/**
 * @file App.jsx
 * @description Component chính của ứng dụng - Premium Web3 Theme
 */

import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { WalletProvider } from './modules/wallet/WalletContext';
import { ContractProvider } from './modules/contract/ContractContext';
import { TaskProvider } from './modules/task/TaskContext';
import WalletButton from './modules/wallet/WalletButton';
import TaskList from './modules/task/components/TaskList';
import { FaGithub, FaTwitter, FaDiscord } from 'react-icons/fa';

function App() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scroll for header blur effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <WalletProvider>
      <ContractProvider>
        <TaskProvider>
          <div className="min-h-screen animated-gradient">
            {/* Header */}
            <header
              className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                  ? 'glass border-b border-white/10'
                  : 'bg-transparent'
                }`}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  {/* Logo */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-cyan flex items-center justify-center shadow-glow">
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
                      {/* Glow effect */}
                      <div className="absolute inset-0 w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-cyan blur-lg opacity-50 -z-10" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-white">
                        Task<span className="gradient-text">Manager</span>
                      </h1>
                      <p className="text-xs text-dark-400">
                        Quản lý công việc trên Blockchain
                      </p>
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className="flex items-center gap-4">
                    {/* Network Badge */}
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-medium text-emerald-400">Sepolia</span>
                    </div>

                    {/* Wallet Button */}
                    <WalletButton />
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="pt-24 pb-12 min-h-screen">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <TaskList />
              </div>
            </main>

            {/* Footer */}
            <footer className="relative mt-12 border-t border-white/5">
              {/* Gradient Line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-brand-500 to-transparent" />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  {/* Copyright */}
                  <div className="flex items-center gap-2 text-dark-400 text-sm">
                    <span>© 2025</span>
                    <span className="text-white font-medium">TaskManager DApp</span>
                    <span>•</span>
                    <span>Built on Ethereum</span>
                  </div>

                  {/* Social Links */}
                  <div className="flex items-center gap-4">
                    <a
                      href="#"
                      className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-white/5 transition-colors"
                      aria-label="GitHub"
                    >
                      <FaGithub className="w-5 h-5" />
                    </a>
                    <a
                      href="#"
                      className="p-2 rounded-lg text-dark-400 hover:text-accent-cyan hover:bg-accent-cyan/5 transition-colors"
                      aria-label="Twitter"
                    >
                      <FaTwitter className="w-5 h-5" />
                    </a>
                    <a
                      href="#"
                      className="p-2 rounded-lg text-dark-400 hover:text-brand-400 hover:bg-brand-500/5 transition-colors"
                      aria-label="Discord"
                    >
                      <FaDiscord className="w-5 h-5" />
                    </a>
                  </div>

                  {/* Powered by */}
                  <div className="flex items-center gap-2 text-dark-500 text-xs">
                    <span>Powered by</span>
                    <span className="gradient-text font-semibold">Ethereum</span>
                    <span>+</span>
                    <span className="text-accent-cyan font-semibold">React</span>
                  </div>
                </div>
              </div>
            </footer>
          </div>

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'rgba(30, 41, 59, 0.95)',
                backdropFilter: 'blur(16px)',
                color: '#f8fafc',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                padding: '16px',
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
              loading: {
                iconTheme: {
                  primary: '#8b5cf6',
                  secondary: '#1e293b',
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
