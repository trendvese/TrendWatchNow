import { useEffect, useState } from 'react';

export function AnimatedBackground({ darkMode }: { darkMode: boolean }) {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div 
        className={`absolute inset-0 transition-colors duration-700 ${
          darkMode 
            ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' 
            : 'bg-gradient-to-br from-slate-100 via-white to-slate-50'
        }`}
      />
      
      {/* Animated orbs */}
      <div 
        className="absolute w-[800px] h-[800px] rounded-full opacity-30 blur-[120px] transition-all duration-1000 ease-out"
        style={{
          background: darkMode 
            ? 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)' 
            : 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
          left: `${mousePos.x - 20}%`,
          top: `${mousePos.y - 20}%`,
        }}
      />
      <div 
        className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[100px] animate-pulse"
        style={{
          background: darkMode 
            ? 'radial-gradient(circle, rgba(236,72,153,0.4) 0%, transparent 70%)' 
            : 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)',
          right: '10%',
          top: '20%',
        }}
      />
      <div 
        className="absolute w-[500px] h-[500px] rounded-full opacity-25 blur-[80px] animate-bounce"
        style={{
          background: darkMode 
            ? 'radial-gradient(circle, rgba(34,211,238,0.3) 0%, transparent 70%)' 
            : 'radial-gradient(circle, rgba(34,211,238,0.15) 0%, transparent 70%)',
          left: '20%',
          bottom: '10%',
          animationDuration: '8s',
        }}
      />
      
      {/* Grid overlay */}
      <div 
        className={`absolute inset-0 transition-opacity duration-500 ${darkMode ? 'opacity-[0.03]' : 'opacity-[0.02]'}`}
        style={{
          backgroundImage: `linear-gradient(${darkMode ? 'white' : 'black'} 1px, transparent 1px), linear-gradient(90deg, ${darkMode ? 'white' : 'black'} 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
