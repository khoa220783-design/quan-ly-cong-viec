/**
 * @file App.jsx
 * @description Component chính của ứng dụng
 */

import React from 'react';
import { Toaster } from 'react-hot-toast';
import { WalletProvider } from './modules/wallet/WalletContext';
import { ContractProvider } from './modules/contract/ContractContext';
import { TaskProvider } from './modules/task/TaskContext';
import WalletButton from './modules/wallet/WalletButton';
import TaskList from './modules/task/components/TaskList';
import { FaCheckCircle, FaLock, FaCoins } from 'react-icons/fa';

function App() {
  
  return (
    <WalletProvider>
      <ContractProvider>
        <TaskProvider>
          <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  {/* Logo */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <svg 
                        className="w-6 h-6 text-white" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" 
                        />
                      </svg>
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">
                        Task Manager DApp
                      </h1>
                      <p className="text-xs text-gray-500">
                        Quản lý công việc phi tập trung
                      </p>
                    </div>
                  </div>
                  
                  {/* Wallet Button */}
                  <WalletButton />
                </div>
              </div>
            </header>
            
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <TaskList />
            </main>
            
            {/* Footer */}
            <footer className="bg-white border-t mt-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <p className="text-center text-gray-600">
                  © 2025 Task Manager DApp. Được xây dựng trên Ethereum Blockchain.
                </p>
              </div>
            </footer>
          </div>
          
          {/* Toast Notifications */}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </TaskProvider>
      </ContractProvider>
    </WalletProvider>
  );
}

export default App;
