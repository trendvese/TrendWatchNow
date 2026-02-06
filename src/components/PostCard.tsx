import { cn } from '@/utils/cn';
import { Post } from '@/types/post';
import { categories } from '@/data/categories';

interface PostCardProps {
  post: Post;
  darkMode: boolean;
  featured?: boolean;
  onClick: () => void;
}

export function PostCard({ post, darkMode, featured = false, onClick }: PostCardProps) {
  const category = categories[post.category];
  
  const formatViews = (views: number) => {
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <article
      onClick={onClick}
      className={cn(
        "group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500",
        "hover:scale-[1.02] hover:shadow-2xl",
        featured ? "col-span-2 row-span-2" : "",
        darkMode 
          ? "bg-slate-800/30 backdrop-blur-sm border border-white/5 hover:border-white/10 shadow-xl shadow-black/20" 
          : "bg-white/60 backdrop-blur-sm border border-black/5 hover:border-black/10 shadow-xl shadow-black/5"
      )}
    >
      {/* Image Container */}
      <div className={cn(
        "relative overflow-hidden",
        featured ? "h-64 md:h-80" : "h-48"
      )}>
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Category Badge */}
        <div className={cn(
          "absolute top-4 left-4 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider",
          "backdrop-blur-md border border-white/20",
          `bg-gradient-to-r ${category.color} text-white`
        )}>
          {category.label}
        </div>

        {/* Trending Badge */}
        {post.trending && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/90 backdrop-blur-md text-white">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            TRENDING
          </div>
        )}

        {/* Reading Time */}
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-2 py-1 rounded-md text-xs text-white/90 bg-black/30 backdrop-blur-sm">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {post.readTime} min read
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className={cn(
          "font-bold mb-2 line-clamp-2 transition-colors group-hover:text-violet-400",
          featured ? "text-xl md:text-2xl" : "text-lg",
          darkMode ? "text-white" : "text-slate-900"
        )}>
          {post.title}
        </h3>
        
        <p className={cn(
          "text-sm line-clamp-2 mb-4",
          darkMode ? "text-slate-400" : "text-slate-600"
        )}>
          {post.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Author */}
          <div className="flex items-center gap-2">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-violet-500/30"
            />
            <div>
              <p className={cn(
                "text-sm font-medium",
                darkMode ? "text-white" : "text-slate-900"
              )}>{post.author.name}</p>
              <p className={cn(
                "text-xs",
                darkMode ? "text-slate-500" : "text-slate-500"
              )}>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex items-center gap-1 text-xs",
              darkMode ? "text-slate-500" : "text-slate-500"
            )}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {formatViews(post.views)}
            </div>
            <div className={cn(
              "flex items-center gap-1 text-xs",
              darkMode ? "text-slate-500" : "text-slate-500"
            )}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {formatViews(post.reactions)}
            </div>
          </div>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
        "bg-gradient-to-br from-violet-500/10 via-transparent to-pink-500/10"
      )} />
    </article>
  );
}
