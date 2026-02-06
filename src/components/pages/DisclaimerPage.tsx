import React from 'react';

interface DisclaimerPageProps {
  onBack: () => void;
}

export const DisclaimerPage: React.FC<DisclaimerPageProps> = ({ onBack }) => {
  const lastUpdated = "January 15, 2025";

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
            Disclaimer
          </h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-gray-900/50 rounded-2xl border border-white/10 p-8 md:p-12">
          
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Disclaimer</h1>
            <p className="text-gray-400">Last Updated: {lastUpdated}</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-8 text-gray-300">

            <section className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
              <p className="text-yellow-200 font-medium">
                ⚠️ Please read this disclaimer carefully before using our website. By accessing or 
                using TrendVerse, you acknowledge that you have read, understood, and agree to be 
                bound by this disclaimer.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">1. General Information Disclaimer</h2>
              <p>
                The information provided on TrendVerse (trendverse-blog.web.app) is for general 
                informational purposes only. All content on this Site is provided in good faith, 
                however, we make no representation or warranty of any kind, express or implied, 
                regarding the accuracy, adequacy, validity, reliability, availability, or completeness 
                of any information on the Site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">2. Not Professional Advice</h2>
              <p>
                The content on this Site is not intended to be a substitute for professional advice. 
                This includes but is not limited to:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <h3 className="font-bold text-red-400 mb-2">💰 Financial Disclaimer</h3>
                  <p className="text-sm">
                    Articles about cryptocurrency, stocks, investments, or financial topics are for 
                    informational purposes only and should not be considered financial advice. Always 
                    consult a qualified financial advisor before making investment decisions.
                  </p>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <h3 className="font-bold text-blue-400 mb-2">⚖️ Legal Disclaimer</h3>
                  <p className="text-sm">
                    Content discussing legal topics is for informational purposes only. It should not 
                    be considered legal advice. Consult a qualified attorney for legal matters.
                  </p>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <h3 className="font-bold text-green-400 mb-2">🏥 Health Disclaimer</h3>
                  <p className="text-sm">
                    Health-related articles are for informational purposes only. They are not a 
                    substitute for professional medical advice, diagnosis, or treatment. Always 
                    seek advice from your physician.
                  </p>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                  <h3 className="font-bold text-purple-400 mb-2">💻 Tech Disclaimer</h3>
                  <p className="text-sm">
                    Technology reviews and recommendations are based on our testing and research. 
                    Results may vary. We are not responsible for any issues arising from following 
                    our guides.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">3. Affiliate & Advertising Disclosure</h2>
              <p>
                TrendVerse participates in various affiliate marketing programs and displays 
                advertisements. This means:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>
                  <strong>Affiliate Links:</strong> Some links on our Site are affiliate links. 
                  If you click on these links and make a purchase, we may earn a commission at no 
                  additional cost to you.
                </li>
                <li>
                  <strong>Sponsored Content:</strong> Some articles may be sponsored. Sponsored 
                  content will be clearly labeled as such.
                </li>
                <li>
                  <strong>Advertisements:</strong> We display ads through Google AdSense and other 
                  networks. The presence of an ad does not constitute an endorsement.
                </li>
              </ul>
              <p className="mt-3">
                Despite potential compensation, we strive to provide honest and unbiased content. 
                Our opinions are our own.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">4. Product Reviews & Opinions</h2>
              <p>
                Reviews and opinions expressed on TrendVerse are based on our personal experience 
                and research at the time of writing. Please note:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-3">
                <li>Products and services may change after our review</li>
                <li>Prices and availability are subject to change</li>
                <li>Your experience may differ from ours</li>
                <li>We recommend doing your own research before purchasing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">5. Third-Party Content</h2>
              <p>
                Our Site may include content from third parties, including links to other websites. 
                We do not:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-3">
                <li>Endorse or guarantee the accuracy of third-party content</li>
                <li>Have control over third-party websites</li>
                <li>Accept responsibility for third-party content or websites</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">6. News & Current Events</h2>
              <p>
                Articles covering news and current events are based on information available at 
                the time of publication. News stories may develop or change after publication. 
                We are not responsible for any inaccuracies due to subsequent developments.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">7. Errors & Omissions</h2>
              <p>
                While we strive to provide accurate information, TrendVerse makes no guarantees 
                about the completeness, reliability, or accuracy of information on this Site. 
                Any action you take based on our content is strictly at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">8. Fair Use Disclaimer</h2>
              <p>
                This Site may contain copyrighted material (images, quotes, excerpts) used under 
                the Fair Use doctrine. Such material is made available for commentary, criticism, 
                education, and news reporting purposes. We believe this constitutes fair use as 
                provided in Section 107 of the U.S. Copyright Law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">9. Views Expressed</h2>
              <p>
                The views and opinions expressed in articles on TrendVerse are those of the 
                individual authors and do not necessarily reflect the official policy or position 
                of TrendVerse. Guest posts and user comments represent the views of their authors.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">10. Contact Us</h2>
              <p>If you have any questions about this Disclaimer, please contact us at:</p>
              <div className="bg-white/5 rounded-xl p-4 mt-3">
                <p><strong>TrendVerse</strong></p>
                <p>Email: legal@trendverse.com</p>
                <p>Address: 123 Tech Street, San Francisco, CA 94102</p>
              </div>
            </section>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-500">
          © {new Date().getFullYear()} TrendVerse. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
