import whitelist from './whitelist.json';

// Define the two phases with fixed sizes
export const PHASE_1_SIZE = Math.min(4990, whitelist.length);
export const PHASE_2_SIZE = Math.min(4400, Math.max(0, whitelist.length - PHASE_1_SIZE));

// Phase 1 details
export const PHASE_1_DATE = "Monday, 3PM UTC";
export const PHASE_1_MESSAGE = `Your wallet is whitelisted for Phase 1 minting on ${PHASE_1_DATE}`;

// Phase 2 details
export const PHASE_2_DATE = "Tuesday, 3PM UTC";
export const PHASE_2_MESSAGE = `Your wallet is whitelisted for Phase 2 minting on ${PHASE_2_DATE}`;

// Function to check which phase a wallet belongs to
export const checkWhitelistPhase = (walletAddress: string): number | null => {
    const normalizedAddress = walletAddress.toLowerCase().trim();

    // Find the index of the wallet in the whitelist
    const index = whitelist.findIndex((item: any) => {
        // If item is an array (like ["0x123...", ""]), check the first element
        if (Array.isArray(item)) {
            return item[0].toLowerCase() === normalizedAddress;
        }
        // If item is a string, check directly
        return typeof item === 'string' && item.toLowerCase() === normalizedAddress;
    });

    // If not found, return null
    if (index === -1) return null;

    console.log(`Found wallet at index ${index}`);

    // Determine the phase based on the index
    // First 5000 addresses are Phase 1, next 4500 are Phase 2
    if (index < PHASE_1_SIZE) {
        return 1;
    } else if (index < PHASE_1_SIZE + PHASE_2_SIZE) {
        return 2;
    } else {
        // If more than 9500 addresses, they're not in any phase
        return null;
    }
};

// Function to get the message for a wallet
export const getWhitelistMessage = (walletAddress: string): string | null => {
    const phase = checkWhitelistPhase(walletAddress);

    if (phase === null) return null;

    return phase === 1 ? PHASE_1_MESSAGE : PHASE_2_MESSAGE;
}; 