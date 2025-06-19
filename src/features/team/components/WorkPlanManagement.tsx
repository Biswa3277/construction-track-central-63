
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WorkPlan, WorkPlanPeriod, WorkPlanStatus } from "../types/teamTypes";
import AddWorkPlanForm from "./AddWorkPlanForm";

const generateWorkPlans = (): WorkPlan[] => {
  return [
    {
      id: "wp001",
      memberId: "tm002",
      title: "Project Planning Review",
      description: "Review and update project timelines for Q2",
      location: "Main Office - Conference Room A",
      period: "weekly",
      startDate: "2024-03-01",
      endDate: "2024-03-07",
      status: "current",
      priority: "high",
      createdAt: "2024-02-28",
      updatedAt: "2024-03-01",
      progress: 65
    },
    {
      id: "wp002",
      memberId: "tm003",
      title: "Equipment Installation",
      description: "Install new monitoring equipment at site location",
      location: "Site B - Plant Area",
      period: "daily",
      startDate: "2024-03-15",
      endDate: "2024-03-15",
      status: "upcoming",
      priority: "medium",
      createdAt: "2024-03-01",
      updatedAt: "2024-03-01",
      progress: 0
    },
    {
      id: "wp003",
      memberId: "tm004",
      title: "Monthly HR Review",
      description: "Conduct monthly performance reviews and team assessments",
      location: "HR Department",
      period: "monthly",
      startDate: "2024-02-01",
      endDate: "2024-02-28",
      status: "completed",
      priority: "medium",
      createdAt: "2024-01-25",
      updatedAt: "2024-02-28",
      completedAt: "2024-02-28",
      progress: 100
    }
  ];
};

const WorkPlanManagement = () => {
  const [workPlans, setWorkPlans] = useState<WorkPlan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<WorkPlan[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState<WorkPlanPeriod | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<WorkPlanStatus | "all">("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    const allPlans = generateWorkPlans();
    setWorkPlans(allPlans);
    applyFilters(allPlans);
  }, [searchQuery, selectedPeriod, selectedStatus]);

  const applyFilters = (plans: WorkPlan[]) => {
    let filtered = [...plans];

    if (selectedPeriod !== "all") {
      filtered = filtered.filter(plan => plan.period === selectedPeriod);
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter(plan => plan.status === selectedStatus);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(plan =>
        plan.title.toLowerCase().includes(query) ||
        plan.description.toLowerCase().includes(query) ||
        plan.location.toLowerCase().includes(query)
      );
    }

    setFilteredPlans(filtered);
  };

  const getStatusBadge = (status: WorkPlanStatus) => {
    const statusColors: Record<WorkPlanStatus, string> = {
      "upcoming": "bg-blue-100 text-blue-800",
      "current": "bg-yellow-100 text-yellow-800",
      "completed": "bg-green-100 text-green-800",
      "overdue": "bg-red-100 text-red-800"
    };

    return (
      <Badge className={statusColors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: "low" | "medium" | "high") => {
    const priorityColors = {
      "low": "bg-gray-100 text-gray-800",
      "medium": "bg-orange-100 text-orange-800",
      "high": "bg-red-100 text-red-800"
    };

    return (
      <Badge className={priorityColors[priority]}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const handleAddSuccess = () => {
    setIsAddDialogOpen(false);
    const allPlans = generateWorkPlans();
    setWorkPlans(allPlans);
    applyFilters(allPlans);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Work Plan Management</CardTitle>
              <CardDescription>Manage team work plans and schedules</CardDescription>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Work Plan
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search work plans..."
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
                  <TableHead>Title</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{plan.title}</div>
                        <div className="text-sm text-muted-foreground">{plan.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="text-sm">{plan.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {plan.period.charAt(0).toUpperCase() + plan.period.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(plan.status)}</TableCell>
                    <TableCell>{getPriorityBadge(plan.priority)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${plan.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{plan.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{plan.startDate}</div>
                        <div className="text-muted-foreground">to {plan.endDate}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredPlans.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No work plans found matching the current criteria.
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Add New Work Plan</DialogTitle>
          </DialogHeader>
          <AddWorkPlanForm onSuccess={handleAddSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkPlanManagement;
