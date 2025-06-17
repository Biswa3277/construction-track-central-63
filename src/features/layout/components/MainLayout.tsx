
import { useState, useEffect } from "react";
import { Outlet, Navigate, useLocation, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import MainNavigation from "./MainNavigation";
import Header from "@/components/layout/Header";
import { toast } from "sonner";

const MainLayout = () => {
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        navigate("/login", { replace: true });
      }
    };
    
    checkAuth();
    
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [navigate]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Dashboard";
    if (path === "/department-projects") return "Department Projects";
    if (path === "/payments") return "Payments";
    if (path === "/project-billing") return "Project Billing";
    if (path === "/purchase-billing") return "Purchase and Invoice";
    if (path === "/expenses") return "Expenses";
    if (path === "/transportation") return "Transportation";
    if (path === "/vendors") return "Vendors";
    if (path === "/team-management") return "Team Management";
    if (path === "/reports") return "Reports";
    if (path === "/settings") return "Settings";
    if (path === "/user-management") return "User Management";
    return "";
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <MainNavigation user={user} />
        <div className="flex-1 overflow-auto">
          <div className="h-16 border-b flex items-center justify-between px-6">
            <div className="flex items-center">
              <SidebarTrigger />
              <h2 className="text-lg font-medium ml-4">
                {getPageTitle()}
              </h2>
            </div>
            <Header user={user} />
          </div>
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
