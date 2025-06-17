import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Download, Calendar, TrendingUp, TrendingDown, DollarSign, Users, Package, FileText, Truck, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface AnalysisDashboardProps {
  reportType: string;
  onClose: () => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AnalysisDashboard = ({ reportType, onClose }: AnalysisDashboardProps) => {
  const [dateRange, setDateRange] = useState("30");
  const [activeTab, setActiveTab] = useState(reportType);
  const [chartData, setChartData] = useState<any>({});
  const [summaryStats, setSummaryStats] = useState<any>({});

  const reportTypes = [
    "Payment Summary",
    "Project Expenditure", 
    "Vendor Payment History",
    "Material Transportation",
    "Budget vs Actual",
    "Payment Due Report"
  ];

  useEffect(() => {
    generateAnalysisData();
  }, [dateRange, activeTab]);

  const generateAnalysisData = () => {
    const days = parseInt(dateRange);
    const mockData = generateMockData(activeTab, days);
    setChartData(mockData.charts);
    setSummaryStats(mockData.summary);
  };

  const generateMockData = (type: string, days: number) => {
    const baseData = Array.from({ length: Math.min(days, 30) }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return {
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' })
      };
    }).reverse();

    switch (type) {
      case "Payment Summary":
        return {
          charts: {
            dailyPayments: baseData.map(d => ({
              ...d,
              amount: Math.floor(Math.random() * 100000) + 50000,
              count: Math.floor(Math.random() * 10) + 1
            })),
            paymentStatus: [
              { name: 'Paid', value: 65, count: 45 },
              { name: 'Pending', value: 25, count: 18 },
              { name: 'Overdue', value: 10, count: 7 }
            ],
            projectPayments: [
              { project: 'Water Treatment Plant', amount: 250000, progress: 75 },
              { project: 'Road Construction', amount: 180000, progress: 60 },
              { project: 'Bridge Project', amount: 320000, progress: 85 },
              { project: 'School Building', amount: 150000, progress: 45 }
            ]
          },
          summary: {
            totalAmount: 1500000,
            totalPayments: 70,
            avgPayment: 21428,
            growthRate: 12.5
          }
        };

      case "Project Expenditure":
        return {
          charts: {
            expenditureByCategory: [
              { category: 'Materials', amount: 450000, percentage: 45 },
              { category: 'Labor', amount: 300000, percentage: 30 },
              { category: 'Equipment', amount: 150000, percentage: 15 },
              { category: 'Others', amount: 100000, percentage: 10 }
            ],
            monthlyExpenditure: baseData.slice(-12).map(d => ({
              ...d,
              budgeted: Math.floor(Math.random() * 80000) + 40000,
              actual: Math.floor(Math.random() * 70000) + 35000
            })),
            projectComparison: [
              { project: 'Water Treatment', budgeted: 500000, actual: 475000, variance: -5 },
              { project: 'Road Construction', budgeted: 300000, actual: 320000, variance: 6.7 },
              { project: 'Bridge Project', budgeted: 600000, actual: 580000, variance: -3.3 }
            ]
          },
          summary: {
            totalBudget: 2000000,
            totalSpent: 1750000,
            remaining: 250000,
            utilizationRate: 87.5
          }
        };

      case "Vendor Payment History":
        return {
          charts: {
            vendorPayments: [
              { vendor: 'ABC Construction', totalPaid: 850000, payments: 15, avgDays: 12 },
              { vendor: 'XYZ Materials', totalPaid: 650000, payments: 22, avgDays: 8 },
              { vendor: 'Tech Solutions', totalPaid: 420000, payments: 18, avgDays: 15 },
              { vendor: 'Steel Works', totalPaid: 380000, payments: 12, avgDays: 10 },
              { vendor: 'Transport Co', totalPaid: 290000, payments: 25, avgDays: 6 }
            ],
            paymentTrends: baseData.map(d => ({
              ...d,
              amount: Math.floor(Math.random() * 80000) + 20000,
              vendors: Math.floor(Math.random() * 5) + 2
            })),
            paymentDelays: [
              { range: '0-7 days', count: 45, percentage: 60 },
              { range: '8-15 days', count: 20, percentage: 27 },
              { range: '16-30 days', count: 8, percentage: 11 },
              { range: '30+ days', count: 2, percentage: 2 }
            ]
          },
          summary: {
            totalVendors: 25,
            totalPaid: 2590000,
            avgPaymentTime: 10.2,
            onTimePayments: 85.5
          }
        };

      case "Material Transportation":
        return {
          charts: {
            deliveryStatus: [
              { status: 'Delivered', count: 145, percentage: 72.5 },
              { status: 'In Transit', count: 32, percentage: 16 },
              { status: 'Delayed', count: 18, percentage: 9 },
              { status: 'Pending', count: 5, percentage: 2.5 }
            ],
            dailyDeliveries: baseData.map(d => ({
              ...d,
              delivered: Math.floor(Math.random() * 15) + 3,
              delayed: Math.floor(Math.random() * 3)
            })),
            routePerformance: [
              { route: 'Route A (City Center)', deliveries: 85, onTime: 92, avgTime: 2.5 },
              { route: 'Route B (Industrial)', deliveries: 65, onTime: 88, avgTime: 3.2 },
              { route: 'Route C (Suburban)', deliveries: 50, onTime: 95, avgTime: 1.8 }
            ],
            materialTypes: [
              { material: 'Steel', quantity: 1250, unit: 'tons' },
              { material: 'Cement', quantity: 2800, unit: 'bags' },
              { material: 'Gravel', quantity: 850, unit: 'cubic meters' },
              { material: 'Equipment', quantity: 45, unit: 'units' }
            ]
          },
          summary: {
            totalDeliveries: 200,
            onTimeRate: 90.5,
            avgDeliveryTime: 2.5,
            totalMaterials: 4945
          }
        };

      case "Budget vs Actual":
        return {
          charts: {
            budgetComparison: baseData.slice(-6).map(d => ({
              ...d,
              budgeted: Math.floor(Math.random() * 200000) + 100000,
              actual: Math.floor(Math.random() * 180000) + 90000,
              variance: Math.floor(Math.random() * 40000) - 20000
            })),
            departmentBudgets: [
              { department: 'PHED', budgeted: 800000, actual: 750000, variance: -6.25 },
              { department: 'PWD', budgeted: 600000, actual: 620000, variance: 3.33 },
              { department: 'Roads', budgeted: 450000, actual: 425000, variance: -5.56 },
              { department: 'Bridges', budgeted: 350000, actual: 380000, variance: 8.57 }
            ],
            budgetUtilization: [
              { category: 'Personnel', budgeted: 500000, used: 475000, remaining: 25000 },
              { category: 'Materials', budgeted: 800000, used: 720000, remaining: 80000 },
              { category: 'Equipment', budgeted: 300000, used: 285000, remaining: 15000 },
              { category: 'Services', budgeted: 200000, used: 190000, remaining: 10000 }
            ]
          },
          summary: {
            totalBudget: 1800000,
            totalSpent: 1670000,
            variance: -7.2,
            remainingBudget: 130000
          }
        };

      case "Payment Due Report":
        return {
          charts: {
            upcomingPayments: [
              { vendor: 'ABC Construction', amount: 125000, dueDate: '2024-01-15', priority: 'high' },
              { vendor: 'Material Suppliers', amount: 85000, dueDate: '2024-01-18', priority: 'medium' },
              { vendor: 'Equipment Rental', amount: 45000, dueDate: '2024-01-20', priority: 'low' },
              { vendor: 'Transport Services', amount: 32000, dueDate: '2024-01-25', priority: 'medium' }
            ],
            paymentTimeline: baseData.slice(-14).map(d => ({
              ...d,
              due: Math.floor(Math.random() * 80000) + 20000,
              overdue: Math.floor(Math.random() * 30000)
            })),
            priorityBreakdown: [
              { priority: 'Critical', count: 5, amount: 280000 },
              { priority: 'High', count: 12, amount: 520000 },
              { priority: 'Medium', count: 18, amount: 340000 },
              { priority: 'Low', count: 8, amount: 160000 }
            ],
            agingAnalysis: [
              { range: 'Current', amount: 850000, count: 25 },
              { range: '1-30 days', amount: 420000, count: 15 },
              { range: '31-60 days', amount: 180000, count: 8 },
              { range: '60+ days', amount: 85000, count: 5 }
            ]
          },
          summary: {
            totalDue: 1535000,
            overdueAmount: 265000,
            upcomingPayments: 43,
            avgPaymentSize: 35698
          }
        };

      default:
        return {
          charts: {
            overview: baseData.map(d => ({
              ...d,
              value: Math.floor(Math.random() * 1000) + 100
            }))
          },
          summary: {
            total: 50000,
            count: 25,
            average: 2000,
            growth: 8.2
          }
        };
    }
  };

  const exportReport = (format: string) => {
    toast.success(`Exporting ${activeTab} analysis as ${format.toUpperCase()}...`);
  };

  const renderPaymentSummaryCharts = () => (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Payment Trends</CardTitle>
            <CardDescription>Payment amounts over selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ amount: { label: "Amount", color: "#8884d8" } }} className="h-[300px]">
              <LineChart data={chartData.dailyPayments}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Status Distribution</CardTitle>
            <CardDescription>Current payment status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ value: { label: "Percentage", color: "#0088FE" } }} className="h-[300px]">
              <PieChart>
                <Pie
                  data={chartData.paymentStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.paymentStatus?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Payment Progress</CardTitle>
          <CardDescription>Payment completion status by project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {chartData.projectPayments?.map((project: any, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{project.project}</span>
                  <span className="text-sm text-muted-foreground">
                    ₹{project.amount.toLocaleString()} ({project.progress}%)
                  </span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );

  const renderProjectExpenditureCharts = () => (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Expenditure by Category</CardTitle>
            <CardDescription>Breakdown of project expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ amount: { label: "Amount", color: "#00C49F" } }} className="h-[300px]">
              <BarChart data={chartData.expenditureByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="amount" fill="#00C49F" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget vs Actual</CardTitle>
            <CardDescription>Monthly budget comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ 
              budgeted: { label: "Budgeted", color: "#8884d8" },
              actual: { label: "Actual", color: "#82ca9d" }
            }} className="h-[300px]">
              <BarChart data={chartData.monthlyExpenditure}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="budgeted" fill="#8884d8" />
                <Bar dataKey="actual" fill="#82ca9d" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Variance Analysis</CardTitle>
          <CardDescription>Budget variance by project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {chartData.projectComparison?.map((project: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{project.project}</h4>
                  <p className="text-sm text-muted-foreground">
                    Budget: ₹{project.budgeted.toLocaleString()} | Actual: ₹{project.actual.toLocaleString()}
                  </p>
                </div>
                <Badge variant={project.variance > 0 ? "destructive" : "default"}>
                  {project.variance > 0 ? "+" : ""}{project.variance}%
                  {project.variance > 0 ? <TrendingUp className="w-3 h-3 ml-1" /> : <TrendingDown className="w-3 h-3 ml-1" />}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );

  const renderVendorPaymentHistoryCharts = () => (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Vendors by Payment Volume</CardTitle>
            <CardDescription>Payment amounts by vendor</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ totalPaid: { label: "Total Paid", color: "#8884d8" } }} className="h-[300px]">
              <BarChart data={chartData.vendorPayments}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="vendor" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="totalPaid" fill="#8884d8" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Delay Analysis</CardTitle>
            <CardDescription>Distribution of payment processing times</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ count: { label: "Count", color: "#00C49F" } }} className="h-[300px]">
              <PieChart>
                <Pie
                  data={chartData.paymentDelays}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ range, percentage }) => `${range}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {chartData.paymentDelays?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Trends</CardTitle>
          <CardDescription>Daily payment amounts and vendor activity</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ 
            amount: { label: "Amount", color: "#8884d8" },
            vendors: { label: "Vendors", color: "#82ca9d" }
          }} className="h-[300px]">
            <LineChart data={chartData.paymentTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="vendors" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );

  const renderMaterialTransportationCharts = () => (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Delivery Status Overview</CardTitle>
            <CardDescription>Current status of all deliveries</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ count: { label: "Count", color: "#0088FE" } }} className="h-[300px]">
              <PieChart>
                <Pie
                  data={chartData.deliveryStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, percentage }) => `${status}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {chartData.deliveryStatus?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Delivery Performance</CardTitle>
            <CardDescription>Delivered vs delayed shipments</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ 
              delivered: { label: "Delivered", color: "#00C49F" },
              delayed: { label: "Delayed", color: "#FF8042" }
            }} className="h-[300px]">
              <AreaChart data={chartData.dailyDeliveries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="delivered" stackId="1" stroke="#00C49F" fill="#00C49F" />
                <Area type="monotone" dataKey="delayed" stackId="1" stroke="#FF8042" fill="#FF8042" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Route Performance Analysis</CardTitle>
          <CardDescription>Performance metrics by delivery route</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {chartData.routePerformance?.map((route: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{route.route}</h4>
                  <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                    <span>Deliveries: {route.deliveries}</span>
                    <span>Avg Time: {route.avgTime}h</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={route.onTime} className="w-20" />
                  <Badge variant={route.onTime > 90 ? "default" : "secondary"}>
                    {route.onTime}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );

  const renderBudgetVsActualCharts = () => (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Budget vs Actual Trends</CardTitle>
            <CardDescription>Monthly comparison of budgeted vs actual spending</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ 
              budgeted: { label: "Budgeted", color: "#8884d8" },
              actual: { label: "Actual", color: "#82ca9d" }
            }} className="h-[300px]">
              <LineChart data={chartData.budgetComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="budgeted" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="actual" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Budget Variance</CardTitle>
            <CardDescription>Budget performance by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ 
              budgeted: { label: "Budgeted", color: "#8884d8" },
              actual: { label: "Actual", color: "#82ca9d" }
            }} className="h-[300px]">
              <BarChart data={chartData.departmentBudgets}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="budgeted" fill="#8884d8" />
                <Bar dataKey="actual" fill="#82ca9d" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Budget Utilization by Category</CardTitle>
          <CardDescription>Budget usage across different expense categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {chartData.budgetUtilization?.map((category: any, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{category.category}</span>
                  <span className="text-sm text-muted-foreground">
                    ₹{category.used.toLocaleString()} / ₹{category.budgeted.toLocaleString()}
                  </span>
                </div>
                <Progress value={(category.used / category.budgeted) * 100} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Used: {((category.used / category.budgeted) * 100).toFixed(1)}%</span>
                  <span>Remaining: ₹{category.remaining.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );

  const renderPaymentDueReportCharts = () => (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Payments</CardTitle>
            <CardDescription>Payments due in the next 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {chartData.upcomingPayments?.map((payment: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{payment.vendor}</h4>
                    <p className="text-sm text-muted-foreground">Due: {payment.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{payment.amount.toLocaleString()}</p>
                    <Badge variant={
                      payment.priority === 'high' ? 'destructive' : 
                      payment.priority === 'medium' ? 'default' : 'secondary'
                    }>
                      {payment.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Priority Distribution</CardTitle>
            <CardDescription>Breakdown by payment priority</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ amount: { label: "Amount", color: "#8884d8" } }} className="h-[300px]">
              <BarChart data={chartData.priorityBreakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="priority" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Timeline</CardTitle>
          <CardDescription>Due vs overdue payments over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ 
            due: { label: "Due", color: "#00C49F" },
            overdue: { label: "Overdue", color: "#FF8042" }
          }} className="h-[300px]">
            <AreaChart data={chartData.paymentTimeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="due" stackId="1" stroke="#00C49F" fill="#00C49F" />
              <Area type="monotone" dataKey="overdue" stackId="1" stroke="#FF8042" fill="#FF8042" />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );

  const renderSummaryCards = () => {
    const getCardsForReportType = (type: string) => {
      switch (type) {
        case "Payment Summary":
          return [
            { title: "Total Amount", value: `₹${summaryStats.totalAmount?.toLocaleString() || 0}`, icon: DollarSign, color: "text-green-600" },
            { title: "Total Payments", value: summaryStats.totalPayments || 0, icon: FileText, color: "text-blue-600" },
            { title: "Average Payment", value: `₹${summaryStats.avgPayment?.toLocaleString() || 0}`, icon: Users, color: "text-purple-600" },
            { title: "Growth Rate", value: `${summaryStats.growthRate || 0}%`, icon: TrendingUp, color: "text-orange-600" }
          ];
        case "Project Expenditure":
          return [
            { title: "Total Budget", value: `₹${summaryStats.totalBudget?.toLocaleString() || 0}`, icon: DollarSign, color: "text-green-600" },
            { title: "Total Spent", value: `₹${summaryStats.totalSpent?.toLocaleString() || 0}`, icon: Package, color: "text-red-600" },
            { title: "Remaining", value: `₹${summaryStats.remaining?.toLocaleString() || 0}`, icon: FileText, color: "text-blue-600" },
            { title: "Utilization", value: `${summaryStats.utilizationRate || 0}%`, icon: TrendingUp, color: "text-purple-600" }
          ];
        case "Vendor Payment History":
          return [
            { title: "Total Vendors", value: summaryStats.totalVendors || 0, icon: Users, color: "text-blue-600" },
            { title: "Total Paid", value: `₹${summaryStats.totalPaid?.toLocaleString() || 0}`, icon: DollarSign, color: "text-green-600" },
            { title: "Avg Payment Time", value: `${summaryStats.avgPaymentTime || 0} days`, icon: Calendar, color: "text-orange-600" },
            { title: "On-Time Rate", value: `${summaryStats.onTimePayments || 0}%`, icon: CheckCircle, color: "text-purple-600" }
          ];
        case "Material Transportation":
          return [
            { title: "Total Deliveries", value: summaryStats.totalDeliveries || 0, icon: Truck, color: "text-blue-600" },
            { title: "On-Time Rate", value: `${summaryStats.onTimeRate || 0}%`, icon: CheckCircle, color: "text-green-600" },
            { title: "Avg Delivery Time", value: `${summaryStats.avgDeliveryTime || 0}h`, icon: Calendar, color: "text-orange-600" },
            { title: "Total Materials", value: summaryStats.totalMaterials || 0, icon: Package, color: "text-purple-600" }
          ];
        case "Budget vs Actual":
          return [
            { title: "Total Budget", value: `₹${summaryStats.totalBudget?.toLocaleString() || 0}`, icon: DollarSign, color: "text-green-600" },
            { title: "Total Spent", value: `₹${summaryStats.totalSpent?.toLocaleString() || 0}`, icon: Package, color: "text-red-600" },
            { title: "Variance", value: `${summaryStats.variance || 0}%`, icon: summaryStats.variance > 0 ? TrendingUp : TrendingDown, color: summaryStats.variance > 0 ? "text-red-600" : "text-green-600" },
            { title: "Remaining", value: `₹${summaryStats.remainingBudget?.toLocaleString() || 0}`, icon: FileText, color: "text-blue-600" }
          ];
        case "Payment Due Report":
          return [
            { title: "Total Due", value: `₹${summaryStats.totalDue?.toLocaleString() || 0}`, icon: DollarSign, color: "text-orange-600" },
            { title: "Overdue Amount", value: `₹${summaryStats.overdueAmount?.toLocaleString() || 0}`, icon: AlertTriangle, color: "text-red-600" },
            { title: "Upcoming Payments", value: summaryStats.upcomingPayments || 0, icon: Calendar, color: "text-blue-600" },
            { title: "Avg Payment Size", value: `₹${summaryStats.avgPaymentSize?.toLocaleString() || 0}`, icon: FileText, color: "text-purple-600" }
          ];
        default:
          return [
            { title: "Total", value: summaryStats.total || 0, icon: FileText, color: "text-blue-600" },
            { title: "Count", value: summaryStats.count || 0, icon: Package, color: "text-green-600" },
            { title: "Average", value: summaryStats.average || 0, icon: TrendingUp, color: "text-purple-600" },
            { title: "Growth", value: `${summaryStats.growth || 0}%`, icon: Calendar, color: "text-orange-600" }
          ];
      }
    };

    const cards = getCardsForReportType(activeTab);

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {cards.map((card, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                  <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                </div>
                <card.icon className={`h-8 w-8 ${card.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderChartContent = () => {
    switch (activeTab) {
      case "Payment Summary":
        return renderPaymentSummaryCharts();
      case "Project Expenditure":
        return renderProjectExpenditureCharts();
      case "Vendor Payment History":
        return renderVendorPaymentHistoryCharts();
      case "Material Transportation":
        return renderMaterialTransportationCharts();
      case "Budget vs Actual":
        return renderBudgetVsActualCharts();
      case "Payment Due Report":
        return renderPaymentDueReportCharts();
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Analysis Dashboard</CardTitle>
              <CardDescription>Detailed analysis for {activeTab}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">Analysis dashboard for {activeTab} is being prepared...</p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analysis Dashboard</h2>
          <p className="text-muted-foreground">Comprehensive analysis and insights</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="15">Last 15 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => exportReport('pdf')}>
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportReport('excel')}>
              <Download className="w-4 h-4 mr-2" />
              Excel
            </Button>
          </div>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>

      <Separator />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 lg:grid-cols-6 h-auto p-1">
          {reportTypes.map((report) => (
            <TabsTrigger key={report} value={report} className="text-xs px-2 py-2">
              {report.replace(' ', '\n')}
            </TabsTrigger>
          ))}
        </TabsList>

        {reportTypes.map((report) => (
          <TabsContent key={report} value={report} className="space-y-6">
            {renderSummaryCards()}
            {renderChartContent()}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AnalysisDashboard;
