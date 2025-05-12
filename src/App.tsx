import React from 'react';
import { BlockchainProvider } from './blockchain/BlockchainContext';
import { AuthProvider } from './auth/AuthContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import Header from './components/Header';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
import MiningControl from './components/MiningControl';
import BlockchainInfo from './components/BlockchainInfo';
import ChatInterface from './components/ChatInterface';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <BlockchainProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-gray-100">
                    <Header />
                    <main className="container mx-auto py-6 px-4">
                      <div className="max-w-2xl mx-auto">
                        <BlockchainInfo />
                        <PostForm />
                        <PostList />
                      </div>
                    </main>
                    <MiningControl />
                    <ChatInterface />
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BlockchainProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

export default App;