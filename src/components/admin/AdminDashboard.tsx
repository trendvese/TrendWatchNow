import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/utils/cn';
import { DraftPost, PostStatus } from '@/types/admin';
import { categories } from '@/data/categories';
import { 
  getAllPosts, 
  deletePost as deleteFirebasePost, 
  updatePost as updateFirebasePost 
} from '../../services/postService';
import { getActiveSubscribersCount } from '../../services/subscriberService';
import { downloadSitemap, copySitemapToClipboard } from '@/utils/sitemapGenerator';
import { Post } from '@/types/post';
import ArticleEditor from './ArticleEditor';
import { SubscribersManager } from './SubscribersManager';

interface AdminDashboardProps {
  onLogout: () => void;
}

type View = 'dashboard' | 'posts' | 'create' | 'edit' | 'subscribers' | 'settings';

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<DraftPost | null>(null);
  const [statusFilter, setStatusFilter] = useState<PostStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [sitemapCopied, setSitemapCopied] = useState(false);
  const [sitemapDownloaded, setSitemapDownloaded] = useState(false);

  // Fetch posts from Firebase
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const fetchedPosts = await getAllPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchSubscribersCount();
  }, []);

  const fetchSubscribersCount = async () => {
    const count = await getActiveSubscribersCount();
    setSubscribersCount(count);
  };

  // Convert Post to DraftPost for editing
  const postToDraftPost = (post: Post): DraftPost => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    category: post.category,
    image: post.image,
    author: post.author,
    date: post.date,
    readTime: post.readTime,
    trending: post.trending,
    views: post.views,
    reactions: post.reactions,
    status: post.status || 'published'
  });

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [posts, statusFilter, searchQuery]);

  // Stats
  const stats = useMemo(() => ({
    total: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    drafts: posts.filter(p => p.status === 'draft').length,
    trending: posts.filter(p => p.trending).length,
    totalViews: posts.reduce((sum, p) => sum + (p.views || 0), 0)
  }), [posts]);

  // Handle delete
  const handleDelete = async (id: string) => {
    setActionLoading(id);
    try {
      await deleteFirebasePost(id);
      await fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setActionLoading(null);
      setShowDeleteModal(null);
    }
  };

  // Toggle publish status
  const togglePublish = async (id: string, currentStatus: 'draft' | 'published') => {
    setActionLoading(id);
    try {
      await updateFirebasePost(id, { status: currentStatus === 'draft' ? 'published' : 'draft' });
      await fetchPosts();
    } catch (error) {
      console.error('Error toggling publish:', error);
    } finally {
      setActionLoading(null);
    }
  };

  // Toggle trending
  const toggleTrending = async (id: string, currentTrending: boolean) => {
    setActionLoading(id);
    try {
      await updateFirebasePost(id, { trending: !currentTrending });
      await fetchPosts();
    } catch (error) {
      console.error('Error toggling trending:', error);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle edit
  const handleEdit = (post: Post) => {
    setEditingPost(postToDraftPost(post));
    setCurrentView('edit');
  };

  // Handle save
  const handleSave = () => {
    fetchPosts();
    setCurrentView('posts');
    setEditingPost(null);
  };

  if (loading && posts.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900/80 backdrop-blur-xl border-r border-white/5 p-4 flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <div>
            <h1 className="font-bold">TrendVerse</h1>
            <p className="text-xs text-slate-500">Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'posts', label: 'All Posts', icon: '📝' },
            { id: 'create', label: 'Create New', icon: '✨' },
            { id: 'subscribers', label: 'Subscribers', icon: '📬', badge: subscribersCount },
            { id: 'settings', label: 'Settings', icon: '⚙️' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id as View);
                setEditingPost(null);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                currentView === item.id || (currentView === 'edit' && item.id === 'posts')
                  ? "bg-gradient-to-r from-violet-500/20 to-pink-500/20 text-white border border-violet-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              )}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium flex-1 text-left">{item.label}</span>
              {'badge' in item && (item as { badge?: number }).badge !== undefined && (item as { badge?: number }).badge! > 0 && (
                <span className="px-2 py-0.5 text-xs font-medium bg-violet-500 text-white rounded-full">
                  {(item as { badge?: number }).badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Firebase Status */}
        <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl mb-4">
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            Firebase Connected
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-medium">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Dashboard View */}
        {currentView === 'dashboard' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
              <p className="text-slate-400">Welcome back! Here's an overview of your blog.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Posts', value: stats.total, icon: '📝', color: 'from-blue-500 to-cyan-500' },
                { label: 'Published', value: stats.published, icon: '✅', color: 'from-green-500 to-emerald-500' },
                { label: 'Drafts', value: stats.drafts, icon: '📋', color: 'from-yellow-500 to-orange-500' },
                { label: 'Trending', value: stats.trending, icon: '🔥', color: 'from-red-500 to-pink-500' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{stat.icon}</span>
                    <div className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      `bg-gradient-to-r ${stat.color} text-white`
                    )}>
                      Live
                    </div>
                  </div>
                  <p className="text-4xl font-bold mb-1">{stat.value}</p>
                  <p className="text-slate-500 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Total Views */}
            <div className="bg-gradient-to-r from-violet-500/10 to-pink-500/10 border border-violet-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 mb-1">Total Views</p>
                  <p className="text-5xl font-bold">{stats.totalViews.toLocaleString()}</p>
                </div>
                <div className="text-6xl">👁️</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => setCurrentView('create')}
                className="flex items-center gap-4 p-6 bg-gradient-to-r from-violet-500/10 to-pink-500/10 border border-violet-500/30 rounded-2xl hover:border-violet-500/50 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-2xl">
                  ✨
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold">Create New Post</h3>
                  <p className="text-slate-400 text-sm">Write and publish a new article</p>
                </div>
              </button>

              <button
                onClick={() => setCurrentView('posts')}
                className="flex items-center gap-4 p-6 bg-slate-900/50 border border-white/5 rounded-2xl hover:border-white/10 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center text-2xl">
                  📝
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold">Manage Posts</h3>
                  <p className="text-slate-400 text-sm">Edit, delete, or publish articles</p>
                </div>
              </button>
            </div>

            {/* Recent Posts */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Recent Posts</h3>
                <button 
                  onClick={fetchPosts}
                  className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
              {posts.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No posts yet. Create your first post!</p>
              ) : (
                <div className="space-y-3">
                  {posts.slice(0, 5).map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 transition-colors cursor-pointer"
                      onClick={() => handleEdit(post)}
                    >
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{post.title}</h4>
                        <p className="text-sm text-slate-500">{post.category} • {new Date(post.date).toLocaleDateString()}</p>
                      </div>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium",
                        post.status === 'published' 
                          ? "bg-green-500/20 text-green-400" 
                          : "bg-yellow-500/20 text-yellow-400"
                      )}>
                        {post.status || 'published'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Posts List View */}
        {currentView === 'posts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">All Posts</h2>
                <p className="text-slate-400">Manage your blog articles</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={fetchPosts}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-xl font-medium hover:bg-slate-700 transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
                <button
                  onClick={() => setCurrentView('create')}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Post
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts..."
                  className="w-full px-4 py-2 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-violet-500/50 outline-none transition-colors"
                />
              </div>
              <div className="flex gap-2">
                {(['all', 'published', 'draft'] as PostStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={cn(
                      "px-4 py-2 rounded-xl font-medium transition-all duration-300 capitalize",
                      statusFilter === status
                        ? "bg-violet-500 text-white"
                        : "bg-slate-800/50 text-slate-400 hover:text-white"
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Posts Table */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-bold mb-2">No posts found</h3>
                  <p className="text-slate-500 mb-4">
                    {posts.length === 0 
                      ? "Create your first post to get started!" 
                      : "Try adjusting your search or filters."}
                  </p>
                  {posts.length === 0 && (
                    <button
                      onClick={() => setCurrentView('create')}
                      className="px-6 py-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl font-medium"
                    >
                      Create Post
                    </button>
                  )}
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-slate-800/50 border-b border-white/5">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-medium text-slate-400">Post</th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-slate-400">Category</th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-slate-400">Status</th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-slate-400">Trending</th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-slate-400">Views</th>
                      <th className="text-right py-4 px-6 text-sm font-medium text-slate-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPosts.map((post) => {
                      const category = categories[post.category];
                      const isLoading = actionLoading === post.id;
                      return (
                        <tr key={post.id} className={cn(
                          "border-b border-white/5 hover:bg-slate-800/30 transition-colors",
                          isLoading && "opacity-50"
                        )}>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-4">
                              <img
                                src={post.image}
                                alt={post.title}
                                className="w-14 h-14 rounded-lg object-cover"
                              />
                              <div>
                                <h4 className="font-medium line-clamp-1">{post.title}</h4>
                                <p className="text-sm text-slate-500 line-clamp-1">{post.excerpt}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={cn(
                              "px-2 py-1 rounded-md text-xs font-medium",
                              category?.bg, category?.text
                            )}>
                              {category?.label}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <button
                              onClick={() => togglePublish(post.id, (post.status || 'published') as 'draft' | 'published')}
                              disabled={isLoading}
                              className={cn(
                                "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                                post.status === 'published'
                                  ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                                  : "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                              )}
                            >
                              {post.status || 'published'}
                            </button>
                          </td>
                          <td className="py-4 px-4">
                            <button
                              onClick={() => toggleTrending(post.id, post.trending)}
                              disabled={isLoading}
                              className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                post.trending
                                  ? "bg-red-500/20 text-red-400"
                                  : "bg-slate-800 text-slate-500 hover:text-slate-300"
                              )}
                            >
                              🔥
                            </button>
                          </td>
                          <td className="py-4 px-4 text-sm text-slate-400">
                            {(post.views || 0).toLocaleString()}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEdit(post)}
                                disabled={isLoading}
                                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => setShowDeleteModal(post.id)}
                                disabled={isLoading}
                                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Create/Edit View */}
        {(currentView === 'create' || currentView === 'edit') && (
          <ArticleEditor
            post={editingPost}
            onSave={handleSave}
            onCancel={() => {
              setCurrentView('posts');
              setEditingPost(null);
            }}
          />
        )}

        {/* Subscribers View */}
        {currentView === 'subscribers' && (
          <div className="fixed inset-0 z-40">
            <SubscribersManager onBack={() => setCurrentView('dashboard')} />
          </div>
        )}

        {/* Settings View */}
        {currentView === 'settings' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Settings</h2>
              <p className="text-slate-400">Configure your blog settings and tools</p>
            </div>

            {/* Sitemap Generator */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-2xl">
                  🗺️
                </div>
                <div>
                  <h3 className="text-xl font-bold">Sitemap Generator</h3>
                  <p className="text-slate-400 text-sm">Generate sitemap.xml for SEO (includes all your posts)</p>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-sm">Includes {posts.filter(p => p.status === 'published').length} published posts</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-sm">Includes all static pages (About, Contact, Privacy, etc.)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-sm">Includes all category pages</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => {
                    downloadSitemap(posts);
                    setSitemapDownloaded(true);
                    setTimeout(() => setSitemapDownloaded(false), 3000);
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {sitemapDownloaded ? 'Downloaded! ✓' : 'Download sitemap.xml'}
                </button>

                <button
                  onClick={async () => {
                    const success = await copySitemapToClipboard(posts);
                    if (success) {
                      setSitemapCopied(true);
                      setTimeout(() => setSitemapCopied(false), 3000);
                    }
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-800 rounded-xl font-medium hover:bg-slate-700 transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  {sitemapCopied ? 'Copied! ✓' : 'Copy to Clipboard'}
                </button>
              </div>

              <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                <h4 className="font-bold text-yellow-400 flex items-center gap-2 mb-2">
                  <span>📋</span> After Downloading:
                </h4>
                <ol className="text-sm text-slate-300 space-y-1 list-decimal list-inside">
                  <li>Replace the <code className="px-1 bg-slate-800 rounded">public/sitemap.xml</code> file with the downloaded one</li>
                  <li>Run <code className="px-1 bg-slate-800 rounded">npm run build</code></li>
                  <li>Deploy with <code className="px-1 bg-slate-800 rounded">firebase deploy</code></li>
                  <li>Submit sitemap to Google: <code className="px-1 bg-slate-800 rounded">https://trendverse-blog.web.app/sitemap.xml</code></li>
                </ol>
              </div>
            </div>

            {/* SEO Tools */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-2xl">
                  🔍
                </div>
                <div>
                  <h3 className="text-xl font-bold">SEO Tools</h3>
                  <p className="text-slate-400 text-sm">External tools to improve your search rankings</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href="https://search.google.com/search-console"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    🔎
                  </div>
                  <div>
                    <h4 className="font-medium">Google Search Console</h4>
                    <p className="text-xs text-slate-500">Submit sitemap & monitor search performance</p>
                  </div>
                </a>

                <a
                  href="https://analytics.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    📊
                  </div>
                  <div>
                    <h4 className="font-medium">Google Analytics</h4>
                    <p className="text-xs text-slate-500">Track visitors & page views</p>
                  </div>
                </a>

                <a
                  href="https://www.google.com/adsense"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    💰
                  </div>
                  <div>
                    <h4 className="font-medium">Google AdSense</h4>
                    <p className="text-xs text-slate-500">Monetize with ads</p>
                  </div>
                </a>

                <a
                  href="https://pagespeed.web.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    ⚡
                  </div>
                  <div>
                    <h4 className="font-medium">PageSpeed Insights</h4>
                    <p className="text-xs text-slate-500">Check site speed & performance</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-2xl">
                  🔗
                </div>
                <div>
                  <h3 className="text-xl font-bold">Quick Links</h3>
                  <p className="text-slate-400 text-sm">Useful links for your blog</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                  href="https://trendverse-blog.web.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <span>🌐</span>
                  <span>View Live Blog</span>
                </a>
                <a
                  href="https://console.firebase.google.com/project/trendverse-blog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <span>🔥</span>
                  <span>Firebase Console</span>
                </a>
                <a
                  href="https://trendverse-blog.web.app/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <span>🗺️</span>
                  <span>View Sitemap</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center text-3xl mb-4">
                🗑️
              </div>
              <h3 className="text-xl font-bold mb-2">Delete Post?</h3>
              <p className="text-slate-400 mb-6">This action cannot be undone. The post will be permanently deleted from Firebase.</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  disabled={actionLoading === showDeleteModal}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteModal)}
                  disabled={actionLoading === showDeleteModal}
                  className="flex-1 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  {actionLoading === showDeleteModal ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
