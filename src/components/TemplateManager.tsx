import React, { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import axios from 'axios';
import { showErrorToast } from '../utils/toast';

const API_URL = import.meta.env.VITE_API_URL;

interface Template {
  id: string;
  name: string;
  content: string;
  platform: string;
}

const TemplateManager: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [newTemplate, setNewTemplate] = useState({ name: '', content: '', platform: 'twitter' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const idToken = await auth.currentUser?.getIdToken();
      console.log('Fetching templates from:', `${API_URL}/api/templates`);
      const response = await axios.get(`${API_URL}/api/templates`, {
        headers: { 'Authorization': `Bearer ${idToken}` }
      });
      console.log('Templates response:', response.data);
      setTemplates(response.data.templates);
    } catch (err) {
      console.error('Error fetching templates:', err);
      if (axios.isAxiosError(err)) {
        console.error('Axios error details:', err.response?.data);
      }
      setError('Failed to fetch templates');
      showErrorToast('Failed to fetch templates. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const createTemplate = async () => {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const response = await fetch(`${API_URL}/api/templates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify(newTemplate)
      });
      if (!response.ok) throw new Error('Failed to create template');
      await fetchTemplates();
      setNewTemplate({ name: '', content: '', platform: 'twitter' });
    } catch (err) {
      setError('Failed to create template');
      console.error(err);
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const response = await fetch(`${API_URL}/api/templates/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${idToken}` }
      });
      if (!response.ok) throw new Error('Failed to delete template');
      await fetchTemplates();
    } catch (err) {
      setError('Failed to delete template');
      console.error(err);
    }
  };

  if (isLoading) return <div>Loading templates...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Template Manager</h2>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Create New Template</h3>
        <input
          type="text"
          placeholder="Template Name"
          value={newTemplate.name}
          onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
          className="w-full p-2 mb-2 border rounded"
        />
        <textarea
          placeholder="Template Content"
          value={newTemplate.content}
          onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
          className="w-full p-2 mb-2 border rounded"
          rows={4}
        />
        <select
          value={newTemplate.platform}
          onChange={(e) => setNewTemplate({...newTemplate, platform: e.target.value})}
          className="w-full p-2 mb-2 border rounded"
        >
          <option value="twitter">Twitter</option>
          <option value="facebook">Facebook</option>
          <option value="instagram">Instagram</option>
          <option value="linkedin">LinkedIn</option>
        </select>
        <button
          onClick={createTemplate}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Template
        </button>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Your Templates</h3>
        {templates.map((template) => (
          <div key={template.id} className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h4 className="text-lg font-semibold">{template.name}</h4>
            <p className="text-gray-600 mb-2">Platform: {template.platform}</p>
            <p className="mb-2">{template.content}</p>
            <button
              onClick={() => deleteTemplate(template.id)}
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateManager;