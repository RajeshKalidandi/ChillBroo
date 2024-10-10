import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserSettings } from '../../pages/Settings';
import { useTheme } from '../../contexts/ThemeContext';

interface ThemeSectionProps {
  settings: UserSettings;
  onUpdate: (updatedSettings: Partial<UserSettings>) => Promise<void>;
}

const ThemeSection: React.FC<ThemeSectionProps> = ({ settings, onUpdate }) => {
  const { t } = useTranslation();
  const { setTheme } = useTheme();

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    onUpdate({ theme });
    setTheme(theme);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{t('settings.theme')}</h2>
      <div className="flex space-x-4">
        {['light', 'dark', 'system'].map((theme) => (
          <button
            key={theme}
            onClick={() => handleThemeChange(theme as 'light' | 'dark' | 'system')}
            className={`px-4 py-2 rounded-md ${
              settings.theme === theme
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            {t(`themes.${theme}`)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSection;