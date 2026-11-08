import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { ProfileProvider } from "./context/ProfileContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoutes from "./ProtectedRoutes";

import Login from "./main/Login";
import Signup from "./main/Signup";
import ManageAccount from "./main/ManageAccount";
import LandingPage from "./main/LandingPage";

import Home from "./main/localUser/Home";
import Profile from "./main/localUser/Profile";
import Certifications from "./main/localUser/Certifications";

import AdminDashboard from "./main/adminPanel/AdminDashboard";
import AdminAnnouncements from "./main/adminPanel/AdminAnnouncements";
import AdminModules from "./main/adminPanel/AdminModules";
import AdminMaterials from "./main/adminPanel/AdminMaterials";
import SuperAdmin from "./main/adminPanel/SuperAdmin";
import SuperAdminLayout from "./main/adminPanel/SuperAdminLayout";
import AdminAssessment from "./main/adminPanel/AdminAssessment";

import HRModules from "./main/modules/hr";
import ITModules from "./main/modules/it";
import FinanceModules from "./main/modules/finance";
import MarketingModules from "./main/modules/marketing";
import PreSalesModules from "./main/modules/presales";
import CustomerSuccessModules from "./main/modules/cust_success";
import SalesModules from "./main/modules/sales";
import PMModules from "./main/modules/ppm";
import OOCModules from "./main/modules/ooc";

export default function App() {
  return (
    // <ProfileProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
  {/* Public */}
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/landingpage" element={<LandingPage/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/signup" element={<Signup/>}/>
  {/* Protected */}
              <Route element ={<ProtectedRoutes/>}>
                <Route path="/home" element={<Home/>}/>
                <Route path="/admin" element={<SuperAdminLayout/>}>
                  <Route path="dashboard" element={<AdminDashboard/>}/>
                  <Route path="users" element={<SuperAdmin/>}/>
                  <Route path="announcements" element={<AdminAnnouncements/>}/>
                  <Route path="materials" element={<AdminMaterials/>}/>
                  <Route path="modules" element={<AdminModules/>}/>
                  <Route path="assessment" element={<AdminAssessment/>}/>
                </Route>
                  <Route path="/profile" element={<Profile/>}/>
                  <Route path="/certifications" element={<Certifications/>}/>
                  <Route path="/manageaccount" element={<ManageAccount/>}/>

                  {/* module pages */}
                  <Route path="/hr" element={<HRModules/>}/>
                  <Route path="/it" element={<ITModules/>}/>
                  <Route path="/finance" element={<FinanceModules/>}/>
                  <Route path="/marketing" element={<MarketingModules/>}/>
                  <Route path="/preSales" element={<PreSalesModules/>}/>
                  <Route path="/customerSuccess" element={<CustomerSuccessModules/>}/>
                  <Route path="/sales" element={<SalesModules/>}/>
                  <Route path="/ppm" element={<PMModules/>}/>
                  <Route path="/ooc" element={<OOCModules/>}/>
              </Route>
            </Routes>
          </BrowserRouter>
        </ToastProvider>
    // </ProfileProvider>
  );
}
