import React, { useState, useEffect } from 'react';
import { PlusCircle, X } from 'lucide-react';
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

interface TemplateManagerProps {
  template: Template | null;
  onSave: (template: Omit<Template, 'id'>) => void;
  onCancel: () => void;
}

const TemplateManager: React.FC<TemplateManagerProps> = ({ template, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Template, 'id'>>({
    name: '',
    description: '',
    content: '',
    platform: 'twitter'
  });

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        description: template.description,
        content: template.content,
        platform: template.platform
      });
    }
  }, [template]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {template ? 'Edit Template' : 'Add New Template'}
        </h2>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Template Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <textarea
          name="content"
          placeholder="Template Content"
          value={formData.content}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded h-32 resize-none"
          required
        />
        <select
          name="platform"
          value={formData.platform}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="twitter">Twitter</option>
          <option value="facebook">Facebook</option>
          <option value="instagram">Instagram</option>
          <option value="linkedin">LinkedIn</option>
        </select>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
          >
            <PlusCircle size={20} className="mr-2" />
            {template ? 'Update' : 'Save'} Template
          </button>
        </div>
      </form>
    </div>
  );
};

export default TemplateManager;