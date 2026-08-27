import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProfileProvider } from './context/ProfileContext';
import { ToastProvider } from './context/ToastContext';
import { AdminIdentityProvider } from './context/AdminIdentityContext';
import RequireSuperAdmin from './components/RequireSuperAdmin';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Certifications from './pages/Certifications';
import ManageAccount from './pages/ManageAccount';
import AdminDashboard from './pages/AdminDashboard';
import AdminAnnouncements from './pages/AdminAnnouncements';
import AdminMaterials from './pages/AdminMaterials';
import AdminUsers from './pages/AdminUsers';

export default function App() {
  return (
    <ProfileProvider>
      <AdminIdentityProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/landingpage" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/home" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/certifications" element={<Certifications />} />
              <Route path="/manageaccount" element={<ManageAccount />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/announcements" element={<AdminAnnouncements />} />
              <Route path="/admin/materials" element={<AdminMaterials />} />
              <Route path="/admin/users" element={<RequireSuperAdmin><AdminUsers /></RequireSuperAdmin>} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AdminIdentityProvider>
    </ProfileProvider>
  );
}
