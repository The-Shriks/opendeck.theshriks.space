import { Play, Clipboard, FileText, ChevronRight, CornerDownLeft, Download, ExternalLink, RefreshCw, GitFork, Copy, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { ShortVideo } from '../types';
import { SHORTS } from '../data/archiveData';

interface ShortsViewerProps {
  initialShortId?: string;
  onNavigate: (route: string) => void;
  isDarkMode: boolean;
}

export default function ShortsViewer({
  initialShortId,
  onNavigate,
  isDarkMode
}: ShortsViewerProps) {
  const [activeShort, setActiveShort] = useState<ShortVideo>(SHORTS[0]);
  const [copiedCode, setCopiedCode] = useState(false);
  const [executionLine, setExecutionLine] = useState(0);
  const [isRunningSimulation, setIsRunningSimulation] = useState(false);

  useEffect(() => {
    if (initialShortId) {
      const found = SHORTS.find((s) => s.id === initialShortId);
      if (found) {
        setActiveShort(found);
      }
    }
  }, [initialShortId]);

  // Code line simulator effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunningSimulation && activeShort.codeSnippet) {
      const codeLinesCount = activeShort.codeSnippet.split('\n').length;
      interval = setInterval(() => {
        setExecutionLine((prev) => (prev + 1) % codeLinesCount);
      }, 1000);
    } else {
      setExecutionLine(0);
    }
    return () => clearInterval(interval);
  }, [isRunningSimulation, activeShort.codeSnippet]);

  const handleCopyCode = () => {
    if (!activeShort.codeSnippet) return;
    navigator.clipboard.writeText(activeShort.codeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div id="shorts-viewer-container" className="max-w-7xl mx-auto px-4 md:px-8 py-8 font-mono">
      {/* Page Header */}
      <div className="border-b pb-4 mb-8">
        <div className="text-[10px] opacity-40 mb-1">CONNECTED_FEED::INSTAGRAM_REEL_EXPLANATIONS</div>
        <h1 className={`text-base font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-black'}`}>
          [REEL_INDEX_HUB]
        </h1>
        <p className="text-[10px] opacity-60 mt-1 leading-relaxed max-w-xl">
          Detailed technical reference briefs, execution traces, and download archives for every conceptual tutorial shared on our social reels.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Playlist Selector (cols-3) */}
        <div className="lg:col-span-3 space-y-3">
          <div className="text-[10px] opacity-40 font-bold tracking-wider mb-2">ACTIVE_PLAYLIST</div>
          <div className={`border p-2 space-y-1 ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'}`}>
            {SHORTS.map((s, idx) => (
              <button
                id={`short-playlist-item-${s.id}`}
                key={s.id}
                onClick={() => {
                  setActiveShort(s);
                  setIsRunningSimulation(false);
                }}
                className={`w-full text-left p-2.5 text-xs transition-colors flex items-center justify-between ${
                  activeShort.id === s.id
                    ? isDarkMode
                      ? 'bg-neutral-900 text-white border-l-2 border-white'
                      : 'bg-neutral-100 text-black border-l-2 border-black'
                    : isDarkMode
                      ? 'text-neutral-500 hover:text-neutral-300'
                      : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <span className="opacity-40 text-[9px]">0{idx + 1}</span>
                  <span className="truncate tracking-tight font-medium">{s.title}</span>
                </div>
                {activeShort.id === s.id && <CornerDownLeft size={10} className="shrink-0 ml-1.5 opacity-60" />}
              </button>
            ))}
          </div>
        </div>

        {/* Middle Column: Hardware/Visual Simulator Panel (cols-4) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="text-[10px] opacity-40 font-bold tracking-wider">VISUAL_SCHEMATIC</div>
          
          <div className={`border p-5 relative overflow-hidden flex flex-col justify-between min-h-[420px] ${
            isDarkMode ? 'bg-black border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-black'
          }`}>
            {/* Grid background effect */}
            <div className={`absolute inset-0 z-0 opacity-20 pointer-events-none ${isDarkMode ? 'terminal-grid' : 'terminal-grid-light'}`} />

            {/* Screen Header */}
            <div className="relative z-10 flex justify-between items-center text-[9px] opacity-60 border-b pb-2 mb-4 font-mono">
              <span>SIMULATION_TERM::ACTIVE</span>
              <span className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 bg-neutral-400 rounded-none animate-ping" />
                <span>ONLINE</span>
              </span>
            </div>

            {/* ASCII Schematic Content */}
            <div className="relative z-10 flex-grow flex flex-col justify-center my-4 font-mono">
              {activeShort.diagram ? (
                <pre className={`text-[10px] leading-relaxed overflow-x-auto whitespace-pre p-3 border ${
                  isDarkMode ? 'bg-neutral-950 border-neutral-800 text-neutral-300' : 'bg-white border-neutral-100 text-neutral-800'
                }`}>
                  {activeShort.diagram}
                </pre>
              ) : (
                <div className="text-center text-xs opacity-50 py-12">
                  NO HARDWARE_SCHEMATIC REQUIRED
                </div>
              )}
            </div>

            {/* Bottom Interaction controls */}
            <div className="relative z-10 border-t pt-3 flex items-center justify-between mt-4">
              <span className="text-[9px] opacity-50">TRACEPOINT_HOOKS: LOADED</span>
              <button
                id="toggle-simulator-btn"
                onClick={() => setIsRunningSimulation(!isRunningSimulation)}
                className={`px-3 py-1 text-[9px] border transition-colors flex items-center space-x-1.5 ${
                  isRunningSimulation
                    ? 'bg-white text-black border-white hover:bg-neutral-200'
                    : isDarkMode
                      ? 'border-neutral-800 hover:bg-neutral-900 text-white'
                      : 'border-neutral-200 hover:bg-neutral-100 text-black'
                }`}
              >
                <RefreshCw size={10} className={isRunningSimulation ? 'animate-spin' : ''} />
                <span>{isRunningSimulation ? 'PAUSE_TRACE' : 'INIT_TRACE_SIM'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Reference Materials & Code Brief (cols-5) */}
        <div className="lg:col-span-5 space-y-5">
          <div>
            <div className="text-[10px] opacity-40 font-bold tracking-wider mb-2">SOURCE_BRIEF</div>
            <div className={`border p-5 space-y-4 ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'}`}>
              <h2 className={`text-sm font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>
                {activeShort.title}
              </h2>
              <p className={`text-xs font-sans leading-relaxed tracking-wide ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                {activeShort.description}
              </p>

              {/* Collapsible/Scrollable notes */}
              <div className={`p-4 border text-xs font-sans leading-relaxed space-y-3 ${
                isDarkMode ? 'bg-neutral-950/40 border-neutral-800 text-neutral-300' : 'bg-neutral-50/50 border-neutral-100 text-neutral-700'
              }`}>
                <div className="font-mono text-[9px] opacity-50 border-b pb-1 mb-2">LECTURE_NOTES.TXT</div>
                <div className="line-clamp-4 overflow-y-auto max-h-[150px] scrollbar-thin pr-1 text-[11px] whitespace-pre-wrap">
                  {activeShort.notes}
                </div>
              </div>
            </div>
          </div>

          {/* Code Section */}
          {activeShort.codeSnippet && (
            <div>
              <div className="text-[10px] opacity-40 font-bold tracking-wider mb-2 flex justify-between items-center">
                <span>REPLICABLE_IMPLEMENTATION</span>
                <button
                  id="copy-short-code-btn"
                  onClick={handleCopyCode}
                  className={`text-[9px] border px-2 py-0.5 transition-colors flex items-center space-x-1 ${
                    isDarkMode ? 'border-neutral-800 hover:bg-neutral-900 text-neutral-300' : 'border-neutral-200 hover:bg-neutral-100 text-neutral-700'
                  }`}
                >
                  {copiedCode ? (
                    <>
                      <Check size={9} />
                      <span>COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy size={9} />
                      <span>COPY_CODE</span>
                    </>
                  )}
                </button>
              </div>

              <div className={`border relative ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'}`}>
                <pre className={`overflow-x-auto p-4 text-[11px] font-mono leading-relaxed max-h-[220px] scrollbar-thin ${
                  isDarkMode ? 'bg-black text-neutral-300' : 'bg-neutral-50 text-neutral-800'
                }`}>
                  {activeShort.codeSnippet.split('\n').map((line, idx) => {
                    const isExecuted = isRunningSimulation && idx === executionLine;
                    return (
                      <div
                        key={idx}
                        className={`transition-colors duration-300 px-1 ${
                          isExecuted
                            ? isDarkMode
                              ? 'bg-neutral-800 text-white font-bold'
                              : 'bg-neutral-200 text-black font-bold'
                            : ''
                        }`}
                      >
                        <span className="opacity-30 select-none mr-3 inline-block w-4 text-right">
                          {idx + 1}
                        </span>
                        {line}
                      </div>
                    );
                  })}
                </pre>
              </div>
            </div>
          )}

          {/* Connections Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* References */}
            <div>
              <div className="text-[10px] opacity-40 font-bold tracking-wider mb-2">REFERENCE_NODE</div>
              <div className="space-y-2">
                {activeShort.relatedResourceIds.map((resId) => (
                  <button
                    id={`short-ref-${resId}`}
                    key={resId}
                    onClick={() => onNavigate(`#/resources/${resId}`)}
                    className={`w-full text-left p-2.5 border text-xs hover:border-current transition-colors flex items-center justify-between ${
                      isDarkMode ? 'border-neutral-800 text-neutral-300' : 'border-neutral-200 text-neutral-700'
                    }`}
                  >
                    <span className="truncate">{resId.toUpperCase().replace(/-/g, '_')}</span>
                    <ExternalLink size={10} className="opacity-60 ml-2" />
                  </button>
                ))}
              </div>
            </div>

            {/* Downloads */}
            {activeShort.downloads && activeShort.downloads.length > 0 && (
              <div>
                <div className="text-[10px] opacity-40 font-bold tracking-wider mb-2">DOWNLOAD_ARCHIVE</div>
                <div className="space-y-2">
                  {activeShort.downloads.map((d) => (
                    <a
                      id={`short-download-${d.label.toLowerCase().replace(/\s+/g, '-')}`}
                      key={d.label}
                      href={d.url}
                      target="_blank"
                      referrerPolicy="no-referrer"
                      className={`block p-2.5 border text-xs hover:border-current transition-colors flex items-center justify-between ${
                        isDarkMode ? 'border-neutral-800 text-neutral-300' : 'border-neutral-200 text-neutral-700'
                      }`}
                    >
                      <span className="truncate">{d.label.toUpperCase()}</span>
                      <Download size={10} className="opacity-60 ml-2" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
