/**
 * @file App.jsx
 * @description Component chính với Theme support
 */

import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, useTheme } from './modules/common/ThemeContext';
import { WalletProvider } from './modules/wallet/WalletContext';
import { ContractProvider } from './modules/contract/ContractContext';
import { TaskProvider } from './modules/task/TaskContext';
import WalletButton from './modules/wallet/WalletButton';
import ThemeToggle from './modules/common/components/ThemeToggle';
import TaskList from './modules/task/components/TaskList';
import { FaGithub } from 'react-icons/fa';

// Main App Content (needs to be inside ThemeProvider)
function AppContent() {
  const { isDark } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

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
          <div className={`min-h-screen transition-colors duration-300 ${isDark
              ? 'bg-zinc-900'
              : 'bg-gradient-to-br from-zinc-50 to-zinc-100'
            }`}>
            {/* Header */}
            <header
              className={`
                fixed top-0 left-0 right-0 z-50 
                transition-all duration-300
                ${isScrolled
                  ? 'bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg shadow-sm border-b border-zinc-200/50 dark:border-zinc-800'
                  : 'bg-transparent'
                }
              `}
            >
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  {/* Logo */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                      <svg
                        className="w-5 h-5 text-white"
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
                      <h1 className="text-lg font-semibold text-zinc-800 dark:text-white">
                        TaskManager
                      </h1>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:block">
                        Blockchain-powered
                      </p>
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className="flex items-center gap-3">
                    {/* Network Badge */}
                    <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Sepolia</span>
                    </div>

                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {/* Wallet Button */}
                    <WalletButton />
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="pt-24 pb-16 min-h-screen">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <TaskList />
              </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    © 2025 TaskManager • Built on Ethereum
                  </p>
                  <div className="flex items-center gap-4">
                    <a
                      href="#"
                      className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                      aria-label="GitHub"
                    >
                      <FaGithub className="w-5 h-5" />
                    </a>
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
                background: isDark ? '#27272a' : '#ffffff',
                color: isDark ? '#fafafa' : '#18181b',
                border: `1px solid ${isDark ? '#3f3f46' : '#e4e4e7'}`,
                borderRadius: '12px',
                padding: '12px 16px',
                boxShadow: isDark
                  ? '0 10px 15px rgba(0, 0, 0, 0.3)'
                  : '0 10px 15px rgba(0, 0, 0, 0.1)',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
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

// App wrapper with ThemeProvider
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
