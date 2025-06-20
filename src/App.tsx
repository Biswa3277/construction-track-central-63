
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ChakraProvider } from "./chakra/ChakraProvider";
import { Toaster } from "sonner";
import LoginPage from "./features/auth/components/LoginPage";
import DashboardLayout from "./features/dashboard/components/DashboardLayout";
import ProtectedRoute from "./features/auth/components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <ChakraProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </ChakraProvider>
  );
}

export default App;
