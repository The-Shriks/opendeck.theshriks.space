import { GitFork, Star } from 'lucide-react';
import { WRAPPERS } from '../data/openDeckData';
import DetailsModal from './DetailsModal';
import { useState } from 'react';

import { useEffect } from 'react';

interface OpenDeckViewProps {
  isDarkMode: boolean;
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export default function OpenDeckView({ isDarkMode, currentRoute, onNavigate }: OpenDeckViewProps) {
  const [modalData, setModalData] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const id = currentRoute.startsWith('/wrapper-') ? currentRoute.substring(1) : null;
    if (id) {
      const wrapper = WRAPPERS.find(w => w.id === id);
      if (wrapper && wrapper.locked === false) {
        setModalData({
          title: wrapper.name,
          type: wrapper.type,
          description: wrapper.description,
          actionLabel: 'VISIT GITHUB REPO',
          actionUrl: wrapper.url,
          content: wrapper.content || `Stars: ${wrapper.stars}\nPackage Status: NPM_READY\nLicense: MIT_OPEN_SOURCE\n\nExecute npm install for integration.`
        });
      }
    } else {
      setModalData(null);
    }
  }, [currentRoute]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 font-mono">
      <div className="border-b pb-4 mb-8">
        <span className="text-[9px] opacity-40 block mb-1">OPEN_SOURCE_REGISTRY</span>
        <h1 className={`text-base font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-black'}`}>
          [OPENDECK_WRAPPERS]
        </h1>
        <p className="text-[10px] opacity-60 mt-1 leading-relaxed max-w-xl">
          A curated collection of open source wrappers, utilities, and components maintained by the OpenDeck community.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {WRAPPERS.map((wrapper) => (
          <div
            key={wrapper.id}
            onClick={() => {
              if (wrapper.locked === false) {
                onNavigate(`/${wrapper.id}`);
              }
            }}
            className={`relative group w-full text-left p-6 border transition-all flex flex-col justify-between overflow-hidden ${
              wrapper.locked !== false ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02]'
            } ${
              isDarkMode
                ? 'border-neutral-800 bg-neutral-950/20 hover:border-neutral-500'
                : 'border-neutral-200 bg-neutral-50/20 hover:border-neutral-400'
            }`}
          >
            {/* Locked Overlay */}
            {wrapper.locked !== false && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/10 backdrop-blur-[3px] transition-all duration-300">
                <span className={`px-4 py-1.5 text-[10px] tracking-widest font-bold border ${
                  isDarkMode 
                    ? 'bg-neutral-950 border-neutral-700 text-white shadow-xl shadow-black/50' 
                    : 'bg-white border-neutral-300 text-black shadow-xl shadow-black/10'
                }`}>
                  [LOCKED :: UPCOMING]
                </span>
              </div>
            )}

            <div className={`${wrapper.locked !== false ? 'opacity-40 select-none' : ''}`}>
              <div className="flex justify-between items-start mb-4">
                <span className="text-[9px] font-mono opacity-50 flex items-center space-x-1">
                  <GitFork size={12} />
                  <span>{wrapper.type.toUpperCase()}</span>
                </span>
                <span className="text-[9px] font-mono opacity-50 flex items-center space-x-1">
                  <Star size={12} />
                  <span>{wrapper.stars || 'N/A'}</span>
                </span>
              </div>
              <h3 className={`text-sm font-bold tracking-wider uppercase mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                {wrapper.name}
              </h3>
              <p className="text-xs opacity-60 leading-relaxed font-sans line-clamp-3">
                {wrapper.description}
              </p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-current opacity-10 text-[9px] flex justify-between select-none">
              <span>NPM_PACKAGE_READY</span>
              <span>MIT_LICENSE</span>
            </div>
            
            {/* Share Button (only if unlocked, or always?) */}
            {wrapper.locked === false && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(`https://opendeck.theshriks.space/${wrapper.id}`);
                  setCopiedId(wrapper.id);
                  setTimeout(() => setCopiedId(null), 2000);
                }}
                className="absolute top-4 right-4 p-1.5 opacity-50 hover:opacity-100 bg-black/20 hover:bg-black/50 rounded transition-all z-20"
                title="Copy Share Link"
              >
                {copiedId === wrapper.id ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                )}
              </button>
            )}
          </div>
        ))}
      </div>

      <DetailsModal
        isOpen={!!modalData}
        onClose={() => {
          setModalData(null);
          onNavigate('/opendeck');
        }}
        isDarkMode={isDarkMode}
        {...modalData}
      />
    </div>
  );
}
