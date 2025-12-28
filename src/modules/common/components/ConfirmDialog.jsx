/**
 * @file ConfirmDialog.jsx
 * @description Terminal-style Confirm Dialog
 */

import React, { useEffect, useRef } from 'react';
import { FaTrash, FaExclamationTriangle } from 'react-icons/fa';

const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'confirm',
    message = 'Are you sure?',
    confirmText = 'CONFIRM',
    cancelText = 'CANCEL',
    variant = 'default',
    isLoading = false,
}) => {
    const confirmRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            confirmRef.current?.focus();
            document.body.style.overflow = 'hidden';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const isDanger = variant === 'danger';

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose} />

            <div className="relative w-full max-w-sm bg-surface-elevated border border-border rounded-xl shadow-2xl animate-scale-in overflow-hidden">
                {/* Terminal header */}
                <div className="flex items-center justify-between px-4 py-2 bg-surface border-b border-border">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-neon-red/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-neon-orange/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-neon-green/80" />
                    </div>
                    <span className="font-mono text-2xs text-muted uppercase tracking-widest">{title}</span>
                    <div className="w-12" />
                </div>

                {/* Content */}
                <div className="p-5">
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center ${isDanger ? 'bg-neon-red/10 border border-neon-red/30' : 'bg-neon-orange/10 border border-neon-orange/30'}`}>
                        {isDanger ? (
                            <FaTrash className="w-5 h-5 text-neon-red" />
                        ) : (
                            <FaExclamationTriangle className="w-5 h-5 text-neon-orange" />
                        )}
                    </div>
                    <p className="font-mono text-sm text-secondary text-center mb-6">{message}</p>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2.5 rounded-lg bg-surface-hover border border-border font-mono text-xs text-secondary hover:bg-border-default transition-colors disabled:opacity-50"
                        >
                            {cancelText}
                        </button>
                        <button
                            ref={confirmRef}
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`flex-1 px-4 py-2.5 rounded-lg font-mono text-xs font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${isDanger
                                ? 'bg-neon-red text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                                : 'bg-neon-green text-neutral-950 hover:shadow-neon-green'
                                }`}
                        >
                            {isLoading && (
                                <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            )}
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
