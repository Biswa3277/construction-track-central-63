import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Plus, Eye, FolderPlus, IndianRupee } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import ProjectProgressSection from "@/components/projects/ProjectProgressSection";
import AddProjectWithScopeForm from "@/components/projects/AddProjectWithScopeForm";
import ProjectDetailsDialog from "@/components/projects/ProjectDetailsDialog";
import AddScopeOfWorkDialog from "@/components/projects/AddScopeOfWorkDialog";
import { BillingProject } from "@/features/billing/types/billingTypes";

// Simulated data for departments
const departments = [
  {
    id: "civil",
    name: "Civil",
    manager: "John Doe",
    ongoingProjects: 4,
    totalProjects: 8
  },
  {
    id: "mechanical",
    name: "Mechanical",
    manager: "Sarah Johnson",
    ongoingProjects: 3,
    totalProjects: 5
  },
  {
    id: "design",
    name: "Design",
    manager: "Mike Chen",
    ongoingProjects: 2,
    totalProjects: 6
  },
  {
    id: "accounts",
    name: "Accounts",
    manager: "Lisa Wong",
    ongoingProjects: 1,
    totalProjects: 3
  },
  {
    id: "tender",
    name: "Tender",
    manager: "Robert Singh",
    ongoingProjects: 2,
    totalProjects: 4
  },
  {
    id: "purchase",
    name: "Purchase",
    manager: "James Miller",
    ongoingProjects: 3,
    totalProjects: 5
  },
  {
    id: "automation",
    name: "Automation",
    manager: "Emily Clark",
    ongoingProjects: 5,
    totalProjects: 7
  }
];

// Simulated data - in a real app, this would come from an API
const generateMockProjects = (department?: string) => {
  const projects = [
    {
      id: "1",
      name: "Amrit WTP",
      department: "civil",
      totalBudget: 7500000,
      spent: 4875000,
      remaining: 2625000,
      status: "in-progress",
      progress: 65,
      startDate: "15/1/2023",
      endDate: "30/7/2023",
      paymentsCount: 10,
      pendingPayments: 3
    },
    {
      id: "2",
      name: "YACHULI",
      department: "mechanical",
      totalBudget: 3500000,
      spent: 2800000,
      remaining: 700000,
      status: "in-progress",
      progress: 80,
      startDate: "10/2/2023",
      endDate: "20/5/2023",
      paymentsCount: 12,
      pendingPayments: 2
    },
    {
      id: "3",
      name: "Sample Testing",
      department: "design",
      totalBudget: 450000,
      spent: 450000,
      remaining: 0,
      status: "completed",
      progress: 100,
      startDate: "1/2/2023",
      endDate: "15/3/2023",
      paymentsCount: 4,
      pendingPayments: 0
    },
    {
      id: "4",
      name: "Piyong IoT",
      department: "automation",
      totalBudget: 1200000,
      spent: 360000,
      remaining: 840000,
      status: "in-progress",
      progress: 30,
      startDate: "20/3/2023",
      endDate: "10/6/2023",
      paymentsCount: 5,
      pendingPayments: 4
    },
    {
      id: "5",
      name: "Machuika",
      department: "civil",
      totalBudget: 2200000,
      spent: 990000,
      remaining: 1210000,
      status: "in-progress",
      progress: 45,
      startDate: "1/3/2023",
      endDate: "30/9/2023",
      paymentsCount: 8,
      pendingPayments: 5
    }
  ];

  if (department) {
    return projects.filter(p => p.department === department);
  }
  
  return projects;
};

const DepartmentProjects = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [billingProjects, setBillingProjects] = useState<BillingProject[]>([]);
  const [departmentBillingProjects, setDepartmentBillingProjects] = useState<BillingProject[]>([]);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isProjectDetailsOpen, setIsProjectDetailsOpen] = useState(false);
  const [isAddScopeOpen, setIsAddScopeOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<BillingProject | null>(null);

  useEffect(() => {
    // Get user's department from localStorage (in a real app)
    const userData = localStorage.getItem("user");
    let user = null;
    if (userData) {
      user = JSON.parse(userData);
    }
    
    // Here we'd normally fetch the user's department projects
    // For now, just get all projects
    const allProjects = generateMockProjects(selectedDepartment || undefined);
    setProjects(allProjects);
    filterProjects(allProjects, statusFilter, searchQuery);

    // Load billing projects
    loadBillingProjects();
  }, [statusFilter, searchQuery, selectedDepartment]);

  const loadBillingProjects = () => {
    const storedProjects = JSON.parse(localStorage.getItem('billing_projects') || '[]');
    setBillingProjects(storedProjects);
    
    // Filter billing projects by selected department if any
    if (selectedDepartment) {
      const selectedDept = departments.find(d => d.id === selectedDepartment);
      if (selectedDept) {
        // Filter projects that have work plan items for this department
        const filteredBillingProjects = storedProjects.filter((project: BillingProject) =>
          project.workPlan.some(scope => scope.departmentName.toLowerCase() === selectedDept.name.toLowerCase())
        );
        setDepartmentBillingProjects(filteredBillingProjects);
      }
    } else {
      setDepartmentBillingProjects(storedProjects);
    }
  };

  const filterProjects = (projects: any[], status: string, query: string) => {
    let result = [...projects];
    
    // Filter by status
    if (status !== "all") {
      result = result.filter(project => project.status === status);
    }
    
    // Filter by search query
    if (query) {
      const queryLower = query.toLowerCase();
      result = result.filter(project => 
        project.name.toLowerCase().includes(queryLower)
      );
    }
    
    setFilteredProjects(result);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "active":
        return <Badge className="bg-blue-100 text-blue-800">Active</Badge>;
      case "in-progress":
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      case "planning":
        return <Badge className="bg-yellow-100 text-yellow-800">Planning</Badge>;
      case "on-hold":
        return <Badge className="bg-orange-100 text-orange-800">On Hold</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const calculateProgress = (project: BillingProject) => {
    if (project.totalCost === 0) return 0;
    return Math.round((project.totalReceived / project.totalCost) * 100);
  };

  const getVendorPaymentStatus = (project: BillingProject) => {
    // Mock vendor payment data - in a real app this would come from actual vendor data
    const totalVendors = Math.max(1, Math.floor(project.workPlan.length * 1.5));
    const paidVendors = Math.floor(totalVendors * (project.totalReceived / project.totalCost));
    const pendingAmount = project.totalPending * 0.6; // Assume 60% of pending is for vendors
    
    return { totalVendors, paidVendors, pendingAmount };
  };

  const handleDepartmentSelect = (deptId: string) => {
    setSelectedDepartment(deptId);
  };

  const handleDepartmentAction = (deptId: string, action: string) => {
    if (action === 'payments') {
      navigate('/payments');
    } else if (action === 'projects') {
      setSelectedDepartment(deptId);
    }
  };

  const handleAddProject = () => {
    setIsAddProjectOpen(false);
    loadBillingProjects();
    toast.success("Project added successfully!");
  };

  const handleViewProject = (project: BillingProject) => {
    setSelectedProject(project);
    setIsProjectDetailsOpen(true);
  };

  const handleAddScope = (project: BillingProject) => {
    setSelectedProject(project);
    setIsAddScopeOpen(true);
  };

  const handleScopeAdded = () => {
    setIsAddScopeOpen(false);
    setSelectedProject(null);
    loadBillingProjects();
    toast.success("Scope of work added successfully!");
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold">Projects & Tasks</h1>
        </div>
        
        {!selectedDepartment ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Departments Overview</CardTitle>
                <CardDescription>View and manage departments and their projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {departments.map(dept => (
                    <Card key={dept.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle>{dept.name}</CardTitle>
                        <CardDescription>Manager: {dept.manager}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Ongoing Projects:</span>
                          <Badge variant="outline">{dept.ongoingProjects} / {dept.totalProjects}</Badge>
                        </div>
                        <Progress value={(dept.ongoingProjects / dept.totalProjects) * 100} className="h-2" />
                        <div className="flex justify-between mt-4">
                          <Button size="sm" variant="outline" onClick={() => handleDepartmentAction(dept.id, 'projects')}>
                            View Projects
                          </Button>
                          <Button size="sm" onClick={() => handleDepartmentAction(dept.id, 'payments')}>
                            Payments
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Project Progress & Management Section */}
            <ProjectProgressSection projects={billingProjects} onProjectsUpdate={loadBillingProjects} />
          </>
        ) : (
          <>
            {/* Department-specific Project Progress & Management */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Project Progress & Management</CardTitle>
                  <CardDescription>
                    {departments.find(d => d.id === selectedDepartment)?.name} Department Projects
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setIsAddProjectOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Project
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedDepartment(null)}>
                    Back to Departments
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {departmentBillingProjects.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No projects found for this department. Add your first project to get started.</p>
                    <Button onClick={() => setIsAddProjectOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Project
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Project Name</TableHead>
                          <TableHead>Owner</TableHead>
                          <TableHead>Total Cost</TableHead>
                          <TableHead>Progress</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Vendor Status</TableHead>
                          <TableHead>Scope Count</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {departmentBillingProjects.map((project) => {
                          const vendorStatus = getVendorPaymentStatus(project);
                          return (
                            <TableRow key={project.id}>
                              <TableCell className="font-medium">
                                <Link 
                                  to={`/project/${project.id}`}
                                  className="text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                  {project.name}
                                </Link>
                              </TableCell>
                              <TableCell>{project.projectOwner}</TableCell>
                              <TableCell>₹{project.totalCost.toLocaleString()}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Progress value={calculateProgress(project)} className="h-2 w-20" />
                                  <span className="text-xs">{calculateProgress(project)}%</span>
                                </div>
                              </TableCell>
                              <TableCell>{getStatusBadge(project.status)}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <IndianRupee className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs">
                                    {vendorStatus.paidVendors}/{vendorStatus.totalVendors}
                                  </span>
                                  <Progress 
                                    value={vendorStatus.totalVendors > 0 ? (vendorStatus.paidVendors / vendorStatus.totalVendors) * 100 : 0} 
                                    className="h-1 w-12" 
                                  />
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {project.workPlan?.length || 0} scopes
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewProject(project)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleAddScope(project)}
                                  >
                                    <FolderPlus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Legacy Projects Table for Selected Department */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Legacy Project Management</CardTitle>
                  <CardDescription>
                    {departments.find(d => d.id === selectedDepartment)?.name} Department Legacy Projects
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <Tabs defaultValue="all" value={statusFilter} onValueChange={setStatusFilter}>
                    <TabsList>
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                      <TabsTrigger value="completed">Completed</TabsTrigger>
                      <TabsTrigger value="on-hold">On Hold</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search projects..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project Name</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Spent</TableHead>
                        <TableHead>Remaining</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProjects.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell className="font-medium">{project.name}</TableCell>
                          <TableCell>₹{project.totalBudget.toLocaleString()}</TableCell>
                          <TableCell>₹{project.spent.toLocaleString()}</TableCell>
                          <TableCell>₹{project.remaining.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={project.progress} className="h-2 w-20" />
                              <span className="text-xs">{project.progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(project.status)}</TableCell>
                          <TableCell>{project.startDate}</TableCell>
                          <TableCell>{project.endDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Dialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
          </DialogHeader>
          <AddProjectWithScopeForm 
            onSuccess={handleAddProject} 
            selectedDepartment={selectedDepartment ? departments.find(d => d.id === selectedDepartment)?.name : undefined}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isProjectDetailsOpen} onOpenChange={setIsProjectDetailsOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Project Details</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <ProjectDetailsDialog 
              project={selectedProject} 
              onClose={() => setIsProjectDetailsOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isAddScopeOpen} onOpenChange={setIsAddScopeOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Scope of Work</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <AddScopeOfWorkDialog 
              project={selectedProject}
              onSuccess={handleScopeAdded}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DepartmentProjects;
