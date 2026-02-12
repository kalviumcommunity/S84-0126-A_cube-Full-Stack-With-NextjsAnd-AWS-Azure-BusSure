export const revalidate = 60;

export default function PoliciesPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative py-16 px-4">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeInUp">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 animate-gradient">
            Cancellation & Refund Policies
          </h1>
          <p className="text-base text-gray-500 dark:text-gray-400">
            Last Updated: February 11, 2026 | Effective Date: January 1, 2026
          </p>
        </div>

        {/* General Policy */}
        <section className="glow-on-hover mb-8 p-8 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20 shadow-lg animate-fadeInUp animate-delay-100">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            1. General Refund Policy
          </h2>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            BusSure facilitates refunds for intercity bus tickets in accordance with the policies of 
            individual bus operators and applicable regulations. Refund eligibility and amounts depend 
            on the timing of cancellation, ticket type, and operator-specific terms.
          </p>
        </section>

        {/* Cancellation Timeframes */}
        <section className="mb-8 animate-fadeInUp animate-delay-200">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            2. Cancellation Timeframes
          </h2>
          
          <div className="space-y-4">
            {/* Full Refund */}
            <div className="glow-on-hover p-6 bg-green-50/50 dark:bg-green-900/20 backdrop-blur-sm rounded-xl border-l-4 border-green-500 dark:border-green-400 shadow-lg">
              <h3 className="text-2xl font-semibold mb-3 text-green-800 dark:text-green-300">
                2.1 Full Refund (100%)
              </h3>
              <p className="text-lg leading-relaxed text-green-700 dark:text-green-200">
                Cancellations made more than 24 hours before scheduled departure are eligible for a 
                full refund, minus any applicable processing fees (typically $2-5).
              </p>
            </div>

            {/* Partial Refund */}
            <div className="glow-on-hover p-6 bg-yellow-50/50 dark:bg-yellow-900/20 backdrop-blur-sm rounded-xl border-l-4 border-yellow-500 dark:border-yellow-400 shadow-lg">
              <h3 className="text-2xl font-semibold mb-3 text-yellow-800 dark:text-yellow-300">
                2.2 Partial Refund (50-75%)
              </h3>
              <p className="text-lg leading-relaxed text-yellow-700 dark:text-yellow-200">
                Cancellations made between 6-24 hours before departure may receive a partial refund 
                of 50-75% of the ticket price, depending on the operator's policy.
              </p>
            </div>

            {/* Minimal Refund */}
            <div className="glow-on-hover p-6 bg-orange-50/50 dark:bg-orange-900/20 backdrop-blur-sm rounded-xl border-l-4 border-orange-500 dark:border-orange-400 shadow-lg">
              <h3 className="text-2xl font-semibold mb-3 text-orange-800 dark:text-orange-300">
                2.3 Minimal Refund (25-50%)
              </h3>
              <p className="text-lg leading-relaxed text-orange-700 dark:text-orange-200">
                Cancellations made less than 6 hours before departure typically receive 25-50% refund, 
                subject to operator discretion.
              </p>
            </div>

            {/* No Refund */}
            <div className="glow-on-hover p-6 bg-red-50/50 dark:bg-red-900/20 backdrop-blur-sm rounded-xl border-l-4 border-red-500 dark:border-red-400 shadow-lg">
              <h3 className="text-2xl font-semibold mb-3 text-red-800 dark:text-red-300">
                2.4 No Refund
              </h3>
              <p className="text-lg leading-relaxed text-red-700 dark:text-red-200">
                No refunds are provided for no-shows or cancellations made after departure time, 
                unless exceptional circumstances apply.
              </p>
            </div>
          </div>
        </section>

        {/* Special Circumstances */}
        <section className="glow-on-hover mb-8 p-8 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20 shadow-lg animate-fadeInUp animate-delay-300">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            3. Special Circumstances
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                3.1 Service Cancellations
              </h3>
              <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                If the bus operator cancels the service, passengers are entitled to a full refund 
                or free rebooking to an alternative service.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                3.2 Medical Emergencies
              </h3>
              <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                Full refunds may be granted for documented medical emergencies. Supporting documentation 
                (medical certificate, hospital admission records) must be submitted within 7 days.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                3.3 Force Majeure
              </h3>
              <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                In cases of natural disasters, severe weather, or other force majeure events, 
                refund policies may be adjusted at the operator's discretion.
              </p>
            </div>
          </div>
        </section>

        {/* Refund Processing */}
        <section className="glow-on-hover mb-8 p-8 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20 shadow-lg animate-fadeInUp animate-delay-400">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            4. Refund Processing
          </h2>
          <ul className="space-y-3 text-lg text-gray-700 dark:text-gray-300">
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 mr-3 mt-1">•</span>
              <span>Refunds are processed within 5-10 business days after claim approval</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 mr-3 mt-1">•</span>
              <span>Refunds are issued to the original payment method used for booking</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 mr-3 mt-1">•</span>
              <span>Bank processing times may add an additional 3-5 business days</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 mr-3 mt-1">•</span>
              <span>You will receive email notifications at each stage of the refund process</span>
            </li>
          </ul>
        </section>

        {/* Non-Refundable Items */}
        <section className="glow-on-hover mb-8 p-8 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20 shadow-lg">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            5. Non-Refundable Items
          </h2>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
            The following are typically non-refundable:
          </p>
          <ul className="space-y-3 text-lg text-gray-700 dark:text-gray-300">
            <li className="flex items-start">
              <span className="text-red-600 dark:text-red-400 mr-3 mt-1">✗</span>
              <span>Promotional or discounted tickets (unless specified otherwise)</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-600 dark:text-red-400 mr-3 mt-1">✗</span>
              <span>Special event or holiday service tickets</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-600 dark:text-red-400 mr-3 mt-1">✗</span>
              <span>Processing and convenience fees</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-600 dark:text-red-400 mr-3 mt-1">✗</span>
              <span>Third-party add-ons (insurance, seat selection fees)</span>
            </li>
          </ul>
        </section>

        {/* How to Request */}
        <section className="glow-on-hover mb-8 p-8 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20 shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            6. How to Request a Refund
          </h2>
          <ol className="space-y-3 text-lg text-gray-700 dark:text-gray-300 list-decimal list-inside">
            <li>Log in to your BusSure account or access your booking via email confirmation</li>
            <li>Navigate to the "Refund" section and select the booking you wish to cancel</li>
            <li>Complete the refund request form with reason for cancellation</li>
            <li>Submit any required supporting documentation</li>
            <li>Track your claim status through your dashboard</li>
          </ol>
        </section>

        {/* Dispute Resolution */}
        <section className="glow-on-hover mb-8 p-8 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20 shadow-lg">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            7. Dispute Resolution
          </h2>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            If you disagree with a refund decision, you may file an appeal within 14 days of the 
            decision. Appeals should be submitted through your account dashboard with any additional 
            supporting evidence. Our review team will respond within 5 business days.
          </p>
        </section>

        {/* Policy Updates */}
        <section className="glow-on-hover mb-8 p-8 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20 shadow-lg">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            8. Policy Updates
          </h2>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            These policies may be updated periodically to reflect changes in regulations or operator 
            requirements. Material changes will be communicated via email to registered users. 
            Continued use of the platform after policy updates constitutes acceptance of the revised terms.
          </p>
        </section>

        {/* Contact CTA */}
        <section className="glow-on-hover p-8 bg-gradient-to-r from-blue-600/20 to-violet-600/20 dark:from-blue-900/30 dark:to-violet-900/30 backdrop-blur-sm rounded-xl border border-blue-500/30 dark:border-blue-700/30 shadow-lg">
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            <span className="font-semibold text-gray-900 dark:text-white">Questions about our policies?</span> Contact our support team at{" "}
            <a 
              href="mailto:support@bussure.com" 
              className="text-blue-600 dark:text-blue-400 hover:underline transition-all"
            >
              support@bussure.com
            </a> or call 1-800-BUS-SURE for clarification.
          </p>
        </section>
      </div>
    </main>
  );
}
