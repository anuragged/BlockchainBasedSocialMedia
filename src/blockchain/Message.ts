/**
 * Message class representing a direct message between users
 */
export interface MessageData {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  timestamp: number;
  hash: string;
}

export class Message {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  timestamp: number;
  hash: string;

  constructor(
    id: string,
    sender: string,
    recipient: string,
    content: string,
    timestamp = Date.now()
  ) {
    this.id = id;
    this.sender = sender;
    this.recipient = recipient;
    this.content = content;
    this.timestamp = timestamp;
    this.hash = this.calculateHash();
  }

  /**
   * Calculate the hash of the message using its properties
   */
  calculateHash(): string {
    const data = this.id + this.sender + this.recipient + this.content + this.timestamp;
    // Simple hash function for demonstration purposes
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
  }

  /**
   * Convert message to a serializable object
   */
  toObject(): MessageData {
    return {
      id: this.id,
      sender: this.sender,
      recipient: this.recipient,
      content: this.content,
      timestamp: this.timestamp,
      hash: this.hash
    };
  }
}