import { useState } from 'react';
import { cn } from '@/utils/cn';
import { SubscribeModal } from './SubscribeModal';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export function Header({ darkMode, setDarkMode, searchQuery, setSearchQuery }: HeaderProps) {
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);

  return (
    <>
    <SubscribeModal 
      isOpen={showSubscribeModal} 
      onClose={() => setShowSubscribeModal(false)} 
      darkMode={darkMode} 
    />
    <header className={cn(
      "sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-300",
      darkMode 
        ? "bg-slate-900/80 border-white/10" 
        : "bg-white/80 border-black/5"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse" />
            </div>
            <div>
              <h1 className={cn(
                "text-xl font-bold tracking-tight",
                darkMode ? "text-white" : "text-slate-900"
              )}>
                Trend<span className="bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">Watch</span> Now
              </h1>
              <p className={cn(
                "text-[10px] uppercase tracking-widest",
                darkMode ? "text-slate-500" : "text-slate-400"
              )}>Explore What's Trending</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className={cn(
              "relative w-full group"
            )}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, topics, trends..."
                className={cn(
                  "w-full px-4 py-2.5 pl-11 rounded-xl border outline-none transition-all duration-300",
                  "placeholder:text-slate-500",
                  darkMode 
                    ? "bg-slate-800/50 border-white/10 text-white focus:border-violet-500/50 focus:bg-slate-800" 
                    : "bg-slate-100/50 border-black/5 text-slate-900 focus:border-violet-500/50 focus:bg-white"
                )}
              />
              <svg className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                darkMode ? "text-slate-500" : "text-slate-400"
              )} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className={cn(
                    "absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors",
                    darkMode ? "hover:bg-slate-700" : "hover:bg-slate-200"
                  )}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={cn(
                "relative w-14 h-8 rounded-full p-1 transition-all duration-300",
                darkMode 
                  ? "bg-slate-700" 
                  : "bg-slate-200"
              )}
            >
              <div className={cn(
                "absolute w-6 h-6 rounded-full transition-all duration-300 flex items-center justify-center",
                darkMode 
                  ? "translate-x-6 bg-slate-900" 
                  : "translate-x-0 bg-white shadow-sm"
              )}>
                {darkMode ? (
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>

            {/* Subscribe Button */}
            <button 
              onClick={() => setShowSubscribeModal(true)}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-xl font-medium text-sm shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </header>
    </>
  );
}
