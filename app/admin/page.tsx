"use client"

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { useApi } from '@/hooks/use-api';
import { useRouter } from 'next/navigation';
import { Student, Admin } from '@/app/types';

// Define Activity type for the recent activity data
interface Activity {
  id: number;
  student: string;
  timestamp: string;
  action: string;
  result: string;
}

const AdminDashboard = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalStudents: 0,
    verifiedToday: 0,
    failedAttempts: 0,
    avgScanTime: 0
  });
  const [adminName, setAdminName] = useState('Admin User');
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const { getStudents, getDashboardStats, getAdminProfile } = useApi();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch dashboard stats
        const statsData = await getDashboardStats();
        setStats({
          totalStudents: statsData.total_students,
          verifiedToday: statsData.verified_today,
          failedAttempts: statsData.failed_attempts,
          avgScanTime: statsData.avg_scan_time
        });
        
        // Fetch students data
        const studentsData = await getStudents();
        setStudents(studentsData);
        
        // Generate recent activity (placeholder for now)
        const recentActivityData = generateRecentActivity(studentsData);
        setRecentActivity(recentActivityData);
        
        // Fetch admin profile
        const adminData = await getAdminProfile();
        if (adminData.firstName && adminData.lastName) {
          setAdminName(`${adminData.firstName} ${adminData.lastName}`);
        } else if (adminData.email) {
          setAdminName(adminData.email);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchData();
  }, [getStudents, getDashboardStats, getAdminProfile]);

  // Generate placeholder recent activity data
  const generateRecentActivity = (students: Student[]): Activity[] => {
    if (!students || students.length === 0) {
      return [];
    }
    
    const activities = [
      { action: 'logged in', result: 'success' },
      { action: 'logged in', result: 'failed' },
      { action: 'registered', result: 'success' }
    ];
    
    return students.slice(0, 5).map((student, index) => ({
      id: index,
      student: student?.email || student?.matricNumber || 'Unknown Student',
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      ...activities[Math.floor(Math.random() * activities.length)]
    }));
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-medium">Loading dashboard...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-lg font-medium text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
    <div>
        <h1 className="text-3xl font-bold">Welcome, {adminName}!</h1>
        <p className="text-gray-500">Here's what's happening in your system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalStudents}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Verified Today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.verifiedToday}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Failed Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.failedAttempts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg. Scan Time</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.avgScanTime.toFixed(1)}s</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => router.push('/admin/students/add')}>Add Student</Button>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left font-medium text-gray-500">Student</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500">Action</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500">Result</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <tr key={activity.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{activity.student}</td>
                    <td className="px-4 py-2">{activity.action}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        activity.result === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {activity.result}
                      </span>
                </td>
                    <td className="px-4 py-2">{new Date(activity.timestamp).toLocaleString()}</td>
              </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-center text-gray-500">No recent activity</td>
              </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

