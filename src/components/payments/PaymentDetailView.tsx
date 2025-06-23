import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Truck, FileCheck, FileUp, ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import TransportationStatus from "../transportation/TransportationStatus";
import { useState } from "react";
import { toast } from "sonner";

const PaymentDetailView = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  
  // This would typically come from an API
  const payment = {
    id: "1",
    slNo: 1,
    description: "Maintain Marxian's amount return",
    projectName: "Piyong IoT(Namsal)",
    companyName: "King Longkai (Account Holder Name)",
    poReference: "PO123456",
    poDate: "2023-04-15",
    accountNo: "11822669748",
    ifscCode: "SBIN0013311",
    branchBank: "SBI/Namsai",
    totalAmount: 300000,
    paid: 0,
    payDate: "",
    payableAmount: 300000,
    priority: "High",
    remarks: "",
    transportationStatus: "pending",
    paymentStatus: "unpaid",
    documents: [
      { name: "Invoice-123.pdf", type: "invoice", uploadedAt: "2023-04-10" },
      { name: "PO-123.pdf", type: "purchase-order", uploadedAt: "2023-04-05" }
    ],
    transportInfo: {
      carrier: "",
      trackingNumber: "",
      estimatedDelivery: "",
      currentStatus: "Not Shipped",
      updates: []
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="status-paid">Paid</Badge>;
      case "partial":
        return <Badge className="status-partial">Partially Paid</Badge>;
      case "unpaid":
        return <Badge className="status-unpaid">Unpaid</Badge>;
      case "hold":
        return <Badge className="status-hold">On Hold</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getTransportStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="transport-pending">Pending</Badge>;
      case "in-transit":
        return <Badge className="transport-in-transit">In Transit</Badge>;
      case "delivered":
        return <Badge className="transport-delivered">Delivered</Badge>;
      case "not-applicable":
        return <Badge variant="outline">N/A</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleFileUpload = () => {
    toast.success("File uploaded successfully");
  };

  const handlePaymentUpdate = () => {
    toast.success("Payment information updated");
  };

  const handleTransportUpdate = () => {
    toast.success("Transportation information updated");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/payments">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold">Payment #{payment.slNo}</h2>
          <p className="text-muted-foreground">{payment.description}</p>
        </div>
      </div>

      <Tabs defaultValue="details" onValueChange={(value) => setActiveTab(parseInt(value.split('-')[1]))} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger>Payment Details</TabsTrigger>
          <TabsTrigger>Transportation</TabsTrigger>
          <TabsTrigger>Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>Details about the payment and vendor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Project</h3>
                    <p>{payment.projectName}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Vendor</h3>
                    <p>{payment.companyName}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">PO Reference</h3>
                    <p>{payment.poReference || "N/A"}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">PO Date</h3>
                    <p>{payment.poDate || "N/A"}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Account Number</h3>
                    <p>{payment.accountNo}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">IFSC Code</h3>
                    <p>{payment.ifscCode}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Branch/Bank</h3>
                    <p>{payment.branchBank}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Priority</h3>
                    <p>{payment.priority || "Normal"}</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">Payment Status</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-muted-foreground text-sm">Total Amount</div>
                      <div className="text-xl font-bold">₹{payment.totalAmount.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-muted-foreground text-sm">Paid Amount</div>
                      <div className="text-xl font-bold">₹{payment.paid.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-muted-foreground text-sm">Payable Amount</div>
                      <div className="text-xl font-bold">₹{payment.payableAmount.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="font-medium">Current Status:</span>
                  {getPaymentStatusBadge(payment.paymentStatus)}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handlePaymentUpdate}>Update Payment</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transportation Details</CardTitle>
              <CardDescription>Track the shipping status of materials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Current Status:</span>
                  {getTransportStatusBadge(payment.transportationStatus)}
                </div>
                
                <TransportationStatus status={payment.transportInfo.currentStatus} updates={payment.transportInfo.updates} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Carrier</h3>
                      <p>{payment.transportInfo.carrier || "Not assigned"}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Tracking Number</h3>
                      <p>{payment.transportInfo.trackingNumber || "Not available"}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Estimated Delivery</h3>
                      <p>{payment.transportInfo.estimatedDelivery || "Not available"}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Current Status</h3>
                      <p>{payment.transportInfo.currentStatus}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleTransportUpdate}>Update Transportation</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Invoices, Purchase Orders, and Chalans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payment.documents.length > 0 ? (
                  <div className="space-y-2">
                    {payment.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">Uploaded on {doc.uploadedAt}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">View</Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No documents uploaded yet
                  </div>
                )}
                
                <Button onClick={handleFileUpload} className="w-full">
                  <FileUp className="mr-2 h-4 w-4" />
                  Upload New Document
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentDetailView;
