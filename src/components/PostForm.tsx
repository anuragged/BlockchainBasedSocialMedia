import React, { useState, useRef } from 'react';
import { useBlockchain } from '../blockchain/BlockchainContext';
import { Send, Image, X, Film, Loader2 } from 'lucide-react';

interface PostData {
  content: string;
  imageUrl?: string;
  isStory: boolean;
}

const PostForm: React.FC = () => {
  const [postData, setPostData] = useState<PostData>({
    content: '',
    imageUrl: '',
    isStory: false
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addPost, username } = useBlockchain();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Simulate image upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would upload to a storage service
      const mockImageUrl = `https://picsum.photos/seed/${Math.random()}/800/600`;
      setPostData(prev => ({ ...prev, imageUrl: mockImageUrl }));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((postData.content.trim() || postData.imageUrl) && username) {
      const content = JSON.stringify({
        text: postData.content,
        imageUrl: postData.imageUrl,
        isStory: postData.isStory,
        expiresAt: postData.isStory ? Date.now() + 24 * 60 * 60 * 1000 : undefined
      });
      
      addPost(content);
      setPostData({ content: '', imageUrl: '', isStory: false });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = () => {
    setPostData(prev => ({ ...prev, imageUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!username) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
        <p className="text-yellow-800">Please set a username to start posting.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="mb-4">
        <textarea
          value={postData.content}
          onChange={(e) => setPostData(prev => ({ ...prev, content: e.target.value }))}
          placeholder="What's on your mind?"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      {postData.imageUrl && (
        <div className="relative mb-4">
          <img 
            src={postData.imageUrl} 
            alt="Upload preview" 
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center text-gray-600 hover:text-blue-500"
            >
              {isUploading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Image className="h-5 w-5" />
              )}
            </button>
          </div>
          
          <button
            type="button"
            onClick={() => setPostData(prev => ({ ...prev, isStory: !prev.isStory }))}
            className={`flex items-center ${postData.isStory ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'}`}
          >
            <Film className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          {postData.isStory && (
            <span className="text-sm text-blue-500">24h Story</span>
          )}
          <button
            type="submit"
            disabled={!postData.content.trim() && !postData.imageUrl}
            className={`flex items-center px-4 py-2 rounded-lg ${
              postData.content.trim() || postData.imageUrl
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Send className="h-4 w-4 mr-2" />
            {postData.isStory ? 'Share Story' : 'Post'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PostForm;