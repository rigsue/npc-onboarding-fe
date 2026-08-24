import React, { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'netrust_profile';

const DEFAULT_PROFILE = {
  name: 'John Doe',
  role: 'IT Operations',
  email: 'JohnDoe@netrust.com.ph',
  phone: '+63 906 5389 280',
  photo: null,
};

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...DEFAULT_PROFILE, ...JSON.parse(saved) } : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // ignore storage errors (e.g. private browsing quota)
    }
  }, [profile]);

  const updateProfile = (patch) => setProfile((prev) => ({ ...prev, ...patch }));

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return ctx;
}
