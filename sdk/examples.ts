/**
 * Esempi di utilizzo dell'SDK Shogun Contracts
 * 
 * Questi esempi mostrano come utilizzare l'SDK per interagire con i contratti
 */

import { ShogunSDK } from './index.js';
import { JsonRpcProvider, Wallet } from 'ethers';

/**
 * Esempio 1: Configurazione base con provider
 */
export async function example1_BasicSetup() {
  const provider = new JsonRpcProvider('https://sepolia.base.org');
  const sdk = new ShogunSDK({
    provider,
    chainId: 84532 // Base Sepolia
  });

  // Ottenere informazioni su un relay
  const relayRegistry = sdk.getRelayRegistry();
  const activeRelays = await relayRegistry.getActiveRelays();
  console.log('Active relays:', activeRelays);
}

/**
 * Esempio 2: Con signer per transazioni
 */
export async function example2_WithSigner() {
  const provider = new JsonRpcProvider('https://sepolia.base.org');
  const wallet = new Wallet('YOUR_PRIVATE_KEY', provider);
  
  const sdk = new ShogunSDK({
    provider,
    signer: wallet,
    chainId: 84532
  });

  // Registrare un nuovo relay
  const relayRegistry = sdk.getRelayRegistry();
  const tx = await relayRegistry.registerRelay(
    'https://relay.example.com',
    '0x...', // pubkey
    '0x...', // epub
    BigInt('1000000000000000000'), // 1 token
    BigInt('1000') // griefing ratio
  );
  
  await tx.wait();
  console.log('Relay registered!');
}

/**
 * Esempio 3: Gestione Storage Deals
 */
export async function example3_StorageDeals() {
  const provider = new JsonRpcProvider('https://sepolia.base.org');
  const wallet = new Wallet('YOUR_PRIVATE_KEY', provider);
  
  const sdk = new ShogunSDK({
    provider,
    signer: wallet,
    chainId: 84532
  });

  const storageDeal = sdk.getStorageDealRegistry();

  // Registrare un nuovo deal
  const dealId = '0x...'; // generato lato client
  const tx = await storageDeal.registerDeal(
    dealId,
    wallet.address, // client
    'Qm...', // CID
    BigInt(100), // 100 MB
    BigInt('1000000'), // 1 USDC (6 decimals)
    BigInt(30), // 30 giorni
    BigInt('500000') // 0.5 USDC stake
  );

  await tx.wait();
  console.log('Deal registered!');

  // Ottenere informazioni sul deal
  const deal = await storageDeal.getDeal(dealId);
  console.log('Deal info:', deal);
}

/**
 * Esempio 4: Data Posts
 */
export async function example4_DataPosts() {
  const provider = new JsonRpcProvider('https://sepolia.base.org');
  const wallet = new Wallet('YOUR_PRIVATE_KEY', provider);
  
  const sdk = new ShogunSDK({
    provider,
    signer: wallet,
    chainId: 84532
  });

  const dataPost = sdk.getDataPostRegistry();

  // Pubblicare un nuovo post
  const tx = await dataPost.publishPost(
    '0x...', // proofHash
    'Qm...', // encryptedDataHash
    'Dataset description',
    'dataset',
    BigInt('1000000') // 1 USDC
  );

  await tx.wait();
  console.log('Post published!');

  // Ottenere tutti i post attivi
  const activePosts = await dataPost.getActivePosts();
  console.log('Active posts:', activePosts);
}

/**
 * Esempio 5: Stealth Pool
 */
export async function example5_StealthPool() {
  const provider = new JsonRpcProvider('https://sepolia.base.org');
  const wallet = new Wallet('YOUR_PRIVATE_KEY', provider);
  
  const sdk = new ShogunSDK({
    provider,
    signer: wallet,
    chainId: 11155111 // Sepolia
  });

  const stealthPool = sdk.getStealthPool();

  // Registrare un deposito
  const commitment = '0x...'; // calcolato lato client
  const tx = await stealthPool.registerDeposit(
    commitment,
    BigInt('1000000000000000000') // 1 ETH
  );

  await tx.wait();
  console.log('Deposit registered!');

  // Generare merkle proof
  const [proof, index] = await stealthPool.generateMerkleProof(commitment);
  console.log('Merkle proof:', proof);
}

/**
 * Esempio 6: Utility functions
 */
export async function example6_Utilities() {
  import { 
    getContractDeployment, 
    getAvailableChainIds, 
    isChainSupported 
  } from './index.js';

  // Verificare chain supportata
  if (isChainSupported(84532)) {
    console.log('Base Sepolia is supported!');
  }

  // Ottenere deployment info
  const deployment = getContractDeployment(84532, 'ShogunRelayRegistry');
  if (deployment) {
    console.log('Relay Registry address:', deployment.address);
  }

  // Ottenere tutte le chain disponibili
  const chains = getAvailableChainIds();
  console.log('Available chains:', chains);
}

