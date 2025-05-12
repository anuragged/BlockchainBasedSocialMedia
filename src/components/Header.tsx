import React from 'react';
import { useBlockchain } from '../blockchain/BlockchainContext';
import { Database, Lock, Shield } from 'lucide-react';

const Header: React.FC = () => {
  const { username, setUsername } = useBlockchain();
  const [inputUsername, setInputUsername] = React.useState(username);
  const [isEditing, setIsEditing] = React.useState(!username);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUsername.trim()) {
      setUsername(inputUsername.trim());
      setIsEditing(false);
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-900 to-purple-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <Database className="h-8 w-8 mr-2" />
          <h1 className="text-2xl font-bold">BlockSocial</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm">
            <Lock className="h-4 w-4 mr-1" />
            <span>Secure</span>
          </div>
          <div className="flex items-center text-sm">
            <Shield className="h-4 w-4 mr-1" />
            <span>Decentralized</span>
          </div>
          
          {isEditing ? (
            <form onSubmit={handleSubmit} className="flex">
              <input
                type="text"
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
                placeholder="Enter username"
                className="px-3 py-1 rounded-l text-black"
                autoFocus
              />
              <button 
                type="submit"
                className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded-r"
              >
                Set
              </button>
            </form>
          ) : (
            <div className="flex items-center">
              <span className="mr-2">@{username}</span>
              <button 
                onClick={() => setIsEditing(true)}
                className="text-xs underline"
              >
                Change
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;