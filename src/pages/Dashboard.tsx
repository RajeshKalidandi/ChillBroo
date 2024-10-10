import React from 'react'
import { Link } from 'react-router-dom'
import { Zap, FileText, BarChart2, TrendingUp, PenTool } from 'lucide-react'

const Dashboard: React.FC = () => {
  // Mock data for demonstration purposes
  const stats = {
    generatedContent: 42,
    activeTemplates: 7,
    engagementRate: '8.5%',
    trendingTopic: 'AI in Social Media'
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to ChillBroo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<FileText />} title="Generated Content" value={stats.generatedContent} />
        <StatCard icon={<Zap />} title="Active Templates" value={stats.activeTemplates} />
        <StatCard icon={<BarChart2 />} title="Avg. Engagement Rate" value={stats.engagementRate} />
        <StatCard icon={<TrendingUp />} title="Trending Topic" value={stats.trendingTopic} />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            title="Account Settings"
            description="Update your profile and preferences"
            linkTo="/settings"
            icon={<Zap className="w-6 h-6 text-purple-500" />}
          />
        </div>
      </div>
    </div>
  )
}

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number }> = ({ icon, title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <span className="text-blue-500">{icon}</span>
    </div>
    <p className="text-3xl font-bold text-gray-800">{value}</p>
  </div>
)

const QuickActionCard: React.FC<{ title: string; description: string; linkTo: string; icon: React.ReactNode }> = ({ title, description, linkTo, icon }) => (
  <Link to={linkTo} className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
    <div className="flex items-center mb-2">
      {icon}
      <h3 className="text-xl font-semibold ml-2 text-gray-800">{title}</h3>
    </div>
    <p className="text-gray-600">{description}</p>
  </Link>
)

export default Dashboard