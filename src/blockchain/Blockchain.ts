import { Block, BlockData } from './Block';
import { Message, MessageData } from './Message';

export class Blockchain {
  chain: Block[];
  difficulty: number;
  pendingPosts: Block[];
  messages: Message[];

  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 1; // Reduced difficulty for faster mining
    this.pendingPosts = [];
    this.messages = [];
  }

  /**
   * Create the first block in the blockchain
   */
  createGenesisBlock(): Block {
    return new Block(
      '0',
      Date.now(),
      'Genesis Block',
      'System',
      '0'
    );
  }

  /**
   * Get the latest block in the chain
   */
  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  /**
   * Add a new post to pending posts
   */
  createPost(content: string, author: string): Block {
    const id = (this.chain.length + this.pendingPosts.length).toString();
    const newBlock = new Block(
      id,
      Date.now(),
      content,
      author,
      this.getLatestBlock().hash
    );
    this.pendingPosts.push(newBlock);
    return newBlock;
  }

  /**
   * Mine pending posts and add them to the blockchain
   */
  minePendingPosts(miningRewardAddress: string): void {
    // Process each pending post
    for (const block of this.pendingPosts) {
      console.log('Mining block:', block);
      block.previousHash = this.getLatestBlock().hash;
      block.mineBlock(this.difficulty);
      this.chain.push(block);
      console.log('Block mined:', block.hash);
    }
    
    // Clear pending posts after successful mining
    this.pendingPosts = [];
  }

  /**
   * Validate the integrity of the blockchain
   */
  isChainValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }

  /**
   * Get all posts from the blockchain
   */
  getAllPosts(): BlockData[] {
    return this.chain.slice(1).map(block => block.toObject());
  }

  /**
   * Get posts by a specific author
   */
  getPostsByAuthor(author: string): BlockData[] {
    return this.chain
      .filter(block => block.author === author)
      .map(block => block.toObject());
  }

  /**
   * Send a direct message to another user
   */
  sendMessage(sender: string, recipient: string, content: string): Message {
    const id = this.messages.length.toString();
    const message = new Message(id, sender, recipient, content);
    this.messages.push(message);
    return message;
  }

  /**
   * Get all messages for a specific user
   */
  getMessagesForUser(username: string): MessageData[] {
    return this.messages
      .filter(msg => msg.sender === username || msg.recipient === username)
      .map(msg => msg.toObject());
  }

  /**
   * Get conversation between two users
   */
  getConversation(user1: string, user2: string): MessageData[] {
    return this.messages
      .filter(msg => 
        (msg.sender === user1 && msg.recipient === user2) || 
        (msg.sender === user2 && msg.recipient === user1)
      )
      .map(msg => msg.toObject())
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Get unique users who have messaged with a specific user
   */
  getMessagedUsers(username: string): string[] {
    const users = new Set<string>();
    
    this.messages.forEach(msg => {
      if (msg.sender === username) {
        users.add(msg.recipient);
      } else if (msg.recipient === username) {
        users.add(msg.sender);
      }
    });
    
    return Array.from(users);
  }

  /**
   * Serialize the blockchain to JSON
   */
  toJSON(): string {
    return JSON.stringify({
      chain: this.chain.map(block => block.toObject()),
      pendingPosts: this.pendingPosts.map(block => block.toObject()),
      difficulty: this.difficulty,
      messages: this.messages.map(msg => msg.toObject())
    });
  }

  /**
   * Load blockchain from JSON
   */
  static fromJSON(json: string): Blockchain {
    const data = JSON.parse(json);
    const blockchain = new Blockchain();
    
    blockchain.chain = data.chain.map((blockData: BlockData) => {
      const block = new Block(
        blockData.id,
        blockData.timestamp,
        blockData.content,
        blockData.author,
        blockData.previousHash
      );
      block.hash = blockData.hash;
      block.nonce = blockData.nonce;
      return block;
    });
    
    blockchain.pendingPosts = data.pendingPosts.map((blockData: BlockData) => {
      const block = new Block(
        blockData.id,
        blockData.timestamp,
        blockData.content,
        blockData.author,
        blockData.previousHash
      );
      block.hash = blockData.hash;
      block.nonce = blockData.nonce;
      return block;
    });
    
    if (data.messages) {
      blockchain.messages = data.messages.map((msgData: MessageData) => {
        return new Message(
          msgData.id,
          msgData.sender,
          msgData.recipient,
          msgData.content,
          msgData.timestamp
        );
      });
    }
    
    blockchain.difficulty = data.difficulty;
    
    return blockchain;
  }
}