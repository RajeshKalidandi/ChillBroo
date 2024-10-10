import React from 'react';
import { Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';

interface SocialMediaPreviewProps {
  platform: string;
  content: string;
}

const SocialMediaPreview: React.FC<SocialMediaPreviewProps> = ({ platform, content }) => {
  const renderIcon = () => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="text-blue-400" />;
      case 'facebook':
        return <Facebook className="text-blue-600" />;
      case 'instagram':
        return <Instagram className="text-pink-500" />;
      case 'linkedin':
        return <Linkedin className="text-blue-700" />;
      default:
        return null;
    }
  };

  const getPreviewStyle = () => {
    switch (platform) {
      case 'twitter':
        return 'bg-blue-50 border-blue-200';
      case 'facebook':
        return 'bg-blue-100 border-blue-300';
      case 'instagram':
        return 'bg-pink-50 border-pink-200';
      case 'linkedin':
        return 'bg-blue-50 border-blue-300';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`border ${getPreviewStyle()} rounded-lg p-4 mt-4`}>
      <div className="flex items-center mb-2">
        {renderIcon()}
        <span className="ml-2 font-semibold capitalize">{platform} Preview</span>
      </div>
      <p className="text-sm">
        {platform === 'twitter' ? content.slice(0, 280) : content}
        {platform === 'twitter' && content.length > 280 && '...'}
      </p>
    </div>
  );
};

export default SocialMediaPreview;