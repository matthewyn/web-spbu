import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import PetaSebaranSPBU from "./PetaSebaranSPBU";
import Home from "./Home";
import Login from "./Login";
import SignUp from "./SignUp";
import Settings from "./Settings"; // Import the Settings component
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const location = useLocation();

  return (
    <div>
      <Navbar />
      {/* Define the Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/peta-sebaran-spbu"
          element={
            <ProtectedRoute>
              <PetaSebaranSPBU />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Routes>
      {location.pathname !== "/peta-sebaran-spbu" && <Footer />}
    </div>
  );
}
