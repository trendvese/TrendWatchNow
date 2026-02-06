import { useState } from 'react';
import { cn } from '@/utils/cn';
import { addSubscriber } from '@/services/subscriberService';

interface NewsletterSubscribeProps {
  darkMode: boolean;
  variant?: 'sidebar' | 'footer' | 'popup';
}

export function NewsletterSubscribe({ darkMode, variant = 'sidebar' }: NewsletterSubscribeProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setStatus('error');
      setMessage('Please enter your email');
      return;
    }

    if (!validateEmail(email)) {
      setStatus('error');
      setMessage('Please enter a valid email');
      return;
    }

    setStatus('loading');
    
    try {
      const result = await addSubscriber(email, 'website');
      
      if (result.success) {
        setStatus('success');
        setMessage(result.message);
        setEmail('');
        
        // Reset after 5 seconds
        setTimeout(() => {
          setStatus('idle');
          setMessage('');
        }, 5000);
      } else {
        setStatus('error');
        setMessage(result.message);
      }
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  if (variant === 'sidebar') {
    return (
      <div className={cn(
        "mt-6 p-4 rounded-xl border",
        darkMode 
          ? "bg-gradient-to-br from-violet-500/10 to-pink-500/10 border-white/10" 
          : "bg-gradient-to-br from-violet-500/5 to-pink-500/5 border-black/5"
      )}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">📬</span>
          <h4 className={cn(
            "font-bold",
            darkMode ? "text-white" : "text-slate-900"
          )}>Stay Updated</h4>
        </div>
        <p className={cn(
          "text-xs mb-3",
          darkMode ? "text-slate-400" : "text-slate-600"
        )}>Get the latest trends delivered to your inbox weekly.</p>
        
        {status === 'success' ? (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/20 border border-green-500/30">
            <span className="text-green-400 text-lg">✓</span>
            <span className="text-green-400 text-sm font-medium">{message}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') {
                    setStatus('idle');
                    setMessage('');
                  }
                }}
                placeholder="your@email.com"
                disabled={status === 'loading'}
                className={cn(
                  "flex-1 px-3 py-2 rounded-lg text-sm border outline-none transition-all",
                  darkMode 
                    ? "bg-slate-800 border-white/10 text-white placeholder:text-slate-500 focus:border-violet-500" 
                    : "bg-white border-black/10 text-slate-900 placeholder:text-slate-400 focus:border-violet-500",
                  status === 'error' && "border-red-500",
                  status === 'loading' && "opacity-50 cursor-not-allowed"
                )}
              />
              <button 
                type="submit"
                disabled={status === 'loading'}
                className={cn(
                  "px-4 py-2 bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-lg text-sm font-medium transition-all duration-300",
                  status === 'loading' 
                    ? "opacity-50 cursor-not-allowed" 
                    : "hover:shadow-lg hover:shadow-purple-500/25"
                )}
              >
                {status === 'loading' ? (
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : 'Join'}
              </button>
            </div>
            {status === 'error' && (
              <p className="text-red-400 text-xs mt-2">{message}</p>
            )}
          </form>
        )}
        
        <p className={cn(
          "text-[10px] mt-2",
          darkMode ? "text-slate-500" : "text-slate-400"
        )}>
          🔒 No spam. Unsubscribe anytime.
        </p>
      </div>
    );
  }

  // Footer variant
  return (
    <div className={cn(
      "p-6 rounded-2xl",
      darkMode 
        ? "bg-gradient-to-br from-violet-500/10 to-pink-500/10" 
        : "bg-gradient-to-br from-violet-500/5 to-pink-500/5"
    )}>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
          <span className="text-xl">📬</span>
        </div>
        <div>
          <h4 className={cn(
            "font-bold text-lg",
            darkMode ? "text-white" : "text-slate-900"
          )}>Subscribe to Newsletter</h4>
          <p className={cn(
            "text-sm",
            darkMode ? "text-slate-400" : "text-slate-600"
          )}>Get weekly updates on trending topics</p>
        </div>
      </div>
      
      {status === 'success' ? (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-green-500/20 border border-green-500/30 mt-4">
          <span className="text-green-400 text-2xl">✓</span>
          <span className="text-green-400 font-medium">{message}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error') {
                  setStatus('idle');
                  setMessage('');
                }
              }}
              placeholder="Enter your email address"
              disabled={status === 'loading'}
              className={cn(
                "flex-1 px-4 py-3 rounded-xl border outline-none transition-all",
                darkMode 
                  ? "bg-slate-800 border-white/10 text-white placeholder:text-slate-500 focus:border-violet-500" 
                  : "bg-white border-black/10 text-slate-900 placeholder:text-slate-400 focus:border-violet-500",
                status === 'error' && "border-red-500",
                status === 'loading' && "opacity-50 cursor-not-allowed"
              )}
            />
            <button 
              type="submit"
              disabled={status === 'loading'}
              className={cn(
                "px-6 py-3 bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-xl font-medium transition-all duration-300",
                status === 'loading' 
                  ? "opacity-50 cursor-not-allowed" 
                  : "hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105"
              )}
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
          {status === 'error' && (
            <p className="text-red-400 text-sm mt-2">{message}</p>
          )}
        </form>
      )}
    </div>
  );
}
