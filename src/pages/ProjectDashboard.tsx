
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Truck,
  CreditCard,
  FileText,
  Plus,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import ProjectProgressSection from "@/components/projects/ProjectProgressSection";

const ProjectDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    // Load projects from billing system
    const storedProjects = JSON.parse(localStorage.getItem('billing_projects') || '[]');
    const storedPayments = JSON.parse(localStorage.getItem('billing_payments') || '[]');
    
    setProjects(storedProjects);
    setPayments(storedPayments);
  };

  // Calculate statistics
  const projectStats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    onHold: projects.filter(p => p.status === 'on-hold').length,
    avgProgress: projects.length > 0 ? 
      Math.round(projects.reduce((sum, p) => sum + ((p.totalReceived / p.totalCost) * 100 || 0), 0) / projects.length) : 0
  };

  const paymentStats = {
    totalAmount: projects.reduce((sum, p) => sum + p.totalCost, 0),
    receivedAmount: projects.reduce((sum, p) => sum + p.totalReceived, 0),
    pendingAmount: projects.reduce((sum, p) => sum + p.totalPending, 0),
    overdueCount: projects.filter(p => p.totalPending > 0 && p.status === 'active').length
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Project Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive overview of all projects and payments</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link to="/projects?tab=progress">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Project Progress</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projectStats.avgProgress}%</div>
              <p className="text-xs text-muted-foreground">
                {projectStats.active} active of {projectStats.total} total
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Progress value={projectStats.avgProgress} className="h-2 flex-1" />
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/payments">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payment Status</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{paymentStats.receivedAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                ₹{paymentStats.pendingAmount.toLocaleString()} pending
              </p>
              <div className="flex items-center gap-1 mt-2">
                <Badge variant={paymentStats.overdueCount > 0 ? "destructive" : "secondary"} className="text-xs">
                  {paymentStats.overdueCount} overdue
                </Badge>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/project-billing">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Billing Status</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.filter(p => p.totalPending === 0).length}</div>
              <p className="text-xs text-muted-foreground">
                {projects.filter(p => p.totalPending > 0).length} pending bills
              </p>
              <div className="flex items-center gap-1 mt-2">
                <Badge variant="outline" className="text-xs">Active</Badge>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/transportation">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transportation</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                3 in transit, 9 delivered
              </p>
              <div className="flex items-center gap-1 mt-2">
                <Badge variant="secondary" className="text-xs">On Track</Badge>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Project Progress & Management */}
      <ProjectProgressSection projects={projects} onProjectsUpdate={loadDashboardData} />
    </div>
  );
};

export default ProjectDashboard;
