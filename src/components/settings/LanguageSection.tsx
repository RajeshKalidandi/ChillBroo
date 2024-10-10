import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserSettings } from '../../pages/Settings';

interface LanguageSectionProps {
  settings: UserSettings;
  onUpdate: (updatedSettings: Partial<UserSettings>) => Promise<void>;
}

const LanguageSection: React.FC<LanguageSectionProps> = ({ settings, onUpdate }) => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (language: string) => {
    onUpdate({ language });
    i18n.changeLanguage(language);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{t('settings.language')}</h2>
      <select
        value={settings.language}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        {Object.entries(t('languages', { returnObjects: true })).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSection;