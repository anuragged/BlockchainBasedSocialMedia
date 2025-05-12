import React, { useState, useEffect, useRef } from 'react';
import { useBlockchain } from '../blockchain/BlockchainContext';
import { MessageData } from '../blockchain/Message';
import { Send, X, MessageSquare, User, Image, Heart, Smile } from 'lucide-react';
import { formatTimestamp, getUserColor } from '../blockchain/utils';

const ChatInterface: React.FC = () => {
  const { 
    username, 
    sendMessage, 
    getConversation, 
    getMessagedUsers,
    activeChat,
    setActiveChat
  } = useBlockchain();
  
  const [message, setMessage] = useState('');
  const [newRecipient, setNewRecipient] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [conversations, setConversations] = useState<MessageData[]>([]);
  const [contactedUsers, setContactedUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  // Load contacted users
  useEffect(() => {
    if (username) {
      setContactedUsers(getMessagedUsers());
    }
  }, [username, getMessagedUsers]);

  // Load conversation when active chat changes
  useEffect(() => {
    if (activeChat) {
      setConversations(getConversation(activeChat));
    } else {
      setConversations([]);
    }
  }, [activeChat, getConversation]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations]);

  // Refresh conversations periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeChat) {
        setConversations(getConversation(activeChat));
      }
      setContactedUsers(getMessagedUsers());
    }, 2000);
    
    return () => clearInterval(interval);
  }, [activeChat, getConversation, getMessagedUsers]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && activeChat) {
      sendMessage(activeChat, message);
      setMessage('');
      // Update conversation immediately
      setConversations(getConversation(activeChat));
      // Update contacted users list
      setContactedUsers(getMessagedUsers());
    }
  };

  const handleStartNewChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRecipient.trim() && newRecipient !== username) {
      setActiveChat(newRecipient);
      setShowNewChat(false);
      setNewRecipient('');
    }
  };

  if (!username) {
    return (
      <div className="fixed bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="text-sm">Please set a username to use chat</p>
      </div>
    );
  }

  if (!isExpanded) {
    return (
      <div 
        className="fixed bottom-4 left-4 bg-white rounded-full shadow-lg p-3 cursor-pointer"
        onClick={() => setIsExpanded(true)}
      >
        <MessageSquare className="h-6 w-6 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 w-80">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-3 rounded-t-lg flex justify-between items-center">
        <div className="flex items-center">
          {activeChat ? (
            <>
              <button 
                onClick={() => setActiveChat(null)} 
                className="mr-2 text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center">
                <div 
                  className="rounded-full h-8 w-8 flex items-center justify-center mr-2 text-white"
                  style={{ backgroundColor: getUserColor(activeChat) }}
                >
                  {activeChat.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium">@{activeChat}</span>
              </div>
            </>
          ) : (
            <>
              <MessageSquare className="h-5 w-5 mr-2 text-gray-700" />
              <h3 className="font-medium text-gray-800">Direct Messages</h3>
            </>
          )}
        </div>
        <button 
          onClick={() => setIsExpanded(false)} 
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      {/* Contact List */}
      {!activeChat && (
        <div className="p-3 max-h-80 overflow-y-auto">
          {contactedUsers.length > 0 ? (
            <div className="space-y-2">
              {contactedUsers.map(user => (
                <div 
                  key={user}
                  onClick={() => setActiveChat(user)}
                  className="p-2 hover:bg-gray-100 rounded cursor-pointer flex items-center"
                >
                  <div 
                    className="rounded-full h-10 w-10 flex items-center justify-center mr-3 text-white"
                    style={{ backgroundColor: getUserColor(user) }}
                  >
                    {user.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-medium">@{user}</span>
                    <p className="text-xs text-gray-500">Tap to open conversation</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm mb-1">No conversations yet</p>
              <p className="text-gray-400 text-xs">Start a new chat to connect with others</p>
            </div>
          )}
          
          {/* New Chat Button */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            {showNewChat ? (
              <form onSubmit={handleStartNewChat} className="flex flex-col space-y-2">
                <input
                  type="text"
                  value={newRecipient}
                  onChange={(e) => setNewRecipient(e.target.value)}
                  placeholder="Enter username"
                  className="border border-gray-300 rounded p-2 text-sm"
                  autoFocus
                />
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowNewChat(false)}
                    className="flex-1 bg-gray-200 text-gray-800 rounded p-1 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 text-white rounded p-1 text-sm"
                  >
                    Start Chat
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowNewChat(true)}
                className="w-full bg-blue-500 text-white rounded-full p-2 text-sm flex items-center justify-center"
              >
                <User className="h-4 w-4 mr-1" />
                New Message
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Conversation */}
      {activeChat && (
        <>
          <div className="p-3 h-64 overflow-y-auto bg-gray-50">
            {conversations.length > 0 ? (
              <div className="space-y-3">
                {conversations.map((msg) => (
                  <div 
                    key={msg.hash}
                    className={`max-w-[80%] ${
                      msg.sender === username 
                        ? 'ml-auto bg-blue-500 text-white rounded-2xl rounded-br-none' 
                        : 'mr-auto bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-bl-none'
                    } p-3 text-sm shadow-sm`}
                  >
                    <p>{msg.content}</p>
                    <p className={`text-xs mt-1 ${msg.sender === username ? 'text-blue-100' : 'text-gray-500'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center">
                <div 
                  className="rounded-full h-16 w-16 flex items-center justify-center mb-3 text-white text-xl"
                  style={{ backgroundColor: getUserColor(activeChat) }}
                >
                  {activeChat.charAt(0).toUpperCase()}
                </div>
                <p className="font-medium">@{activeChat}</p>
                <p className="text-gray-400 text-xs mt-1">
                  Send a message to start the conversation
                </p>
              </div>
            )}
          </div>
          
          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 flex items-center">
            <button
              type="button"
              className="text-gray-500 mr-2"
            >
              <Smile className="h-5 w-5" />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message..."
              className="flex-1 border border-gray-300 rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {!message.trim() ? (
              <button
                type="button"
                className="text-gray-500 ml-2"
              >
                <Image className="h-5 w-5" />
              </button>
            ) : (
              <button
                type="submit"
                className="text-blue-500 ml-2 font-semibold"
              >
                Send
              </button>
            )}
          </form>
        </>
      )}
    </div>
  );
};

export default ChatInterface;