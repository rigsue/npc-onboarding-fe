import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProfileProvider } from "./context/ProfileContext";
import { ToastProvider } from "./context/ToastContext";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Certifications from "./pages/Certifications";
import ManageAccount from "./pages/ManageAccount";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAnnouncements from "./pages/AdminAnnouncements";
import AdminMaterials from "./pages/AdminMaterials";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import ProtectedRoutes from "./ProtectedRoutes";

export default function App() {
  return (
    <ProfileProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
  {/* Public */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/landingpage" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
  {/* Protected */}
              <Route element ={<ProtectedRoutes />}>
                <Route path="/home" element={<Home />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/superadmin" element={<SuperAdminDashboard />} 
                />
                <Route path="/profile" element={<Profile />} />
                <Route path="/certifications" element={<Certifications />} />
                <Route path="/manageaccount" element={<ManageAccount />} />
                <Route 
                  path="/admin/announcements" 
                  element={<AdminAnnouncements />} 
                />
                <Route 
                  path="/admin/materials" 
                  element={<AdminMaterials />} 
                />
{/*                 <Route 
                path="/admin/users" 
                element={
                  <RequireSuperAdmin>
                      <AdminUsers />
                  </RequireSuperAdmin>} 
                /> */}
              </Route>
            </Routes>
          </BrowserRouter>
        </ToastProvider>
    </ProfileProvider>
  );
}
