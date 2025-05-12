/**
 * Block class representing a single block in the blockchain
 */
export interface BlockData {
  id: string;
  timestamp: number;
  content: string;
  author: string;
  previousHash: string;
  hash: string;
  nonce: number;
}

export class Block {
  id: string;
  timestamp: number;
  content: string;
  author: string;
  previousHash: string;
  hash: string;
  nonce: number;

  constructor(
    id: string,
    timestamp: number,
    content: string,
    author: string,
    previousHash = ''
  ) {
    this.id = id;
    this.timestamp = timestamp;
    this.content = content;
    this.author = author;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  /**
   * Calculate the hash of the block using its properties
   */
  calculateHash(): string {
    const data = `${this.id}${this.timestamp}${this.content}${this.author}${this.previousHash}${this.nonce}`;
    let hash = 0;
    
    // Using a more efficient hashing algorithm
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    // Ensure positive hash and convert to hex
    return Math.abs(hash).toString(16).padStart(8, '0');
  }

  /**
   * Mine the block with a specific difficulty
   */
  mineBlock(difficulty: number, onProgress?: (progress: number) => void): void {
    const target = Array(difficulty + 1).join('0');
    let attempts = 0;
    const maxAttempts = 10000; // Prevent infinite loops
    
    while (this.hash.substring(0, difficulty) !== target && attempts < maxAttempts) {
      this.nonce++;
      this.hash = this.calculateHash();
      attempts++;
      
      // Report progress every 100 attempts
      if (attempts % 100 === 0 && onProgress) {
        onProgress(attempts);
      }
      
      // Add a small delay every 1000 attempts to prevent freezing
      if (attempts % 1000 === 0) {
        // Force browser to render
        void document.body.offsetHeight;
      }
    }
  }

  /**
   * Convert block to a serializable object
   */
  toObject(): BlockData {
    return {
      id: this.id,
      timestamp: this.timestamp,
      content: this.content,
      author: this.author,
      previousHash: this.previousHash,
      hash: this.hash,
      nonce: this.nonce
    };
  }
}