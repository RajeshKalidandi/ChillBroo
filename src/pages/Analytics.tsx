import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ContentAnalytics {
  platform: string;
  count: number;
}

const Analytics: React.FC = () => {
  const [contentAnalytics, setContentAnalytics] = useState<ContentAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data, error } = await supabase
        .from('generated_content')
        .select('platform')
        .eq('user_id', userData.user.id);

      if (error) throw error;

      const analytics = data.reduce((acc: ContentAnalytics[], item) => {
        const existingPlatform = acc.find(a => a.platform === item.platform);
        if (existingPlatform) {
          existingPlatform.count++;
        } else {
          acc.push({ platform: item.platform, count: 1 });
        }
        return acc;
      }, []);

      setContentAnalytics(analytics);
    } catch (err) {
      setError('Failed to fetch analytics');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading analytics...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Content Analytics</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
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
    </div>
  );
};

export default Analytics;