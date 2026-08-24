import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProfileProvider } from './context/ProfileContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Certifications from './pages/Certifications';
import ManageAccount from './pages/ManageAccount';
import HR from './pages/onboard/hr';
import IT from './pages/onboard/it';
import Finance from './pages/onboard/finance';
import Marketing from './pages/onboard/marketing';
import PreSales from './pages/onboard/presales';
import CustomerSuccess from './pages/onboard/cust_success';
import Sales from './pages/onboard/sales';
// import PPM from './pages/onboard/ppm';
// import OOC from './pages/onboard/ooc';

const App = () => {
  return (
    <ProfileProvider>
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
                  {/* onboarding */}
        <Route path="/hr" element={<HR />} />
        <Route path="/it" element={<IT />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/marketing" element={<Marketing />} />
        <Route path="/presales" element={<PreSales />} />
        <Route path="/cust_success" element={<CustomerSuccess />} />
        <Route path="/sales" element={<Sales />} />
        {/* <Route path="/ppm" element={<PPM />} />
        <Route path="/ooc" element={<OOC />} /> */}
          
        </Routes>
      </BrowserRouter>
    </ProfileProvider>
  );
}
export default App;
