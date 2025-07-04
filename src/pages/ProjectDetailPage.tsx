
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Plus, Eye, Edit, Trash2, IndianRupee, BarChart3, Truck } from "lucide-react";
import { toast } from "sonner";
import AddScopeOfWorkDialog from "@/components/projects/AddScopeOfWorkDialog";
import TransportationStatus from "@/components/transportation/TransportationStatus";
import { BillingProject } from "@/features/billing/types/billingTypes";

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<BillingProject | null>(null);
  const [isAddScopeOpen, setIsAddScopeOpen] = useState(false);

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = () => {
    const storedProjects = JSON.parse(localStorage.getItem('billing_projects') || '[]');
    const foundProject = storedProjects.find((p: BillingProject) => p.id === id);
    setProject(foundProject || null);
  };

  const calculateProgress = () => {
    if (!project || project.totalCost === 0) return 0;
    return Math.round((project.totalReceived / project.totalCost) * 100);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "on-hold":
        return <Badge className="bg-orange-100 text-orange-800">On Hold</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getVendorPaymentStatus = () => {
    if (!project) return { totalVendors: 0, paidVendors: 0, pendingAmount: 0 };
    
    // Mock vendor payment data - in a real app this would come from actual vendor data
    const totalVendors = Math.max(1, Math.floor(project.workPlan.length * 1.5));
    const paidVendors = Math.floor(totalVendors * (project.totalReceived / project.totalCost));
    const pendingAmount = project.totalPending * 0.6; // Assume 60% of pending is for vendors
    
    return { totalVendors, paidVendors, pendingAmount };
  };

  const getProjectProgressStats = () => {
    if (!project) return { activeScopes: 0, totalScopes: 0 };
    
    const totalScopes = project.workPlan.length;
    const activeScopes = project.workPlan.filter(scope => 
      scope.status === 'in-progress' || scope.status === 'pending'
    ).length;
    
    return { activeScopes, totalScopes };
  };

  const getTransportationStats = () => {
    // Mock transportation data - in a real app this would come from actual transportation data
    const totalShipments = Math.max(1, Math.floor(Math.random() * 20) + 5);
    const inTransit = Math.floor(totalShipments * 0.25);
    const delivered = totalShipments - inTransit;
    
    return { totalShipments, inTransit, delivered };
  };

  const handleScopeAdded = () => {
    setIsAddScopeOpen(false);
    loadProject();
    toast.success("Scope of work added successfully!");
  };

  const deleteScopeOfWork = (scopeId: string) => {
    if (!project) return;
    
    if (window.confirm("Are you sure you want to delete this scope of work?")) {
      const existingProjects = JSON.parse(localStorage.getItem('billing_projects') || '[]');
      const updatedProjects = existingProjects.map((p: BillingProject) => 
        p.id === project.id 
          ? { ...p, workPlan: p.workPlan.filter(scope => scope.id !== scopeId) }
          : p
      );
      localStorage.setItem('billing_projects', JSON.stringify(updatedProjects));
      loadProject();
      toast.success("Scope of work deleted successfully!");
    }
  };

  if (!project) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Project not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const vendorPaymentStatus = getVendorPaymentStatus();
  const progressStats = getProjectProgressStats();
  const transportationStats = getTransportationStats();

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="text-muted-foreground">Project Details & Scope of Works</p>
          </div>
        </div>

        {/* Project Progress and Transportation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Project Progress Card */}
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Project Progress</CardTitle>
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{calculateProgress()}%</div>
              <p className="text-sm text-muted-foreground">
                {progressStats.activeScopes} active of {progressStats.totalScopes} total
              </p>
              <div className="mt-4">
                <Progress value={calculateProgress()} className="h-2" />
              </div>
              <div className="flex items-center justify-end mt-3">
                <span className="text-sm text-muted-foreground">→</span>
              </div>
            </CardContent>
          </Card>

          {/* Transportation Card */}
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/transportation')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Transportation</CardTitle>
              <Truck className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{transportationStats.totalShipments}</div>
              <p className="text-sm text-muted-foreground">
                {transportationStats.inTransit} in transit, {transportationStats.delivered} delivered
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                  On Track
                </span>
                <span className="text-sm text-muted-foreground">→</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle>Project Overview</CardTitle>
            <CardDescription>Basic project information and progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Project Owner</h4>
                <p className="text-lg font-semibold">{project.projectOwner}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Total Cost</h4>
                <p className="text-lg font-semibold">₹{project.totalCost.toLocaleString()}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Received</h4>
                <p className="text-lg font-semibold text-green-600">₹{project.totalReceived.toLocaleString()}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Pending</h4>
                <p className="text-lg font-semibold text-red-600">₹{project.totalPending.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium mb-2">Overall Progress</h4>
              <div className="flex items-center gap-4">
                <Progress value={calculateProgress()} className="flex-1" />
                <span className="text-sm font-medium">{calculateProgress()}%</span>
              </div>
            </div>

            {/* Vendor Payment Status Section */}
            <div className="mt-6">
              <h4 className="font-medium mb-4 flex items-center gap-2">
                <IndianRupee className="h-4 w-4" />
                Vendor Payment Status
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg bg-blue-50">
                  <h5 className="text-sm font-medium text-muted-foreground">Total Vendors</h5>
                  <p className="text-2xl font-bold text-blue-600">{vendorPaymentStatus.totalVendors}</p>
                </div>
                <div className="p-4 border rounded-lg bg-green-50">
                  <h5 className="text-sm font-medium text-muted-foreground">Paid Vendors</h5>
                  <p className="text-2xl font-bold text-green-600">{vendorPaymentStatus.paidVendors}</p>
                </div>
                <div className="p-4 border rounded-lg bg-red-50">
                  <h5 className="text-sm font-medium text-muted-foreground">Pending Vendor Payments</h5>
                  <p className="text-2xl font-bold text-red-600">₹{Math.round(vendorPaymentStatus.pendingAmount).toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Vendor Payment Progress</span>
                  <span className="text-sm font-medium">
                    {vendorPaymentStatus.totalVendors > 0 ? Math.round((vendorPaymentStatus.paidVendors / vendorPaymentStatus.totalVendors) * 100) : 0}%
                  </span>
                </div>
                <Progress 
                  value={vendorPaymentStatus.totalVendors > 0 ? (vendorPaymentStatus.paidVendors / vendorPaymentStatus.totalVendors) * 100 : 0} 
                  className="h-2" 
                />
              </div>
            </div>

            {project.description && (
              <div className="mt-6">
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-muted-foreground">{project.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Scope of Works */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Scope of Works</CardTitle>
              <CardDescription>All scope of works for this project</CardDescription>
            </div>
            <Button onClick={() => setIsAddScopeOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Scope
            </Button>
          </CardHeader>
          <CardContent>
            {project.workPlan.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No scope of works found. Add your first scope to get started.</p>
                <Button onClick={() => setIsAddScopeOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Scope
                </Button>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Department</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Target Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {project.workPlan.map((scope) => (
                      <TableRow key={scope.id}>
                        <TableCell className="font-medium">{scope.departmentName}</TableCell>
                        <TableCell>{scope.notes}</TableCell>
                        <TableCell>
                          {scope.targetDate ? new Date(scope.targetDate).toLocaleDateString() : 'Not set'}
                        </TableCell>
                        <TableCell>{getStatusBadge(scope.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteScopeOfWork(scope.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isAddScopeOpen} onOpenChange={setIsAddScopeOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Scope of Work</DialogTitle>
          </DialogHeader>
          <AddScopeOfWorkDialog 
            project={project}
            onSuccess={handleScopeAdded}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectDetailPage;
