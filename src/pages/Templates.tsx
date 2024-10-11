import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit2, Trash2, Search, AlertCircle, Zap, Filter } from 'lucide-react';
import { auth } from '../firebaseConfig';
import axios from 'axios';
import { showErrorToast, showSuccessToast } from '../utils/toast';
import LoadingSpinner from '../components/LoadingSpinner';
import TemplateManager from '../components/TemplateManager';
import TrendingTopics from '../components/TrendingTopics';
import ContentCreationResources from '../components/ContentCreationResources';
import UserRecommendations from '../components/UserRecommendations';

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
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [predefinedTemplatesError, setPredefinedTemplatesError] = useState<string | null>(null);
  const [randomIdea, setRandomIdea] = useState<string | null>(null);

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
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 403) {
          showErrorToast('You do not have permission to access templates. Please log in or check your account status.');
        } else if (err.response?.status === 500) {
          showErrorToast('Server error occurred while fetching templates. Please try again later.');
        } else {
          showErrorToast(`Failed to fetch templates: ${err.message}`);
        }
      } else {
        showErrorToast('An unexpected error occurred while fetching templates.');
      }
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
      setPredefinedTemplatesError(null);
    } catch (err) {
      console.error('Error fetching predefined templates:', err);
      if (axios.isAxiosError(err)) {
        setPredefinedTemplatesError(`Failed to fetch predefined templates: ${err.message}`);
      } else {
        setPredefinedTemplatesError('An unexpected error occurred while fetching predefined templates.');
      }
    }
  };

  const handleAddTemplate = async (templateData: Omit<Template, 'id'>) => {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      await axios.post(`${API_URL}/api/templates`, templateData, {
        headers: { 'Authorization': `Bearer ${idToken}` }
      });
      await fetchTemplates();
      setIsAdding(false);
      showSuccessToast('Template added successfully!');
    } catch (err) {
      console.error('Error adding template:', err);
      showErrorToast('Failed to add template. Please try again.');
    }
  };

  const handleEditTemplate = async (templateData: Template) => {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      await axios.put(`${API_URL}/api/templates/${templateData.id}`, templateData, {
        headers: { 'Authorization': `Bearer ${idToken}` }
      });
      await fetchTemplates();
      setIsEditing(false);
      setEditingTemplate(null);
      showSuccessToast('Template updated successfully!');
    } catch (err) {
      console.error('Error updating template:', err);
      showErrorToast('Failed to update template. Please try again.');
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      await axios.delete(`${API_URL}/api/templates/${id}`, {
        headers: { 'Authorization': `Bearer ${idToken}` }
      });
      await fetchTemplates();
      showSuccessToast('Template deleted successfully!');
    } catch (err) {
      console.error('Error deleting template:', err);
      showErrorToast('Failed to delete template. Please try again.');
    }
  };

  const filteredTemplates = templates.filter(template =>
    (template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterPlatform === 'all' || template.platform === filterPlatform)
  );

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

  const generateRandomIdea = () => {
    if (predefinedTemplates.length > 0) {
      const randomTemplate = predefinedTemplates[Math.floor(Math.random() * predefinedTemplates.length)];
      const randomTrend = document.querySelector('.trend-card__list li a')?.textContent || 'trending topic';
      const idea = `${randomTemplate.name} about ${randomTrend}`;
      setRandomIdea(idea);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Content Templates</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <div className="relative w-full md:w-auto mb-4 md:mb-0">
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full md:w-64 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={filterPlatform}
                  onChange={(e) => setFilterPlatform(e.target.value)}
                  className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Platforms</option>
                  <option value="twitter">Twitter</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
                <button
                  onClick={() => setIsAdding(true)}
                  className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
                >
                  <PlusCircle className="mr-2" size={20} />
                  Add Template
                </button>
              </div>
            </div>

            {(isAdding || isEditing) && (
              <TemplateManager
                template={isEditing ? editingTemplate : null}
                onSave={(templateData) => {
                  if (isEditing && editingTemplate) {
                    handleEditTemplate({ ...templateData, id: editingTemplate.id });
                  } else {
                    handleAddTemplate(templateData);
                  }
                }}
                onCancel={() => {
                  setIsAdding(false);
                  setIsEditing(false);
                  setEditingTemplate(null);
                }}
              />
            )}

            <h2 className="text-2xl font-semibold mb-4">Your Custom Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTemplates.map(template => (
                <div key={template.id} className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
                  <p className="text-gray-600 mb-4">{template.description}</p>
                  <div className="mb-4 text-sm text-gray-500 overflow-hidden" style={{maxHeight: '100px'}}>
                    {template.content}
                  </div>
                  {renderPreview(template.content, template.platform)}
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setEditingTemplate(template);
                      }}
                      className="text-blue-500 hover:text-blue-600 mr-2"
                    >
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

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Predefined Templates</h2>
            {predefinedTemplatesError ? (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
                <div className="flex items-center">
                  <AlertCircle className="mr-2" size={20} />
                  <p>{predefinedTemplatesError}</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {predefinedTemplates.map(template => (
                  <div key={template.id} className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                    <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
                    <p className="text-gray-600 mb-2 text-sm">{template.description}</p>
                    <div className="text-xs text-gray-500 mb-2 overflow-hidden" style={{maxHeight: '60px'}}>
                      {template.content}
                    </div>
                    {renderPreview(template.content, template.platform)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-8">
          <TrendingTopics />
          <ContentCreationResources />
          <UserRecommendations />
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Zap className="mr-2" />
              Random Content Idea
            </h2>
            <button
              onClick={generateRandomIdea}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 mb-4"
            >
              Generate Idea
            </button>
            {randomIdea && (
              <p className="bg-yellow-100 p-4 rounded-lg">{randomIdea}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Templates;