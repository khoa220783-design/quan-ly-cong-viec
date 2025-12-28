/**
 * @file Modal.jsx
 * @description Terminal-style Modal
 */

import React, { useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) => {
  const modalRef = useRef(null);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  };

  useEffect(() => {
    if (!isOpen) return;

    modalRef.current?.focus();
    document.body.style.overflow = 'hidden';

    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        className={`
          relative w-full ${sizes[size]}
          bg-surface-elevated border border-border rounded-xl
          shadow-2xl shadow-black/50
          animate-scale-in overflow-hidden
        `}
      >
        {/* Terminal-style header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-surface">
          <div className="flex items-center gap-3">
            {/* Window controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-neon-red/80 hover:bg-neon-red transition-colors"
              />
              <div className="w-3 h-3 rounded-full bg-neon-orange/80" />
              <div className="w-3 h-3 rounded-full bg-neon-green/80" />
            </div>
            <span className="font-mono text-xs text-muted uppercase tracking-widest">
              {title}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-muted hover:text-primary hover:bg-surface-hover transition-colors"
          >
            <FaTimes className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
