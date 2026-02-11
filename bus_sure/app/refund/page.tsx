"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type RefundFormData = {
  busRegistrationNumber: string;
  busOperator: string;
  journeyDate: string;
  fromCity: string;
  toCity: string;
  ticketNumber: string;
  amountPaid: string;
  reason: string;
};

export default function TransparentRefundPage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [formData, setFormData] = useState<RefundFormData>({
    busRegistrationNumber: "",
    busOperator: "",
    journeyDate: "",
    fromCity: "",
    toCity: "",
    ticketNumber: "",
    amountPaid: "",
    reason: "",
  });

  // Simple auth guard based on token in localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");

    if (!token) {
      router.push("/login");
      return;
    }

    if (userRaw) {
      try {
        const user = JSON.parse(userRaw);
        if (user?.name) setUserName(user.name);
        if (user?.email) setUserEmail(user.email);
      } catch {
        // ignore parse errors
      }
    }
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Your session has expired. Please log in again.");
        router.push("/login");
        return;
      }

      const response = await fetch("/api/refunds/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || data.error || "Failed to submit refund request.");
        return;
      }

      setSuccess(
        "Your refund request has been submitted. Our agent will review it shortly."
      );
      setFormData({
        busRegistrationNumber: "",
        busOperator: "",
        journeyDate: "",
        fromCity: "",
        toCity: "",
        ticketNumber: "",
        amountPaid: "",
        reason: "",
      });
    } catch (err) {
      console.error("Refund submission error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-10 mx-auto min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-3xl bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl dark:bg-gray-900/90 dark:border dark:border-gray-800 animate-fadeInScale">
        <div className="p-8 md:p-10 space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-3 animate-fadeInUp">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent font-poppins">
              Request a Refund
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Fill in your journey details below. We'll review your request and get back to you soon.
            </p>
          </div>

          {error && (
            <div className="p-4 text-sm text-red-800 rounded-xl bg-red-50 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800 animate-shake">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {success && (
            <div className="p-4 text-sm text-green-800 rounded-xl bg-green-50 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800 animate-bounce-slow">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {success}
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Personal Info - Read Only */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeInUp animate-delay-100">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Your Name
                </label>
                <input
                  type="text"
                  value={userName}
                  disabled
                  className="bg-gray-100/50 border-0 text-gray-600 text-sm rounded-xl block w-full p-3.5 dark:bg-gray-800/50 dark:text-gray-400 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <input
                  type="email"
                  value={userEmail}
                  disabled
                  className="bg-gray-100/50 border-0 text-gray-600 text-sm rounded-xl block w-full p-3.5 dark:bg-gray-800/50 dark:text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Journey Details */}
            <div className="space-y-5 animate-fadeInUp animate-delay-200">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Journey Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="busRegistrationNumber" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Bus Registration Number
                  </label>
                  <input
                    id="busRegistrationNumber"
                    name="busRegistrationNumber"
                    type="text"
                    required
                    value={formData.busRegistrationNumber}
                    onChange={handleChange}
                    placeholder="MH12AB1234"
                    className="bg-white border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-3.5 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-500 dark:text-white transition-all duration-300"
                  />
                </div>
                <div>
                  <label htmlFor="busOperator" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Bus Operator
                  </label>
                  <input
                    id="busOperator"
                    name="busOperator"
                    type="text"
                    value={formData.busOperator}
                    onChange={handleChange}
                    placeholder="XYZ Travels"
                    className="bg-white border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-3.5 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-500 dark:text-white transition-all duration-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label htmlFor="journeyDate" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Journey Date
                  </label>
                  <input
                    id="journeyDate"
                    name="journeyDate"
                    type="date"
                    required
                    value={formData.journeyDate}
                    onChange={handleChange}
                    className="bg-white border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-3.5 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-all duration-300"
                  />
                </div>
                <div>
                  <label htmlFor="fromCity" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    From
                  </label>
                  <input
                    id="fromCity"
                    name="fromCity"
                    type="text"
                    required
                    value={formData.fromCity}
                    onChange={handleChange}
                    placeholder="Mumbai"
                    className="bg-white border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-3.5 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-500 dark:text-white transition-all duration-300"
                  />
                </div>
                <div>
                  <label htmlFor="toCity" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    To
                  </label>
                  <input
                    id="toCity"
                    name="toCity"
                    type="text"
                    required
                    value={formData.toCity}
                    onChange={handleChange}
                    placeholder="Pune"
                    className="bg-white border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-3.5 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-500 dark:text-white transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="space-y-5 animate-fadeInUp animate-delay-300">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Booking Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="ticketNumber" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ticket Reference
                  </label>
                  <input
                    id="ticketNumber"
                    name="ticketNumber"
                    type="text"
                    required
                    value={formData.ticketNumber}
                    onChange={handleChange}
                    placeholder="PNR123456"
                    className="bg-white border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-3.5 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-500 dark:text-white transition-all duration-300"
                  />
                </div>
                <div>
                  <label htmlFor="amountPaid" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Amount Paid
                  </label>
                  <input
                    id="amountPaid"
                    name="amountPaid"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.amountPaid}
                    onChange={handleChange}
                    placeholder="1200.00"
                    className="bg-white border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-3.5 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-500 dark:text-white transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Reason */}
            <div className="animate-fadeInUp animate-delay-400">
              <label htmlFor="reason" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Reason for Refund
              </label>
              <textarea
                id="reason"
                name="reason"
                required
                rows={5}
                value={formData.reason}
                onChange={handleChange}
                placeholder="Please describe what happened - delays, cancellations, service issues, or other reasons..."
                className="bg-white border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-4 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-500 dark:text-white transition-all duration-300 resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 focus:ring-4 focus:outline-none focus:ring-blue-300/50 font-semibold rounded-xl text-base px-6 py-4 text-center dark:focus:ring-blue-800/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:shadow-blue-500/30 transform hover:scale-[1.02] active:scale-[0.98] animate-fadeInUp animate-delay-400"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="animate-pulse">Processing your request...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Submit Refund Request
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
