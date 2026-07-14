import { ArrowLeft, Bookmark, Calendar, User, Eye, ArrowUpRight, Copy, Check, GitFork, Share2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Resource } from '../types';
import { RESOURCES } from '../data/archiveData';

interface ResourceViewerProps {
  resource: Resource;
  onNavigate: (route: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  isDarkMode: boolean;
}

export default function ResourceViewer({
  resource,
  onNavigate,
  isBookmarked,
  onToggleBookmark,
  isDarkMode
}: ResourceViewerProps) {
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
  const [showShareNotification, setShowShareNotification] = useState(false);

  // Scroll to top when resource changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [resource.id]);

  const handleCopyCode = (codeText: string, blockId: string) => {
    navigator.clipboard.writeText(codeText.trim());
    setCopiedStates((prev) => ({ ...prev, [blockId]: true }));
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [blockId]: false }));
    }, 2000);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}/resources/${resource.id}`;
    navigator.clipboard.writeText(shareUrl);
    setShowShareNotification(true);
    setTimeout(() => setShowShareNotification(false), 2500);
  };

  // Find related resources
  const relatedResources = RESOURCES.filter((r) => resource.relatedIds.includes(r.id));

  // Custom renderer for markdown content
  const renderMarkdown = (text: string) => {
    const parts = text.split(/```/g);
    let codeBlockCount = 0;

    return parts.map((part, index) => {
      // It is a code block if index is odd
      if (index % 2 !== 0) {
        codeBlockCount++;
        const blockId = `code-block-${codeBlockCount}`;
        
        // Find language
        const lines = part.split('\n');
        const firstLine = lines[0].trim();
        const language = ['go', 'rust', 'python', 'javascript', 'typescript', 'bash', 'sql', 'dockerfile', 'c'].includes(firstLine.toLowerCase())
          ? firstLine
          : 'code';
        
        const codeContent = language !== 'code' 
          ? lines.slice(1).join('\n') 
          : lines.join('\n');

        return (
          <div
            id={blockId}
            key={index}
            className={`my-6 border relative rounded-none ${
              isDarkMode 
                ? 'bg-neutral-950 border-neutral-800' 
                : 'bg-neutral-50 border-neutral-200'
            }`}
          >
            {/* Code Block Header */}
            <div className={`flex items-center justify-between px-4 py-2 border-b text-[10px] font-mono tracking-wider ${
              isDarkMode ? 'border-neutral-800 bg-neutral-900/40 text-neutral-400' : 'border-neutral-200 bg-neutral-100/50 text-neutral-500'
            }`}>
              <span>CODE_SOURCE::{language.toUpperCase()}</span>
              <button
                id={`copy-code-${blockId}`}
                onClick={() => handleCopyCode(codeContent, blockId)}
                className={`flex items-center space-x-1.5 transition-colors p-1 border ${
                  isDarkMode 
                    ? 'border-neutral-800 hover:bg-neutral-900 text-neutral-300' 
                    : 'border-neutral-200 hover:bg-neutral-200 text-neutral-700'
                }`}
              >
                {copiedStates[blockId] ? (
                  <>
                    <Check size={11} />
                    <span>COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy size={11} />
                    <span>COPY</span>
                  </>
                )}
              </button>
            </div>
            {/* Code Block Content */}
            <pre className="overflow-x-auto p-4 text-xs font-mono leading-relaxed whitespace-pre scrollbar-thin">
              <code className={isDarkMode ? 'text-neutral-300' : 'text-neutral-800'}>
                {codeContent.trim()}
              </code>
            </pre>
          </div>
        );
      }

      // Parse normal markdown lines (paragraphs, headers, tables, etc.)
      const lines = part.split('\n');
      return (
        <div key={index} className="space-y-4">
          {lines.map((line, lineIdx) => {
            const trimmed = line.trim();

            if (!trimmed) return <div key={lineIdx} className="h-2" />;

            // Header 3 (###)
            if (line.startsWith('### ')) {
              return (
                <h3
                  id={`h3-${lineIdx}`}
                  key={lineIdx}
                  className={`text-sm font-mono font-bold tracking-wider mt-8 mb-4 border-b pb-1.5 ${
                    isDarkMode ? 'border-neutral-800 text-white' : 'border-neutral-200 text-black'
                  }`}
                >
                  {line.substring(4)}
                </h3>
              );
            }

            // Header 4 (####)
            if (line.startsWith('#### ')) {
              return (
                <h4
                  id={`h4-${lineIdx}`}
                  key={lineIdx}
                  className={`text-xs font-mono font-semibold tracking-wider mt-6 mb-3 ${
                    isDarkMode ? 'text-neutral-200' : 'text-neutral-800'
                  }`}
                >
                  // {line.substring(5)}
                </h4>
              );
            }

            // List Item (* or -)
            if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
              return (
                <ul key={lineIdx} className="list-disc pl-5 my-1 space-y-1">
                  <li className={`text-xs font-sans leading-relaxed tracking-wide ${
                    isDarkMode ? 'text-neutral-400' : 'text-neutral-600'
                  }`}>
                    {trimmed.substring(2)}
                  </li>
                </ul>
              );
            }

            // Table parsing (very basic for layout)
            if (trimmed.startsWith('|') && trimmed.endsWith('|') && !trimmed.includes('---')) {
              const cells = trimmed.split('|').map(c => c.trim()).filter(c => c !== '');
              const isHeaderRow = lineIdx === 0 || (lines[lineIdx - 1] && lines[lineIdx - 1].trim() === '');
              
              return (
                <div key={lineIdx} className="overflow-x-auto my-2">
                  <table className={`min-w-full text-xs font-mono border-collapse border ${
                    isDarkMode ? 'border-neutral-800' : 'border-neutral-200'
                  }`}>
                    <tbody>
                      <tr className={isDarkMode ? 'bg-neutral-950/40' : 'bg-neutral-50/50'}>
                        {cells.map((cell, cellIdx) => (
                          <td
                            key={cellIdx}
                            className={`border p-2 ${
                              isDarkMode ? 'border-neutral-800 text-neutral-300' : 'border-neutral-200 text-neutral-800'
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              );
            }

            // Normal paragraph
            return (
              <p
                key={lineIdx}
                className={`text-xs font-sans leading-relaxed tracking-wide ${
                  isDarkMode ? 'text-neutral-300' : 'text-neutral-700'
                }`}
              >
                {line}
              </p>
            );
          })}
        </div>
      );
    });
  };

  const getDifficultyStyles = (level: string) => {
    switch (level) {
      case 'Advanced':
        return 'text-white border-white bg-neutral-900';
      case 'Intermediate':
        return 'text-neutral-400 border-neutral-700 bg-neutral-950';
      default:
        return 'text-neutral-500 border-neutral-800 bg-black';
    }
  };

  return (
    <div id={`resource-page-${resource.id}`} className="max-w-4xl mx-auto px-4 md:px-8 py-8">
      {/* Back Button */}
      <div className="mb-6 flex justify-between items-center">
        <button
          id="back-to-library-btn"
          onClick={() => onNavigate('/library')}
          className={`flex items-center space-x-1 text-xs font-mono tracking-widest ${
            isDarkMode ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'
          }`}
        >
          <ArrowLeft size={14} />
          <span>BACK_TO_LIBRARY</span>
        </button>

        <div className="flex space-x-3">
          {/* Share Button */}
          <button
            id="share-resource-btn"
            onClick={handleShare}
            className={`p-1.5 border flex items-center justify-center transition-colors ${
              isDarkMode 
                ? 'border-neutral-800 hover:bg-neutral-900 text-white' 
                : 'border-neutral-200 hover:bg-neutral-100 text-black'
            }`}
            title="Copy reference link"
          >
            <Share2 size={13} />
          </button>

          {/* Bookmark Trigger */}
          <button
            id="bookmark-toggle-btn"
            onClick={() => onToggleBookmark(resource.id)}
            className={`p-1.5 border flex items-center justify-center transition-colors ${
              isDarkMode 
                ? 'border-neutral-800 hover:bg-neutral-900 text-white' 
                : 'border-neutral-200 hover:bg-neutral-100 text-black'
            }`}
          >
            <Bookmark size={13} fill={isBookmarked ? (isDarkMode ? '#ffffff' : '#000000') : 'none'} />
          </button>
        </div>
      </div>

      {/* Share Toast Notification */}
      {showShareNotification && (
        <div className="fixed top-24 right-4 z-50 p-3 bg-white text-black text-[10px] font-mono border border-black shadow shadow-neutral-950/20">
          LINK COPIED TO SYSTEM CLIPBOARD_
        </div>
      )}

      {/* Main Document Layout */}
      <article className={`border p-6 md:p-10 ${
        isDarkMode ? 'border-neutral-800 bg-neutral-950/20' : 'border-neutral-200 bg-neutral-50/10'
      }`}>
        {/* Document Header Metadata */}
        <div className="border-b pb-6 mb-8 font-mono">
          <div className="flex flex-wrap items-center gap-3 text-[10px] opacity-60 mb-3">
            <span className="flex items-center space-x-1">
              <Calendar size={12} />
              <span>UPDATED: {resource.lastUpdated}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <User size={12} />
              <span>AUTH: {resource.author}</span>
            </span>
            <span>•</span>
            <span>SYS_VER: {resource.version}</span>
          </div>

          <h1 className={`text-xl md:text-2xl font-bold tracking-tight mb-4 ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}>
            {resource.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <span className={`text-[9px] px-2 py-0.5 border font-mono ${getDifficultyStyles(resource.difficulty)}`}>
              {resource.difficulty.toUpperCase()}
            </span>
            <span className={`text-[9px] px-2 py-0.5 border font-mono ${
              isDarkMode ? 'border-neutral-800 text-neutral-400' : 'border-neutral-200 text-neutral-600'
            }`}>
              READ_TIME: {resource.readingTime}
            </span>
            {resource.gitHubUrl && (
              <a
                id={`repo-link-${resource.id}`}
                href={resource.gitHubUrl}
                target="_blank"
                referrerPolicy="no-referrer"
                className={`text-[9px] px-2 py-0.5 border font-mono flex items-center space-x-1 hover:opacity-80 transition-opacity ${
                  isDarkMode ? 'border-neutral-800 text-neutral-300' : 'border-neutral-200 text-neutral-700'
                }`}
              >
                <GitFork size={10} />
                <span>GITHUB_REPO</span>
              </a>
            )}
          </div>
        </div>

        {/* Dynamic Markdown Content */}
        <div className="prose max-w-none">
          {renderMarkdown(resource.content)}
        </div>

        {/* Document Footer Tags */}
        <div className={`mt-10 pt-6 border-t font-mono text-[10px] flex flex-wrap items-center gap-2 ${
          isDarkMode ? 'border-neutral-800' : 'border-neutral-200'
        }`}>
          <span className="opacity-40">SYS_TAGS:</span>
          {resource.tags.map((tag) => (
            <span key={tag} className={`px-1.5 py-0.5 border ${
              isDarkMode ? 'border-neutral-800 bg-neutral-900 text-neutral-400' : 'border-neutral-200 bg-neutral-100 text-neutral-600'
            }`}>
              #{tag.toUpperCase()}
            </span>
          ))}
        </div>
      </article>

      {/* Connected Knowledge System / Related Resources */}
      {relatedResources.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xs font-mono font-bold tracking-wider opacity-60 mb-4 flex items-center space-x-2">
            <span>CONNECTED_KNOWLEDGE_NODES</span>
            <span className="h-[1px] bg-neutral-800 flex-grow" />
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedResources.map((rel) => (
              <button
                id={`related-card-${rel.id}`}
                key={rel.id}
                onClick={() => onNavigate(`/resources/${rel.id}`)}
                className={`text-left p-4 border transition-all flex flex-col justify-between hover:scale-[1.01] ${
                  isDarkMode 
                    ? 'border-neutral-800 hover:border-neutral-600 bg-neutral-950/20' 
                    : 'border-neutral-200 hover:border-neutral-400 bg-neutral-50/20'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-mono opacity-50">NODE::{rel.type.toUpperCase()}</span>
                    <span className="text-[9px] font-mono opacity-50">{rel.readingTime}</span>
                  </div>
                  <h3 className={`text-xs font-bold tracking-tight mb-1 line-clamp-1 ${
                    isDarkMode ? 'text-white' : 'text-black'
                  }`}>
                    {rel.title}
                  </h3>
                  <p className="text-[10px] opacity-60 line-clamp-2 leading-relaxed">
                    {rel.description}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-4 font-mono text-[9px]">
                  <span className="opacity-40">VIEW_NODE</span>
                  <ArrowUpRight size={10} className="opacity-60" />
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
