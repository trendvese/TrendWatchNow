import { useState, useMemo, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { posts as staticPosts } from '@/data/posts';
import { Post } from '@/types/post';
import { usePageTracking } from '@/hooks/useAnalytics';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { CategoryFilter } from '@/components/CategoryFilter';
import { PostCard } from '@/components/PostCard';
import { TrendingSidebar } from '@/components/TrendingSidebar';
import { ArticleReader } from '@/components/ArticleReader';
import { StatsBar } from '@/components/StatsBar';
import SEOHead from '@/components/SEOHead';
import { HeaderAd, SidebarAd, FeedAd } from '@/components/AdUnit';
import AdminPanel from '@/components/admin/AdminPanel';
import { getPublishedPosts as getFirebasePosts } from '@/services/postService';
import { 
  AboutPage, 
  ContactPage, 
  PrivacyPolicyPage, 
  TermsOfServicePage, 
  DisclaimerPage 
} from '@/components/pages';

type View = 'blog' | 'admin' | 'about' | 'contact' | 'privacy' | 'terms' | 'disclaimer';

export function App() {
  const [currentView, setCurrentView] = useState<View>('blog');
  
  // Track page views automatically
  usePageTracking(`/${currentView === 'blog' ? '' : currentView}`, `TrendWatch Now - ${currentView.charAt(0).toUpperCase() + currentView.slice(1)}`);
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [firebasePosts, setFirebasePosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load posts from Firebase
  useEffect(() => {
    const loadFirebasePosts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const posts = await getFirebasePosts();
        console.log('Firebase posts loaded:', posts.length);
        setFirebasePosts(posts);
      } catch (err) {
        console.error('Error loading Firebase posts:', err);
        setError('Failed to load posts from server');
      } finally {
        setIsLoading(false);
      }
    };

    loadFirebasePosts();
  }, [currentView]); // Reload when switching back from admin

  // Combine Firebase posts with static posts (Firebase posts first - they're newer)
  const allPosts = useMemo(() => {
    // Remove duplicates by ID (Firebase posts take priority)
    const firebaseIds = new Set(firebasePosts.map(p => p.id));
    const filteredStaticPosts = staticPosts.filter(p => !firebaseIds.has(p.id));
    return [...firebasePosts, ...filteredStaticPosts];
  }, [firebasePosts]);

  const filteredPosts = useMemo(() => {
    return allPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, allPosts]);

  const featuredPost = allPosts.find(p => p.trending && p.views > 40000) || allPosts[0];
  const remainingPosts = filteredPosts.filter(p => p.id !== featuredPost?.id);

  // Insert ad after every 4 posts
  const postsWithAds = useMemo(() => {
    const result: (Post | 'ad')[] = [];
    remainingPosts.forEach((post, index) => {
      result.push(post);
      if ((index + 1) % 4 === 0 && index < remainingPosts.length - 1) {
        result.push('ad');
      }
    });
    return result;
  }, [remainingPosts]);

  // Show different pages based on currentView
  if (currentView === 'admin') {
    return <AdminPanel onBack={() => setCurrentView('blog')} />;
  }
  if (currentView === 'about') {
    return <AboutPage onBack={() => setCurrentView('blog')} />;
  }
  if (currentView === 'contact') {
    return <ContactPage onBack={() => setCurrentView('blog')} />;
  }
  if (currentView === 'privacy') {
    return <PrivacyPolicyPage onBack={() => setCurrentView('blog')} />;
  }
  if (currentView === 'terms') {
    return <TermsOfServicePage onBack={() => setCurrentView('blog')} />;
  }
  if (currentView === 'disclaimer') {
    return <DisclaimerPage onBack={() => setCurrentView('blog')} />;
  }

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-500",
      darkMode ? "text-white" : "text-slate-900"
    )}>
      {/* SEO for Homepage */}
      {!selectedPost && (
        <SEOHead
          title={activeCategory !== 'all' ? `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Articles` : undefined}
          description="Your destination for trending topics - Tech, Mobile, News, Events, Gaming & Lifestyle. Stay ahead with the latest updates and in-depth articles."
        />
      )}

      <AnimatedBackground darkMode={darkMode} />
      <Header 
        darkMode={darkMode} 
        setDarkMode={setDarkMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Header Ad */}
      <div className={cn(
        "border-b",
        darkMode ? "border-white/5" : "border-black/5"
      )}>
        <HeaderAd />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Access Button */}
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => setCurrentView('admin')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
              "bg-gradient-to-r from-violet-500/10 to-pink-500/10 border border-violet-500/30",
              "hover:border-violet-500/50 hover:shadow-lg hover:shadow-purple-500/10",
              darkMode ? "text-violet-300" : "text-violet-600"
            )}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Admin Panel
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className={cn(
            "mb-6 p-4 rounded-xl flex items-center gap-3",
            darkMode ? "bg-violet-500/10 border border-violet-500/20" : "bg-violet-50 border border-violet-200"
          )}>
            <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            <span className={darkMode ? "text-violet-300" : "text-violet-600"}>
              Loading posts...
            </span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className={cn(
            "mb-6 p-4 rounded-xl flex items-center gap-3",
            darkMode ? "bg-red-500/10 border border-red-500/20" : "bg-red-50 border border-red-200"
          )}>
            <span className="text-xl">⚠️</span>
            <span className={darkMode ? "text-red-300" : "text-red-600"}>
              {error} - Showing cached articles
            </span>
          </div>
        )}

        {/* Stats Bar */}
        <div className="mb-8">
          <StatsBar darkMode={darkMode} />
        </div>

        {/* Hero Section - Featured Post */}
        {!searchQuery && activeCategory === 'all' && featuredPost && (
          <div className="mb-10">
            <HeroSection 
              post={featuredPost} 
              darkMode={darkMode} 
              onClick={() => setSelectedPost(featuredPost)}
            />
          </div>
        )}

        {/* Category Filter */}
        <nav className="mb-8" aria-label="Article categories">
          <CategoryFilter 
            darkMode={darkMode}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        </nav>

        {/* Search Results Header */}
        {searchQuery && (
          <div className="mb-6">
            <h2 className={cn(
              "text-2xl font-bold",
              darkMode ? "text-white" : "text-slate-900"
            )}>
              Search results for "{searchQuery}"
            </h2>
            <p className={cn(
              "text-sm mt-1",
              darkMode ? "text-slate-400" : "text-slate-600"
            )}>
              Found {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Posts Grid */}
          <section className="lg:col-span-2" aria-label="Articles">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {postsWithAds.map((item, index) => {
                if (item === 'ad') {
                  return <FeedAd key={`ad-${index}`} />;
                }
                return (
                  <PostCard
                    key={item.id}
                    post={item}
                    darkMode={darkMode}
                    featured={!searchQuery && activeCategory === 'all' && index === 0}
                    onClick={() => setSelectedPost(item)}
                  />
                );
              })}
            </div>

            {/* No Results */}
            {filteredPosts.length === 0 && !isLoading && (
              <div className={cn(
                "text-center py-16 rounded-2xl border",
                darkMode 
                  ? "bg-slate-800/30 border-white/5" 
                  : "bg-white/60 border-black/5"
              )}>
                <div className="text-6xl mb-4">🔍</div>
                <h3 className={cn(
                  "text-xl font-bold mb-2",
                  darkMode ? "text-white" : "text-slate-900"
                )}>No articles found</h3>
                <p className={cn(
                  "text-sm",
                  darkMode ? "text-slate-400" : "text-slate-600"
                )}>Try adjusting your search or filter to find what you're looking for.</p>
              </div>
            )}

            {/* Load More */}
            {remainingPosts.length > 0 && (
              <div className="mt-10 text-center">
                <button className={cn(
                  "px-8 py-3 rounded-xl font-medium transition-all duration-300",
                  "bg-gradient-to-r from-violet-500 to-pink-500 text-white",
                  "shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105"
                )}>
                  Load More Articles
                </button>
              </div>
            )}
          </section>

          {/* Sidebar */}
          <aside className="lg:col-span-1" aria-label="Sidebar">
            <div className="sticky top-28 space-y-6">
              <TrendingSidebar 
                posts={allPosts} 
                darkMode={darkMode}
                onPostClick={setSelectedPost}
              />

              {/* Sidebar Ad */}
              <SidebarAd />

              {/* Quick Topics */}
              <div className={cn(
                "p-5 rounded-2xl backdrop-blur-sm border",
                darkMode 
                  ? "bg-slate-800/30 border-white/5" 
                  : "bg-white/60 border-black/5"
              )}>
                <h3 className={cn(
                  "font-bold text-lg mb-4",
                  darkMode ? "text-white" : "text-slate-900"
                )}>
                  Quick Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['AI', 'iPhone 16', 'Tesla', 'CES 2024', 'Gaming', 'Crypto', 'Space', 'Apps', 'Reviews'].map((topic) => (
                    <button
                      key={topic}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm transition-all duration-300 hover:scale-105",
                        darkMode 
                          ? "bg-slate-700/50 text-slate-300 hover:bg-violet-500/30 hover:text-violet-300" 
                          : "bg-slate-100 text-slate-700 hover:bg-violet-500/10 hover:text-violet-600"
                      )}
                    >
                      #{topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className={cn(
                "p-5 rounded-2xl backdrop-blur-sm border",
                darkMode 
                  ? "bg-slate-800/30 border-white/5" 
                  : "bg-white/60 border-black/5"
              )}>
                <h3 className={cn(
                  "font-bold text-lg mb-4",
                  darkMode ? "text-white" : "text-slate-900"
                )}>
                  Follow Us
                </h3>
                <div className="flex gap-3">
                  {[
                    { icon: '𝕏', color: 'from-slate-600 to-slate-800', label: 'Twitter/X', url: 'https://x.com/Bh_anant' },
                    { icon: '📘', color: 'from-blue-500 to-blue-600', label: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61587492453263' },
                    { icon: '📸', color: 'from-pink-500 to-purple-500', label: 'Instagram', url: 'https://www.instagram.com/trendwatchnow/' },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Follow us on ${social.label}`}
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center text-xl",
                        "transition-all duration-300 hover:scale-110 hover:shadow-lg",
                        `bg-gradient-to-br ${social.color} text-white`
                      )}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Another Sidebar Ad */}
              <SidebarAd />
            </div>
          </aside>
        </div>

        {/* Footer */}
        <footer className={cn(
          "mt-16 pt-8 border-t text-center",
          darkMode ? "border-white/10" : "border-black/10"
        )}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className={cn(
              "text-lg font-bold",
              darkMode ? "text-white" : "text-slate-900"
            )}>
              Trend<span className="bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">Watch</span> Now
            </span>
          </div>
          <p className={cn(
            "text-sm",
            darkMode ? "text-slate-500" : "text-slate-500"
          )}>
            © 2024 TrendWatch Now. Exploring what's trending, one article at a time.
          </p>
          <nav className="flex flex-wrap justify-center gap-4 md:gap-6 mt-4" aria-label="Footer navigation">
            {[
              { label: 'About', view: 'about' as View },
              { label: 'Contact', view: 'contact' as View },
              { label: 'Privacy Policy', view: 'privacy' as View },
              { label: 'Terms of Service', view: 'terms' as View },
              { label: 'Disclaimer', view: 'disclaimer' as View },
            ].map((link) => (
              <button
                key={link.label}
                onClick={() => setCurrentView(link.view)}
                className={cn(
                  "text-sm transition-colors hover:text-violet-400",
                  darkMode ? "text-slate-400" : "text-slate-600"
                )}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </footer>
      </main>

      {/* Article Reader Modal */}
      {selectedPost && (
        <ArticleReader
          post={selectedPost}
          darkMode={darkMode}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
}
