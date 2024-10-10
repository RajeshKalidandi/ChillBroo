import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserSettings } from '../../pages/Settings';
import { useForm } from 'react-hook-form';

interface ProfileSectionProps {
  settings: UserSettings;
  onUpdate: (updatedSettings: Partial<UserSettings>) => Promise<void>;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ settings, onUpdate }) => {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      displayName: settings.displayName,
    },
  });

  const onSubmit = (data: { displayName: string }) => {
    onUpdate({ displayName: data.displayName });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">{t('settings.profile')}</h2>
      <div>
        <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('settings.displayName')}
        </label>
        <input
          type="text"
          id="displayName"
          {...register('displayName', { required: t('errors.required'), minLength: { value: 2, message: t('errors.minLength', { count: 2 }) } })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        {errors.displayName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.displayName.message}</p>}
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('settings.email')}
        </label>
        <input
          type="email"
          id="email"
          value={settings.email}
          disabled
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
      >
        {t('common.save')}
      </button>
    </form>
  );
};

export default ProfileSection;