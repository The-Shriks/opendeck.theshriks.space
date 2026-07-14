import { Download, FileText, BookOpen } from 'lucide-react';
import { MATERIALS, NOTES } from '../data/openDeckData';
import DetailsModal from './DetailsModal';
import { useEffect, useState } from 'react';

interface MaterialsViewProps {
  isDarkMode: boolean;
}

export default function MaterialsView({ isDarkMode }: MaterialsViewProps) {
  const [modalData, setModalData] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const checkHashForModal = () => {
      const params = new URLSearchParams(window.location.hash.split('?')[1]);
      const id = params.get('id');
      if (id) {
        // Check NOTES first
        const note = NOTES.find(n => n.id === id);
        if (note) {
          setModalData({
            title: note.title,
            type: note.type,
            description: note.description,
            content: note.content
          });
          return;
        }
        // Check MATERIALS
        const material = MATERIALS.find(m => m.id === id);
        if (material) {
          setModalData({
            title: material.title,
            type: material.type,
            description: material.description,
            actionLabel: 'DOWNLOAD FILE',
            actionUrl: material.link,
            content: `Size: ${material.size}\nFormat: ${material.type}\nStatus: SECURE`
          });
        }
      } else {
        setModalData(null);
      }
    };

    checkHashForModal();
    window.addEventListener('hashchange', checkHashForModal);
    return () => window.removeEventListener('hashchange', checkHashForModal);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 font-mono">
      <div className="border-b pb-4 mb-8">
        <span className="text-[9px] opacity-40 block mb-1">KNOWLEDGE_BASE</span>
        <h1 className={`text-base font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-black'}`}>
          [MATERIALS & GUIDES]
        </h1>
        <p className="text-[10px] opacity-60 mt-1 leading-relaxed max-w-xl">
          Direct links to UI kits, system architecture diagrams, and readable system notes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Notes & Guides */}
        <div>
          <div className="flex items-center space-x-2 mb-4 opacity-70">
            <BookOpen size={14} />
            <h2 className="text-xs font-bold tracking-widest uppercase">Guides & Notes</h2>
          </div>
          <div className="space-y-4">
            {NOTES.map((note) => (
              <div
                key={note.id}
                className={`relative w-full text-left p-5 border flex items-start space-x-4 transition-colors overflow-hidden cursor-not-allowed ${
                  isDarkMode
                    ? 'border-neutral-800 bg-neutral-950/20'
                    : 'border-neutral-200 bg-neutral-50/20'
                }`}
              >
                {/* Locked Overlay */}
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/10 backdrop-blur-[3px]">
                  <span className={`px-4 py-1.5 text-[10px] tracking-widest font-bold border ${
                    isDarkMode 
                      ? 'bg-neutral-950 border-neutral-700 text-white shadow-xl shadow-black/50' 
                      : 'bg-white border-neutral-300 text-black shadow-xl shadow-black/10'
                  }`}>
                    [LOCKED :: UPCOMING]
                  </span>
                </div>

                <div className="flex items-start space-x-4 opacity-40 select-none">
                  <div className="p-3 border border-current opacity-40 mt-1 shrink-0">
                    <BookOpen size={16} />
                  </div>
                  <div>
                    <div className="text-[9px] font-mono opacity-50 mb-1">{note.type.toUpperCase()}</div>
                    <h3 className={`text-sm font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>
                      {note.title}
                    </h3>
                    <p className="text-[11px] opacity-60 mt-1 font-sans line-clamp-2">
                      {note.description}
                    </p>
                  </div>
                </div>
                
                {/* Share Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(`https://opendeck.theshriks.space/${note.id}`);
                    setCopiedId(note.id);
                    setTimeout(() => setCopiedId(null), 2000);
                  }}
                  className="absolute top-4 right-4 p-1.5 opacity-50 hover:opacity-100 bg-black/20 hover:bg-black/50 rounded transition-all z-20"
                  title="Copy Share Link"
                >
                  {copiedId === note.id ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Secure Downloads */}
        <div>
          <div className="flex items-center space-x-2 mb-4 opacity-70">
            <Download size={14} />
            <h2 className="text-xs font-bold tracking-widest uppercase">Secure Downloads</h2>
          </div>
          <div className="space-y-4">
            {MATERIALS.map((material) => (
              <div
                key={material.id}
                className={`relative w-full text-left p-5 border flex items-start space-x-4 transition-colors overflow-hidden cursor-not-allowed ${
                  isDarkMode
                    ? 'border-neutral-800 bg-neutral-950/20'
                    : 'border-neutral-200 bg-neutral-50/20'
                }`}
              >
                {/* Locked Overlay */}
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/10 backdrop-blur-[3px]">
                  <span className={`px-4 py-1.5 text-[10px] tracking-widest font-bold border ${
                    isDarkMode 
                      ? 'bg-neutral-950 border-neutral-700 text-white shadow-xl shadow-black/50' 
                      : 'bg-white border-neutral-300 text-black shadow-xl shadow-black/10'
                  }`}>
                    [LOCKED :: UPCOMING]
                  </span>
                </div>

                <div className="flex items-start space-x-4 opacity-40 select-none">
                  <div className="p-3 border border-current opacity-40 mt-1 shrink-0">
                    <FileText size={16} />
                  </div>
                  <div>
                    <div className="text-[9px] font-mono opacity-50 mb-1">{material.type.toUpperCase()} // {material.size}</div>
                    <h3 className={`text-sm font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>
                      {material.title}
                    </h3>
                    <p className="text-[11px] opacity-60 mt-1 font-sans line-clamp-2">
                      {material.description}
                    </p>
                  </div>
                </div>
                
                {/* Share Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(`https://opendeck.theshriks.space/${material.id}`);
                    setCopiedId(material.id);
                    setTimeout(() => setCopiedId(null), 2000);
                  }}
                  className="absolute top-4 right-4 p-1.5 opacity-50 hover:opacity-100 bg-black/20 hover:bg-black/50 rounded transition-all z-20"
                  title="Copy Share Link"
                >
                  {copiedId === material.id ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DetailsModal
        isOpen={!!modalData}
        onClose={() => {
          setModalData(null);
          window.location.hash = '#/materials';
        }}
        isDarkMode={isDarkMode}
        {...modalData}
      />
    </div>
  );
}
