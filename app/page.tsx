"use client";

import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const exampleQueries = [
    "What's the weather in London?",
    "How many employees are there?",
    "What's the weather in San Francisco?",
    "How many employees are in the Engineering department?",
    "List all employees",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAnswer("");

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "An error occurred");
      } else {
        setAnswer(data.answer);
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <main className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800 dark:text-white">
          AI Routing System
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
          Ask me about weather or employee data
        </p>

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? "Processing..." : "Ask"}
            </button>
          </div>
        </form>

        {answer && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
            <p className="text-green-800 dark:text-green-200 font-medium">
              {answer}
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-800 dark:text-red-200 font-medium">
              Error: {error}
            </p>
          </div>
        )}

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Example Questions:
          </h2>
          <div className="flex flex-col gap-2">
            {exampleQueries.map((example, index) => (
              <button
                key={index}
                onClick={() => setQuery(example)}
                className="text-left text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                → {example}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
