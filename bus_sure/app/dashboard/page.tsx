'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface DashboardStats {
  totalPolicies: number;
  activeClaims: number;
  pendingClaims: number;
  totalCoverage: number;
}

interface ClaimListItem {
  id: number;
  claimNumber: string;
  amount: number;
  status: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  policy: {
    id: number;
    policyNumber: string;
  } | null;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [agentClaims, setAgentClaims] = useState<ClaimListItem[]>([]);
  const [claimsLoading, setClaimsLoading] = useState(false);
  const [claimsError, setClaimsError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (!token || !userData) {
        router.push('/login');
        return;
      }

      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Mock stats for now - you can replace with actual API calls
        setStats({
          totalPolicies: 3,
          activeClaims: 2,
          pendingClaims: 1,
          totalCoverage: 150
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Load pending claims for agents/admins so they can act on requests
  useEffect(() => {
    const loadAgentClaims = async () => {
      if (!user || (user.role !== 'AGENT' && user.role !== 'ADMIN')) return;

      try {
        setClaimsLoading(true);
        setClaimsError(null);

        const res = await fetch('/api/claims/optimized?status=PENDING&limit=20');
        const data = await res.json();

        if (!res.ok || !data.success) {
          setClaimsError(data.message || data.error || 'Failed to load claims');
          return;
        }

        const claims: ClaimListItem[] = data.data.claims || [];
        setAgentClaims(claims);
      } catch (err) {
        console.error('Failed to load agent claims', err);
        setClaimsError('Failed to load claims');
      } finally {
        setClaimsLoading(false);
      }
    };

    loadAgentClaims();
  }, [user]);

  const handleApproveClaim = async (claim: ClaimListItem) => {
    if (!user) return;

    try {
      setActionLoadingId(claim.id);
      setActionError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        setActionError('Session expired. Please log in again.');
        router.push('/login');
        return;
      }

      const res = await fetch('/api/claims/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          claimId: claim.id,
          approvedAmount: claim.amount,
          paymentMethod: 'BANK_TRANSFER',
          transactionId: undefined,
          processedBy: user.id,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setActionError(data.message || data.error || 'Failed to approve claim');
        return;
      }

      // Optimistically update list: remove approved claim from pending list
      setAgentClaims((prev) => prev.filter((c) => c.id !== claim.id));
    } catch (err) {
      console.error('Approve claim error', err);
      setActionError('Failed to approve claim');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectClaim = async (claim: ClaimListItem) => {
    if (!user) return;

    try {
      setActionLoadingId(claim.id);
      setActionError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        setActionError('Session expired. Please log in again.');
        router.push('/login');
        return;
      }

      const res = await fetch('/api/claims/optimized', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'bulkUpdate',
          data: {
            claimIds: [claim.id],
            newStatus: 'REJECTED',
            updatedBy: user.id,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setActionError(data.message || data.error || 'Failed to reject claim');
        return;
      }

      // Remove rejected claim from pending list
      setAgentClaims((prev) => prev.filter((c) => c.id !== claim.id));
    } catch (err) {
      console.error('Reject claim error', err);
      setActionError('Failed to reject claim');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                BusSure Dashboard
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Welcome back, {user.name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Role: {user.role}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Policies</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats?.totalPolicies || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Claims</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats?.activeClaims || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Claims</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats?.pendingClaims || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Coverage</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  { 150}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="text-gray-900 dark:text-white">File New Claim</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-gray-900 dark:text-white">View Policies</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-gray-900 dark:text-white">Update Profile</span>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">Policy renewed successfully</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">Claim under review</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">Document uploaded</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agent/Admin view: Pending refund/claim requests */}
        {user.role !== 'CUSTOMER' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Pending refund requests
              </h3>
              {claimsLoading && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Loading...
                </span>
              )}
            </div>

            {claimsError && (
              <div className="mb-4 p-3 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-900 dark:text-red-400">
                {claimsError}
              </div>
            )}

            {actionError && (
              <div className="mb-4 p-3 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-900 dark:text-red-400">
                {actionError}
              </div>
            )}

            {agentClaims.length === 0 && !claimsLoading ? (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No pending refund requests at the moment.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      <th className="py-2 pr-4">Claim #</th>
                      <th className="py-2 pr-4">Customer</th>
                      <th className="py-2 pr-4">Policy</th>
                      <th className="py-2 pr-4">Amount</th>
                      <th className="py-2 pr-4">Created</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agentClaims.map((claim) => (
                      <tr
                        key={claim.id}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50"
                      >
                        <td className="py-2 pr-4 text-gray-900 dark:text-gray-100">
                          {claim.claimNumber}
                        </td>
                        <td className="py-2 pr-4 text-gray-700 dark:text-gray-200">
                          <div className="flex flex-col">
                            <span>{claim.user?.name}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {claim.user?.email}
                            </span>
                          </div>
                        </td>
                        <td className="py-2 pr-4 text-gray-700 dark:text-gray-200">
                          {claim.policy?.policyNumber || '—'}
                        </td>
                        <td className="py-2 pr-4 text-gray-900 dark:text-gray-100">
                          ₹{claim.amount.toFixed(2)}
                        </td>
                        <td className="py-2 pr-4 text-gray-600 dark:text-gray-300">
                          {new Date(claim.createdAt).toLocaleString()}
                        </td>
                        <td className="py-2 pr-4">
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                            {claim.status}
                          </span>
                        </td>
                        <td className="py-2 pr-4 text-right space-x-2">
                          <button
                            onClick={() => handleApproveClaim(claim)}
                            disabled={actionLoadingId === claim.id}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoadingId === claim.id
                              ? 'Processing...'
                              : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleRejectClaim(claim)}
                            disabled={actionLoadingId === claim.id}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-red-600 border border-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
