import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import OTPVerify from "./pages/OTPVerify";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminOTPVerify from "./admin/pages/AdminOTPVerify";
import AdminSignup from "./admin/pages/adminsignup";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashbord";
import AdminForgotPasswordOTP from "./admin/pages/AdminForgotPasswordOTP";
import AdminResetPassword from "./admin/pages/AdminResetPassword";
import AdminForgotPassword from "./admin/pages/AdminForgotPassword";
import Assessment from "./pages/Assessment";
import Report from "./pages/Report";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp-verify" element={<OTPVerify />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin/otp-verify" element={<AdminOTPVerify />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route
          path="/admin/forgot-password"
          element={<AdminForgotPassword />}
        />
        <Route
          path="/admin/forgot-password-otp"
          element={<AdminForgotPasswordOTP />}
        />
        <Route path="/admin/reset-password" element={<AdminResetPassword />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/Report" element={<Report />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
