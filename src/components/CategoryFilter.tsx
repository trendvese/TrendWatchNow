import { cn } from '@/utils/cn';
import { categories } from '@/data/categories';

interface CategoryFilterProps {
  darkMode: boolean;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export function CategoryFilter({ darkMode, activeCategory, setActiveCategory }: CategoryFilterProps) {
  const allCategories = [
    { key: 'all', label: 'All Posts', color: 'from-slate-500 to-slate-400' },
    ...Object.entries(categories).map(([key, value]) => ({ key, ...value }))
  ];

  return (
    <div className="w-full overflow-x-auto scrollbar-hide py-2">
      <div className="flex gap-2 min-w-max px-1">
        {allCategories.map((category) => (
          <button
            key={category.key}
            onClick={() => setActiveCategory(category.key)}
            className={cn(
              "relative px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 whitespace-nowrap",
              "hover:scale-105 active:scale-95",
              activeCategory === category.key
                ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                : darkMode
                  ? "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
            )}
          >
            {activeCategory === category.key && (
              <span className="absolute inset-0 rounded-xl bg-white/20 animate-pulse" />
            )}
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}
