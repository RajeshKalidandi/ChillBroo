import React, { useState, useEffect } from 'react'
import { PlusCircle, Edit2, Trash2 } from 'lucide-react'
import { auth } from '../firebaseConfig';
import axios from 'axios';
import { showErrorToast } from '../utils/toast';

const API_URL = import.meta.env.VITE_API_URL;

interface Template {
  id: string;
  name: string;
  description: string;
  content: string;
  platform: string;
}

const Templates: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [predefinedTemplates, setPredefinedTemplates] = useState<Template[]>([]);
  const [newTemplate, setNewTemplate] = useState({ name: '', description: '', content: '', platform: 'twitter' });
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTemplates();
    fetchPredefinedTemplates();
  }, []);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const response = await axios.get(`${API_URL}/api/templates`, {
        headers: { 'Authorization': `Bearer ${idToken}` }
      });
      setTemplates(response.data.templates);
    } catch (err) {
      console.error('Error fetching templates:', err);
      showErrorToast('Failed to fetch templates. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPredefinedTemplates = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/content-frameworks`);
      setPredefinedTemplates(response.data.frameworks.map((framework: any) => ({
        id: framework.name,
        name: framework.name,
        description: framework.description,
        content: framework.structure,
        platform: 'all'
      })));
    } catch (err) {
      console.error('Error fetching predefined templates:', err);
      showErrorToast('Failed to fetch predefined templates. Please try again.');
    }
  };

  const handleAddTemplate = async () => {
    if (newTemplate.name && newTemplate.description && newTemplate.content) {
      try {
        const idToken = await auth.currentUser?.getIdToken();
        await axios.post(`${API_URL}/api/templates`, newTemplate, {
          headers: { 'Authorization': `Bearer ${idToken}` }
        });
        await fetchTemplates();
        setNewTemplate({ name: '', description: '', content: '', platform: 'twitter' });
        setIsAdding(false);
      } catch (err) {
        console.error('Error adding template:', err);
        showErrorToast('Failed to add template. Please try again.');
      }
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      await axios.delete(`${API_URL}/api/templates/${id}`, {
        headers: { 'Authorization': `Bearer ${idToken}` }
      });
      await fetchTemplates();
    } catch (err) {
      console.error('Error deleting template:', err);
      showErrorToast('Failed to delete template. Please try again.');
    }
  };

  const renderPreview = (content: string, platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitter':
        return (
          <div className="bg-blue-100 p-4 rounded-lg">
            <h3 className="font-bold text-blue-500">Twitter Preview</h3>
            <p className="mt-2">{content.slice(0, 280)}</p>
          </div>
        );
      case 'facebook':
        return (
          <div className="bg-indigo-100 p-4 rounded-lg">
            <h3 className="font-bold text-indigo-500">Facebook Preview</h3>
            <p className="mt-2">{content}</p>
          </div>
        );
      case 'instagram':
        return (
          <div className="bg-pink-100 p-4 rounded-lg">
            <h3 className="font-bold text-pink-500">Instagram Preview</h3>
            <p className="mt-2">{content}</p>
          </div>
        );
      case 'linkedin':
        return (
          <div className="bg-blue-200 p-4 rounded-lg">
            <h3 className="font-bold text-blue-700">LinkedIn Preview</h3>
            <p className="mt-2">{content}</p>
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-bold text-gray-700">Preview</h3>
            <p className="mt-2">{content}</p>
          </div>
        );
    }
  };

  if (isLoading) return <div>Loading templates...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-4">Content Templates</h1>
      
      <div className="flex justify-between items-center">
        <p className="text-gray-600">Manage your content templates here.</p>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          <PlusCircle className="mr-2" size={20} />
          Add Template
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Add New Template</h2>
          <input
            type="text"
            placeholder="Template Name"
            value={newTemplate.name}
            onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="text"
            placeholder="Description"
            value={newTemplate.description}
            onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
            className="w-full p-2 mb-2 border rounded"
          />
          <textarea
            placeholder="Template Content"
            value={newTemplate.content}
            onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
            className="w-full p-2 mb-4 border rounded h-32 resize-none"
          />
          <select
            value={newTemplate.platform}
            onChange={(e) => setNewTemplate({ ...newTemplate, platform: e.target.value })}
            className="w-full p-2 mb-4 border rounded"
          >
            <option value="twitter">Twitter</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
          </select>
          <div className="flex justify-end">
            <button
              onClick={handleAddTemplate}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mr-2"
            >
              Save
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4">Predefined Templates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {predefinedTemplates.map(template => (
          <div key={template.id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
            <p className="text-gray-600 mb-4">{template.description}</p>
            <p className="text-sm text-gray-500 mb-4">{template.content.substring(0, 100)}...</p>
            {renderPreview(template.content, template.platform)}
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mb-4">Your Custom Templates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map(template => (
          <div key={template.id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
            <p className="text-gray-600 mb-4">{template.description}</p>
            <p className="text-sm text-gray-500 mb-4">{template.content.substring(0, 100)}...</p>
            {renderPreview(template.content, template.platform)}
            <div className="flex justify-end mt-4">
              <button className="text-blue-500 hover:text-blue-600 mr-2">
                <Edit2 size={20} />
              </button>
              <button
                onClick={() => handleDeleteTemplate(template.id)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Templates