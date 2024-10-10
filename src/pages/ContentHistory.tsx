import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface Content {
  id: string;
  content: string;
  platform: string;
  created_at: string;
}

const ContentHistory: React.FC = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const { data, error } = await supabase
        .from('generated_content')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContents(data || []);
    } catch (err) {
      setError('Failed to fetch content history');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Content History</h1>
      {contents.length === 0 ? (
        <p>No content generated yet.</p>
      ) : (
        <ul className="space-y-4">
          {contents.map((content) => (
            <li key={content.id} className="bg-white p-4 rounded shadow">
              <p className="text-sm text-gray-500 mb-1">
                Platform: {content.platform} | Created: {new Date(content.created_at).toLocaleString()}
              </p>
              <p>{content.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ContentHistory;