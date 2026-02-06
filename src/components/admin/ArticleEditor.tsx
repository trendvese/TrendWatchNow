import { useState, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { DraftPost } from '@/types/admin';
import { categories } from '@/data/categories';
import { createPost, updatePost as updateFirebasePost } from '../../services/postService';
import { parseMarkdown } from '../../utils/markdownParser';

interface ArticleEditorProps {
  post?: DraftPost | null;
  onSave: () => void;
  onCancel: () => void;
}

const DEFAULT_AUTHOR = {
  name: 'Admin Author',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop'
};

// Calculate read time
const calculateReadTime = (content: string) => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
};

export default function ArticleEditor({ post, onSave, onCancel }: ArticleEditorProps) {
  const isEditing = !!post;

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'tech' as DraftPost['category'],
    image: '',
    authorName: DEFAULT_AUTHOR.name,
    authorAvatar: DEFAULT_AUTHOR.avatar,
    trending: false,
    status: 'draft' as 'draft' | 'published'
  });

  const [preview, setPreview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Load post data if editing
  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        image: post.image,
        authorName: post.author.name,
        authorAvatar: post.author.avatar,
        trending: post.trending,
        status: post.status
      });
    }
  }, [post]);

  // Form validation
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.excerpt.trim()) newErrors.excerpt = 'Excerpt is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    if (!formData.image.trim()) newErrors.image = 'Featured image URL is required';
    if (!formData.authorName.trim()) newErrors.authorName = 'Author name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle image upload - converts to base64 (works without external service)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 1MB for base64)
    if (file.size > 1024 * 1024) {
      setErrors({ ...errors, image: 'Image too large. Use URL instead or compress the image.' });
      return;
    }

    setIsUploading(true);
    try {
      // Convert to base64 (no external service needed)
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFormData({ ...formData, image: base64 });
        setIsUploading(false);
      };
      reader.onerror = () => {
        setErrors({ ...errors, image: 'Failed to read image' });
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      setErrors({ ...errors, image: 'Failed to process image' });
      setIsUploading(false);
    }
  };

  // Handle save
  const handleSave = async (status: 'draft' | 'published') => {
    if (!validate()) return;

    setIsSaving(true);

    const postData = {
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      category: formData.category,
      image: formData.image,
      author: {
        name: formData.authorName,
        avatar: formData.authorAvatar || DEFAULT_AUTHOR.avatar
      },
      date: post?.date || new Date().toISOString().split('T')[0],
      readTime: calculateReadTime(formData.content),
      trending: formData.trending,
      views: post?.views || 0,
      reactions: post?.reactions || 0,
      status
    };

    try {
      if (isEditing && post?.id) {
        await updateFirebasePost(post.id, postData);
      } else {
        await createPost(postData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving post:', error);
      setErrors({ ...errors, submit: 'Failed to save post. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Preview formatted content using markdown parser
  const formatPreviewContent = (content: string) => {
    const parsedHtml = parseMarkdown(content);
    return (
      <div 
        className="markdown-content dark"
        dangerouslySetInnerHTML={{ __html: parsedHtml }} 
      />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">
            {isEditing ? 'Edit Post' : 'Create New Post'}
          </h2>
          <p className="text-slate-400">
            {isEditing ? 'Update your article details below' : 'Fill in the details to create a new article'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setPreview(!preview)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300",
              preview
                ? "bg-violet-500 text-white"
                : "bg-slate-800 text-slate-400 hover:text-white"
            )}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {preview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {errors.submit && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {errors.submit}
        </div>
      )}

      {preview ? (
        /* Preview Mode */
        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden">
          {/* Hero Image */}
          {formData.image && (
            <div className="relative h-64">
              <img
                src={formData.image}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
            </div>
          )}
          
          <div className="p-8 -mt-20 relative">
            {/* Category */}
            <span className={cn(
              "inline-block px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider mb-4",
              `bg-gradient-to-r ${categories[formData.category]?.color} text-white`
            )}>
              {categories[formData.category]?.label}
            </span>
            
            {/* Title */}
            <h1 className="text-4xl font-bold mb-4">{formData.title || 'Untitled Post'}</h1>
            
            {/* Excerpt */}
            <p className="text-xl text-slate-400 mb-6">{formData.excerpt || 'No excerpt provided'}</p>
            
            {/* Author */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
              <img
                src={formData.authorAvatar || DEFAULT_AUTHOR.avatar}
                alt="Author"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{formData.authorName || 'Anonymous'}</p>
                <p className="text-sm text-slate-500">
                  {calculateReadTime(formData.content)} min read • {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
            
            {/* Content */}
            <div className="prose prose-invert max-w-none">
              {formatPreviewContent(formData.content || 'No content yet...')}
            </div>
          </div>
        </div>
      ) : (
        /* Edit Mode */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter a compelling title..."
                className={cn(
                  "w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white text-lg placeholder:text-slate-500",
                  "outline-none transition-all duration-300",
                  errors.title ? "border-red-500/50" : "border-white/10 focus:border-violet-500/50"
                )}
              />
              {errors.title && <p className="mt-2 text-sm text-red-400">{errors.title}</p>}
            </div>

            {/* Excerpt */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Excerpt <span className="text-red-400">*</span>
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Write a short summary that will appear in post cards..."
                rows={3}
                className={cn(
                  "w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder:text-slate-500",
                  "outline-none transition-all duration-300 resize-none",
                  errors.excerpt ? "border-red-500/50" : "border-white/10 focus:border-violet-500/50"
                )}
              />
              {errors.excerpt && <p className="mt-2 text-sm text-red-400">{errors.excerpt}</p>}
              <p className="mt-2 text-xs text-slate-500">{formData.excerpt.length}/200 characters recommended</p>
            </div>

            {/* Content */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-300">
                  Content <span className="text-red-400">*</span>
                </label>
                <span className="text-xs text-slate-500">
                  Supports Markdown formatting
                </span>
              </div>
              
              {/* Formatting Toolbar */}
              <div className="flex flex-wrap gap-1 mb-3 p-2 bg-slate-800/50 rounded-xl border border-white/5">
                {[
                  { label: 'H1', insert: '# ', title: 'Heading 1' },
                  { label: 'H2', insert: '## ', title: 'Heading 2' },
                  { label: 'H3', insert: '### ', title: 'Heading 3' },
                  { label: 'B', insert: '**text**', title: 'Bold', className: 'font-bold' },
                  { label: 'I', insert: '*text*', title: 'Italic', className: 'italic' },
                  { label: '• List', insert: '- ', title: 'Bullet List' },
                  { label: '1. List', insert: '1. ', title: 'Numbered List' },
                  { label: '" Quote', insert: '> ', title: 'Blockquote' },
                  { label: '—', insert: '\n---\n', title: 'Horizontal Line' },
                  { label: '🔗 Link', insert: '[text](url)', title: 'Link' },
                  { label: '🖼️ Image', insert: '![alt](url)', title: 'Image' },
                  { label: '`Code`', insert: '`code`', title: 'Inline Code' },
                  { label: '```', insert: '```\ncode block\n```', title: 'Code Block' },
                ].map((btn) => (
                  <button
                    key={btn.label}
                    type="button"
                    title={btn.title}
                    onClick={() => {
                      const textarea = document.getElementById('content-textarea') as HTMLTextAreaElement;
                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const text = formData.content;
                      const before = text.substring(0, start);
                      const after = text.substring(end);
                      const newContent = before + btn.insert + after;
                      setFormData({ ...formData, content: newContent });
                      setTimeout(() => {
                        textarea.focus();
                        const newPos = start + btn.insert.length;
                        textarea.setSelectionRange(newPos, newPos);
                      }, 10);
                    }}
                    className={cn(
                      "px-2 py-1 text-xs rounded-lg bg-slate-700 hover:bg-violet-500/30 text-slate-300 hover:text-white transition-colors",
                      btn.className
                    )}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
              
              <textarea
                id="content-textarea"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your article content here...

## Introduction
Start with an engaging introduction...

## Main Points
- Point 1
- Point 2

> Add quotes for emphasis

## Conclusion
Wrap up your article..."
                rows={20}
                className={cn(
                  "w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder:text-slate-500",
                  "outline-none transition-all duration-300 resize-none font-mono text-sm",
                  errors.content ? "border-red-500/50" : "border-white/10 focus:border-violet-500/50"
                )}
              />
              {errors.content && <p className="mt-2 text-sm text-red-400">{errors.content}</p>}
              <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                <span>{formData.content.split(/\s+/).filter(Boolean).length} words</span>
                <span>~{calculateReadTime(formData.content)} min read</span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
              <h3 className="font-bold mb-4">Publish Settings</h3>
              
              <div className="space-y-4">
                {/* Status */}
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Status</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFormData({ ...formData, status: 'draft' })}
                      className={cn(
                        "flex-1 py-2 rounded-lg text-sm font-medium transition-colors",
                        formData.status === 'draft'
                          ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                          : "bg-slate-800 text-slate-400"
                      )}
                    >
                      Draft
                    </button>
                    <button
                      onClick={() => setFormData({ ...formData, status: 'published' })}
                      className={cn(
                        "flex-1 py-2 rounded-lg text-sm font-medium transition-colors",
                        formData.status === 'published'
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-slate-800 text-slate-400"
                      )}
                    >
                      Published
                    </button>
                  </div>
                </div>

                {/* Trending */}
                <div className="flex items-center justify-between">
                  <label className="text-sm text-slate-400">Mark as Trending</label>
                  <button
                    onClick={() => setFormData({ ...formData, trending: !formData.trending })}
                    className={cn(
                      "w-12 h-6 rounded-full transition-colors relative",
                      formData.trending ? "bg-violet-500" : "bg-slate-700"
                    )}
                  >
                    <div className={cn(
                      "absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all",
                      formData.trending ? "left-6" : "left-0.5"
                    )} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-2">
                <button
                  onClick={() => handleSave('published')}
                  disabled={isSaving}
                  className="w-full py-3 bg-gradient-to-r from-violet-500 to-pink-500 rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving to Firebase...
                    </>
                  ) : (
                    isEditing ? 'Update & Publish' : 'Publish Now'
                  )}
                </button>
                <button
                  onClick={() => handleSave('draft')}
                  disabled={isSaving}
                  className="w-full py-3 bg-slate-800 rounded-xl font-medium text-slate-300 hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  Save as Draft
                </button>
                <button
                  onClick={onCancel}
                  className="w-full py-3 rounded-xl font-medium text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Category */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
              <h3 className="font-bold mb-4">Category</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(categories).map(([key, category]) => (
                  <button
                    key={key}
                    onClick={() => setFormData({ ...formData, category: key as DraftPost['category'] })}
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-xl text-sm font-medium transition-all",
                      formData.category === key
                        ? `bg-gradient-to-r ${category.color} text-white`
                        : "bg-slate-800 text-slate-400 hover:text-white"
                    )}
                  >
                    <span>{category.icon}</span>
                    <span>{category.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
              <h3 className="font-bold mb-4">Featured Image</h3>
              
              {/* Upload Button */}
              <label className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 border border-dashed border-slate-600 rounded-xl cursor-pointer hover:border-violet-500/50 transition-colors mb-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
                    <span className="text-slate-400">Uploading...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-slate-400">Upload Image</span>
                  </>
                )}
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Or paste image URL..."
                  className={cn(
                    "w-full px-4 py-2 bg-slate-800/50 border rounded-xl text-white text-sm placeholder:text-slate-500",
                    "outline-none transition-all duration-300",
                    errors.image ? "border-red-500/50" : "border-white/10 focus:border-violet-500/50"
                  )}
                />
              </div>
              {errors.image && <p className="mt-2 text-sm text-red-400">{errors.image}</p>}
              
              {formData.image && (
                <div className="mt-4">
                  <div 
                    className="relative rounded-xl overflow-hidden cursor-pointer"
                    onClick={() => setShowImagePreview(true)}
                  >
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white text-sm">Click to preview</span>
                    </div>
                  </div>
                </div>
              )}
              
              <p className="mt-2 text-xs text-slate-500">
                💡 Get free images from:
              </p>
              <div className="mt-1 flex flex-wrap gap-1">
                <a href="https://unsplash.com" target="_blank" rel="noopener" className="text-xs text-violet-400 hover:underline">Unsplash</a>
                <span className="text-slate-600">•</span>
                <a href="https://pexels.com" target="_blank" rel="noopener" className="text-xs text-violet-400 hover:underline">Pexels</a>
                <span className="text-slate-600">•</span>
                <a href="https://pixabay.com" target="_blank" rel="noopener" className="text-xs text-violet-400 hover:underline">Pixabay</a>
              </div>
            </div>

            {/* Author */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
              <h3 className="font-bold mb-4">Author</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    placeholder="Author name..."
                    className={cn(
                      "w-full px-4 py-2 bg-slate-800/50 border rounded-xl text-white text-sm placeholder:text-slate-500",
                      "outline-none transition-all duration-300",
                      errors.authorName ? "border-red-500/50" : "border-white/10 focus:border-violet-500/50"
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Avatar URL</label>
                  <input
                    type="text"
                    value={formData.authorAvatar}
                    onChange={(e) => setFormData({ ...formData, authorAvatar: e.target.value })}
                    placeholder="Avatar image URL..."
                    className="w-full px-4 py-2 bg-slate-800/50 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-500 outline-none focus:border-violet-500/50 transition-colors"
                  />
                  {formData.authorAvatar && (
                    <img
                      src={formData.authorAvatar}
                      alt="Author"
                      className="w-12 h-12 rounded-full object-cover mt-2"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_AUTHOR.avatar;
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {showImagePreview && formData.image && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={() => setShowImagePreview(false)}
        >
          <img
            src={formData.image}
            alt="Full preview"
            className="max-w-full max-h-[80vh] rounded-xl"
          />
        </div>
      )}
    </div>
  );
}
