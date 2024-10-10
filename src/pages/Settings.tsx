import React, { useState } from 'react'
import { Save, RefreshCw } from 'lucide-react'

interface UserSettings {
  fullName: string;
  email: string;
  notificationsEnabled: boolean;
  darkModeEnabled: boolean;
  language: string;
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    notificationsEnabled: true,
    darkModeEnabled: false,
    language: 'en',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // TODO: Implement API call to save settings
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulating API call
    setIsLoading(false)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={settings.fullName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={settings.email}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notificationsEnabled"
                name="notificationsEnabled"
                checked={settings.notificationsEnabled}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <label htmlFor="notificationsEnabled" className="ml-2 block text-sm text-gray-900">
                Enable notifications
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="darkModeEnabled"
                name="darkModeEnabled"
                checked={settings.darkModeEnabled}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <label htmlFor="darkModeEnabled" className="ml-2 block text-sm text-gray-900">
                Enable dark mode
              </label>
            </div>
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700">Language</label>
              <select
                id="language"
                name="language"
                value={settings.language}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4">
          {isSaved && (
            <span className="text-green-600 font-medium">Settings saved successfully!</span>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Saving...
              </>
            ) : (
              <>
                <Save className="-ml-1 mr-2 h-5 w-5" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Settings