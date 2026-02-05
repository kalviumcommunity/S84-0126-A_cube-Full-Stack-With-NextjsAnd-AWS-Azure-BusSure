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
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl dark:border dark:bg-gray-900 dark:border-gray-700">
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 md:text-3xl dark:text-white">
              Transparent Refund Request
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Share your journey details and reason for refund. Your request will be
              logged transparently and sent to an agent for review.
            </p>
          </div>

          {error && (
            <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400">
              {success}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                  Your name
                </label>
                <input
                  type="text"
                  value={userName}
                  disabled
                  className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                  Email
                </label>
                <input
                  type="email"
                  value={userEmail}
                  disabled
                  className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="busRegistrationNumber" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                  Bus registration number
                </label>
                <input
                  id="busRegistrationNumber"
                  name="busRegistrationNumber"
                  type="text"
                  required
                  value={formData.busRegistrationNumber}
                  onChange={handleChange}
                  placeholder="e.g. MH12AB1234"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="busOperator" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                  Bus operator / company
                </label>
                <input
                  id="busOperator"
                  name="busOperator"
                  type="text"
                  value={formData.busOperator}
                  onChange={handleChange}
                  placeholder="e.g. XYZ Travels"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="journeyDate" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                  Journey date
                </label>
                <input
                  id="journeyDate"
                  name="journeyDate"
                  type="date"
                  required
                  value={formData.journeyDate}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="fromCity" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                  From city
                </label>
                <input
                  id="fromCity"
                  name="fromCity"
                  type="text"
                  required
                  value={formData.fromCity}
                  onChange={handleChange}
                  placeholder="e.g. Mumbai"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="toCity" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                  To city
                </label>
                <input
                  id="toCity"
                  name="toCity"
                  type="text"
                  required
                  value={formData.toCity}
                  onChange={handleChange}
                  placeholder="e.g. Pune"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ticketNumber" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                  Ticket / booking reference
                </label>
                <input
                  id="ticketNumber"
                  name="ticketNumber"
                  type="text"
                  required
                  value={formData.ticketNumber}
                  onChange={handleChange}
                  placeholder="e.g. PNR123456"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="amountPaid" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                  Amount paid (in your currency)
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
                  placeholder="e.g. 1200.00"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reason" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                What happened? (reason for refund)
              </label>
              <textarea
                id="reason"
                name="reason"
                required
                rows={4}
                value={formData.reason}
                onChange={handleChange}
                placeholder="Describe delays, cancellations, service issues, or policy reasons for your refund request."
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit refund request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
