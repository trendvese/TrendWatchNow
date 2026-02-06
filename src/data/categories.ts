export interface Category {
  id: string;
  label: string;
  icon: string;
  color: string;
  bg: string;
  text: string;
}

export const categoriesMap: Record<string, Omit<Category, 'id'>> = {
  // Original Categories
  tech: { 
    label: 'Technology',
    icon: '💻',
    color: 'from-blue-500 to-cyan-400', 
    bg: 'bg-blue-500/20', 
    text: 'text-blue-400' 
  },
  mobile: { 
    label: 'Mobile',
    icon: '📱',
    color: 'from-purple-500 to-pink-400', 
    bg: 'bg-purple-500/20', 
    text: 'text-purple-400' 
  },
  news: { 
    label: 'News',
    icon: '📰',
    color: 'from-red-500 to-orange-400', 
    bg: 'bg-red-500/20', 
    text: 'text-red-400' 
  },
  events: { 
    label: 'Events',
    icon: '🎪',
    color: 'from-green-500 to-emerald-400', 
    bg: 'bg-green-500/20', 
    text: 'text-green-400' 
  },
  lifestyle: { 
    label: 'Lifestyle',
    icon: '✨',
    color: 'from-amber-500 to-yellow-400', 
    bg: 'bg-amber-500/20', 
    text: 'text-amber-400' 
  },
  gaming: { 
    label: 'Gaming',
    icon: '🎮',
    color: 'from-indigo-500 to-violet-400', 
    bg: 'bg-indigo-500/20', 
    text: 'text-indigo-400' 
  },
  
  // NEW Categories
  finance: { 
    label: 'Finance',
    icon: '💰',
    color: 'from-yellow-500 to-amber-400', 
    bg: 'bg-yellow-500/20', 
    text: 'text-yellow-400' 
  },
  sports: { 
    label: 'Sports',
    icon: '⚽',
    color: 'from-emerald-500 to-teal-400', 
    bg: 'bg-emerald-500/20', 
    text: 'text-emerald-400' 
  },
  entertainment: { 
    label: 'Entertainment',
    icon: '🎬',
    color: 'from-rose-500 to-pink-400', 
    bg: 'bg-rose-500/20', 
    text: 'text-rose-400' 
  },
  health: { 
    label: 'Health',
    icon: '🏥',
    color: 'from-teal-500 to-cyan-400', 
    bg: 'bg-teal-500/20', 
    text: 'text-teal-400' 
  },
  science: { 
    label: 'Science',
    icon: '🔬',
    color: 'from-cyan-500 to-blue-400', 
    bg: 'bg-cyan-500/20', 
    text: 'text-cyan-400' 
  },
  politics: { 
    label: 'Politics',
    icon: '🏛️',
    color: 'from-slate-500 to-gray-400', 
    bg: 'bg-slate-500/20', 
    text: 'text-slate-400' 
  },
};

// Array version for iteration
export const categoriesList: Category[] = Object.entries(categoriesMap).map(([id, cat]) => ({
  id,
  ...cat
}));

// Backward compatible export
export const categories = categoriesMap;

// Helper to get category by ID
export const getCategoryById = (id: string): Category | undefined => {
  const cat = categoriesMap[id];
  return cat ? { id, ...cat } : undefined;
};
