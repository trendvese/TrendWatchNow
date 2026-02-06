import React from 'react';

interface AboutPageProps {
  onBack: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            About Us
          </h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-gray-900/50 rounded-2xl border border-white/10 p-8 md:p-12">
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl">
              📰
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              TrendWatch Now
            </h1>
            <p className="text-xl text-gray-400">
              Your Gateway to What's Trending
            </p>
          </div>

          {/* About Content */}
          <div className="prose prose-invert max-w-none space-y-8">
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-2xl">🎯</span> Our Mission
              </h2>
              <p className="text-gray-300 leading-relaxed">
                At TrendWatch Now, our mission is to keep you informed about the latest trends across technology, 
                mobile devices, gaming, finance, entertainment, and more. We believe everyone deserves access 
                to quality, unbiased information that helps them stay ahead in this fast-paced world.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-2xl">👥</span> Who We Are
              </h2>
              <p className="text-gray-300 leading-relaxed">
                TrendWatch Now was founded by a team of passionate writers, tech enthusiasts, and industry experts 
                who share a common goal: delivering accurate, engaging, and timely content to our readers. 
                Our diverse team brings expertise from various fields including technology journalism, 
                financial analysis, gaming, and digital marketing.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-2xl">📚</span> What We Cover
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { icon: '💻', title: 'Technology', desc: 'Latest tech news, AI, software updates' },
                  { icon: '📱', title: 'Mobile', desc: 'Smartphone reviews, apps, and tips' },
                  { icon: '🎮', title: 'Gaming', desc: 'Game reviews, esports, and releases' },
                  { icon: '💰', title: 'Finance', desc: 'Markets, crypto, and investments' },
                  { icon: '🎬', title: 'Entertainment', desc: 'Movies, TV shows, and streaming' },
                  { icon: '🏥', title: 'Health', desc: 'Wellness tips and health news' },
                  { icon: '⚽', title: 'Sports', desc: 'Sports news and updates' },
                  { icon: '🔬', title: 'Science', desc: 'Scientific discoveries and research' },
                ].map((item, index) => (
                  <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <h3 className="font-semibold text-white">{item.title}</h3>
                        <p className="text-sm text-gray-400">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-2xl">✨</span> Our Values
              </h2>
              <ul className="space-y-3">
                {[
                  { title: 'Accuracy', desc: 'We fact-check all our content before publishing' },
                  { title: 'Transparency', desc: 'We disclose sponsored content and affiliations' },
                  { title: 'Timeliness', desc: 'We deliver news when it matters most' },
                  { title: 'Accessibility', desc: 'We make complex topics easy to understand' },
                ].map((value, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-300">
                    <span className="text-green-400 mt-1">✓</span>
                    <span><strong className="text-white">{value.title}:</strong> {value.desc}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-2xl">📧</span> Get in Touch
              </h2>
              <p className="text-gray-300 leading-relaxed">
                We love hearing from our readers! Whether you have a story tip, feedback, or just want to say hello, 
                feel free to reach out to us. Visit our <button onClick={onBack} className="text-purple-400 hover:text-purple-300 underline">Contact page</button> for 
                more ways to connect with us.
              </p>
            </section>

            <section className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
              <p className="text-gray-300 text-center">
                Thank you for being part of the TrendWatch Now community. Together, we explore what's trending! 🚀
              </p>
            </section>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-500">
          © {new Date().getFullYear()} TrendWatch Now. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
