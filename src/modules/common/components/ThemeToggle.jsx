/**
 * @file ThemeToggle.jsx
 * @description Terminal-style theme toggle
 */

import React from 'react';
import { useTheme } from '../ThemeContext';

const ThemeToggle = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="
        relative w-12 h-7 rounded-lg
        bg-surface-hover border border-border
        transition-all duration-300
        hover:border-border-strong
        focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-green
      "
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {/* Toggle */}
            <span className={`
        absolute top-0.5 left-0.5
        w-6 h-6 rounded-md
        bg-border border border-border-strong
        flex items-center justify-center
        transition-all duration-300
        ${isDark ? 'translate-x-5 bg-neon-green/20 border-neon-green/50' : 'translate-x-0'}
      `}>
                {/* Sun */}
                <svg
                    className={`w-3.5 h-3.5 text-neon-orange transition-all duration-300 ${isDark ? 'opacity-0 scale-0 rotate-90' : 'opacity-100 scale-100 rotate-0'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>

                {/* Moon */}
                <svg
                    className={`absolute w-3.5 h-3.5 text-neon-green transition-all duration-300 ${isDark ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-0 -rotate-90'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
            </span>
        </button>
    );
};

export default ThemeToggle;
