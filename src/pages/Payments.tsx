
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Filter, ArrowUpDown, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { BillingProject } from "@/features/billing/types/billingTypes";

const Payments = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("overall");
  const [projects, setProjects] = useState<BillingProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityPayments, setPriorityPayments] = useState([
    {
      id: "1",
      description: "Emergency generator repair",
      amount: 150000,
      priority: 1,
      status: "pending",
      dueDate: "2024-01-15",
      vendor: "TechCorp Solutions"
    },
    {
      id: "2", 
      description: "Monthly office rent",
      amount: 45000,
      priority: 2,
      status: "paid",
      dueDate: "2024-01-01",
      vendor: "Property Management"
    },
    {
      id: "3",
      description: "Equipment maintenance",
      amount: 75000,
      priority: 3,
      status: "pending",
      dueDate: "2024-01-20",
      vendor: "Maintenance Co"
    }
  ]);

  const [otherPayments] = useState([
    {
      id: "t1",
      type: "Transportation",
      description: "Vehicle fuel and maintenance",
      amount: 25000,
      status: "pending",
      category: "Transportation",
      dueDate: "2024-01-18"
    },
    {
      id: "u1",
      type: "Utilities",
      description: "Electricity bill - December",
      amount: 18000,
      status: "paid",
      category: "Utilities",
      dueDate: "2024-01-05"
    },
    {
      id: "s1",
      type: "Supplies",
      description: "Office supplies and stationery",
      amount: 12000,
      status: "pending",
      category: "Office",
      dueDate: "2024-01-22"
    }
  ]);

  const [allPayments] = useState([
    {
      id: "1",
      slNo: 1,
      description: "Maintain Marxian's amount return",
      projectName: "Piyong IoT(Namsal)",
      companyName: "King Longkai (Account Holder Name)",
      poReference: "PO123456",
      poDate: "2023-04-15",
      totalAmount: 300000,
      paid: 0,
      payableAmount: 300000,
      priority: "High",
      paymentStatus: "unpaid",
    },
    {
      id: "2",
      slNo: 2,
      description: "Supply of Man Power",
      projectName: "YACHULI",
      companyName: "A-TEL TECH",
      poReference: "PO789012",
      poDate: "2023-05-20",
      totalAmount: 150000,
      paid: 75000,
      payableAmount: 75000,
      priority: "Medium",
      paymentStatus: "partial",
    },
    {
      id: "3",
      slNo: 3,
      description: "Supply of Juniper make 48 port switch",
      projectName: "Amni WTP",
      companyName: "BMP SYSTEMS",
      poReference: "PO345678",
      poDate: "2023-06-25",
      totalAmount: 80000,
      paid: 80000,
      payableAmount: 0,
      priority: "High",
      paymentStatus: "paid",
    }
  ]);

  useEffect(() => {
    loadProjects();
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const loadProjects = () => {
    const storedProjects = JSON.parse(localStorage.getItem('billing_projects') || '[]');
    setProjects(storedProjects);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSelectedProject(null);
    setSearchParams({ tab: value });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case "partial":
        return <Badge className="bg-yellow-100 text-yellow-800">Partial</Badge>;
      case "pending":
      case "unpaid":
        return <Badge className="bg-red-100 text-red-800">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPriorityBadge = (priority: string | number) => {
    const priorityLevel = typeof priority === 'string' ? priority.toLowerCase() : 
      priority === 1 ? 'high' : priority === 2 ? 'medium' : 'low';
    
    switch (priorityLevel) {
      case "high":
      case 1:
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case "medium":
      case 2:
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case "low":
      case 3:
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"));
    
    if (dragIndex !== dropIndex) {
      const newPayments = [...priorityPayments];
      const [draggedItem] = newPayments.splice(dragIndex, 1);
      newPayments.splice(dropIndex, 0, draggedItem);
      
      // Update priorities based on new order
      const updatedPayments = newPayments.map((payment, index) => ({
        ...payment,
        priority: index + 1
      }));
      
      setPriorityPayments(updatedPayments);
      toast.success("Payment priority updated successfully!");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const getProjectPayments = (projectId: string) => {
    return allPayments.filter(payment => 
      projects.find(p => p.id === projectId && p.name === payment.projectName)
    );
  };

  const calculateProgress = (project: BillingProject) => {
    if (project.totalCost === 0) return 0;
    return Math.round(((project.totalCost - project.totalPending) / project.totalCost) * 100);
  };

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.projectOwner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedProject) {
    const project = projects.find(p => p.id === selectedProject);
    const projectPayments = getProjectPayments(selectedProject);
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Button variant="outline" onClick={() => setSelectedProject(null)}>
              ← Back to Projects
            </Button>
            <h1 className="text-3xl font-bold mt-2">Payments - {project?.name}</h1>
            <p className="text-muted-foreground">All payments related to this project</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Payment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">₹{project?.totalCost.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Budget</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">₹{project?.totalReceived.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Received</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">₹{project?.totalPending.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{calculateProgress(project!)}%</div>
                <div className="text-sm text-muted-foreground">Complete</div>
              </div>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Pending</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.description}</TableCell>
                    <TableCell>₹{payment.totalAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-green-600">₹{payment.paid.toLocaleString()}</TableCell>
                    <TableCell className="text-red-600">₹{payment.payableAmount.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(payment.paymentStatus)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">View Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
                {projectPayments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No payments found for this project.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Payments Management</h1>
          <p className="text-muted-foreground">
            Comprehensive payment tracking and management system
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Payment
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overall">Overall Payments</TabsTrigger>
          <TabsTrigger value="projects">As Per Projects</TabsTrigger>
          <TabsTrigger value="priority">As Per Priority</TabsTrigger>
          <TabsTrigger value="others">Other Payments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overall" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>All Payments Overview</CardTitle>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search payments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SL No.</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Payable Amount</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.slNo}</TableCell>
                      <TableCell>{payment.description}</TableCell>
                      <TableCell>{payment.projectName}</TableCell>
                      <TableCell>{payment.companyName}</TableCell>
                      <TableCell>₹{payment.totalAmount.toLocaleString()}</TableCell>
                      <TableCell>₹{payment.payableAmount.toLocaleString()}</TableCell>
                      <TableCell>{getPriorityBadge(payment.priority)}</TableCell>
                      <TableCell>{getStatusBadge(payment.paymentStatus)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">View Details</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Projects Payment Status</CardTitle>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProjects.map((project) => {
                  const progress = calculateProgress(project);
                  const projectPayments = getProjectPayments(project.id);
                  
                  return (
                    <Card 
                      key={project.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedProject(project.id)}
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <div className="text-sm text-muted-foreground">
                          {projectPayments.length} payment(s)
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span>Total Budget:</span>
                            <span className="font-medium">₹{project.totalCost.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Received:</span>
                            <span className="font-medium text-green-600">₹{project.totalReceived.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Pending:</span>
                            <span className="font-medium text-red-600">₹{project.totalPending.toLocaleString()}</span>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress:</span>
                              <span>{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                {filteredProjects.length === 0 && (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    No projects found. Add your first project to get started.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="priority" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpDown className="h-5 w-5" />
                Priority-based Payments
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Drag and drop to reorder payment priorities
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {priorityPayments.map((payment, index) => (
                  <div
                    key={payment.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragOver={handleDragOver}
                    className="flex items-center gap-4 p-4 border rounded-lg cursor-move hover:bg-gray-50 transition-colors"
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                      <div className="font-medium">{payment.description}</div>
                      <div>₹{payment.amount.toLocaleString()}</div>
                      <div>{payment.vendor}</div>
                      <div>Due: {payment.dueDate}</div>
                      <div className="flex gap-2">
                        <Badge className="bg-blue-100 text-blue-800">Priority {payment.priority}</Badge>
                        {getStatusBadge(payment.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="others" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Other Payments</CardTitle>
              <p className="text-sm text-muted-foreground">
                Payments not related to specific projects
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {otherPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.type}</TableCell>
                      <TableCell>{payment.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{payment.category}</Badge>
                      </TableCell>
                      <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                      <TableCell>{payment.dueDate}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">View Details</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payments;
