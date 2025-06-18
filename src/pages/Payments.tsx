
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Filter, ArrowUpDown, GripVertical, Upload, Download, FileSpreadsheet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import PaymentFilterBar from "@/components/payments/PaymentFilterBar";

interface VendorPayment {
  id: string;
  slNo: number;
  description: string;
  projectName: string;
  companyName: string;
  poReference: string;
  poDate: string;
  acNo: string;
  ifscCode: string;
  branchBank: string;
  totalAmount: number;
  paid: number;
  payDate?: string;
  payableAmount: number;
  priority: "High" | "Medium" | "Low";
  remarks?: string;
  status: "paid" | "partial" | "unpaid" | "hold";
  transactionStatus?: string;
}

const Payments = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("overall");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [filters, setFilters] = useState({});

  const [vendorPayments, setVendorPayments] = useState<VendorPayment[]>([
    {
      id: "1",
      slNo: 1,
      description: "Maintain Marxian's amount return",
      projectName: "Piyong IoT(Namsal)",
      companyName: "King Longkai (Account Holder Name)",
      poReference: "PO123456",
      poDate: "2023-04-15",
      acNo: "11522669748",
      ifscCode: "SBIN0013311",
      branchBank: "SBI/Namsal",
      totalAmount: 300000,
      paid: 0,
      payableAmount: 300000,
      priority: "High",
      status: "unpaid",
    },
    {
      id: "2",
      slNo: 2,
      description: "M2M Sim Card",
      projectName: "Sample Testing",
      companyName: "A-TEL TECH COMMUNICATION SOLUTIONS",
      poReference: "PO789012",
      poDate: "2023-05-20",
      acNo: "42977648534",
      ifscCode: "SBIN0011564",
      branchBank: "MAHAVIR ENCLAVE STATE BANK OF INDIA",
      totalAmount: 3717,
      paid: 0,
      payableAmount: 3717,
      priority: "Medium",
      status: "unpaid",
    },
    {
      id: "3",
      slNo: 3,
      description: "Control Valve for Sample Testing",
      projectName: "Sample Testing",
      companyName: "BMP SYSTEMS",
      poReference: "PO345678",
      poDate: "2023-06-25",
      acNo: "50200006302332",
      ifscCode: "HDFC0001923",
      branchBank: "KASBA HDFC BANK LTD",
      totalAmount: 81510,
      paid: 81510,
      payableAmount: 0,
      priority: "High",
      status: "paid",
      payDate: "2023-07-01",
      remarks: "Amount Updated"
    },
    {
      id: "4",
      slNo: 4,
      description: "Panel Internal Instruments",
      projectName: "YACHULI",
      companyName: "P.R.S. ENTERPRISE",
      poReference: "PO456789",
      poDate: "2023-07-10",
      acNo: "101500019900115",
      ifscCode: "ESNAP001240",
      branchBank: "KOLKATA G.C. AVENUE",
      totalAmount: 76891,
      paid: 0,
      payableAmount: 76891,
      priority: "High",
      status: "unpaid",
    },
    {
      id: "5",
      slNo: 5,
      description: "Gateway module",
      projectName: "Amni WTP",
      companyName: "Augmate Technologies Pvt Ltd",
      poReference: "PO567890",
      poDate: "2023-08-15",
      acNo: "71695500000318",
      ifscCode: "BARB0DBMAKA",
      branchBank: "Makaprura",
      totalAmount: 342234,
      paid: 101545,
      payableAmount: 240689,
      priority: "Medium",
      status: "partial",
      payDate: "2023-09-01",
      remarks: "Amount Updated"
    }
  ]);

  const [priorityPayments, setPriorityPayments] = useState<VendorPayment[]>([]);
  const [otherPayments] = useState([
    {
      id: "t1",
      type: "Transportation",
      description: "Vehicle fuel and maintenance",
      vendor: "Local Transport Co",
      amount: 25000,
      status: "pending",
      dueDate: "2024-01-18"
    },
    {
      id: "t2",
      type: "Office Rent",
      description: "Monthly office rent - December",
      vendor: "Property Management",
      amount: 45000,
      status: "paid",
      dueDate: "2024-01-05"
    },
    {
      id: "t3",
      type: "Utilities",
      description: "Electricity bill - December",
      vendor: "State Electricity Board",
      amount: 18000,
      status: "pending",
      dueDate: "2024-01-22"
    }
  ]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
    // Initialize priority payments from vendor payments
    setPriorityPayments(vendorPayments.filter(p => p.priority === "High").slice(0, 5));
  }, [searchParams, vendorPayments]);

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
        return <Badge className="bg-red-100 text-red-800">Unpaid</Badge>;
      case "hold":
        return <Badge className="bg-gray-100 text-gray-800">On Hold</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High":
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case "Medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case "Low":
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
      
      setPriorityPayments(newPayments);
      toast.success("Payment priority updated successfully!");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const getProjectPayments = (projectName: string) => {
    return vendorPayments.filter(payment => payment.projectName === projectName);
  };

  const getUniqueProjects = () => {
    const projects = [...new Set(vendorPayments.map(p => p.projectName))];
    return projects.map(name => {
      const projectPayments = getProjectPayments(name);
      const totalAmount = projectPayments.reduce((sum, p) => sum + p.totalAmount, 0);
      const totalPaid = projectPayments.reduce((sum, p) => sum + p.paid, 0);
      const totalPending = projectPayments.reduce((sum, p) => sum + p.payableAmount, 0);
      
      return {
        name,
        totalPayments: projectPayments.length,
        totalAmount,
        totalPaid,
        totalPending,
        completionPercentage: totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 0
      };
    });
  };

  const filteredPayments = vendorPayments.filter(payment => 
    payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadTemplate = () => {
    toast.success("Excel template will be downloaded");
  };

  const exportData = () => {
    toast.success("Payment data exported to Excel");
  };

  if (selectedProject) {
    const projectPayments = getProjectPayments(selectedProject);
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Button variant="outline" onClick={() => setSelectedProject(null)}>
              ← Back to Projects
            </Button>
            <h1 className="text-3xl font-bold mt-2">Payments - {selectedProject}</h1>
            <p className="text-muted-foreground">All vendor payments for this project</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportData}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={() => setIsAddPaymentOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Payment
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Payment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  ₹{projectPayments.reduce((sum, p) => sum + p.totalAmount, 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Amount</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ₹{projectPayments.reduce((sum, p) => sum + p.paid, 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Paid</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  ₹{projectPayments.reduce((sum, p) => sum + p.payableAmount, 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{projectPayments.length}</div>
                <div className="text-sm text-muted-foreground">Total Payments</div>
              </div>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SL No.</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>PO Reference</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Pending</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.slNo}</TableCell>
                    <TableCell>{payment.description}</TableCell>
                    <TableCell>{payment.companyName}</TableCell>
                    <TableCell>{payment.poReference}</TableCell>
                    <TableCell>₹{payment.totalAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-green-600">₹{payment.paid.toLocaleString()}</TableCell>
                    <TableCell className="text-red-600">₹{payment.payableAmount.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell>{getPriorityBadge(payment.priority)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">View Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
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
          <h1 className="text-3xl font-bold">Vendor Payments Management</h1>
          <p className="text-muted-foreground">
            Track and manage all vendor payments for projects and operations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={downloadTemplate}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Template
          </Button>
          <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" onClick={exportData}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsAddPaymentOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Payment
          </Button>
        </div>
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
                <CardTitle>All Vendor Payments</CardTitle>
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
              <PaymentFilterBar onFilterChange={setFilters} />
              
              <div className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SL No.</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>PO Reference</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Paid</TableHead>
                      <TableHead>Pending</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.slNo}</TableCell>
                        <TableCell>{payment.description}</TableCell>
                        <TableCell>{payment.projectName}</TableCell>
                        <TableCell>{payment.companyName}</TableCell>
                        <TableCell>{payment.poReference}</TableCell>
                        <TableCell>₹{payment.totalAmount.toLocaleString()}</TableCell>
                        <TableCell className="text-green-600">₹{payment.paid.toLocaleString()}</TableCell>
                        <TableCell className="text-red-600">₹{payment.payableAmount.toLocaleString()}</TableCell>
                        <TableCell>{getPriorityBadge(payment.priority)}</TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">View Details</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Project-wise Payment Status</CardTitle>
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
                {getUniqueProjects().map((project) => (
                  <Card 
                    key={project.name} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedProject(project.name)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <div className="text-sm text-muted-foreground">
                        {project.totalPayments} payment(s)
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Total Amount:</span>
                          <span className="font-medium">₹{project.totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Paid:</span>
                          <span className="font-medium text-green-600">₹{project.totalPaid.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Pending:</span>
                          <span className="font-medium text-red-600">₹{project.totalPending.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Completion:</span>
                          <span className="font-medium">{project.completionPercentage}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                      <div className="font-medium">{payment.description}</div>
                      <div>₹{payment.totalAmount.toLocaleString()}</div>
                      <div>{payment.companyName}</div>
                      <div>{payment.projectName}</div>
                      <div>Due: {payment.poDate}</div>
                      <div className="flex gap-2">
                        {getPriorityBadge(payment.priority)}
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
                Non-project payments like transportation, utilities, etc.
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Vendor</TableHead>
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
                      <TableCell>{payment.vendor}</TableCell>
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

      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Payments from Excel</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Upload an Excel file with payment data. Make sure to follow the template format.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={downloadTemplate} className="flex-1">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Download Template
              </Button>
              <Button className="flex-1">
                <Upload className="mr-2 h-4 w-4" />
                Choose File
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Payments;
