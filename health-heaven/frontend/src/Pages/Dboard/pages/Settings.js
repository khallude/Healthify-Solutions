import React from 'react';
import { Bell, Lock, Eye, Globe, Moon, Smartphone } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your account preferences and settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Notifications</h2>
            <div className="space-y-4">
              <NotificationSetting
                title="Appointment Reminders"
                description="Get notified about upcoming appointments"
                icon={<Bell className="h-5 w-5" />}
                enabled={true}
              />
              <NotificationSetting
                title="Health Alerts"
                description="Receive alerts for important health metrics"
                icon={<Bell className="h-5 w-5" />}
                enabled={true}
              />
              <NotificationSetting
                title="Newsletter"
                description="Weekly health tips and updates"
                icon={<Bell className="h-5 w-5" />}
                enabled={false}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Privacy</h2>
            <div className="space-y-4">
              <PrivacySetting
                title="Profile Visibility"
                description="Control who can see your profile"
                icon={<Eye className="h-5 w-5" />}
                value="Only Me"
              />
              <PrivacySetting
                title="Data Sharing"
                description="Manage how your data is shared"
                icon={<Globe className="h-5 w-5" />}
                value="Healthcare Providers Only"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Account Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value="john.doe@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value="+1 234-567-8900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Language</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Preferences</h2>
            <div className="space-y-4">
              <PreferenceSetting
                title="Dark Mode"
                description="Use dark theme throughout the app"
                icon={<Moon className="h-5 w-5" />}
              />
              <PreferenceSetting
                title="Mobile Notifications"
                description="Enable push notifications on mobile"
                icon={<Smartphone className="h-5 w-5" />}
              />
              <PreferenceSetting
                title="Two-Factor Authentication"
                description="Add an extra layer of security"
                icon={<Lock className="h-5 w-5" />}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type NotificationSettingProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
};

function NotificationSetting({ title, description, icon, enabled }: NotificationSettingProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="text-gray-600">{icon}</div>
        <div>
          <p className="font-medium text-gray-900">{title}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" checked={enabled} />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );
}

type PrivacySettingProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  value: string;
};

function PrivacySetting({ title, description, icon, value }: PrivacySettingProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="text-gray-600">{icon}</div>
        <div>
          <p className="font-medium text-gray-900">{title}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <select className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
        <option>{value}</option>
      </select>
    </div>
  );
}

type PreferenceSettingProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

function PreferenceSetting({ title, description, icon }: PreferenceSettingProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="text-gray-600">{icon}</div>
        <div>
          <p className="font-medium text-gray-900">{title}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );
}