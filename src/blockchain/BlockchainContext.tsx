import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Blockchain } from './Blockchain';
import { Block, BlockData } from './Block';
import { MessageData } from './Message';

interface BlockchainContextType {
  blockchain: Blockchain;
  posts: BlockData[];
  username: string;
  setUsername: (name: string) => void;
  addPost: (content: string) => void;
  mineBlocks: () => void;
  isLoading: boolean;
  sendMessage: (recipient: string, content: string) => void;
  getConversation: (otherUser: string) => MessageData[];
  getMessagedUsers: () => string[];
  activeChat: string | null;
  setActiveChat: (username: string | null) => void;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
};

interface BlockchainProviderProps {
  children: ReactNode;
}

export const BlockchainProvider: React.FC<BlockchainProviderProps> = ({ children }) => {
  const [blockchain, setBlockchain] = useState<Blockchain>(() => {
    const savedChain = localStorage.getItem('blockchain');
    if (savedChain) {
      try {
        return Blockchain.fromJSON(savedChain);
      } catch (error) {
        console.error('Failed to load blockchain from storage:', error);
        return new Blockchain();
      }
    }
    return new Blockchain();
  });
  
  const [posts, setPosts] = useState<BlockData[]>([]);
  const [username, setUsername] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeChat, setActiveChat] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('blockchain', blockchain.toJSON());
      setPosts(blockchain.getAllPosts().reverse());
    } catch (error) {
      console.error('Failed to save blockchain to storage:', error);
    }
  }, [blockchain]);

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  useEffect(() => {
    if (username) {
      localStorage.setItem('username', username);
    }
  }, [username]);

  const addPost = (content: string) => {
    if (!content.trim() || !username) return;
    
    const newBlockchain = new Blockchain();
    newBlockchain.chain = blockchain.chain.map(block => {
      const newBlock = new Block(
        block.id,
        block.timestamp,
        block.content,
        block.author,
        block.previousHash
      );
      newBlock.hash = block.hash;
      newBlock.nonce = block.nonce;
      return newBlock;
    });
    
    newBlockchain.pendingPosts = blockchain.pendingPosts.map(block => {
      const newBlock = new Block(
        block.id,
        block.timestamp,
        block.content,
        block.author,
        block.previousHash
      );
      newBlock.hash = block.hash;
      newBlock.nonce = block.nonce;
      return newBlock;
    });
    
    newBlockchain.messages = blockchain.messages.map(msg => 
      new Message(msg.id, msg.sender, msg.recipient, msg.content, msg.timestamp)
    );
    
    newBlockchain.difficulty = blockchain.difficulty;
    
    newBlockchain.createPost(content, username);
    setBlockchain(newBlockchain);
  };

  const mineBlocks = async () => {
    if (blockchain.pendingPosts.length === 0) return;
    
    setIsLoading(true);
    
    try {
      const newBlockchain = new Blockchain();
      newBlockchain.chain = blockchain.chain.map(block => {
        const newBlock = new Block(
          block.id,
          block.timestamp,
          block.content,
          block.author,
          block.previousHash
        );
        newBlock.hash = block.hash;
        newBlock.nonce = block.nonce;
        return newBlock;
      });
      
      newBlockchain.pendingPosts = blockchain.pendingPosts.map(block => {
        const newBlock = new Block(
          block.id,
          block.timestamp,
          block.content,
          block.author,
          block.previousHash
        );
        newBlock.hash = block.hash;
        newBlock.nonce = block.nonce;
        return newBlock;
      });
      
      newBlockchain.messages = blockchain.messages.map(msg => 
        new Message(msg.id, msg.sender, msg.recipient, msg.content, msg.timestamp)
      );
      
      newBlockchain.difficulty = blockchain.difficulty;
      
      // Process each pending post with a small delay
      for (let i = 0; i < newBlockchain.pendingPosts.length; i++) {
        const block = newBlockchain.pendingPosts[i];
        block.previousHash = newBlockchain.getLatestBlock().hash;
        
        // Mine the block with progress callback
        await new Promise<void>((resolve) => {
          block.mineBlock(newBlockchain.difficulty, (progress) => {
            // Update mining progress
            const totalProgress = (i * 1000) + progress;
            document.dispatchEvent(new CustomEvent('miningProgress', { 
              detail: totalProgress 
            }));
          });
          resolve();
        });
        
        newBlockchain.chain.push(block);
        
        // Small delay between blocks
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      newBlockchain.pendingPosts = [];
      setBlockchain(newBlockchain);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = (recipient: string, content: string) => {
    if (!content.trim() || !username || !recipient) return;
    
    const newBlockchain = new Blockchain();
    newBlockchain.chain = blockchain.chain.map(block => {
      const newBlock = new Block(
        block.id,
        block.timestamp,
        block.content,
        block.author,
        block.previousHash
      );
      newBlock.hash = block.hash;
      newBlock.nonce = block.nonce;
      return newBlock;
    });
    
    newBlockchain.pendingPosts = blockchain.pendingPosts.map(block => {
      const newBlock = new Block(
        block.id,
        block.timestamp,
        block.content,
        block.author,
        block.previousHash
      );
      newBlock.hash = block.hash;
      newBlock.nonce = block.nonce;
      return newBlock;
    });
    
    newBlockchain.messages = blockchain.messages.map(msg => 
      new Message(msg.id, msg.sender, msg.recipient, msg.content, msg.timestamp)
    );
    
    newBlockchain.difficulty = blockchain.difficulty;
    
    newBlockchain.sendMessage(username, recipient, content);
    setBlockchain(newBlockchain);
  };

  const getConversation = (otherUser: string): MessageData[] => {
    if (!username || !otherUser) return [];
    return blockchain.getConversation(username, otherUser);
  };

  const getMessagedUsers = (): string[] => {
    if (!username) return [];
    return blockchain.getMessagedUsers(username);
  };

  return (
    <BlockchainContext.Provider
      value={{
        blockchain,
        posts,
        username,
        setUsername,
        addPost,
        mineBlocks,
        isLoading,
        sendMessage,
        getConversation,
        getMessagedUsers,
        activeChat,
        setActiveChat
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};

// Import Message class at the top
import { Message } from './Message';