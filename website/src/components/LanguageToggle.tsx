"use client";

import { useState } from "react";

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    // Add small delay for animation effect
    await new Promise((resolve) => setTimeout(resolve, 300));
    toggleLanguage();
    setIsLoading(false);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-full font-semibold
          transition-all duration-300 ease-out
          ${
            language === "TH"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-orange-600 text-white shadow-lg"
          }
          hover:shadow-xl hover:scale-105
          disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-offset-2
          ${
            language === "TH"
              ? "focus:ring-blue-500"
              : "focus:ring-orange-500"
          }
        `}
      >
        <span className="text-lg font-bold">
          {language === "TH" ? "🇹🇭" : "🇬🇧"}
        </span>
        <span className="min-w-[20px]">
          {isLoading ? (
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            language
          )}
        </span>
      </button>
    </div>
  );
}
