import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserSettings } from '../../pages/Settings';

interface NotificationSectionProps {
  settings: UserSettings;
  onUpdate: (updatedSettings: Partial<UserSettings>) => Promise<void>;
}

const NotificationSection: React.FC<NotificationSectionProps> = ({ settings, onUpdate }) => {
  const { t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    onUpdate({
      notificationPreferences: {
        ...settings.notificationPreferences,
        [name]: checked,
      },
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{t('settings.notifications')}</h2>
      <div className="space-y-2">
        {Object.entries(settings.notificationPreferences).map(([key, value]) => (
          <label key={key} className="flex items-center">
            <input
              type="checkbox"
              name={key}
              checked={value}
              onChange={handleChange}
              className="mr-2"
            />
            {t(`settings.notifications.${key}`)}
          </label>
        ))}
      </div>
    </div>
  );
};

export default NotificationSection;