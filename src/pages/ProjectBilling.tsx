
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText, Calculator, Settings, CreditCard } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import ProjectManagement from "@/features/billing/components/ProjectManagement";
import PaymentTracking from "@/features/billing/components/PaymentTracking";
import InvoiceGeneration from "@/features/billing/components/InvoiceGeneration";
import AddProjectForm from "@/features/billing/components/AddProjectForm";
import DepartmentSettings from "@/features/billing/components/DepartmentSettings";

const ProjectBilling = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("projects");
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isDepartmentSettingsOpen, setIsDepartmentSettingsOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Handle URL parameters for navigation from Dashboard
  useEffect(() => {
    const tab = searchParams.get('tab');
    const projectId = searchParams.get('project');
    
    if (tab) {
      setActiveTab(tab);
    }
    
    if (projectId) {
      // If a specific project is selected, show it in projects tab
      setActiveTab('projects');
    }
  }, [searchParams]);

  const handleAddProjectSuccess = () => {
    setIsProjectDialogOpen(false);
    setRefreshTrigger(prev => prev + 1);
    toast.success("Project added successfully!");
  };

  const handleDepartmentUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
    toast.success("Departments updated successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Project Billing Management</h1>
          <p className="text-muted-foreground">Comprehensive project billing, department allocation, and payment tracking system</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsDepartmentSettingsOpen(true)}>
            <Settings className="mr-2 h-4 w-4" />
            Manage Departments
          </Button>
          <Button onClick={() => setIsProjectDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payment Tracking
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Invoice Generation
          </TabsTrigger>
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Billing Calculator
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Management</CardTitle>
              <CardDescription>Manage billing projects with department involvement, individual budgets, and work planning</CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectManagement refreshTrigger={refreshTrigger} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Tracking</CardTitle>
              <CardDescription>Track payments received from project owners with departmental allocation</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentTracking refreshTrigger={refreshTrigger} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Generation</CardTitle>
              <CardDescription>Generate professional invoices for projects and departments</CardDescription>
            </CardHeader>
            <CardContent>
              <InvoiceGeneration refreshTrigger={refreshTrigger} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calculator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Billing Calculator</CardTitle>
              <CardDescription>Calculate project costs, departmental allocations, and outstanding amounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calculator className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Advanced billing calculator with departmental breakdown will be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
          </DialogHeader>
          <AddProjectForm onSuccess={handleAddProjectSuccess} />
        </DialogContent>
      </Dialog>

      <Dialog open={isDepartmentSettingsOpen} onOpenChange={setIsDepartmentSettingsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Departments</DialogTitle>
          </DialogHeader>
          <DepartmentSettings onUpdate={handleDepartmentUpdate} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectBilling;
