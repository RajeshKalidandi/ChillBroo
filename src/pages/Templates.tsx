import React, { useState } from 'react'
import { PlusCircle, Edit2, Trash2 } from 'lucide-react'

interface Template {
  id: number;
  name: string;
  description: string;
  content: string;
}

const Templates: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([
    { id: 1, name: 'Product Launch', description: 'Announce a new product', content: 'Exciting news! We\'re thrilled to announce the launch of our latest product, [Product Name]. [Brief description]. Visit our website to learn more and be among the first to experience it!' },
    { id: 2, name: 'Weekly Tip', description: 'Share a helpful tip', content: 'Here\'s your #WeeklyTip: [Insert tip here]. How do you implement this in your daily routine? Share your thoughts in the comments!' },
    { id: 3, name: 'Customer Spotlight', description: 'Highlight a customer success story', content: 'Customer Spotlight: [Customer Name] achieved [specific result] using our [product/service]. Learn how they did it: [link] #CustomerSuccess' },
  ])

  const [newTemplate, setNewTemplate] = useState({ name: '', description: '', content: '' })
  const [isAdding, setIsAdding] = useState(false)

  const handleAddTemplate = () => {
    if (newTemplate.name && newTemplate.description && newTemplate.content) {
      setTemplates([...templates, { ...newTemplate, id: Date.now() }])
      setNewTemplate({ name: '', description: '', content: '' })
      setIsAdding(false)
    }
  }

  const handleDeleteTemplate = (id: number) => {
    setTemplates(templates.filter(template => template.id !== id))
  }

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map(template => (
          <div key={template.id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
            <p className="text-gray-600 mb-4">{template.description}</p>
            <p className="text-sm text-gray-500 mb-4">{template.content.substring(0, 100)}...</p>
            <div className="flex justify-end">
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