import React from 'react';

interface TermsOfServicePageProps {
  onBack: () => void;
}

export const TermsOfServicePage: React.FC<TermsOfServicePageProps> = ({ onBack }) => {
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
            Terms of Service
          </h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-gray-900/50 rounded-2xl border border-white/10 p-8 md:p-12">
          
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-gray-400">Last Updated: {lastUpdated}</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-8 text-gray-300">

            <section>
              <h2 className="text-xl font-bold text-white mb-3">1. Agreement to Terms</h2>
              <p>
                By accessing or using the TrendWatch Now website (trendwatchnow.com), you agree to be 
                bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, 
                you do not have permission to access the Site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">2. Intellectual Property Rights</h2>
              <p>
                Unless otherwise stated, TrendWatch Now and/or its licensors own the intellectual property 
                rights for all material on the Site. All intellectual property rights are reserved.
              </p>
              <p className="mt-3">You may:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>View pages from our Site for your own personal use</li>
                <li>Share links to our content on social media</li>
                <li>Quote small portions of our content with proper attribution</li>
              </ul>
              <p className="mt-3">You must not:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Republish material from our Site without permission</li>
                <li>Sell, rent, or sub-license material from our Site</li>
                <li>Reproduce, duplicate, or copy material for commercial purposes</li>
                <li>Redistribute content from TrendWatch Now (unless specifically allowed)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">3. User Accounts</h2>
              <p>
                When you create an account with us, you must provide accurate and complete information. 
                You are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Maintaining the confidentiality of your account and password</li>
                <li>Restricting access to your computer or device</li>
                <li>All activities that occur under your account</li>
              </ul>
              <p className="mt-3">
                We reserve the right to terminate accounts, remove content, or cancel subscriptions at 
                our sole discretion.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">4. User-Generated Content</h2>
              <p>
                If you post comments or submit content to our Site, you grant us a non-exclusive, 
                royalty-free, perpetual license to use, reproduce, modify, and distribute that content.
              </p>
              <p className="mt-3">You agree not to post content that:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Is unlawful, harmful, threatening, or abusive</li>
                <li>Is defamatory, obscene, or invasive of privacy</li>
                <li>Infringes any intellectual property rights</li>
                <li>Contains viruses or malicious code</li>
                <li>Is spam, advertising, or promotional material</li>
                <li>Impersonates any person or entity</li>
              </ul>
              <p className="mt-3">
                We reserve the right to remove any content that violates these Terms without notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">5. Disclaimer</h2>
              <p>
                The information on this Site is provided on an "as is" basis. To the fullest extent 
                permitted by law, TrendVerse:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Excludes all representations and warranties relating to this Site and its contents</li>
                <li>Does not guarantee the accuracy or completeness of the information</li>
                <li>Does not guarantee that the Site will be available at all times</li>
              </ul>
              <p className="mt-3">
                Nothing on this Site constitutes professional advice. The content is for general 
                information purposes only.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">6. Limitations of Liability</h2>
              <p>
                In no event shall TrendWatch Now, its directors, employees, partners, agents, or affiliates 
                be liable for any indirect, incidental, special, consequential, or punitive damages, 
                including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Loss of profits or revenue</li>
                <li>Loss of data or information</li>
                <li>Business interruption</li>
                <li>Personal injury or property damage</li>
              </ul>
              <p className="mt-3">
                arising out of your use of or inability to use the Site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">7. Third-Party Links</h2>
              <p>
                Our Site may contain links to third-party websites or services that are not owned or 
                controlled by TrendWatch Now. We have no control over, and assume no responsibility for:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>The content, privacy policies, or practices of third-party sites</li>
                <li>Any damage or loss caused by those sites</li>
              </ul>
              <p className="mt-3">
                We strongly advise you to read the terms and privacy policies of any third-party sites 
                you visit.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">8. Affiliate Disclosure</h2>
              <p>
                Some links on our Site may be affiliate links. This means we may earn a commission if 
                you click on the link and make a purchase. This does not affect the price you pay.
              </p>
              <p className="mt-3">
                We only recommend products and services we believe will add value to our readers. 
                All opinions expressed are our own.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">9. Advertising</h2>
              <p>
                We display advertisements on our Site through third-party advertising networks, 
                including Google AdSense. These ads may use cookies to display personalized 
                advertisements based on your browsing history.
              </p>
              <p className="mt-3">
                The presence of an advertisement does not imply endorsement of the advertised 
                product or service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">10. Newsletter</h2>
              <p>
                By subscribing to our newsletter, you agree to receive emails from TrendWatch Now. 
                You can unsubscribe at any time by clicking the "Unsubscribe" link in any email 
                or by contacting us directly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">11. Modifications to Terms</h2>
              <p>
                We reserve the right to modify or replace these Terms at any time. If a revision 
                is material, we will provide at least 30 days' notice prior to any new terms taking 
                effect. Your continued use of the Site after changes constitutes acceptance of the 
                new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">12. Governing Law</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws of the 
                United States, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">13. Contact Us</h2>
              <p>If you have any questions about these Terms, please contact us at:</p>
              <div className="bg-white/5 rounded-xl p-4 mt-3">
                <p><strong>TrendWatch Now</strong></p>
                <p>Email: legal@trendwatchnow.com</p>
                <p>Address: 123 Tech Street, San Francisco, CA 94102</p>
              </div>
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
