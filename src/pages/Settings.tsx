import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import PageTransition from '../components/PageTransition';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import ProfileSection from '../components/settings/ProfileSection';
import NotificationSection from '../components/settings/NotificationSection';
import ThemeSection from '../components/settings/ThemeSection';
import LanguageSection from '../components/settings/LanguageSection';
import PrivacySection from '../components/settings/PrivacySection';

export interface UserSettings {
  displayName: string;
  email: string;
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  theme: 'light' | 'dark' | 'system';
  language: string;
  privacySettings: {
    profileVisibility: 'public' | 'private' | 'friends';
    activityVisibility: 'public' | 'private' | 'friends';
  };
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>({
    displayName: '',
    email: '',
    notificationPreferences: {
      email: true,
      push: true,
      sms: false,
    },
    theme: 'system',
    language: 'en',
    privacySettings: {
      profileVisibility: 'public',
      activityVisibility: 'friends',
    },
  });

  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      toast.error(t('errors.noUser'));
      return;
    }

    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data() as UserSettings;
        setSettings({
          ...userData,
          displayName: user.displayName || '',
          email: user.email || '',
        });
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [t]);

  const handleSettingsUpdate = async (updatedSettings: Partial<UserSettings>) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user found');

      if (updatedSettings.displayName) {
        await updateProfile(user, { displayName: updatedSettings.displayName });
      }

      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, updatedSettings);

      toast.success(t('settings.updateSuccess'));
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error(t('errors.updateFailed'));
    }
  };

  if (isLoading) {
    return <div>{t('common.loading')}</div>;
  }

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">{t('settings.title')}</h1>
        <div className="space-y-8">
          <ProfileSection settings={settings} onUpdate={handleSettingsUpdate} />
          <NotificationSection settings={settings} onUpdate={handleSettingsUpdate} />
          <ThemeSection settings={settings} onUpdate={handleSettingsUpdate} />
          <LanguageSection settings={settings} onUpdate={handleSettingsUpdate} />
          <PrivacySection settings={settings} onUpdate={handleSettingsUpdate} />
        </div>
      </div>
    </PageTransition>
  );
};

export default Settings;