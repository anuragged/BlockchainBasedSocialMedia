import React, { useState } from 'react';
import { useBlockchain } from '../blockchain/BlockchainContext';
import { Pickaxe, Loader2, AlertCircle } from 'lucide-react';

const MiningControl: React.FC = () => {
  const { blockchain, mineBlocks, isLoading } = useBlockchain();
  const [miningProgress, setMiningProgress] = useState(0);
  const pendingCount = blockchain.pendingPosts.length;

  if (pendingCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 max-w-sm">
      <div className="p-4">
        <div className="flex items-start mb-3">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-blue-500 animate-spin mr-2" />
          ) : (
            <AlertCircle className="h-5 w-5 text-orange-500 mr-2" />
          )}
          <div>
            <h3 className="font-medium text-gray-900">
              {pendingCount} pending {pendingCount === 1 ? 'post' : 'posts'}
            </h3>
            <p className="text-sm text-gray-500">
              {isLoading ? 'Mining in progress...' : 'Waiting to be mined'}
            </p>
          </div>
        </div>

        {isLoading && (
          <div className="mb-3">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${Math.min((miningProgress / 1000) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Processing block {Math.floor(miningProgress / 100)} of {pendingCount}
            </p>
          </div>
        )}

        <button
          onClick={mineBlocks}
          disabled={isLoading}
          className={`w-full flex items-center justify-center px-4 py-2 rounded-lg ${
            isLoading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transform hover:scale-[1.02] transition-transform'
          }`}
        >
          <Pickaxe className="h-4 w-4 mr-2" />
          {isLoading ? 'Mining in Progress...' : 'Mine Posts'}
        </button>

        {!isLoading && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            Mining adds posts to the blockchain using Proof-of-Work
          </p>
        )}
      </div>
    </div>
  );
};

export default MiningControl;