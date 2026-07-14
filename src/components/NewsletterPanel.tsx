import { useState, FormEvent } from 'react';
import { Mail, Check, Terminal } from 'lucide-react';

interface NewsletterPanelProps {
  isDarkMode: boolean;
}

export default function NewsletterPanel({ isDarkMode }: NewsletterPanelProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        setIsSubmitted(true);
        setEmail('');
      } else {
        console.error('Failed to subscribe');
      }
    } catch (err) {
      console.error('Error subscribing:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="newsletter-container-panel"
      className={`border p-6 md:p-8 font-mono ${
        isDarkMode 
          ? 'border-neutral-800 bg-neutral-950/20' 
          : 'border-neutral-200 bg-neutral-50/50'
      }`}
    >
      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Texts */}
        <div className="md:col-span-7 space-y-2">
          <div className="text-[10px] opacity-40 flex items-center space-x-2">
            <Terminal size={12} />
            <span>OPENDECK::BROADCAST_SYSTEM</span>
          </div>
          <h2 className={`text-sm font-bold tracking-wider ${isDarkMode ? 'text-white' : 'text-black'}`}>
            OPENDECK_TRANSMISSIONS
          </h2>
          <p className="text-[10px] opacity-50 font-sans leading-relaxed tracking-wide">
            Receive the latest open source wrappers, direct download material links, and ready-to-use AI prompts straight to your terminal. Zero marketing clutter.
          </p>
        </div>

        {/* Form input */}
        <div className="md:col-span-5">
          {isSubmitted ? (
            <div className={`p-4 border text-center space-y-1.5 ${
              isDarkMode ? 'border-neutral-800 bg-neutral-900/20' : 'border-neutral-200 bg-neutral-100/20'
            }`}>
              <Check size={16} className="mx-auto opacity-70" />
              <div className="text-[10px] font-bold">TRANSMISSION_LINK_ESTABLISHED</div>
              <p className="text-[9px] opacity-50 font-sans">You have successfully subscribed to OpenDeck.</p>
            </div>
          ) : (
            <form id="newsletter-subscription-form" onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <input
                  id="newsletter-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  disabled={isLoading}
                  className={`w-full pl-9 pr-4 py-2 border text-xs outline-none transition-all ${
                    isDarkMode
                      ? 'bg-black border-neutral-800 text-white focus:border-white'
                      : 'bg-white border-neutral-200 text-black focus:border-black'
                  }`}
                />
                <Mail size={13} className="absolute left-3 top-3 opacity-40" />
              </div>

              <button
                id="newsletter-submit-btn"
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 text-xs font-bold tracking-widest border transition-all ${
                  isDarkMode
                    ? 'bg-white text-black border-white hover:bg-neutral-200'
                    : 'bg-black text-white border-black hover:bg-neutral-800'
                }`}
              >
                {isLoading ? 'ESTABLISHING...' : 'SUBSCRIBE_TML'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
