"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");

    if (token && userRaw) {
      try {
        const user = JSON.parse(userRaw);
        setIsAuthenticated(true);
        if (user?.name) setUserName(user.name);
      } catch {
        setIsAuthenticated(false);
        setUserName("");
      }
    } else {
      setIsAuthenticated(false);
      setUserName("");
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      setIsAuthenticated(false);
      setUserName("");
      router.push("/");
    }
  };

  return (
    <nav className="fixed w-full z-50 top-0 start-0 border-b border-white/5 bg-white/10 dark:bg-black/20 backdrop-blur-xl">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse group"
        >
          <span className="self-center text-2xl font-bold whitespace-nowrap dark:text-white bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-300">
            BusSure
          </span>
        </Link>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse items-center">
          {isAuthenticated ? (
            <>
              <span className="hidden md:inline text-sm text-gray-800 dark:text-gray-200 mr-2">
                Hi, {userName || "user"}
              </span>
              <Link href="/refund">
                <button className="text-white bg-gradient-to-r from-blue-600/80 to-violet-600/80 hover:from-blue-600 hover:to-violet-600 focus:ring-4 focus:outline-none focus:ring-blue-300/50 dark:focus:ring-blue-800/50 font-medium rounded-lg text-sm px-4 py-2 text-center me-2 mb-2 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] hover:scale-105 backdrop-blur-sm">
                  Transparent refund
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-900 bg-white/20 border border-white/20 focus:outline-none hover:bg-white/30 hover:border-white/40 focus:ring-4 focus:ring-blue-300/50 font-medium rounded-lg text-sm px-4 py-2 me-2 mb-2 dark:bg-gray-800/30 dark:text-white dark:border-gray-600/30 dark:hover:bg-gray-700/40 dark:hover:border-gray-600/50 dark:focus:ring-gray-700/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] dark:hover:shadow-[0_0_20px_rgba(156,163,175,0.3)] backdrop-blur-sm"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <button className="text-gray-900 bg-white/20 border border-white/20 focus:outline-none hover:bg-white/30 hover:border-white/40 focus:ring-4 focus:ring-blue-300/50 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800/30 dark:text-white dark:border-gray-600/30 dark:hover:bg-gray-700/40 dark:hover:border-gray-600/50 dark:focus:ring-gray-700/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] dark:hover:shadow-[0_0_20px_rgba(156,163,175,0.3)] backdrop-blur-sm">
                  Log in
                </button>
              </Link>
              <Link href="/signup">
                <button className="text-white bg-gradient-to-r from-blue-600/80 to-violet-600/80 hover:from-blue-600 hover:to-violet-600 focus:ring-4 focus:outline-none focus:ring-blue-300/50 dark:focus:ring-blue-800/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] hover:scale-105 backdrop-blur-sm">
                  Sign up
                </button>
              </Link>
            </>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100/20 focus:outline-none focus:ring-2 focus:ring-gray-200/50 dark:text-gray-400 dark:hover:bg-gray-700/30 dark:focus:ring-gray-600/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(156,163,175,0.4)] backdrop-blur-sm"
            aria-controls="navbar-sticky"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
            isOpen ? "block" : "hidden"
          }`}
          id="navbar-sticky"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100/20 rounded-lg bg-gray-50/10 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800/20 md:dark:bg-transparent dark:border-gray-700/20 backdrop-blur-sm">
            <li>
              <Link
                href="/"
                className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100/20 md:hover:bg-transparent md:hover:text-blue-600 md:p-0 md:dark:hover:text-blue-400 dark:text-white dark:hover:bg-gray-700/30 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] md:hover:scale-105"
                aria-current="page"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100/20 md:hover:bg-transparent md:hover:text-blue-600 md:p-0 md:dark:hover:text-blue-400 dark:text-white dark:hover:bg-gray-700/30 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] md:hover:scale-105"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/policies"
                className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100/20 md:hover:bg-transparent md:hover:text-blue-600 md:p-0 md:dark:hover:text-blue-400 dark:text-white dark:hover:bg-gray-700/30 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] md:hover:scale-105"
              >
                Policies
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100/20 md:hover:bg-transparent md:hover:text-blue-600 md:p-0 md:dark:hover:text-blue-400 dark:text-white dark:hover:bg-gray-700/30 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] md:hover:scale-105"
              >
                Dashboard
              </Link>
            </li>
            {isAuthenticated && (
              <li>
                <Link
                  href="/refund"
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100/20 md:hover:bg-transparent md:hover:text-blue-600 md:p-0 md:dark:hover:text-blue-400 dark:text-white dark:hover:bg-gray-700/30 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] md:hover:scale-105"
                >
                  Transparent refund
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
