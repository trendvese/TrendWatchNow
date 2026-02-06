import { cn } from '@/utils/cn';
import { Post } from '@/types/post';
import { categories } from '@/data/categories';

interface HeroSectionProps {
  post: Post;
  darkMode: boolean;
  onClick: () => void;
}

export function HeroSection({ post, darkMode, onClick }: HeroSectionProps) {
  const category = categories[post.category];

  return (
    <section 
      onClick={onClick}
      className="relative w-full h-[70vh] min-h-[500px] max-h-[700px] rounded-3xl overflow-hidden cursor-pointer group"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
      </div>

      {/* Animated Border Glow */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 blur-sm" />
        <div className={cn(
          "absolute inset-[2px] rounded-3xl",
          darkMode ? "bg-slate-950" : "bg-slate-100"
        )} />
        <img
          src={post.image}
          alt={post.title}
          className="absolute inset-[2px] w-[calc(100%-4px)] h-[calc(100%-4px)] object-cover rounded-3xl"
        />
        <div className="absolute inset-[2px] rounded-3xl bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
        {/* Labels */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            FEATURED
          </span>
          <span className={cn(
            "px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider",
            `bg-gradient-to-r ${category.color} text-white`
          )}>
            {category.label}
          </span>
          {post.trending && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/90 text-white text-xs font-semibold">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
              HOT
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 max-w-4xl group-hover:text-violet-200 transition-colors duration-300">
          {post.title}
        </h1>

        {/* Excerpt */}
        <p className="text-lg text-white/80 max-w-2xl mb-6 line-clamp-2">
          {post.excerpt}
        </p>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-6">
          {/* Author */}
          <div className="flex items-center gap-3">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-white/30"
            />
            <div>
              <p className="text-white font-medium">{post.author.name}</p>
              <p className="text-white/60 text-sm">
                {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-white/70">
            <div className="flex items-center gap-1.5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{post.readTime} min read</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{(post.views / 1000).toFixed(1)}K views</span>
            </div>
          </div>

          {/* CTA */}
          <button className="ml-auto px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl font-medium flex items-center gap-2 hover:bg-white/20 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-violet-500 group-hover:to-pink-500 group-hover:border-transparent">
            Read Article
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 rounded-full bg-black/30 backdrop-blur-md text-white text-sm">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
        </span>
        Live Updates
      </div>
    </section>
  );
}
