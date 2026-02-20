import { useState } from "react";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { Dashboard } from "./pages/Dashboard";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [showRegister, setShowRegister] = useState(false); // Styrer visning

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  // Hvis ikke logget inn, velg mellom Register eller Login
  if (!isLoggedIn) {
    return showRegister ? (
      <RegisterPage goToLogin={() => setShowRegister(false)} />
    ) : (
      <LoginPage 
        onLoginSuccess={() => setIsLoggedIn(true)} 
        goToRegister={() => setShowRegister(true)} 
      />
    );
  }

  return (
    <div className="app-layout">
      {/* Dashboardet ditt her */}
      <Dashboard onLogout={handleLogout} />
    </div>
  );
}