import { X, Search, FileText, Folder, Eye, Layers, GitFork, ChevronRight, CornerDownLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { RESOURCES, SHORTS, COLLECTIONS, TOPICS, ROADMAPS } from '../data/archiveData';
import { Resource, ShortVideo, Collection, Topic, Roadmap } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (route: string) => void;
  isDarkMode: boolean;
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'cheat-sheet' | 'docs' | 'tool' | 'prompt' | 'topic' | 'collection' | 'roadmap' | 'short';
  category: string;
  route: string;
}

export default function CommandPalette({
  isOpen,
  onClose,
  onSelectResult,
  isDarkMode
}: CommandPaletteProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Combine data into a searchable catalog
  const searchCatalog: SearchResult[] = [
    // Resources
    ...RESOURCES.map((r): SearchResult => ({
      id: r.id,
      title: r.title,
      description: r.description,
      type: r.type === 'cheat-sheet' ? 'cheat-sheet' : r.type === 'tool' ? 'tool' : r.type === 'prompt' ? 'prompt' : 'article',
      category: r.type.toUpperCase(),
      route: `#/resources/${r.id}`
    })),
    // Shorts
    ...SHORTS.map((s): SearchResult => ({
      id: s.id,
      title: s.title,
      description: s.description,
      type: 'short',
      category: 'INSTAGRAM REEL',
      route: `#/shorts/${s.id}`
    })),
    // Collections
    ...COLLECTIONS.map((c): SearchResult => ({
      id: c.id,
      title: c.title,
      description: c.description,
      type: 'collection',
      category: 'COLLECTION',
      route: `#/collections/${c.id}`
    })),
    // Topics
    ...TOPICS.map((t): SearchResult => ({
      id: t.id,
      title: t.name,
      description: t.overview,
      type: 'topic',
      category: 'TOPIC',
      route: `#/topics/${t.id}`
    })),
    // Roadmaps
    ...ROADMAPS.map((r): SearchResult => ({
      id: r.id,
      title: r.title,
      description: r.description,
      type: 'roadmap',
      category: 'ROADMAP',
      route: `#/roadmaps/${r.id}`
    }))
  ];

  const filteredResults = searchCatalog.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true; // Show all if empty
    return (
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  }).slice(0, 8); // Limit to top 8 items for fast scanning

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle hotkeys & navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredResults.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredResults.length) % Math.max(1, filteredResults.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredResults[selectedIndex]) {
          onSelectResult(filteredResults[selectedIndex].route);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex, onClose, onSelectResult]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'topic':
        return <Folder size={14} className="opacity-60" />;
      case 'collection':
        return <Layers size={14} className="opacity-60" />;
      case 'roadmap':
        return <GitFork size={14} className="opacity-60" />;
      case 'short':
        return <Eye size={14} className="opacity-60" />;
      default:
        return <FileText size={14} className="opacity-60" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="command-palette-backdrop"
      className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] bg-black/80 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.98 }}
        className={`w-full max-w-2xl border flex flex-col rounded-none ${
          isDarkMode
            ? 'bg-black border-neutral-800 text-white'
            : 'bg-white border-neutral-200 text-black'
        }`}
        ref={containerRef}
      >
        {/* Input Bar */}
        <div className={`flex items-center px-4 py-4 border-b ${
          isDarkMode ? 'border-neutral-800' : 'border-neutral-200'
        }`}>
          <Search size={18} className="mr-3 opacity-50" />
          <input
            id="search-palette-input"
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type command, topic, system component, or protocol..."
            className="w-full bg-transparent outline-none font-mono text-sm tracking-wide"
          />
          <button
            id="close-palette-btn"
            onClick={onClose}
            className={`p-1 border transition-colors ${
              isDarkMode
                ? 'border-neutral-800 hover:bg-neutral-900 text-white'
                : 'border-neutral-200 hover:bg-neutral-100 text-black'
            }`}
          >
            <X size={14} />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[350px] overflow-y-auto py-2">
          {filteredResults.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono opacity-50">
              NO MATCHING ARCHIVE RECORDS FOUND_
            </div>
          ) : (
            filteredResults.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <button
                  id={`search-item-${item.id}`}
                  key={item.id}
                  onClick={() => {
                    onSelectResult(item.route);
                    onClose();
                  }}
                  className={`w-full text-left px-5 py-3 font-mono flex items-start justify-between transition-colors border-l-2 ${
                    isSelected
                      ? isDarkMode
                        ? 'bg-neutral-900 border-white'
                        : 'bg-neutral-100 border-black'
                      : 'border-transparent'
                  }`}
                >
                  <div className="flex items-start space-x-3 pr-4">
                    <div className="mt-1">{getIcon(item.type)}</div>
                    <div>
                      <div className="text-xs font-semibold tracking-tight">
                        {item.title}
                      </div>
                      <div className="text-[10px] opacity-50 mt-1 line-clamp-1 font-light leading-relaxed">
                        {item.description}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <span className={`text-[9px] px-1.5 py-0.5 border ${
                      isDarkMode 
                        ? 'border-neutral-800 bg-neutral-950 text-neutral-400' 
                        : 'border-neutral-200 bg-neutral-50 text-neutral-500'
                    }`}>
                      {item.category}
                    </span>
                    {isSelected && (
                      <CornerDownLeft size={10} className="opacity-60" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Console Legend / Footer */}
        <div className={`px-5 py-2.5 border-t text-[9px] font-mono opacity-40 flex justify-between items-center ${
          isDarkMode ? 'border-neutral-800' : 'border-neutral-200'
        }`}>
          <div className="flex space-x-4">
            <span>↑↓ NAVIGATE</span>
            <span>ENTER SELECT</span>
            <span>ESC CLOSE</span>
          </div>
          <div>
            <span>SYSTEM_MATCH: {filteredResults.length} RECORDS</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
