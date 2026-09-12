import React, { createContext, useContext, useState, useEffect } from 'react';
/* 
The admin side is fully separate from the onboarding employee's data in
ProfileContext (that one belongs to the "User" login and gets edited from
Manage Account) — the two should never read or write each other's data.

Within the admin side there are two distinct account types, matching the
spec: Super Admin has full, unscoped access; Admin (a "department admin")
is scoped to a single department and can't manage accounts, roles, or
system settings. Rather than building two separate sets of pages, the
same admin pages read `isSuperAdmin` / `department` from here and adjust
what's visible and editable.
 */
const STORAGE_KEY = 'netrust_admin_level';

const SUPER_ADMIN = {
  level: 'super-admin',
  name: 'Jalen Brunson',
  role: 'People & Culture Specialist',
  department: 'Finance Department',
  departmentKey: 'Finance',
};

const DEPARTMENT_ADMIN = {
  level: 'admin',
  name: 'Maria Lopez',
  role: 'HR Coordinator',
  department: 'IT Department',
  departmentKey: 'IT',
};

export function getInitials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}

const AdminIdentityContext = createContext(null);

export function AdminIdentityProvider({ children }) {
  const [level, setLevel] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'admin' ? 'admin' : 'super-admin';
    } catch {
      return 'super-admin';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, level);
    } catch {
      // ignore storage errors
    }
  }, [level]);

  const identity = level === 'admin' ? DEPARTMENT_ADMIN : SUPER_ADMIN;

  const value = {
    ...identity,
    isSuperAdmin: level === 'super-admin',
    setLevel,
  };

  return (
    <AdminIdentityContext.Provider value={value}>
      {children}
    </AdminIdentityContext.Provider>
  );
}

export function useAdminIdentity() {
  const ctx = useContext(AdminIdentityContext);
  if (!ctx) {
    throw new Error('useAdminIdentity must be used within an AdminIdentityProvider');
  }
  return ctx;
}
