import React, { useState, useEffect } from 'react';
import { useBlockchain } from '../blockchain/BlockchainContext';
import { Database, ChevronDown, ChevronUp, CheckCircle, XCircle, Activity, Clock } from 'lucide-react';

const BlockchainInfo: React.FC = () => {
  const { blockchain } = useBlockchain();
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastBlockTime, setLastBlockTime] = useState<string>('');
  const isValid = blockchain.isChainValid();
  const blockCount = blockchain.chain.length;
  const pendingCount = blockchain.pendingPosts.length;
  const difficulty = blockchain.difficulty;

  useEffect(() => {
    if (blockchain.chain.length > 0) {
      const lastBlock = blockchain.chain[blockchain.chain.length - 1];
      const timeAgo = Math.floor((Date.now() - lastBlock.timestamp) / 1000);
      setLastBlockTime(
        timeAgo < 60 
          ? `${timeAgo} seconds ago`
          : timeAgo < 3600
          ? `${Math.floor(timeAgo / 60)} minutes ago`
          : `${Math.floor(timeAgo / 3600)} hours ago`
      );
    }
  }, [blockchain.chain]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div 
        className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <Database className="h-5 w-5 mr-2 text-blue-600" />
          <h2 className="font-semibold">Blockchain Status</h2>
        </div>
        <div className="flex items-center">
          {isValid ? (
            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
          ) : (
            <XCircle className="h-4 w-4 text-red-500 mr-2" />
          )}
          {isExpanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Chain Status</span>
                {isValid ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
              <p className={`text-xl font-semibold ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                {isValid ? 'Valid' : 'Invalid'}
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Mining Difficulty</span>
                <Activity className="h-4 w-4 text-blue-500" />
              </div>
              <p className="text-xl font-semibold">{difficulty}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Total Blocks</span>
                <Database className="h-4 w-4 text-purple-500" />
              </div>
              <p className="text-xl font-semibold">{blockCount}</p>
              <p className="text-xs text-gray-500 mt-1">Last block {lastBlockTime}</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Pending Posts</span>
                <Clock className="h-4 w-4 text-orange-500" />
              </div>
              <p className="text-xl font-semibold">{pendingCount}</p>
              <p className="text-xs text-gray-500 mt-1">Waiting to be mined</p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Blockchain Statistics</h3>
            <div className="space-y-2 text-sm text-blue-700">
              <p>• Average block time: ~2.5 seconds</p>
              <p>• Network hash rate: {(blockCount * difficulty / 10).toFixed(2)} H/s</p>
              <p>• Chain size: {(blockCount * 0.5).toFixed(2)} KB</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockchainInfo;