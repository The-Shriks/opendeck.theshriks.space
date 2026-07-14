import { Terminal, Github, Instagram, MessageSquare, Rss, Globe } from 'lucide-react';

interface FooterProps {
  isDarkMode: boolean;
}

export default function Footer({ isDarkMode }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="system-footer-panel"
      className={`border-t py-12 font-mono ${
        isDarkMode 
          ? 'bg-black border-neutral-800 text-neutral-400' 
          : 'bg-white border-neutral-200 text-neutral-600'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Logo Brand */}
          <div className="space-y-1">
            <div className={`flex items-center space-x-2 font-semibold text-xs tracking-wider ${
              isDarkMode ? 'text-white' : 'text-black'
            }`}>
              <Terminal size={14} />
              <span>THE_DEVELOPER_ARCHIVE</span>
            </div>
            <p className="text-[10px] opacity-50">CURATED COMPILER, HARDWARE & NETWORKING KNOWLEDGE ENGINE.</p>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap gap-4 text-xs font-semibold">
            <a
              id="footer-link-instagram"
              href="https://instagram.com/dev_archive"
              target="_blank"
              referrerPolicy="no-referrer"
              className="flex items-center space-x-1 hover:text-white transition-colors"
            >
              <Instagram size={12} />
              <span className="text-[10px]">INSTAGRAM</span>
            </a>
            <a
              id="footer-link-github"
              href="https://github.com/dev-archive"
              target="_blank"
              referrerPolicy="no-referrer"
              className="flex items-center space-x-1 hover:text-white transition-colors"
            >
              <Github size={12} />
              <span className="text-[10px]">GITHUB</span>
            </a>
            <a
              id="footer-link-discord"
              href="https://discord.gg/dev-archive"
              target="_blank"
              referrerPolicy="no-referrer"
              className="flex items-center space-x-1 hover:text-white transition-colors"
            >
              <MessageSquare size={12} />
              <span className="text-[10px]">DISCORD</span>
            </a>
            <a
              id="footer-link-rss"
              href="#/rss"
              className="flex items-center space-x-1 hover:text-white transition-colors"
            >
              <Rss size={12} />
              <span className="text-[10px]">RSS_FEED</span>
            </a>
          </div>
        </div>

        {/* Bottom Details */}
        <div className={`border-t pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[9px] opacity-40 gap-4 ${
          isDarkMode ? 'border-neutral-900' : 'border-neutral-100'
        }`}>
          <div>
            <span>© {currentYear} THE_DEVELOPER_ARCHIVE_NODE. ALL CORE RECORDS CONSOLIDATED.</span>
          </div>
          <div className="flex space-x-4">
            <span>LICENSE::MIT_OPEN_SOURCE</span>
            <span>PRIVACY::LOCAL_ONLY</span>
            <span>PING::0.0.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
