import { cn } from '@/utils/cn';
import { Post } from '@/types/post';
import { categories } from '@/data/categories';
import { NewsletterSubscribe } from './NewsletterSubscribe';

interface TrendingSidebarProps {
  posts: Post[];
  darkMode: boolean;
  onPostClick: (post: Post) => void;
}

export function TrendingSidebar({ posts, darkMode, onPostClick }: TrendingSidebarProps) {
  const trendingPosts = posts.filter(p => p.trending).slice(0, 5);

  return (
    <aside className={cn(
      "rounded-2xl p-5 backdrop-blur-sm border transition-all duration-300",
      darkMode 
        ? "bg-slate-800/30 border-white/5" 
        : "bg-white/60 border-black/5"
    )}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="relative">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </div>
        <h3 className={cn(
          "font-bold text-lg",
          darkMode ? "text-white" : "text-slate-900"
        )}>
          Hot Right Now
        </h3>
      </div>

      {/* Trending Posts */}
      <div className="space-y-4">
        {trendingPosts.map((post, index) => {
          const category = categories[post.category];
          return (
            <div
              key={post.id}
              onClick={() => onPostClick(post)}
              className={cn(
                "group flex gap-3 cursor-pointer p-2 -mx-2 rounded-xl transition-all duration-300",
                darkMode 
                  ? "hover:bg-slate-700/50" 
                  : "hover:bg-slate-100"
              )}
            >
              {/* Rank */}
              <div className={cn(
                "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm",
                index === 0 
                  ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white" 
                  : index === 1 
                    ? "bg-gradient-to-br from-slate-300 to-slate-400 text-white"
                    : index === 2
                      ? "bg-gradient-to-br from-amber-600 to-amber-700 text-white"
                      : darkMode 
                        ? "bg-slate-700 text-slate-400" 
                        : "bg-slate-200 text-slate-500"
              )}>
                {index + 1}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className={cn(
                  "font-medium text-sm line-clamp-2 transition-colors group-hover:text-violet-400",
                  darkMode ? "text-white" : "text-slate-900"
                )}>
                  {post.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-md",
                    category.bg, category.text
                  )}>
                    {category.label}
                  </span>
                  <span className={cn(
                    "text-xs",
                    darkMode ? "text-slate-500" : "text-slate-500"
                  )}>
                    {post.readTime} min
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Newsletter CTA */}
      <NewsletterSubscribe darkMode={darkMode} />
    </aside>
  );
}
