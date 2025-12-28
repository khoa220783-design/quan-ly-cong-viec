/**
 * @file Select.jsx
 * @description Custom Select Component - Fully Accessible & Terminal Themed
 */

import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaCheck } from 'react-icons/fa';

const Select = ({ options, value, onChange, placeholder = 'Select...', className = '', label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const containerRef = useRef(null);
    const buttonRef = useRef(null); // Ref for the button to refocus after selection

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
                setHighlightedIndex(-1);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Keyboard navigation logic
    useEffect(() => {
        if (isOpen && highlightedIndex === -1 && options.length > 0) {
            // Highlight selected option or first option when opening
            const index = options.findIndex(opt => opt.value === value);
            setHighlightedIndex(index >= 0 ? index : 0);
        }
    }, [isOpen, value, options, highlightedIndex]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (isOpen) {
                if (highlightedIndex >= 0) {
                    handleSelect(options[highlightedIndex]);
                }
            } else {
                setIsOpen(true);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (!isOpen) {
                setIsOpen(true);
            } else {
                setHighlightedIndex(prev => (prev < options.length - 1 ? prev + 1 : 0));
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (!isOpen) {
                setIsOpen(true);
            } else {
                setHighlightedIndex(prev => (prev > 0 ? prev - 1 : options.length - 1));
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false);
            setHighlightedIndex(-1);
            buttonRef.current?.focus(); // Return focus to trigger
        } else if (e.key === 'Tab') {
            setIsOpen(false);
        }
    };

    const handleSelect = (option) => {
        onChange(option.value);
        setIsOpen(false);
        setHighlightedIndex(-1);
        buttonRef.current?.focus(); // Return focus to trigger
    };

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            {label && (
                <label className="block font-mono text-xs text-secondary mb-1.5 uppercase tracking-wide">
                    {label}
                </label>
            )}

            {/* Trigger Button - Keyboard Focusable */}
            <button
                ref={buttonRef}
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                onKeyDown={handleKeyDown}
                className={`
          w-full px-3 py-2.5 rounded-lg
          bg-surface-elevated border
          font-mono text-sm text-left
          flex items-center justify-between
          transition-all duration-200 outline-none
          focus:ring-1 focus:ring-neon-green/50
          ${isOpen ? 'border-neon-green ring-1 ring-neon-green/20' : 'border-border hover:border-border-default'}
        `}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className={selectedOption ? 'text-primary' : 'text-muted'}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <FaChevronDown
                    className={`w-3 h-3 text-muted transition-transform duration-200 ${isOpen ? 'rotate-180 text-neon-green' : ''}`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    className="absolute z-50 w-full mt-1 bg-surface border border-border rounded-lg shadow-xl shadow-black/50 overflow-hidden animate-slide-down"
                    role="listbox"
                >
                    <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                        {options.map((option, index) => {
                            const isActive = option.value === value;
                            const isHighlighted = index === highlightedIndex;

                            return (
                                <div
                                    key={option.value}
                                    onClick={() => handleSelect(option)}
                                    onMouseEnter={() => setHighlightedIndex(index)}
                                    className={`
                    px-3 py-2 rounded-md font-mono text-sm cursor-pointer
                    flex items-center justify-between
                    transition-colors duration-150
                    ${isActive
                                            ? 'bg-neon-green/10 text-neon-green'
                                            : isHighlighted
                                                ? 'bg-surface-hover text-primary'
                                                : 'text-secondary'
                                        }
                  `}
                                    role="option"
                                    aria-selected={isActive}
                                >
                                    <span>{option.label}</span>
                                    {isActive && <FaCheck className="w-3 h-3" />}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Select;
