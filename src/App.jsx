/**
 * @file App.jsx
 * @description Neo-Brutalist Terminal Theme - Main App
 */

import React, { useState, useEffect, memo } from 'react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, useTheme } from './modules/common/ThemeContext';
import { WalletProvider } from './modules/wallet/WalletContext';
import { ContractProvider } from './modules/contract/ContractContext';
import { TaskProvider } from './modules/task/TaskContext';
import WalletButton from './modules/wallet/WalletButton';
import ThemeToggle from './modules/common/components/ThemeToggle';
import TaskList from './modules/task/components/TaskList';

// Separate Clock component to prevent re-rendering entire app
const LiveClock = memo(() => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-elevated/50 border border-border">
      <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
      <span className="font-mono text-xs text-secondary">
        {currentTime.toLocaleTimeString('en-US', { hour12: false })}
      </span>
    </div>
  );
});

LiveClock.displayName = 'LiveClock';

function AppContent() {
  const { isDark } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <WalletProvider>
      <ContractProvider>
        <TaskProvider>
          <div className="min-h-screen bg-[var(--bg-primary)] transition-colors duration-300">
            {/* Header */}
            <header className={`
              fixed top-0 left-0 right-0 z-50 transition-all duration-300
              ${isScrolled ? 'glass border-b border-border' : 'bg-transparent'}
            `}>
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-center h-16">
                  {/* Logo */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      {/* Terminal icon */}
                      <div className="w-10 h-10 rounded-lg bg-neon-green/10 border border-neon-green/30 flex items-center justify-center">
                        <span className="font-mono text-neon-green font-bold text-lg">{">"}</span>
                        <span className="font-mono text-neon-green font-bold text-lg animate-blink">_</span>
                      </div>
                      <div>
                        <h1 className="font-display font-bold text-lg text-primary tracking-tight">
                          task<span className="text-neon-green">mgr</span>
                        </h1>
                        <p className="font-mono text-2xs text-muted uppercase tracking-widest">
                          blockchain v1.0
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="flex items-center gap-4">
                    {/* Live time - isolated component */}
                    <LiveClock />

                    {/* Network badge */}
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30">
                      <span className="font-mono text-xs text-neon-cyan font-medium">SEPOLIA</span>
                    </div>

                    <ThemeToggle />
                    <WalletButton />
                  </div>
                </div>
              </div>
            </header>

            {/* Main */}
            <main className="pt-24 pb-16 min-h-screen">
              <div className="max-w-7xl mx-auto px-6">
                <TaskList />
              </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-border py-6">
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="font-mono text-xs text-dim">
                    <span className="text-neon-green">$</span> xây dựng trên ethereum • contract đã triển khai
                  </div>
                  <div className="font-mono text-xs text-dim">
                    © 2025 taskmgr<span className="animate-blink">_</span>
                  </div>
                </div>
              </div>
            </footer>
          </div>

          {/* Toast */}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '13px',
              },
              success: {
                iconTheme: { primary: '#22c55e', secondary: '#141414' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#141414' },
              },
            }}
          />
        </TaskProvider>
      </ContractProvider>
    </WalletProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
