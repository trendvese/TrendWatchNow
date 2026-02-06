import { cn } from '@/utils/cn';

interface StatsBarProps {
  darkMode: boolean;
}

export function StatsBar({ darkMode }: StatsBarProps) {
  const stats = [
    { label: 'Articles', value: '2.4K+', icon: '📝' },
    { label: 'Readers', value: '150K+', icon: '👥' },
    { label: 'Topics', value: '50+', icon: '🏷️' },
    { label: 'Updates Daily', value: '24/7', icon: '🔄' },
  ];

  return (
    <div className={cn(
      "grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl backdrop-blur-sm border",
      darkMode 
        ? "bg-slate-800/30 border-white/5" 
        : "bg-white/60 border-black/5"
    )}>
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className={cn(
            "flex items-center gap-3 p-3 rounded-xl transition-all duration-300 hover:scale-105",
            darkMode ? "hover:bg-slate-700/50" : "hover:bg-slate-100"
          )}
        >
          <div className="text-2xl">{stat.icon}</div>
          <div>
            <p className={cn(
              "text-xl font-bold",
              darkMode ? "text-white" : "text-slate-900"
            )}>{stat.value}</p>
            <p className={cn(
              "text-xs",
              darkMode ? "text-slate-500" : "text-slate-500"
            )}>{stat.label}</p>
          </div>
          {index < stats.length - 1 && (
            <div className={cn(
              "hidden md:block absolute right-0 h-8 w-px",
              darkMode ? "bg-white/10" : "bg-black/10"
            )} />
          )}
        </div>
      ))}
    </div>
  );
}
