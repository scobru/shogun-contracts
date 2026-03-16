import { BaseContract } from './BaseContract.js';
/**
 * Shogun Relay Registry Contract
 * Manages relay registration, staking, and slashing
 */
export class RelayRegistry extends BaseContract {
    constructor(provider, signer, chainId) {
        super(provider, signer, chainId, 'ShogunRelayRegistry');
    }
    /**
     * Register a new relay
     */
    async registerRelay(endpoint, pubkey, epub, stakeAmount, griefingRatio) {
        return await this.contract.registerRelay(endpoint, pubkey, epub, stakeAmount, griefingRatio);
    }
    /**
     * Get relay information
     */
    async getRelayInfo(relayAddress) {
        return await this.contract.getRelayInfo(relayAddress);
    }
    /**
     * Get all active relays
     */
    async getActiveRelays() {
        return await this.contract.getActiveRelays();
    }
    /**
     * Check if relay is active
     */
    async isActiveRelay(relayAddress) {
        return await this.contract.isActiveRelay(relayAddress);
    }
    /**
     * Increase stake
     */
    async increaseStake(amount) {
        return await this.contract.increaseStake(amount);
    }
    /**
     * Request unstake
     */
    async requestUnstake() {
        return await this.contract.requestUnstake();
    }
    /**
     * Withdraw stake
     */
    async withdrawStake() {
        return await this.contract.withdrawStake();
    }
    /**
     * Update relay endpoint
     */
    async updateRelay(newEndpoint) {
        return await this.contract.updateRelay(newEndpoint);
    }
    /**
     * Update relay encryption keys
     */
    async updateRelayEncryptionKeys(pubkey, epub) {
        return await this.contract.updateRelayEncryptionKeys(pubkey, epub);
    }
    /**
     * Register user
     */
    async registerUser(pubkey, epub) {
        return await this.contract.registerUser(pubkey, epub);
    }
    /**
     * Get user info
     */
    async getUserInfo(userAddress) {
        return await this.contract.getUserInfo(userAddress);
    }
    /**
     * Deposit user stake
     */
    async depositUserStake(amount, griefingRatio) {
        return await this.contract.depositUserStake(amount, griefingRatio);
    }
    /**
     * Withdraw user stake
     */
    async withdrawUserStake(amount) {
        return await this.contract.withdrawUserStake(amount);
    }
    /**
     * Grief a relay
     */
    async grief(relay, slashAmount, reason, griefingRatio, dealId) {
        return await this.contract.grief(relay, slashAmount, reason, griefingRatio, dealId);
    }
}
