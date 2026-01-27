'use client';

import { useState, useEffect } from 'react';

interface DatabaseStatusResponse {
  success: boolean;
  message: string;
  timestamp?: string;
  error?: string;
}

export default function DatabaseStatus() {
  const [status, setStatus] = useState<DatabaseStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkDatabaseConnection();
  }, []);

  const checkDatabaseConnection = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/test-db');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      setStatus({
        success: false,
        message: 'Failed to check database connection',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span>Checking database connection...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 border rounded-lg ${
      status?.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
    }`}>
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${
          status?.success ? 'bg-green-500' : 'bg-red-500'
        }`}></div>
        <span className={`font-medium ${
          status?.success ? 'text-green-800' : 'text-red-800'
        }`}>
          Database Status
        </span>
      </div>
      <p className={`mt-2 text-sm ${
        status?.success ? 'text-green-700' : 'text-red-700'
      }`}>
        {status?.message}
      </p>
      {status?.timestamp && (
        <p className="mt-1 text-xs text-gray-500">
          Last checked: {new Date(status.timestamp).toLocaleString()}
        </p>
      )}
      {status?.error && (
        <p className="mt-1 text-xs text-red-600">
          Error: {status.error}
        </p>
      )}
      <button
        onClick={checkDatabaseConnection}
        className="mt-3 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Refresh
      </button>
    </div>
  );
}