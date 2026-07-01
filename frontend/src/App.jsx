import React, { useState } from "react";
import Login from "@/pages/auth/Login.jsx";
import Register from "@/pages/auth/Register";
import Dashboard from "@/pages/dashboard/Dashboard";
import AccessibilityToolbar from "@/components/common/accessibility-toolbar/AccessibilityToolbar";
import SoundAlertBanner from "@/components/common/accessibility-toolbar/SoundAlertBanner";
import { AccessibilityProvider, useAccessibility } from "@/context/AccessibilityContext";

import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";

function AppContent() {
  const [token, setToken] = useState(null);
  const [page, setPage] = useState("login");
  const { settings } = useAccessibility();

  useKeyboardNavigation();

  const logout = () => {
    setToken(null);
    setPage("login");
  };

  const content = !token ? (
    page === "login" ? (
      <Login setPage={setPage} setToken={setToken} />
    ) : (
      <Register setPage={setPage} />
    )
  ) : (
    <Dashboard token={token} logout={logout} />
  );

  return (
    <>
      <a href="#conteudo-principal" className="skip-link">
        Pular para o conteúdo principal
      </a>
      {content}
      <AccessibilityToolbar />
      <SoundAlertBanner enabled={settings.soundAlertsEnabled} />
    </>
  );
}

export default function App() {
  return (
    <AccessibilityProvider>
      <AppContent />
    </AccessibilityProvider>
  );
}
