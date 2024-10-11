import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Zap, FileText, BarChart2, TrendingUp, PenTool, Users, Settings } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { auth, db } from '../firebaseConfig';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { fetchWithCache } from '../utils/api'; // Import the fetchWithCache function
import SkeletonLoader from '../components/SkeletonLoader';
import { OptimizedImage } from '../components/OptimizedImage'; // Import the OptimizedImage component

const LazyTrendingTopics = lazy(() => import('../components/TrendingTopics'));

interface DashboardStats {
  generatedContent: number;
  activeTemplates: number;
  engagementRate: string;
  trendingTopics: string[];
}

const API_URL = import.meta.env.VITE_API_URL;

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    generatedContent: 0,
    activeTemplates: 0,
    engagementRate: '0%',
    trendingTopics: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user found');

      const [contentSnapshot, templateSnapshot] = await Promise.all([
        getDocs(query(collection(db, 'generated_content'), where('userId', '==', user.uid), limit(1000))),
        getDocs(query(collection(db, 'templates'), where('userId', '==', user.uid), limit(1000)))
      ]);

      const generatedContent = contentSnapshot.size;
      const activeTemplates = templateSnapshot.size;

      const engagementRate = ((generatedContent / (activeTemplates || 1)) * 100).toFixed(1) + '%';

      setStats(prevStats => ({
        ...prevStats,
        generatedContent,
        activeTemplates,
        engagementRate
      }));
      setIsLoading(false);

      // Fetch trending topics after initial load
      const trendingTopics = await fetchTrendingTopics();
      setStats(prevStats => ({ ...prevStats, trendingTopics }));
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setIsLoading(false);
    }
  };

  const fetchTrendingTopics = async (): Promise<string[]> => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user found');

      const idToken = await user.getIdToken();
      const response = await fetchWithCache(`${API_URL}/api/trending-topics`, {
        headers: { 'Authorization': `Bearer ${idToken}` }
      });
      return response.trendingTopics;
    } catch (error) {
      console.error('Error fetching trending topics:', error);
      return [];
    }
  };

  const MemoizedStatCards = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
      <StatCard icon={<FileText />} title="Generated Content" value={stats.generatedContent} />
      <StatCard icon={<Zap />} title="Active Templates" value={stats.activeTemplates} />
      <StatCard icon={<BarChart2 />} title="Avg. Engagement Rate" value={stats.engagementRate} />
      <StatCard icon={<TrendingUp />} title="Trending Topics" value={stats.trendingTopics.length} />
    </div>
  ), [stats]);

  const MemoizedQuickActions = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
      <QuickActionCard
        title="Generate New Content"
        description="Create fresh social media content with AI"
        linkTo="/generate"
        icon={<PenTool className="w-6 h-6 text-blue-500" />}
      />
      <QuickActionCard
        title="Manage Templates"
        description="View and edit your content templates"
        linkTo="/templates"
        icon={<FileText className="w-6 h-6 text-green-500" />}
      />
      <QuickActionCard
        title="Team Management"
        description="Manage your team and collaborators"
        linkTo="/team"
        icon={<Users className="w-6 h-6 text-purple-500" />}
      />
      <QuickActionCard
        title="Analytics"
        description="View detailed performance metrics"
        linkTo="/analytics"
        icon={<BarChart2 className="w-6 h-6 text-orange-500" />}
      />
      <QuickActionCard
        title="Social Media Integration"
        description="Connect and manage your social accounts"
        linkTo="/social-media-integration"
        icon={<TrendingUp className="w-6 h-6 text-pink-500" />}
      />
      <QuickActionCard
        title="Account Settings"
        description="Update your profile and preferences"
        linkTo="/settings"
        icon={<Settings className="w-6 h-6 text-gray-500" />}
      />
    </div>
  ), []);

  return (
    <PageTransition>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 py-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white animate-fade-in">Welcome to ChillBroo</h1>
          
          {isLoading ? <SkeletonLoader /> : (
            <>
              {MemoizedStatCards}

              <div className="mt-8 animate-fade-in">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Trending Topics</h2>
                <Suspense fallback={<div className="h-32 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"></div>}>
                  <LazyTrendingTopics topics={stats.trendingTopics} />
                </Suspense>
              </div>

              <div className="mt-8 animate-fade-in">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Quick Actions</h2>
                {MemoizedQuickActions}
              </div>
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number }> = ({ icon, title, value }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
      <span className="text-blue-500 dark:text-blue-400">{icon}</span>
    </div>
    <p className="text-3xl font-bold text-gray-800 dark:text-white">{value}</p>
  </div>
);

const QuickActionCard: React.FC<{ title: string; description: string; linkTo: string; icon: React.ReactNode }> = ({ title, description, linkTo, icon }) => (
  <Link to={linkTo} className="block bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
    <div className="flex items-center mb-2">
      {icon}
      <h3 className="text-xl font-semibold ml-2 text-gray-800 dark:text-white">{title}</h3>
    </div>
    <p className="text-gray-600 dark:text-gray-400">{description}</p>
  </Link>
);

export default Dashboard;