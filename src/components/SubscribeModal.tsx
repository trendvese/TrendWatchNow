import { useState } from 'react';
import { cn } from '@/utils/cn';
import { addSubscriber } from '@/services/subscriberService';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

export function SubscribeModal({ isOpen, onClose, darkMode }: SubscribeModalProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setStatus('error');
      setMessage('Please enter your email');
      return;
    }

    setStatus('loading');
    
    try {
      const result = await addSubscriber(email, 'header-popup');
      
      if (result.success) {
        setStatus('success');
        setMessage(result.message);
        setEmail('');
        
        // Auto close after 3 seconds
        setTimeout(() => {
          onClose();
          setStatus('idle');
          setMessage('');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(result.message);
      }
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={cn(
        "relative w-full max-w-md rounded-2xl p-6 shadow-2xl transform transition-all",
        "animate-in fade-in zoom-in-95 duration-300",
        darkMode 
          ? "bg-slate-800 border border-white/10" 
          : "bg-white border border-black/5"
      )}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={cn(
            "absolute top-4 right-4 p-2 rounded-full transition-colors",
            darkMode ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-500"
          )}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
            <span className="text-3xl">📬</span>
          </div>
        </div>

        {/* Title */}
        <h2 className={cn(
          "text-2xl font-bold text-center mb-2",
          darkMode ? "text-white" : "text-slate-900"
        )}>
          Stay in the Loop!
        </h2>
        
        <p className={cn(
          "text-center mb-6",
          darkMode ? "text-slate-400" : "text-slate-600"
        )}>
          Get the latest trending articles delivered to your inbox. No spam, ever.
        </p>

        {/* Success State */}
        {status === 'success' ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-green-500 mb-2">You're Subscribed!</h3>
            <p className={cn(
              "text-sm",
              darkMode ? "text-slate-400" : "text-slate-600"
            )}>{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
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
                  "w-full px-4 py-3 rounded-xl border outline-none transition-all",
                  darkMode 
                    ? "bg-slate-700 border-white/10 text-white placeholder:text-slate-500 focus:border-violet-500" 
                    : "bg-slate-50 border-black/10 text-slate-900 placeholder:text-slate-400 focus:border-violet-500",
                  status === 'error' && "border-red-500",
                  status === 'loading' && "opacity-50 cursor-not-allowed"
                )}
              />
              {status === 'error' && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {message}
                </p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={status === 'loading'}
              className={cn(
                "w-full py-3 rounded-xl font-medium transition-all duration-300",
                "bg-gradient-to-r from-violet-500 to-pink-500 text-white",
                status === 'loading' 
                  ? "opacity-50 cursor-not-allowed" 
                  : "hover:shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02]"
              )}
            >
              {status === 'loading' ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Subscribing...
                </span>
              ) : (
                'Subscribe Now'
              )}
            </button>
          </form>
        )}

        {/* Footer Note */}
        <p className={cn(
          "text-xs text-center mt-4",
          darkMode ? "text-slate-500" : "text-slate-400"
        )}>
          🔒 Your email is safe with us. Unsubscribe anytime.
        </p>

        {/* Benefits */}
        <div className={cn(
          "mt-6 pt-4 border-t",
          darkMode ? "border-white/10" : "border-black/5"
        )}>
          <p className={cn(
            "text-xs font-medium mb-3 text-center",
            darkMode ? "text-slate-400" : "text-slate-500"
          )}>What you'll get:</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: '🔥', text: 'Trending News' },
              { icon: '💡', text: 'Tech Updates' },
              { icon: '📱', text: 'Mobile Reviews' },
              { icon: '🎮', text: 'Gaming News' }
            ].map((item, index) => (
              <div 
                key={index}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm",
                  darkMode ? "bg-slate-700/50" : "bg-slate-50"
                )}
              >
                <span>{item.icon}</span>
                <span className={darkMode ? "text-slate-300" : "text-slate-600"}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
