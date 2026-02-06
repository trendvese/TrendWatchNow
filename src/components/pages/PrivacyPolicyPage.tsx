import React from 'react';

interface PrivacyPolicyPageProps {
  onBack: () => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onBack }) => {
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
            Privacy Policy
          </h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-gray-900/50 rounded-2xl border border-white/10 p-8 md:p-12">
          
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-gray-400">Last Updated: {lastUpdated}</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-8 text-gray-300">

            <section>
              <h2 className="text-xl font-bold text-white mb-3">1. Introduction</h2>
              <p>
                Welcome to TrendWatch Now ("we," "our," or "us"). We are committed to protecting your personal 
                information and your right to privacy. This Privacy Policy explains how we collect, use, 
                disclose, and safeguard your information when you visit our website trendwatchnow.com 
                (the "Site").
              </p>
              <p>
                Please read this privacy policy carefully. If you do not agree with the terms of this 
                privacy policy, please do not access the site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">2. Information We Collect</h2>
              
              <h3 className="text-lg font-semibold text-white mt-4 mb-2">Personal Data</h3>
              <p>We may collect personal information that you voluntarily provide to us when you:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Subscribe to our newsletter</li>
                <li>Fill out a contact form</li>
                <li>Leave comments on articles</li>
                <li>Register for an account</li>
              </ul>
              <p className="mt-3">This information may include:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Name</li>
                <li>Email address</li>
                <li>Any other information you choose to provide</li>
              </ul>

              <h3 className="text-lg font-semibold text-white mt-4 mb-2">Automatically Collected Data</h3>
              <p>When you visit our Site, we may automatically collect certain information, including:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Pages visited and time spent</li>
                <li>Referring website</li>
                <li>Device information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">3. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Send you our newsletter (if subscribed)</li>
                <li>Respond to your inquiries and requests</li>
                <li>Improve our website and content</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Protect against fraud and unauthorized access</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">4. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to track activity on our Site and hold 
                certain information. Cookies are files with a small amount of data that are stored on 
                your device.
              </p>
              <p className="mt-3">Types of cookies we use:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Essential Cookies:</strong> Necessary for the website to function properly</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our site</li>
                <li><strong>Advertising Cookies:</strong> Used to deliver relevant advertisements</li>
              </ul>
              <p className="mt-3">
                You can instruct your browser to refuse all cookies or indicate when a cookie is being sent. 
                However, some features of our Site may not function properly without cookies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">5. Third-Party Services</h2>
              <p>We may use third-party services that collect, monitor, and analyze data:</p>
              
              <h3 className="text-lg font-semibold text-white mt-4 mb-2">Google Analytics</h3>
              <p>
                We use Google Analytics to track and analyze website traffic. Google Analytics uses cookies 
                to collect information about your use of our Site. You can opt-out by installing the 
                Google Analytics Opt-out Browser Add-on.
              </p>

              <h3 className="text-lg font-semibold text-white mt-4 mb-2">Google AdSense</h3>
              <p>
                We use Google AdSense to display advertisements. Google AdSense uses cookies to serve ads 
                based on your prior visits to our Site and other websites. You can opt out of personalized 
                advertising by visiting Google's Ads Settings.
              </p>

              <h3 className="text-lg font-semibold text-white mt-4 mb-2">Firebase</h3>
              <p>
                We use Firebase (by Google) for hosting, database, and authentication services. Firebase 
                may collect certain information as described in Google's Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">6. Data Retention</h2>
              <p>
                We retain your personal information only for as long as necessary to fulfill the purposes 
                outlined in this Privacy Policy, unless a longer retention period is required or permitted 
                by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">7. Data Security</h2>
              <p>
                We implement appropriate technical and organizational security measures to protect your 
                personal information. However, no method of transmission over the Internet or electronic 
                storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">8. Your Rights</h2>
              <p>Depending on your location, you may have the following rights:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Access:</strong> Request access to your personal data</li>
                <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Data Portability:</strong> Request a copy of your data</li>
              </ul>
              <p className="mt-3">
                To exercise these rights, please contact us using the information provided below.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">9. Children's Privacy</h2>
              <p>
                Our Site is not intended for children under 13 years of age. We do not knowingly collect 
                personal information from children under 13. If you are a parent or guardian and believe 
                your child has provided us with personal information, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by 
                posting the new Privacy Policy on this page and updating the "Last Updated" date. You are 
                advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">11. Contact Us</h2>
              <p>If you have questions or concerns about this Privacy Policy, please contact us at:</p>
              <div className="bg-white/5 rounded-xl p-4 mt-3">
                <p><strong>TrendWatch Now</strong></p>
                <p>Email: privacy@trendwatchnow.com</p>
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
