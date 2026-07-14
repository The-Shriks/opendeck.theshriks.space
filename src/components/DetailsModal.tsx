import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Copy, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: string;
  description?: string;
  content?: string;
  actionLabel?: string;
  actionUrl?: string;
  isDarkMode: boolean;
  onActionClick?: () => void;
}

export default function DetailsModal({
  isOpen,
  onClose,
  title,
  type,
  description,
  content,
  actionLabel,
  actionUrl,
  isDarkMode,
  onActionClick
}: DetailsModalProps) {
  const [copied, setCopied] = useState(false);

  const handleAction = () => {
    if (onActionClick) {
      onActionClick();
      return;
    }
    
    if (actionLabel === 'COPY PROMPT' && content) {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else if (actionUrl) {
      window.open(actionUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`w-full max-w-2xl border pointer-events-auto shadow-2xl flex flex-col max-h-[85vh] ${
                isDarkMode 
                  ? 'bg-neutral-950 border-neutral-800 text-white shadow-black/50' 
                  : 'bg-white border-neutral-200 text-black shadow-neutral-200/50'
              }`}
            >
              {/* Header */}
              <div className={`p-4 border-b flex justify-between items-center ${
                isDarkMode ? 'border-neutral-800' : 'border-neutral-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider border ${
                    isDarkMode 
                      ? 'bg-neutral-900 border-neutral-700 text-neutral-300' 
                      : 'bg-neutral-100 border-neutral-300 text-neutral-600'
                  }`}>
                    {type}
                  </div>
                  <h3 className="font-mono text-sm font-bold tracking-wide truncate max-w-[200px] sm:max-w-md">
                    {title}
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className={`p-1.5 transition-colors ${
                    isDarkMode ? 'hover:bg-neutral-800 text-neutral-400 hover:text-white' : 'hover:bg-neutral-100 text-neutral-500 hover:text-black'
                  }`}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto font-sans text-sm flex-grow">
                {description && (
                  <p className={`mb-6 leading-relaxed ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    {description}
                  </p>
                )}
                
                {content && (
                  <div className={`p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap overflow-x-auto ${
                    isDarkMode ? 'bg-neutral-900 text-neutral-300' : 'bg-neutral-50 text-neutral-700'
                  }`}>
                    {content}
                  </div>
                )}
              </div>

              {/* Footer / Actions */}
              {(actionLabel || actionUrl) && (
                <div className={`p-4 border-t flex justify-end ${
                  isDarkMode ? 'border-neutral-800 bg-neutral-950/50' : 'border-neutral-200 bg-neutral-50/50'
                }`}>
                  <button
                    onClick={handleAction}
                    className={`flex items-center space-x-2 px-4 py-2 font-mono text-[10px] font-bold tracking-wider transition-colors border ${
                      isDarkMode
                        ? 'bg-white text-black border-white hover:bg-neutral-200'
                        : 'bg-black text-white border-black hover:bg-neutral-800'
                    }`}
                  >
                    {actionLabel === 'COPY PROMPT' ? (
                      <>
                        {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                        <span>{copied ? 'COPIED!' : 'COPY PROMPT'}</span>
                      </>
                    ) : (
                      <>
                        <ExternalLink size={14} />
                        <span>{actionLabel || 'VISIT LINK'}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
