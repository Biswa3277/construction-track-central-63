
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@/features/layout/components/MainLayout";
import LoginPage from "@/features/auth/components/LoginPage";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import ProjectDashboard from "@/pages/ProjectDashboard";
import ProjectDetailPage from "@/pages/ProjectDetailPage";
import DepartmentProjects from "@/pages/DepartmentProjects";
import Payments from "@/pages/Payments";
import ProjectBilling from "@/pages/ProjectBilling";
import PurchaseBilling from "@/pages/PurchaseBilling";
import Transportation from "@/pages/Transportation";
import Vendors from "@/pages/Vendors";
import Expenses from "@/pages/Expenses";
import Billing from "@/pages/Billing";
import ReportsPage from "@/features/reports/pages/ReportsPage";
import Settings from "@/pages/Settings";
import UserManagementPage from "@/features/users/pages/UserManagementPage";
import PaymentDetailView from "@/features/payments/components/PaymentDetailView";
import TeamManagement from "@/pages/TeamManagement";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/" element={<MainLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="projects" element={<Projects />} />
              <Route path="project/:id" element={<ProjectDetailPage />} />
              <Route path="project-dashboard" element={<ProjectDashboard />} />
              <Route path="department-projects" element={<DepartmentProjects />} />
              <Route path="payments" element={<Payments />} />
              <Route path="payments/:id" element={<PaymentDetailView />} />
              <Route path="project-billing" element={<ProjectBilling />} />
              <Route path="purchase-billing" element={<PurchaseBilling />} />
              <Route path="transportation" element={<Transportation />} />
              <Route path="vendors" element={<Vendors />} />
              <Route path="expenses" element={<Expenses />} />
              <Route path="billing" element={<Billing />} />
              <Route path="team-management" element={<TeamManagement />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="settings" element={<Settings />} />
              <Route path="user-management" element={<UserManagementPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
