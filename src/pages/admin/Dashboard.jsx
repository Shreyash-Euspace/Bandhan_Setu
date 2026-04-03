import { useState, useEffect } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 1248,
    activeRequests: 45,
    pendingApprovals: 12,
    completedMatches: 89,
    monthlyGrowth: 23,
    approvalRate: 78
  });

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, action: "New registration", user: "Priya Sharma", time: "2 minutes ago", type: "user" },
    { id: 2, action: "Request approved", user: "Rahul Verma", time: "15 minutes ago", type: "approval" },
    { id: 3, action: "Profile updated", user: "Anjali Patel", time: "1 hour ago", type: "update" },
    { id: 4, action: "New request submitted", user: "Vikram Singh", time: "3 hours ago", type: "request" },
    { id: 5, action: "Document verified", user: "Meera Nair", time: "5 hours ago", type: "verification" },
  ]);

  const [monthlyData, setMonthlyData] = useState([
    { month: "Jan", requests: 65, approvals: 45 },
    { month: "Feb", requests: 72, approvals: 52 },
    { month: "Mar", requests: 85, approvals: 63 },
    { month: "Apr", requests: 78, approvals: 58 },
    { month: "May", requests: 92, approvals: 71 },
    { month: "Jun", requests: 88, approvals: 68 },
  ]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening with your matrimony platform.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-red-700 text-white rounded-lg text-sm font-semibold hover:bg-red-800 transition-all duration-200 shadow-sm hover:shadow-md">
            Download Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Users */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.totalUsers.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Total Users</p>
        </div>

        {/* Active Requests */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">+5%</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.activeRequests}</p>
          <p className="text-xs text-gray-500 mt-1">Active Requests</p>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full">+3</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.pendingApprovals}</p>
          <p className="text-xs text-gray-500 mt-1">Pending Approvals</p>
        </div>

        {/* Completed Matches */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">+18%</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.completedMatches}</p>
          <p className="text-xs text-gray-500 mt-1">Completed Matches</p>
        </div>

        {/* Approval Rate */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">+5%</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.approvalRate}%</p>
          <p className="text-xs text-gray-500 mt-1">Approval Rate</p>
        </div>
      </div>

      {/* Charts Section */}
      

      {/* Quick Actions */}
      
    </div>
  );
}