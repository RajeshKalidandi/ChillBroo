import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import PageTransition from '../components/PageTransition';
import LoadingSpinner from '../components/LoadingSpinner';

interface ContentAnalytics {
  platform: string;
  count: number;
}

interface DailyAnalytics {
  date: string;
  count: number;
}

const Analytics: React.FC = () => {
  const [contentAnalytics, setContentAnalytics] = useState<ContentAnalytics[]>([]);
  const [dailyAnalytics, setDailyAnalytics] = useState<DailyAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user found');
      }

      const contentRef = collection(db, 'generated_content');
      const q = query(contentRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);

      const analytics: ContentAnalytics[] = [];
      const dailyData: { [key: string]: number } = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Platform analytics
        const existingPlatform = analytics.find(a => a.platform === data.platform);
        if (existingPlatform) {
          existingPlatform.count++;
        } else {
          analytics.push({ platform: data.platform, count: 1 });
        }

        // Daily analytics
        const date = new Date(data.createdAt.toDate()).toISOString().split('T')[0];
        dailyData[date] = (dailyData[date] || 0) + 1;
      });

      setContentAnalytics(analytics);
      setDailyAnalytics(Object.entries(dailyData).map(([date, count]) => ({ date, count })));
    } catch (err) {
      setError('Failed to fetch analytics');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-4">Content Analytics</h1>
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Content Generation by Platform</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={contentAnalytics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="platform" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Daily Content Generation</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyAnalytics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </PageTransition>
  );
};

export default Analytics;