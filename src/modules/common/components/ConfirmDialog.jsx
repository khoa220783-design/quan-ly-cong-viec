/**
 * @file ConfirmDialog.jsx
 * @description Custom Confirm Dialog thay thế browser confirm()
 */

import React, { useEffect, useRef } from 'react';
import { FaExclamationTriangle, FaTrash, FaCheck } from 'react-icons/fa';

const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Xác nhận',
    message = 'Bạn có chắc chắn muốn thực hiện hành động này?',
    confirmText = 'Xác nhận',
    cancelText = 'Hủy',
    variant = 'default', // 'default' | 'danger'
    isLoading = false,
}) => {
    const confirmButtonRef = useRef(null);
    const dialogRef = useRef(null);

    // Focus confirm button when opened
    useEffect(() => {
        if (isOpen) {
            // Small delay to ensure dialog is rendered
            setTimeout(() => {
                confirmButtonRef.current?.focus();
            }, 50);
        }
    }, [isOpen]);

    // Handle keyboard
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const isDanger = variant === 'danger';

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Dialog */}
            <div
                ref={dialogRef}
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-title"
                aria-describedby="confirm-message"
                className="
          relative w-full max-w-md
          bg-white dark:bg-zinc-800
          rounded-2xl shadow-2xl
          animate-scale-in
          overflow-hidden
        "
            >
                {/* Icon header */}
                <div className={`
          flex items-center justify-center py-6
          ${isDanger
                        ? 'bg-red-50 dark:bg-red-500/10'
                        : 'bg-violet-50 dark:bg-violet-500/10'
                    }
        `}>
                    <div className={`
            w-16 h-16 rounded-full flex items-center justify-center
            ${isDanger
                            ? 'bg-red-100 dark:bg-red-500/20'
                            : 'bg-violet-100 dark:bg-violet-500/20'
                        }
          `}>
                        {isDanger ? (
                            <FaTrash className="w-7 h-7 text-red-500 dark:text-red-400" />
                        ) : (
                            <FaExclamationTriangle className="w-7 h-7 text-violet-500 dark:text-violet-400" />
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-5 text-center">
                    <h3
                        id="confirm-title"
                        className="text-lg font-semibold text-zinc-900 dark:text-white mb-2"
                    >
                        {title}
                    </h3>
                    <p
                        id="confirm-message"
                        className="text-zinc-600 dark:text-zinc-400"
                    >
                        {message}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 px-6 pb-6">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="
              flex-1 px-4 py-3 rounded-xl
              text-zinc-700 dark:text-zinc-300
              bg-zinc-100 dark:bg-zinc-700
              hover:bg-zinc-200 dark:hover:bg-zinc-600
              font-medium transition-colors
              disabled:opacity-50
            "
                    >
                        {cancelText}
                    </button>
                    <button
                        ref={confirmButtonRef}
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`
              flex-1 px-4 py-3 rounded-xl
              text-white font-medium
              transition-all
              disabled:opacity-50
              flex items-center justify-center gap-2
              ${isDanger
                                ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500'
                                : 'bg-violet-500 hover:bg-violet-600 focus:ring-violet-500'
                            }
              focus:outline-none focus:ring-2 focus:ring-offset-2
              dark:focus:ring-offset-zinc-800
            `}
                    >
                        {isLoading ? (
                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        ) : (
                            <>
                                {isDanger ? <FaTrash className="w-4 h-4" /> : <FaCheck className="w-4 h-4" />}
                                {confirmText}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
