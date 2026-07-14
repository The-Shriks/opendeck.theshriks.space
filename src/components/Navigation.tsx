import { Search, Bookmark, Terminal, Menu, X, Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

interface NavigationProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenSearch: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  bookmarkCount: number;
}

export default function Navigation({
  currentRoute,
  onNavigate,
  onOpenSearch,
  isDarkMode,
  onToggleTheme,
  bookmarkCount
}: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'OPENDECK', route: '/opendeck' },
    { label: 'MATERIALS', route: '/materials' },
    { label: 'PROMPTS', route: '/prompts' }
  ];

  const getActiveItem = () => {
    if (currentRoute.startsWith('/opendeck')) return '/opendeck';
    if (currentRoute.startsWith('/materials')) return '/materials';
    if (currentRoute.startsWith('/prompts')) return '/prompts';
    return currentRoute;
  };

  const activeItem = getActiveItem();

  return (
    <header
      id="main-nav-header"
      className={`sticky top-0 z-40 transition-all duration-300 border-b ${
        isScrolled
          ? 'py-3 bg-opacity-95 backdrop-blur-md'
          : 'py-5'
      } ${
        isDarkMode
          ? 'bg-black border-neutral-800 text-white'
          : 'bg-white border-neutral-200 text-black'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Brand/Logo */}
        <button
          id="nav-logo-btn"
          onClick={() => {
            onNavigate('/opendeck');
            setIsMobileMenuOpen(false);
          }}
          className="flex items-center space-x-2 font-mono font-semibold tracking-wider text-sm hover:opacity-80 transition-opacity"
        >
          <img src="/logo.png" alt="OpenDeck Logo" className="w-5 h-5 rounded-sm" />
          <span>OPENDECK.SYS</span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6 text-xs font-mono tracking-widest">
          {navItems.map((item) => (
            <button
              id={`nav-item-${item.label.toLowerCase()}`}
              key={item.route}
              onClick={() => onNavigate(item.route)}
              className={`relative py-1 transition-all duration-200 hover:text-opacity-100 ${
                activeItem === item.route
                  ? 'text-opacity-100 font-bold'
                  : 'text-opacity-50'
              } ${isDarkMode ? 'text-white' : 'text-black'}`}
            >
              {item.label}
              {activeItem === item.route && (
                <motion.div
                  layoutId="nav-underline"
                  className={`absolute -bottom-[13px] left-0 right-0 h-[2px] ${
                    isDarkMode ? 'bg-white' : 'bg-black'
                  }`}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Utilities */}
        <div className="flex items-center space-x-4">


          {/* Mobile menu trigger */}
          <button
            id="nav-mobile-trigger"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 rounded-none transition-colors ${
              isDarkMode ? 'hover:bg-neutral-900' : 'hover:bg-neutral-100'
            }`}
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          id="nav-mobile-menu"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`lg:hidden border-t py-4 px-6 font-mono text-sm tracking-widest ${
            isDarkMode
              ? 'bg-black border-neutral-800 text-white'
              : 'bg-white border-neutral-200 text-black'
          }`}
        >
          <div className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <button
                id={`nav-mobile-${item.label.toLowerCase()}`}
                key={item.route}
                onClick={() => {
                  onNavigate(item.route);
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left py-2 border-b border-transparent ${
                  activeItem === item.route
                    ? 'font-bold opacity-100 border-current'
                    : 'opacity-60'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </header>
  );
}
