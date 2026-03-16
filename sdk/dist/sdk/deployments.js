/**
 * Re-export deployments from local file
 * This allows the SDK to be standalone without depending on the root package
 * Note: Using ../deployments.js so when compiled to dist/, it points to the package root
 * The file deployments.js will be included in the published package root
 */
export { DEPLOYMENTS } from '../deployments.js';
