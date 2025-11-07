/**
 * GunDB Relay Smart Contract Integration
 * 
 * Questo file contiene tutti gli esempi di integrazione tra un relay GunDB
 * e il contratto smart contract per la gestione dei pagamenti e delle sessioni.
 * 
 * @author GunDB Relay Payment System
 * @version 1.0.0
 */

const { ethers } = require('ethers');
const Gun = require('gun');

// Configurazione del contratto
const CONTRACT_ADDRESS = '0x...'; // Inserire l'indirizzo del contratto deployato
const CONTRACT_ABI = []; // Inserire l'ABI del contratto

class GunDBRelayManager {
    constructor(relayAddress, privateKey, rpcUrl) {
        this.relayAddress = relayAddress;
        this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
        this.wallet = new ethers.Wallet(privateKey, this.provider);
        this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.wallet);
        
        // Mappa delle sessioni attive
        this.activeSessions = new Map();
        this.sessionConnections = new Map();
        
        // Configurazione dei limiti per tipo di sottoscrizione
        this.subscriptionLimits = {
            'basic': {
                maxSessions: 10,
                throttleMs: 500,
                priority: 'low',
                maxDataPerSecond: 1024 * 10 // 10KB/s
            },
            'premium': {
                maxSessions: 50,
                throttleMs: 100,
                priority: 'medium',
                maxDataPerSecond: 1024 * 100 // 100KB/s
            },
            'enterprise': {
                maxSessions: 200,
                throttleMs: 0,
                priority: 'high',
                maxDataPerSecond: 1024 * 1000 // 1MB/s
            }
        };
        
        this.initializeMonitoring();
    }

    /**
     * 1. GESTIONE CONNESSIONI UTENTI
     */
    
    /**
     * Gestisce la connessione di un nuovo utente
     * @param {string} userAddress - Indirizzo Ethereum dell'utente
     * @param {Object} gunPeerInstance - Istanza del peer GunDB
     * @param {Object} connectionInfo - Informazioni sulla connessione
     */
    async handleUserConnection(userAddress, gunPeerInstance, connectionInfo) {
        try {
            console.log(`[${new Date().toISOString()}] Tentativo connessione utente: ${userAddress}`);
            
            // Verifica se l'utente ha una sottoscrizione attiva
            const [isActive, subscriptionType, seaPublicKey] = 
                await this.contract.verifyUserAccess(userAddress);
            
            if (!isActive) {
                console.log(`[${new Date().toISOString()}] Connessione rifiutata: nessuna sottoscrizione attiva`);
                return this.rejectConnection(gunPeerInstance, "No active subscription");
            }
            
            // Controlla i limiti basati sul tipo di sottoscrizione
            const currentSessionsByType = this.getSessionCountByType(subscriptionType);
            const maxAllowed = this.subscriptionLimits[subscriptionType].maxSessions;
            
            if (currentSessionsByType >= maxAllowed) {
                console.log(`[${new Date().toISOString()}] Limite sessioni raggiunto per ${subscriptionType}: ${currentSessionsByType}/${maxAllowed}`);
                return this.rejectConnection(gunPeerInstance, "Session limit reached for subscription type");
            }
            
            // Inizia una nuova sessione on-chain
            const sessionId = await this.contract.startSession(this.relayAddress, {
                from: userAddress
            });
            
            console.log(`[${new Date().toISOString()}] Sessione creata: ${sessionId}`);
            
            // Configura la connessione GunDB con priorità basata sul tier
            await this.setupGunConnection(userAddress, sessionId, subscriptionType, gunPeerInstance, seaPublicKey);
            
            return {
                success: true,
                sessionId: sessionId,
                subscriptionType: subscriptionType,
                limits: this.subscriptionLimits[subscriptionType]
            };
            
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Errore connessione utente:`, error);
            return this.rejectConnection(gunPeerInstance, "Internal server error");
        }
    }
    
    /**
     * Configura una connessione GunDB con parametri specifici per il tier
     */
    async setupGunConnection(userAddress, sessionId, subscriptionType, gunPeerInstance, seaPublicKey) {
        const sessionData = {
            userAddress,
            sessionId,
            subscriptionType,
            seaPublicKey,
            startTime: Date.now(),
            lastActivity: Date.now(),
            dataTransferred: 0,
            requestCount: 0,
            gunPeer: gunPeerInstance
        };
        
        // Salva la sessione attiva
        this.activeSessions.set(sessionId, sessionData);
        this.sessionConnections.set(userAddress, sessionId);
        
        // Configura throttling basato sul tier
        const limits = this.subscriptionLimits[subscriptionType];
        this.applyConnectionLimits(gunPeerInstance, limits);
        
        console.log(`[${new Date().toISOString()}] Connessione configurata per ${userAddress} (${subscriptionType})`);
    }
    
    /**
     * Applica i limiti di connessione basati sul tier
     */
    applyConnectionLimits(gunPeerInstance, limits) {
        if (limits.throttleMs > 0) {
            // Implementa throttling
            gunPeerInstance.on('message', this.throttleMessage.bind(this, limits.throttleMs));
        }
        
        // Imposta limiti di banda
        gunPeerInstance.maxDataPerSecond = limits.maxDataPerSecond;
        gunPeerInstance.priority = limits.priority;
    }
    
    /**
     * Rifiuta una connessione
     */
    rejectConnection(gunPeerInstance, reason) {
        console.log(`[${new Date().toISOString()}] Connessione rifiutata: ${reason}`);
        
        if (gunPeerInstance && gunPeerInstance.close) {
            gunPeerInstance.close();
        }
        
        return {
            success: false,
            error: reason,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * 2. GESTIONE RICHIESTE E THROTTLING
     */
    
    /**
     * Gestisce le richieste GunDB con prioritizzazione
     */
    async handleGunDBRequest(sessionId, request, callback) {
        const session = this.activeSessions.get(sessionId);
        
        if (!session) {
            return callback(new Error('Session not found'));
        }
        
        // Aggiorna l'attività della sessione
        session.lastActivity = Date.now();
        session.requestCount++;
        
        // Aggiorna l'attività on-chain ogni 100 richieste
        if (session.requestCount % 100 === 0) {
            try {
                await this.contract.updateSessionActivity(sessionId);
            } catch (error) {
                console.error('Errore aggiornamento attività sessione:', error);
            }
        }
        
        const limits = this.subscriptionLimits[session.subscriptionType];
        
        // Processa la richiesta con priorità basata sul tier
        return this.processRequest(request, limits, callback);
    }
    
    /**
     * Processa una richiesta con i limiti specificati
     */
    processRequest(request, limits, callback) {
        const processWithLimits = () => {
            // Simula processing della richiesta GunDB
            const startTime = Date.now();
            
            // Qui andrebbe la logica effettiva di GunDB
            // Per ora simuliamo un processing
            setTimeout(() => {
                const processingTime = Date.now() - startTime;
                console.log(`[${new Date().toISOString()}] Richiesta processata in ${processingTime}ms (priorità: ${limits.priority})`);
                
                callback(null, {
                    success: true,
                    processingTime,
                    priority: limits.priority
                });
            }, Math.random() * 100); // Simula tempo di processing variabile
        };
        
        // Applica throttling se necessario
        if (limits.throttleMs > 0) {
            setTimeout(processWithLimits, limits.throttleMs);
        } else {
            processWithLimits();
        }
    }
    
    /**
     * Implementa throttling per i messaggi
     */
    throttleMessage(throttleMs, message) {
        // Implementa una coda con throttling
        setTimeout(() => {
            // Processa il messaggio dopo il delay
            this.processMessage(message);
        }, throttleMs);
    }

    /**
     * 3. MONITORAGGIO E GESTIONE RISORSE
     */
    
    /**
     * Inizializza il sistema di monitoraggio
     */
    initializeMonitoring() {
        // Monitora le risorse del sistema ogni 5 secondi
        setInterval(() => {
            this.monitorSystemResources();
        }, 5000);
        
        // Pulisce le sessioni inattive ogni minuto
        setInterval(() => {
            this.cleanupInactiveSessions();
        }, 60000);
        
        // Aggiorna le statistiche ogni 10 secondi
        setInterval(() => {
            this.updateStats();
        }, 10000);
    }
    
    /**
     * Monitora le risorse del sistema
     */
    async monitorSystemResources() {
        const systemLoad = this.getCPUUsage();
        const memoryUsage = this.getMemoryUsage();
        const activeSessionCount = this.activeSessions.size;
        
        console.log(`[${new Date().toISOString()}] Sistema - CPU: ${systemLoad}%, RAM: ${memoryUsage}%, Sessioni: ${activeSessionCount}`);
        
        // Se il sistema è sovraccarico, disconnetti sessioni a bassa priorità
        if (systemLoad > 80 || memoryUsage > 85) {
            console.log(`[${new Date().toISOString()}] Sistema sovraccarico, disconnettendo sessioni basic`);
            await this.disconnectLowPrioritySessions();
        }
    }
    
    /**
     * Disconnette le sessioni a bassa priorità in caso di sovraccarico
     */
    async disconnectLowPrioritySessions() {
        const basicSessions = Array.from(this.activeSessions.values())
            .filter(session => session.subscriptionType === 'basic')
            .sort((a, b) => a.lastActivity - b.lastActivity); // Disconnetti prima quelle meno attive
        
        const sessionsToDisconnect = basicSessions.slice(0, Math.ceil(basicSessions.length * 0.3)); // Disconnetti il 30%
        
        for (const session of sessionsToDisconnect) {
            try {
                await this.endSession(session.sessionId, 'System overload');
                console.log(`[${new Date().toISOString()}] Sessione basic disconnessa per sovraccarico: ${session.sessionId}`);
            } catch (error) {
                console.error('Errore disconnessione sessione:', error);
            }
        }
    }
    
    /**
     * Pulisce le sessioni inattive
     */
    async cleanupInactiveSessions() {
        const now = Date.now();
        const inactivityTimeout = 30 * 60 * 1000; // 30 minuti
        
        for (const [sessionId, session] of this.activeSessions.entries()) {
            if (now - session.lastActivity > inactivityTimeout) {
                console.log(`[${new Date().toISOString()}] Terminando sessione inattiva: ${sessionId}`);
                await this.endSession(sessionId, 'Inactivity timeout');
            }
        }
    }
    
    /**
     * Termina una sessione
     */
    async endSession(sessionId, reason = 'User request') {
        const session = this.activeSessions.get(sessionId);
        
        if (!session) {
            console.log(`[${new Date().toISOString()}] Tentativo di terminare sessione inesistente: ${sessionId}`);
            return;
        }
        
        try {
            // Termina la sessione on-chain
            await this.contract.endSession(sessionId);
            
            // Chiudi la connessione GunDB
            if (session.gunPeer && session.gunPeer.close) {
                session.gunPeer.close();
            }
            
            // Rimuovi dalle mappe locali
            this.activeSessions.delete(sessionId);
            this.sessionConnections.delete(session.userAddress);
            
            console.log(`[${new Date().toISOString()}] Sessione terminata: ${sessionId} (${reason})`);
            
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Errore terminazione sessione:`, error);
        }
    }

    /**
     * 4. ANALYTICS E REPORTING
     */
    
    /**
     * Aggiorna le statistiche del relay
     */
    async updateStats() {
        const stats = await this.getRelayStats();
        
        // Log delle statistiche (potresti inviarle a un sistema di monitoring)
        console.log(`[${new Date().toISOString()}] Stats:`, JSON.stringify(stats, null, 2));
        
        // Potresti anche salvare le stats in un database o inviarle a un servizio di analytics
        // await this.saveStatsToDatabase(stats);
    }
    
    /**
     * Ottiene le statistiche complete del relay
     */
    async getRelayStats() {
        const sessions = Array.from(this.activeSessions.values());
        
        const statsByType = {
            basic: sessions.filter(s => s.subscriptionType === 'basic'),
            premium: sessions.filter(s => s.subscriptionType === 'premium'),
            enterprise: sessions.filter(s => s.subscriptionType === 'enterprise')
        };
        
        let totalRevenue = 0;
        try {
            const relayDetails = await this.contract.getRelayDetails(this.relayAddress);
            totalRevenue = ethers.utils.formatEther(relayDetails.totalEarned);
        } catch (error) {
            console.error('Errore recupero revenue:', error);
        }
        
        return {
            timestamp: new Date().toISOString(),
            totalActiveSessions: sessions.length,
            sessionsByType: {
                basic: statsByType.basic.length,
                premium: statsByType.premium.length,
                enterprise: statsByType.enterprise.length
            },
            totalRevenue: totalRevenue,
            averageSessionDuration: this.calculateAverageSessionTime(sessions),
            systemResources: {
                cpu: this.getCPUUsage(),
                memory: this.getMemoryUsage()
            },
            totalRequests: sessions.reduce((sum, s) => sum + s.requestCount, 0),
            totalDataTransferred: sessions.reduce((sum, s) => sum + s.dataTransferred, 0)
        };
    }
    
    /**
     * Calcola la durata media delle sessioni
     */
    calculateAverageSessionTime(sessions) {
        if (sessions.length === 0) return 0;
        
        const now = Date.now();
        const totalDuration = sessions.reduce((sum, session) => {
            return sum + (now - session.startTime);
        }, 0);
        
        return Math.round(totalDuration / sessions.length / 1000); // Ritorna in secondi
    }

    /**
     * 5. UTILITY FUNCTIONS
     */
    
    /**
     * Conta le sessioni per tipo di sottoscrizione
     */
    getSessionCountByType(subscriptionType) {
        return Array.from(this.activeSessions.values())
            .filter(session => session.subscriptionType === subscriptionType)
            .length;
    }
    
    /**
     * Simula l'uso della CPU (da sostituire con libreria reale)
     */
    getCPUUsage() {
        // Placeholder - usa una libreria come 'os-utils' o 'systeminformation' per dati reali
        return Math.random() * 100;
    }
    
    /**
     * Simula l'uso della memoria (da sostituire con libreria reale)
     */
    getMemoryUsage() {
        const used = process.memoryUsage();
        const total = require('os').totalmem();
        return (used.heapUsed / total) * 100;
    }
    
    /**
     * Processa un messaggio GunDB
     */
    processMessage(message) {
        // Implementa la logica di processing dei messaggi GunDB
        console.log(`[${new Date().toISOString()}] Processing message:`, message);
    }
    
    /**
     * Ottieni informazioni su una sessione specifica
     */
    getSessionInfo(sessionId) {
        return this.activeSessions.get(sessionId);
    }
    
    /**
     * Ottieni tutte le sessioni attive
     */
    getAllActiveSessions() {
        return Array.from(this.activeSessions.values());
    }
}

/**
 * 6. ESEMPI DI USO
 */

// Esempio di inizializzazione del relay manager
async function initializeRelay() {
    const relayManager = new GunDBRelayManager(
        '0x1234...', // Indirizzo del relay
        'private_key_here', // Chiave privata del relay
        'https://mainnet.infura.io/v3/YOUR_PROJECT_ID' // RPC URL
    );
    
    console.log('Relay GunDB inizializzato con gestione smart contract');
    
    // Esempio di gestione connessione utente
    const mockGunPeer = { close: () => console.log('Connessione chiusa') };
    const result = await relayManager.handleUserConnection(
        '0x5678...', // Indirizzo utente
        mockGunPeer,
        { ip: '192.168.1.1', userAgent: 'GunDB Client' }
    );
    
    console.log('Risultato connessione:', result);
}

// Esempio di integrazione con server GunDB esistente
function integrateWithGunServer(gunServer, relayManager) {
    gunServer.on('connection', async (peer, connectionInfo) => {
        // Estrai l'indirizzo dell'utente dalla connessione
        const userAddress = extractUserAddress(connectionInfo);
        
        if (userAddress) {
            const result = await relayManager.handleUserConnection(
                userAddress,
                peer,
                connectionInfo
            );
            
            if (!result.success) {
                peer.close();
            }
        }
    });
    
    gunServer.on('message', async (sessionId, message) => {
        await relayManager.handleGunDBRequest(sessionId, message, (error, result) => {
            if (error) {
                console.error('Errore processing richiesta:', error);
            } else {
                console.log('Richiesta processata:', result);
            }
        });
    });
}

function extractUserAddress(connectionInfo) {
    // Implementa la logica per estrarre l'indirizzo utente
    // dalla connessione (potrebbe essere nei headers, query params, ecc.)
    return connectionInfo.userAddress || null;
}

module.exports = {
    GunDBRelayManager,
    initializeRelay,
    integrateWithGunServer
};

/**
 * ISTRUZIONI PER L'USO:
 * 
 * 1. Installa le dipendenze:
 *    npm install ethers gun
 * 
 * 2. Configura le variabili:
 *    - CONTRACT_ADDRESS: Indirizzo del contratto deployato
 *    - CONTRACT_ABI: ABI del contratto
 *    - Chiavi private e RPC URLs
 * 
 * 3. Integra nel tuo relay GunDB:
 *    const { GunDBRelayManager } = require('./gundb-relay-integration');
 *    const relayManager = new GunDBRelayManager(relayAddress, privateKey, rpcUrl);
 * 
 * 4. Gestisci le connessioni utenti chiamando handleUserConnection()
 * 
 * 5. Monitora le statistiche chiamando getRelayStats()
 */