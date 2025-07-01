import { useState } from "react";
import "./App.css";
import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Home from "./assets/Components/Home/Home";
import My_Library from "./assets/Components/My_Library/My_Library";
import Summarize from "./assets/Components/Summarize/Summarize";
import Exams from "./assets/Components/Exams/Exams";
import NotFound from "./assets/Components/NotFound/NotFound";
import Layout from "./assets/Components/Layout/Layout";
import Register from "./assets/Components/Register/Register";
import ConfirmMail from "./assets/Components/ConfirmMail/ConfirmMail";
import Login from "./assets/Components/Login/Login";
import ProtectedRoute from "./assets/Components/ProtectedRoute/ProtectedRoute";
import ForgotPassword from "./assets/Components/ForgotPassword/ForgotPassword";
import ResetPassword from "./assets/Components/ResetPassword/ResetPassword";
import BookDetails from "./assets/Components/BookDetails/BookDetails";
import BookReader from "./assets/Components/BookReader/BookReader";
import Profile from "./assets/Components/Profile/Profile";
import Spaces from "./assets/Components/Spaces/Spaces";
import MyNotes from "./assets/Components/MyNotes/MyNotes";
import OnDemandTools from "./assets/Components/OnDemandTools/OnDemandTools";

// Component to wrap with AnimatePresence
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={<ProtectedRoute><Layout /></ProtectedRoute>}
        >
          <Route index element={<Home />} />
          <Route path="My_library" element={<My_Library />} />
          <Route path="summarizes" element={<Summarize />} />
          <Route path="Exams" element={<Exams />} />
          <Route path="BookDetails" element={<BookDetails />} />
          <Route path="Profile" element={<Profile/>} />
          <Route path="Spaces" element={<Spaces/>} />
          <Route path="mynotes" element={<MyNotes/>} />
          <Route path="OnDemandTools" element={<OnDemandTools/>} />
        </Route>

        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="confirm-email" element={<ConfirmMail />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password-page" element={<ResetPassword />} />
        <Route path="read" element={<BookReader />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
