/**
 * Utility functions for the blockchain implementation
 */

/**
 * A more secure hash function using SHA-256
 * Note: In a real implementation, we would use a cryptographic library
 * This is a simplified version for demonstration purposes
 */
export const sha256 = async (message: string): Promise<string> => {
  // In a browser environment, we can use the Web Crypto API
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Format a timestamp to a readable date string
 */
export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

/**
 * Truncate a string to a specific length with ellipsis
 */
export const truncate = (str: string, length: number): string => {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
};

/**
 * Generate a random user color based on username
 */
export const getUserColor = (username: string): string => {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 60%)`;
};