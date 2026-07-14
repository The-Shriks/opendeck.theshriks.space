import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, Search, Bookmark, ChevronRight, ArrowUpRight, 
  GitFork, Eye, Layers, Star, Play, FileText, CheckCircle2, 
  BookOpen, Compass, Cpu, Database, Network, Globe 
} from 'lucide-react';

// Import custom components
import Navigation from './components/Navigation';
import CommandPalette from './components/CommandPalette';
import ResourceViewer from './components/ResourceViewer';
import ShortsViewer from './components/ShortsViewer';
import TopicExplorer from './components/TopicExplorer';
import RoadmapViewer from './components/RoadmapViewer';
import NewsletterPanel from './components/NewsletterPanel';
import OpenDeckView from './components/OpenDeckView';
import MaterialsView from './components/MaterialsView';
import PromptsView from './components/PromptsView';

// Import data
import { RESOURCES, SHORTS, COLLECTIONS, TOPICS, ROADMAPS } from './data/archiveData';
import { Resource } from './types';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(
    window.location.pathname === '/' || window.location.pathname === '/index.html'
      ? '/opendeck'
      : window.location.pathname
  );
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [systemTime, setSystemTime] = useState('');

  // 1. History API Routing System
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentRoute(path === '/' || path === '/index.html' ? '/opendeck' : path);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 2. Real-time system clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSystemTime(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 3. Persist Bookmarks to localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('dev_archive_bookmarks');
      if (stored) {
        setBookmarks(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load bookmarks', e);
    }
  }, []);

  const handleToggleBookmark = (id: string) => {
    const updated = bookmarks.includes(id)
      ? bookmarks.filter((bId) => bId !== id)
      : [...bookmarks, id];
    setBookmarks(updated);
    try {
      localStorage.setItem('dev_archive_bookmarks', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to store bookmarks', e);
    }
  };

  const handleNavigate = (route: string) => {
    window.history.pushState(null, '', route);
    setCurrentRoute(route);
    window.scrollTo(0, 0);
  };

  // Keyboard shortcut for command palette (Ctrl+K or Command+K or /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Synchronize CSS class for theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.style.backgroundColor = '#000000';
    } else {
      root.classList.remove('dark');
      root.style.backgroundColor = '#ffffff';
    }
  }, [isDarkMode]);

  // Route router logic helper
  const renderCurrentView = () => {
    if (currentRoute.startsWith('/materials') || currentRoute.startsWith('/mat-') || currentRoute.startsWith('/note-')) {
      return <MaterialsView isDarkMode={isDarkMode} currentRoute={currentRoute} onNavigate={handleNavigate} />;
    }
    if (currentRoute.startsWith('/prompts') || currentRoute.startsWith('/prompt-')) {
      return <PromptsView isDarkMode={isDarkMode} currentRoute={currentRoute} onNavigate={handleNavigate} />;
    }
    if (currentRoute === '/opendeck' || currentRoute.startsWith('/wrapper-')) {
      return <OpenDeckView isDarkMode={isDarkMode} currentRoute={currentRoute} onNavigate={handleNavigate} />;
    }

    // 1. Resource detail route: /resources/:id
    if (currentRoute.startsWith('/resources/')) {
      const resourceId = currentRoute.replace('/resources/', '');
      const resource = RESOURCES.find((r) => r.id === resourceId);
      if (resource) {
        return (
          <ResourceViewer
            resource={resource}
            onNavigate={handleNavigate}
            isBookmarked={bookmarks.includes(resource.id)}
            onToggleBookmark={handleToggleBookmark}
            isDarkMode={isDarkMode}
          />
        );
      }
    }

    // 2. Short detail route: /shorts/:id or general /shorts
    if (currentRoute.startsWith('/shorts')) {
      const shortId = currentRoute.startsWith('/shorts/') ? currentRoute.replace('/shorts/', '') : undefined;
      return (
        <ShortsViewer
          initialShortId={shortId}
          onNavigate={handleNavigate}
          isDarkMode={isDarkMode}
        />
      );
    }

    // 3. Topics route: /topics/:id or general /topics
    if (currentRoute.startsWith('/topics')) {
      const topicId = currentRoute.startsWith('/topics/') ? currentRoute.replace('/topics/', '') : undefined;
      return (
        <TopicExplorer
          initialTopicId={topicId}
          onNavigate={handleNavigate}
          isDarkMode={isDarkMode}
        />
      );
    }

    // 4. Roadmaps route: /roadmaps/:id or general /roadmaps
    if (currentRoute.startsWith('/roadmaps')) {
      const roadmapId = currentRoute.startsWith('/roadmaps/') ? currentRoute.replace('/roadmaps/', '') : undefined;
      return (
        <RoadmapViewer
          initialRoadmapId={roadmapId}
          onNavigate={handleNavigate}
          isDarkMode={isDarkMode}
        />
      );
    }

    // 5. Collections route: /collections/:id
    if (currentRoute.startsWith('/collections/')) {
      const collectionId = currentRoute.replace('/collections/', '');
      const collection = COLLECTIONS.find((c) => c.id === collectionId);
      if (collection) {
        // Render collection playlist details
        return (
          <div id={`collection-view-${collection.id}`} className="max-w-4xl mx-auto px-4 md:px-8 py-8 font-mono">
            <div className="border-b pb-4 mb-8">
              <span className="text-[9px] opacity-40 block mb-1">CURATED_COLLECTION_PLAYLIST</span>
              <h1 className={`text-base font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-black'}`}>
                {collection.title}
              </h1>
              <p className="text-[10px] opacity-60 mt-1 leading-relaxed max-w-xl font-sans">
                {collection.description}
              </p>
            </div>

            <div className="space-y-4">
              {collection.resourceIds.map((resId, idx) => {
                const res = RESOURCES.find((r) => r.id === resId);
                if (!res) return null;
                return (
                  <button
                    id={`collection-item-${res.id}`}
                    key={res.id}
                    onClick={() => handleNavigate(`/resources/${res.id}`)}
                    className={`w-full text-left p-5 border transition-all flex items-start space-x-4 hover:scale-[1.01] ${
                      isDarkMode
                        ? 'border-neutral-800 hover:border-neutral-500 bg-neutral-950/20'
                        : 'border-neutral-200 hover:border-neutral-400 bg-neutral-50/20'
                    }`}
                  >
                    <div className="font-mono text-xs opacity-40 mt-1 select-none">
                      0{idx + 1}
                    </div>
                    <div className="space-y-1 flex-grow">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] opacity-50 font-mono">NODE::{res.type.toUpperCase()}</span>
                        <span className="text-[9px] opacity-50 font-mono">READ: {res.readingTime}</span>
                      </div>
                      <h3 className={`text-xs font-bold tracking-wider uppercase mt-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                        {res.title}
                      </h3>
                      <p className="text-[10px] opacity-50 font-sans leading-relaxed line-clamp-2">
                        {res.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      }
    }

    // 6. Library view: /library
    if (currentRoute === '/library') {
      return (
        <div id="library-container" className="max-w-7xl mx-auto px-4 md:px-8 py-8 font-mono">
          <div className="border-b pb-4 mb-8">
            <span className="text-[9px] opacity-40 block mb-1">CONSOLIDATED_ARCHIVE_REGISTRY</span>
            <h1 className={`text-base font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-black'}`}>
              [KNOWLEDGE_LIBRARY]
            </h1>
            <p className="text-[10px] opacity-60 mt-1 leading-relaxed max-w-xl">
              Pruned list of hardware architecture descriptions, network topologies, low-level trace metrics, and system design specifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {RESOURCES.map((res) => (
              <button
                id={`library-card-${res.id}`}
                key={res.id}
                onClick={() => handleNavigate(`/resources/${res.id}`)}
                className={`text-left p-5 border transition-all flex flex-col justify-between hover:scale-[1.01] ${
                  isDarkMode
                    ? 'border-neutral-800 hover:border-neutral-500 bg-neutral-950/20'
                    : 'border-neutral-200 hover:border-neutral-400 bg-neutral-50/20'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-3 text-[9px] font-mono opacity-50">
                    <span>REGISTRY::{res.type.toUpperCase()}</span>
                    <span>{res.readingTime}</span>
                  </div>
                  <h3 className={`text-xs font-bold tracking-wider uppercase line-clamp-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    {res.title}
                  </h3>
                  <p className="text-[10px] opacity-50 mt-2 line-clamp-3 leading-relaxed font-sans">
                    {res.description}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-6 pt-2 border-t opacity-60 text-[9px]">
                  <span>Difficulty: {res.difficulty.toUpperCase()}</span>
                  <ArrowUpRight size={12} />
                </div>
              </button>
            ))}
          </div>
        </div>
      );
    }

    // 7. Bookmarks view: /bookmarks
    if (currentRoute === '/bookmarks') {
      const bookmarkedResources = RESOURCES.filter((r) => bookmarks.includes(r.id));
      return (
        <div id="bookmarks-container" className="max-w-7xl mx-auto px-4 md:px-8 py-8 font-mono">
          <div className="border-b pb-4 mb-8">
            <span className="text-[9px] opacity-40 block mb-1">LOCAL_SESSION_MEMORY</span>
            <h1 className={`text-base font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-black'}`}>
              [BOOKMARKED_NODES]
            </h1>
            <p className="text-[10px] opacity-60 mt-1 leading-relaxed max-w-xl">
              Locally persisted references for active learning streams and systems auditing. Clear browser cache will reset memory register.
            </p>
          </div>

          {bookmarkedResources.length === 0 ? (
            <div className={`p-10 border text-center font-mono text-xs opacity-50 ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'}`}>
              NO BOOKMARKED RESOURCES FOUND. BROWSE LIBRARY TO PERSIST RESOURCE INDEXES.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookmarkedResources.map((res) => (
                <div
                  id={`bookmark-row-${res.id}`}
                  key={res.id}
                  className={`p-4 border flex items-center justify-between ${
                    isDarkMode ? 'border-neutral-800 bg-neutral-950/20' : 'border-neutral-200 bg-neutral-50/20'
                  }`}
                >
                  <div className="pr-4 truncate flex-grow">
                    <span className="text-[8px] opacity-40 block">NODE::{res.type.toUpperCase()}</span>
                    <button
                      id={`bookmark-title-btn-${res.id}`}
                      onClick={() => handleNavigate(`/resources/${res.id}`)}
                      className={`text-xs font-bold tracking-tight text-left block truncate hover:underline mt-1 ${isDarkMode ? 'text-white' : 'text-black'}`}
                    >
                      {res.title}
                    </button>
                  </div>
                  <button
                    id={`remove-bookmark-btn-${res.id}`}
                    onClick={() => handleToggleBookmark(res.id)}
                    className="p-1.5 border text-[9px] tracking-widest font-mono text-neutral-400 hover:text-white transition-colors"
                  >
                    UNSAVE
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // 8. About page: /about
    if (currentRoute === '/about') {
      return (
        <div id="about-container" className="max-w-3xl mx-auto px-4 md:px-8 py-8 font-mono">
          <div className="border-b pb-4 mb-8">
            <span className="text-[9px] opacity-40 block mb-1">SYSTEM_SPEC_SHEET</span>
            <h1 className={`text-base font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-black'}`}>
              [ABOUT_THE_ARCHIVE]
            </h1>
          </div>

          <div className={`border p-6 md:p-8 space-y-6 ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'}`}>
            <h2 className={`text-sm font-bold uppercase tracking-wider border-b pb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
              THE PROTOCOL
            </h2>
            <p className="text-xs font-sans leading-relaxed text-neutral-300">
              The Developer Archive is a modern, high-fidelity developer learning sandbox. We reject commercial landing page aesthetics—marketing copy, floating glowing gradients, and bloated frontend bundles are locked out. Instead, we present precise hardware, compiler, routing, and consensus schematics styled purely in high-contrast monochrome.
            </p>

            <h2 className={`text-sm font-bold uppercase tracking-wider border-b pb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
              INSTAGRAM REDIRECT LINKING
            </h2>
            <p className="text-xs font-sans leading-relaxed text-neutral-300">
              When users swipe up or click links from our tutorials or Reels, they land inside a dedicated, real-time code editor and terminal visualizer workspace explaining every low-level cycle in absolute detail.
            </p>

            <div className={`p-4 border text-[10px] space-y-1.5 leading-relaxed bg-black/40 ${
              isDarkMode ? 'border-neutral-800 text-neutral-400' : 'border-neutral-200 text-neutral-600'
            }`}>
              <div>ENVIRONMENT: CLOUD_RUN_CONTAINER</div>
              <div>INGRESS: REVERSE_PROXY_PORT_3000</div>
              <div>VERSION: 4.1.2-STABLE</div>
              <div>COMPILER: ESBUILD_TSX_VITE_V4</div>
            </div>
          </div>
        </div>
      );
    }

    // Default: Home View (/home)
    return (
      <div id="home-view-container" className="max-w-7xl mx-auto px-4 md:px-8 py-8 font-mono space-y-12">
        
        {/* SECTION 1: LATEST INSTAGRAM RESOURCE */}
        <section id="section-latest-reel" className="space-y-4">
          <div className="text-[10px] opacity-40 font-bold tracking-wider flex items-center space-x-2">
            <span>01 // LATEST_INSTAGRAM_RESOURCE</span>
            <span className="h-[1px] bg-neutral-800 flex-grow opacity-30" />
          </div>

          <div className={`border p-6 grid grid-cols-1 md:grid-cols-12 gap-6 relative overflow-hidden ${
            isDarkMode ? 'bg-neutral-950/20 border-neutral-800' : 'bg-neutral-50/20 border-neutral-200'
          }`}>
            <div className="md:col-span-8 space-y-4 relative z-10 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[9px] px-1.5 py-0.5 border border-current font-mono inline-block">REEL::HOW_CPU_CACHE_WORKS</span>
                <h2 className={`text-base md:text-lg font-bold tracking-tight uppercase ${isDarkMode ? 'text-white' : 'text-black'}`}>
                  {SHORTS[0].title}
                </h2>
                <p className="text-xs font-sans opacity-60 leading-relaxed max-w-xl">
                  {SHORTS[0].description}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  id="home-open-reel-workspace"
                  onClick={() => handleNavigate('/shorts/how-cpu-cache-works-short')}
                  className={`px-4 py-2 text-xs font-bold tracking-wider border flex items-center space-x-2 transition-all ${
                    isDarkMode
                      ? 'bg-white text-black border-white hover:bg-neutral-200'
                      : 'bg-black text-white border-black hover:bg-neutral-800'
                  }`}
                >
                  <Play size={12} fill="currentColor" />
                  <span>OPEN_REEL_WORKSPACE</span>
                </button>
                <button
                  id="home-read-cache-article"
                  onClick={() => handleNavigate('/resources/cpu-cache-l1-l2-l3')}
                  className={`px-4 py-2 text-xs font-bold tracking-wider border transition-all ${
                    isDarkMode
                      ? 'border-neutral-800 text-white hover:bg-neutral-900'
                      : 'border-neutral-200 text-black hover:bg-neutral-100'
                  }`}
                >
                  READ_FULL_ARTICLE
                </button>
              </div>
            </div>

            <div className="md:col-span-4 relative border p-4 bg-black/40 border-neutral-800/40 font-mono hidden md:flex flex-col justify-center">
              <div className="text-[9px] opacity-40 border-b pb-1 mb-2">SCHEMATIC::PREVIEW</div>
              <pre className="text-[9px] opacity-60 leading-tight whitespace-pre scrollbar-none overflow-hidden">
                {`[CPU Core] --> (L1 Miss)
    |
    v (L2 Cache Miss!)
[L3 Cache] --> (L3 Miss!)
    |
    +== FETCH ENGINES ==> DRAM`}
              </pre>
            </div>
          </div>
        </section>

        {/* SECTION 2: TRENDING COLLECTIONS */}
        <section id="section-trending-collections" className="space-y-4">
          <div className="text-[10px] opacity-40 font-bold tracking-wider flex items-center space-x-2">
            <span>02 // TRENDING_COLLECTIONS_PLAYLISTS</span>
            <span className="h-[1px] bg-neutral-800 flex-grow opacity-30" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COLLECTIONS.map((col) => (
              <button
                id={`home-collection-card-${col.id}`}
                key={col.id}
                onClick={() => handleNavigate(`/collections/${col.id}`)}
                className={`text-left p-5 border transition-all flex flex-col justify-between hover:scale-[1.01] ${
                  isDarkMode
                    ? 'border-neutral-800 hover:border-neutral-500 bg-neutral-950/20'
                    : 'border-neutral-200 hover:border-neutral-400 bg-neutral-50/20'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[9px] font-mono opacity-50 flex items-center space-x-1">
                      <Layers size={10} />
                      <span>PLAYLIST_NODE</span>
                    </span>
                    <span className="text-[9px] font-mono opacity-50">{col.difficulty.toUpperCase()}</span>
                  </div>
                  <h3 className={`text-xs font-bold tracking-wider uppercase ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    {col.title}
                  </h3>
                  <p className="text-[10px] opacity-50 mt-1.5 leading-relaxed line-clamp-2 font-sans">
                    {col.description}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-6 pt-2 border-t opacity-40 text-[9px]">
                  <span>{col.resourceIds.length} RESOURCE NODES</span>
                  <ChevronRight size={10} />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* SECTION 3: POPULAR DEVELOPER TOPICS */}
        <section id="section-popular-topics" className="space-y-4">
          <div className="text-[10px] opacity-40 font-bold tracking-wider flex items-center space-x-2">
            <span>03 // POPULAR_SYSTEMS_TOPICS</span>
            <span className="h-[1px] bg-neutral-800 flex-grow opacity-30" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {TOPICS.map((topic) => (
              <button
                id={`home-topic-node-${topic.id}`}
                key={topic.id}
                onClick={() => handleNavigate(`/topics/${topic.id}`)}
                className={`p-4 border text-left transition-colors flex flex-col justify-between ${
                  isDarkMode
                    ? 'border-neutral-800 bg-neutral-950/20 hover:border-neutral-500 hover:bg-neutral-900'
                    : 'border-neutral-200 bg-neutral-50/20 hover:border-neutral-400 hover:bg-neutral-100'
                }`}
              >
                <div className="text-[9px] opacity-40 flex items-center space-x-1">
                  <Compass size={10} />
                  <span>{topic.category.toUpperCase()}</span>
                </div>
                <div className={`text-xs font-bold tracking-wider uppercase mt-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                  {topic.name}
                </div>
                <div className="text-[9px] opacity-40 mt-1">{topic.resourceIds.length} REGISTRY_FILES</div>
              </button>
            ))}
          </div>
        </section>

        {/* SECTION 4: TODAY'S PICKS */}
        <section id="section-todays-picks" className="space-y-4">
          <div className="text-[10px] opacity-40 font-bold tracking-wider flex items-center space-x-2">
            <span>04 // TODAYS_SYSTEM_REPORTS</span>
            <span className="h-[1px] bg-neutral-800 flex-grow opacity-30" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {RESOURCES.slice(1, 3).map((res) => (
              <button
                id={`home-pick-card-${res.id}`}
                key={res.id}
                onClick={() => handleNavigate(`/resources/${res.id}`)}
                className={`text-left p-5 border transition-all flex flex-col justify-between hover:scale-[1.01] ${
                  isDarkMode
                    ? 'border-neutral-800 hover:border-neutral-500 bg-neutral-950/20'
                    : 'border-neutral-200 hover:border-neutral-400 bg-neutral-50/20'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[9px] font-mono opacity-50">NODE::{res.type.toUpperCase()}</span>
                    <span className="text-[9px] font-mono opacity-50">{res.readingTime}</span>
                  </div>
                  <h3 className={`text-xs font-bold tracking-wider uppercase line-clamp-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    {res.title}
                  </h3>
                  <p className="text-[10px] opacity-50 mt-1.5 leading-relaxed line-clamp-2 font-sans">
                    {res.description}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-6 pt-2 border-t opacity-40 text-[9px]">
                  <span>Difficulty: {res.difficulty.toUpperCase()}</span>
                  <ArrowUpRight size={10} />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* SECTION 5: ROADMAPS OVERVIEW */}
        <section id="section-active-roadmaps" className="space-y-4">
          <div className="text-[10px] opacity-40 font-bold tracking-wider flex items-center space-x-2">
            <span>05 // INTERACTIVE_CURRICULUMS</span>
            <span className="h-[1px] bg-neutral-800 flex-grow opacity-30" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ROADMAPS.map((r) => (
              <div
                id={`home-roadmap-item-${r.id}`}
                key={r.id}
                className={`p-5 border flex flex-col justify-between ${
                  isDarkMode ? 'border-neutral-800 bg-neutral-950/20' : 'border-neutral-200 bg-neutral-50/20'
                }`}
              >
                <div>
                  <span className="text-[9px] opacity-50 font-mono block">NODE::ROADMAP</span>
                  <h3 className={`text-xs font-bold tracking-wider uppercase mt-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    {r.title}
                  </h3>
                  <p className="text-[10px] opacity-50 mt-1 leading-relaxed line-clamp-2 font-sans">
                    {r.description}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-6 pt-3 border-t">
                  <span className="text-[9px] opacity-40">{r.steps.length} SYLLABUS_STEPS</span>
                  <button
                    id={`home-roadmap-open-btn-${r.id}`}
                    onClick={() => handleNavigate(`/roadmaps/${r.id}`)}
                    className={`px-3 py-1.5 text-[9px] border font-bold transition-colors ${
                      isDarkMode
                        ? 'border-neutral-800 hover:bg-neutral-900 text-white'
                        : 'border-neutral-200 hover:bg-neutral-100 text-black'
                    }`}
                  >
                    INIT_ROADMAP
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 6: GITHUB COLLECTIONS */}
        <section id="section-github-collections" className="space-y-4">
          <div className="text-[10px] opacity-40 font-bold tracking-wider flex items-center space-x-2">
            <span>06 // CURATED_OPEN_SOURCE_REPOSITORIES</span>
            <span className="h-[1px] bg-neutral-800 flex-grow opacity-30" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TOPICS.flatMap((t) => t.recommendedRepos).slice(0, 3).map((repo) => (
              <a
                id={`home-repo-link-${repo.name.replace(/\//g, '-')}`}
                key={repo.name}
                href={repo.url}
                target="_blank"
                referrerPolicy="no-referrer"
                className={`p-4 border transition-colors block ${
                  isDarkMode
                    ? 'border-neutral-800 hover:border-neutral-600 bg-neutral-950/20 text-neutral-300'
                    : 'border-neutral-200 hover:border-neutral-400 bg-neutral-50/20 text-neutral-700'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-mono opacity-50 flex items-center space-x-1">
                    <GitFork size={10} />
                    <span>GITHUB_REPO</span>
                  </span>
                  <span className="text-[9px] font-mono opacity-50 flex items-center space-x-1">
                    <Star size={10} />
                    <span>{repo.stars}</span>
                  </span>
                </div>
                <h4 className={`text-xs font-bold tracking-tight mt-3 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                  {repo.name}
                </h4>
                <p className="text-[10px] opacity-50 mt-1 line-clamp-2 leading-relaxed font-sans">
                  {repo.description}
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* SECTION 7: DEVELOPER TOOLS */}
        <section id="section-developer-tools" className="space-y-4">
          <div className="text-[10px] opacity-40 font-bold tracking-wider flex items-center space-x-2">
            <span>07 // SECURE_DEVELOPER_UTILITIES</span>
            <span className="h-[1px] bg-neutral-800 flex-grow opacity-30" />
          </div>

          <div className={`p-5 border flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${
            isDarkMode ? 'border-neutral-800 bg-neutral-950/20' : 'border-neutral-200 bg-neutral-50/20'
          }`}>
            <div className="space-y-1">
              <span className="text-[8px] opacity-50 font-mono block">UTILITY::GO_HARDENED_HTTP_CLIENT</span>
              <h3 className={`text-xs font-bold tracking-wider uppercase ${isDarkMode ? 'text-white' : 'text-black'}`}>
                {RESOURCES[6].title}
              </h3>
              <p className="text-[10px] opacity-50 font-sans leading-relaxed max-w-xl">
                Avoid goroutine leaks and socket exhaustion by implementing standard dials, timeouts, and idle transport limits.
              </p>
            </div>

            <button
              id="home-open-tool-btn"
              onClick={() => handleNavigate(`/resources/${RESOURCES[6].id}`)}
              className={`px-4 py-2 text-[10px] font-bold tracking-widest border transition-colors ${
                isDarkMode
                  ? 'border-neutral-800 hover:bg-neutral-900 text-white'
                  : 'border-neutral-200 hover:bg-neutral-100 text-black'
              }`}
            >
              RUN_INSPECTION
            </button>
          </div>
        </section>

        {/* SECTION 8: WEEKLY LEARNING PATH */}
        <section id="section-weekly-path" className="space-y-4">
          <div className="text-[10px] opacity-40 font-bold tracking-wider flex items-center space-x-2">
            <span>08 // WEEKLY_LEARNING_PATH</span>
            <span className="h-[1px] bg-neutral-800 flex-grow opacity-30" />
          </div>

          <div className={`border p-6 font-sans ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'}`}>
            <div className="font-mono text-[9px] opacity-40 border-b pb-2 mb-4">ESTABLISHED_CURRICULUM_PATH</div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs leading-relaxed">
              <div className="space-y-1">
                <div className="font-mono text-[10px] font-bold">DAY_01 - day_02</div>
                <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>HARDWARE & SYSTEM ROOTS</div>
                <p className="text-[10px] opacity-50 leading-relaxed">Study L1/L2/L3 caches temporal & spatial locality. Learn CPU stall metrics.</p>
              </div>
              <div className="space-y-1">
                <div className="font-mono text-[10px] font-bold">DAY_03 - day_04</div>
                <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>NETWORKING SOCKETS</div>
                <p className="text-[10px] opacity-50 leading-relaxed">Trace TCP states, syn backlogs, ephemeral port thresholds, and connection reuse.</p>
              </div>
              <div className="space-y-1">
                <div className="font-mono text-[10px] font-bold">DAY_05 - day_06</div>
                <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>DATABASE ARCHITECTURE</div>
                <p className="text-[10px] opacity-50 leading-relaxed">Explore B-Tree page alignments, GIN indices, and disk logging write-ahead buffers.</p>
              </div>
              <div className="space-y-1">
                <div className="font-mono text-[10px] font-bold">DAY_07</div>
                <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>DISTRIBUTED CONSENSUS</div>
                <p className="text-[10px] opacity-50 leading-relaxed">Consolidate everything with Raft, Paxos quorum models, and linearizability audits.</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    );
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between font-sans ${
      isDarkMode ? 'bg-black text-white' : 'bg-white text-black'
    }`}>
      
      {/* Navigation Header */}
      <Navigation
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        bookmarkCount={bookmarks.length}
      />

      {/* Main View Area */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRoute}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
          >
            {renderCurrentView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Newsletter Panel Section */}
      {(currentRoute === '/opendeck' || currentRoute === '/home' || currentRoute === '/library') && (
        <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12 w-full">
          <NewsletterPanel isDarkMode={isDarkMode} />
        </div>
      )}

      {/* Instant Command Palette Search overlay */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={handleNavigate}
        isDarkMode={isDarkMode}
      />

    </div>
  );
}
