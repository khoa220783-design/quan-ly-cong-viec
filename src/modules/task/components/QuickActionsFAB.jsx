/**
 * @file QuickActionsFAB.jsx
 * @description Floating Action Button for quick task creation
 */

import React, { useState } from 'react';
import { FaPlus, FaTimes, FaTasks, FaRocket } from 'react-icons/fa';

const QuickActionsFAB = ({ onCreateTask, onViewUrgent }) => {
    const [isOpen, setIsOpen] = useState(false);

    const actions = [
        {
            icon: <FaTasks className="w-4 h-4" />,
            label: 'Tạo Task',
            onClick: onCreateTask,
            color: 'bg-neon-green'
        },
        {
            icon: <FaRocket className="w-4 h-4" />,
            label: 'Xem Gấp',
            onClick: onViewUrgent,
            color: 'bg-neon-orange'
        }
    ];

    return (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col-reverse items-end gap-3">
            {/* Action buttons */}
            {isOpen && actions.map((action, index) => (
                <div
                    key={index}
                    className="flex items-center gap-3 animate-scale-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                >
                    <span className="px-3 py-1.5 bg-surface-elevated border border-border rounded-lg font-mono text-xs text-secondary shadow-lg">
                        {action.label}
                    </span>
                    <button
                        onClick={() => { action.onClick?.(); setIsOpen(false); }}
                        className={`
                            w-12 h-12 rounded-full ${action.color} text-black
                            flex items-center justify-center
                            shadow-lg hover:scale-110 transition-transform
                        `}
                    >
                        {action.icon}
                    </button>
                </div>
            ))}

            {/* Main FAB */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-14 h-14 rounded-full
                    flex items-center justify-center
                    shadow-xl transition-all duration-300
                    ${isOpen
                        ? 'bg-surface-elevated border border-border rotate-45'
                        : 'bg-neon-green text-black hover:bg-neon-green/90'
                    }
                `}
            >
                {isOpen ? (
                    <FaTimes className="w-5 h-5 text-secondary" />
                ) : (
                    <FaPlus className="w-5 h-5" />
                )}
            </button>
        </div>
    );
};

export default QuickActionsFAB;
