import React, { useState } from 'react';
import { useBlockchain } from '../blockchain/BlockchainContext';
import { Clock, User, Image as ImageIcon, Film, Heart } from 'lucide-react';

interface ParsedContent {
  text: string;
  imageUrl?: string;
  isStory: boolean;
  expiresAt?: number;
}

const PostList: React.FC = () => {
  const { posts } = useBlockchain();
  const [showStories, setShowStories] = useState(true);

  const parseContent = (content: string): ParsedContent => {
    try {
      return JSON.parse(content);
    } catch {
      return { text: content, isStory: false };
    }
  };

  const filteredPosts = posts.filter(post => {
    const content = parseContent(post.content);
    if (!content.isStory) return true;
    if (!showStories) return false;
    return !content.expiresAt || content.expiresAt > Date.now();
  });

  if (filteredPosts.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-500">No posts yet. Be the first to post!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowStories(!showStories)}
          className={`flex items-center px-3 py-1 rounded-full text-sm ${
            showStories 
              ? 'bg-blue-100 text-blue-600' 
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          <Film className="h-4 w-4 mr-1" />
          {showStories ? 'Stories Visible' : 'Stories Hidden'}
        </button>
      </div>

      {filteredPosts.map((post) => {
        const content = parseContent(post.content);
        const isExpiringSoon = content.isStory && content.expiresAt && 
          (content.expiresAt - Date.now() < 3600000); // Less than 1 hour

        return (
          <div 
            key={post.hash} 
            className={`bg-white rounded-lg shadow-md overflow-hidden ${
              content.isStory ? 'border-2 border-blue-400' : ''
            }`}
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full h-10 w-10 flex items-center justify-center">
                    {post.author.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold">@{post.author}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{new Date(post.timestamp).toLocaleString()}</span>
                      {content.isStory && (
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                          isExpiringSoon ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {isExpiringSoon ? 'Expires Soon' : 'Story'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                  Block #{post.id}
                </div>
              </div>

              {content.imageUrl && (
                <div className="mb-4">
                  <img 
                    src={content.imageUrl} 
                    alt="Post content" 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}
              
              {content.text && (
                <p className="text-gray-800 whitespace-pre-wrap mb-4">{content.text}</p>
              )}

              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <button className="flex items-center text-gray-500 hover:text-red-500">
                  <Heart className="h-5 w-5 mr-1" />
                  <span className="text-sm">Like</span>
                </button>

                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                  <div className="bg-gray-100 px-2 py-1 rounded">
                    Hash: {post.hash.substring(0, 10)}...
                  </div>
                  <div className="bg-gray-100 px-2 py-1 rounded">
                    Previous: {post.previousHash.substring(0, 6)}...
                  </div>
                  <div className="bg-gray-100 px-2 py-1 rounded">
                    Nonce: {post.nonce}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PostList;