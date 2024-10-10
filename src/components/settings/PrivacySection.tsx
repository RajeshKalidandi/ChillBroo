import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserSettings } from '../../pages/Settings';

interface PrivacySectionProps {
  settings: UserSettings;
  onUpdate: (updatedSettings: Partial<UserSettings>) => Promise<void>;
}

const PrivacySection: React.FC<PrivacySectionProps> = ({ settings, onUpdate }) => {
  const { t } = useTranslation();

  const handlePrivacyChange = (setting: 'profileVisibility' | 'activityVisibility', value: 'public' | 'private' | 'friends') => {
    onUpdate({
      privacySettings: {
        ...settings.privacySettings,
        [setting]: value,
      },
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{t('settings.privacy')}</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('privacy.profileVisibility')}</label>
          <select
            value={settings.privacySettings.profileVisibility}
            onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value as 'public' | 'private' | 'friends')}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="public">{t('privacy.public')}</option>
            <option value="private">{t('privacy.private')}</option>
            <option value="friends">{t('privacy.friends')}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('privacy.activityVisibility')}</label>
          <select
            value={settings.privacySettings.activityVisibility}
            onChange={(e) => handlePrivacyChange('activityVisibility', e.target.value as 'public' | 'private' | 'friends')}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="public">{t('privacy.public')}</option>
            <option value="private">{t('privacy.private')}</option>
            <option value="friends">{t('privacy.friends')}</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default PrivacySection;