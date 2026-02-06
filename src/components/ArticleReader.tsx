import { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';
import { Post } from '@/types/post';
import { categories } from '@/data/categories';
import SEOHead from './SEOHead';
import Breadcrumbs from './Breadcrumbs';
import { InArticleAd } from './AdUnit';
import { parseMarkdown } from '@/utils/markdownParser';
import { analytics } from '@/hooks/useAnalytics';

interface ArticleReaderProps {
  post: Post;
  darkMode: boolean;
  onClose: () => void;
}

export function ArticleReader({ post, darkMode, onClose }: ArticleReaderProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [reactions, setReactions] = useState({ liked: false, count: post.reactions });
  const category = categories[post.category];

  // Track article view on mount
  useEffect(() => {
    analytics.articleView(post.id, post.title, post.category);
  }, [post.id, post.title, post.category]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleLike = () => {
    setReactions(prev => ({
      liked: !prev.liked,
      count: prev.liked ? prev.count - 1 : prev.count + 1
    }));
    // Track like action
    if (!reactions.liked) {
      analytics.articleLike(post.id);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Track bookmark action
    if (!isBookmarked) {
      analytics.articleBookmark(post.id);
    }
  };

  const formatContent = (content: string) => {
    // Parse markdown to HTML
    const parsedHtml = parseMarkdown(content);
    
    // Split content to insert ad in the middle
    const parts = parsedHtml.split('</p>');
    const midPoint = Math.floor(parts.length / 2);
    
    // Insert ad marker
    if (parts.length > 2) {
      parts.splice(midPoint, 0, '</p><div class="ad-placeholder"></div>');
    }
    
    const finalHtml = parts.join('</p>');
    
    return (
      <div className="markdown-content">
        <div dangerouslySetInnerHTML={{ __html: finalHtml }} />
        <InArticleAd />
      </div>
    );
  };

  return (
    <article className="fixed inset-0 z-50 overflow-y-auto" itemScope itemType="https://schema.org/Article">
      {/* SEO Head */}
      <SEOHead
        title={post.title}
        description={post.excerpt}
        image={post.image}
        url={`https://trendverse.com/article/${post.id}`}
        type="article"
        post={post}
      />

      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 transition-colors duration-300",
          darkMode ? "bg-slate-950/95" : "bg-white/95"
        )}
        style={{ backdropFilter: 'blur(20px)' }}
        onClick={onClose}
      />

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-800/20 z-50">
        <div 
          className="h-full bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Content */}
      <div className="relative min-h-screen">
        {/* Header Image */}
        <header className="relative h-[50vh] min-h-[400px]">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
            itemProp="image"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close article"
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-black/30 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/50 transition-all duration-300 hover:scale-110"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Article Meta */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="max-w-3xl mx-auto">
              {/* Breadcrumbs */}
              <div className="mb-4">
                <Breadcrumbs 
                  category={post.category} 
                  articleTitle={post.title} 
                  onNavigate={onClose} 
                />
              </div>
              
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span 
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider",
                    `bg-gradient-to-r ${category.color} text-white`
                  )}
                  itemProp="articleSection"
                >
                  {category.label}
                </span>
                {post.trending && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/90 text-white">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    TRENDING
                  </span>
                )}
                <time 
                  className="text-white/70 text-sm"
                  dateTime={post.date}
                  itemProp="datePublished"
                >
                  {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </time>
                <span className="text-white/70 text-sm">•</span>
                <span className="text-white/70 text-sm">{post.readTime} min read</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight" itemProp="headline">
                {post.title}
              </h1>
            </div>
          </div>
        </header>

        {/* Article Body */}
        <div className={cn(
          "relative py-12 px-6",
          darkMode ? "bg-slate-950" : "bg-white"
        )}>
          <div className="max-w-3xl mx-auto">
            {/* Author Card */}
            <div 
              className={cn(
                "flex items-center gap-4 p-4 rounded-2xl mb-8 -mt-20 relative z-10",
                darkMode 
                  ? "bg-slate-900/90 backdrop-blur-xl border border-white/10" 
                  : "bg-white shadow-xl border border-black/5"
              )}
              itemProp="author"
              itemScope
              itemType="https://schema.org/Person"
            >
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-14 h-14 rounded-full object-cover ring-4 ring-violet-500/30"
                itemProp="image"
              />
              <div className="flex-1">
                <p className={cn(
                  "font-bold",
                  darkMode ? "text-white" : "text-slate-900"
                )} itemProp="name">{post.author.name}</p>
                <p className={cn(
                  "text-sm",
                  darkMode ? "text-slate-400" : "text-slate-600"
                )} itemProp="jobTitle">Tech Writer & Analyst</p>
              </div>
              <a 
                href="https://x.com/Bh_anant"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
              >
                Follow
              </a>
            </div>

            {/* Excerpt / Description */}
            <p className={cn(
              "text-xl leading-relaxed mb-8 font-medium",
              darkMode ? "text-slate-300" : "text-slate-700"
            )} itemProp="description">
              {post.excerpt}
            </p>

            {/* Content */}
            <div className={cn(
              "prose prose-lg max-w-none",
              darkMode ? "dark" : "light"
            )} itemProp="articleBody">
              {formatContent(post.content)}
            </div>

            {/* Tags for SEO */}
            <div className="mt-8 flex flex-wrap gap-2">
              <span className={cn(
                "text-sm",
                darkMode ? "text-slate-500" : "text-slate-500"
              )}>Tags:</span>
              {[post.category, 'trending', 'news', '2024'].map((tag) => (
                <span
                  key={tag}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium",
                    darkMode ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600"
                  )}
                  itemProp="keywords"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Reactions Bar */}
            <div className={cn(
              "flex items-center justify-between mt-12 pt-8 border-t",
              darkMode ? "border-white/10" : "border-black/10"
            )}>
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleLike}
                  aria-label={reactions.liked ? "Unlike article" : "Like article"}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300",
                    reactions.liked 
                      ? "bg-red-500/20 text-red-400" 
                      : darkMode 
                        ? "bg-slate-800 text-slate-400 hover:bg-slate-700" 
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  <svg className={cn("w-5 h-5", reactions.liked && "fill-current")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="font-medium">{reactions.count}</span>
                </button>
                <button 
                  onClick={handleBookmark}
                  aria-label={isBookmarked ? "Remove bookmark" : "Bookmark article"}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300",
                    isBookmarked 
                      ? "bg-violet-500/20 text-violet-400" 
                      : darkMode 
                        ? "bg-slate-800 text-slate-400 hover:bg-slate-700" 
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  <svg className={cn("w-5 h-5", isBookmarked && "fill-current")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <span className="font-medium">{isBookmarked ? 'Saved' : 'Save'}</span>
                </button>
              </div>

              {/* Share */}
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-sm mr-2",
                  darkMode ? "text-slate-500" : "text-slate-500"
                )}>Share:</span>
                {['twitter', 'facebook', 'linkedin'].map((platform) => (
                  <a
                    key={platform}
                    href={
                      platform === 'twitter' 
                        ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://trendverse.com/article/${post.id}`)}`
                        : platform === 'facebook'
                        ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://trendverse.com/article/${post.id}`)}`
                        : `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`https://trendverse.com/article/${post.id}`)}&title=${encodeURIComponent(post.title)}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Share on ${platform}`}
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110",
                      darkMode 
                        ? "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white" 
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                    )}
                  >
                    {platform === 'twitter' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    )}
                    {platform === 'facebook' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    )}
                    {platform === 'linkedin' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    )}
                  </a>
                ))}
              </div>
            </div>

            {/* Related Posts Ad */}
            <div className="mt-12">
              <InArticleAd />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
