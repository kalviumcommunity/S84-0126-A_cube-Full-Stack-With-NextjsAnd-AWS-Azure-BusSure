export const revalidate = false;

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative py-16 px-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeInUp">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 animate-gradient">
            About BusSure
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-300">
            Making bus travel refunds simple, transparent, and fair.
          </p>
        </div>

        {/* Mission Section */}
        <section className="glow-on-hover mb-8 p-8 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20 shadow-lg animate-fadeInUp animate-delay-100">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Our Mission
          </h2>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            BusSure is dedicated to revolutionizing the intercity bus travel experience by providing 
            a transparent, efficient, and user-friendly refund management system. We believe that 
            passengers deserve clarity and fairness when it comes to cancellations and refunds.
          </p>
        </section>

        {/* What We Do Section */}
        <section className="glow-on-hover mb-8 p-8 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20 shadow-lg animate-fadeInUp animate-delay-200">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            What We Do
          </h2>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            Our platform streamlines the entire refund process for intercity bus services, making it 
            simple for passengers to submit claims, track their status, and receive timely refunds. 
            We work with bus operators to ensure compliance with industry standards and provide 
            real-time transparency throughout the refund journey.
          </p>
        </section>

        {/* Key Features Section */}
        <section className="glow-on-hover mb-8 p-8 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20 shadow-lg animate-fadeInUp animate-delay-300">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            Key Features
          </h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 text-2xl mr-4 mt-1">✓</span>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  Instant Claim Submission
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  File refund requests in minutes with our intuitive interface
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 text-2xl mr-4 mt-1">✓</span>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  Real-Time Tracking
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Monitor your claim status from submission to resolution
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 text-2xl mr-4 mt-1">✓</span>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  Transparent Policies
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Clear, accessible information about refund eligibility and timelines
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 text-2xl mr-4 mt-1">✓</span>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  Secure Processing
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Bank-grade security to protect your personal and financial information
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 text-2xl mr-4 mt-1">✓</span>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  Multi-Operator Support
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Unified platform for claims across different bus service providers
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Commitment Section */}
        <section className="glow-on-hover mb-8 p-8 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20 shadow-lg animate-fadeInUp animate-delay-400">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Our Commitment
          </h2>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            We are committed to maintaining the highest standards of service, security, and customer 
            satisfaction. Our team continuously works to improve the platform, ensuring that every 
            passenger receives fair treatment and timely resolution of their refund claims.
          </p>
        </section>

        {/* Contact Section */}
        <section className="glow-on-hover p-8 bg-gradient-to-r from-blue-600/20 to-violet-600/20 dark:from-blue-900/30 dark:to-violet-900/30 backdrop-blur-sm rounded-xl border border-blue-500/30 dark:border-blue-700/30 shadow-lg animate-fadeInUp animate-delay-400">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Contact Us
          </h2>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
            Have questions or need assistance? We're here to help.
          </p>
          <div className="space-y-2 text-lg text-gray-700 dark:text-gray-300">
            <div>
              <span className="font-semibold text-gray-900 dark:text-white">Email:</span>{" "}
              <a 
                href="mailto:support@bussure.com" 
                className="text-blue-600 dark:text-blue-400 hover:underline transition-all"
              >
                support@bussure.com
              </a>
            </div>
            <div>
              <span className="font-semibold text-gray-900 dark:text-white">Phone:</span> 1-800-BUS-SURE
            </div>
            <div>
              <span className="font-semibold text-gray-900 dark:text-white">Hours:</span> Monday - Friday, 8:00 AM - 8:00 PM EST
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
