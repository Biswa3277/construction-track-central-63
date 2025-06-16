
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BillingProject } from "../types/billingTypes";

interface ProjectManagementProps {
  refreshTrigger: number;
}

const ProjectManagement = ({ refreshTrigger }: ProjectManagementProps) => {
  const [projects, setProjects] = useState<BillingProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<BillingProject | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  useEffect(() => {
    loadProjects();
  }, [refreshTrigger]);

  const loadProjects = () => {
    const storedProjects = JSON.parse(localStorage.getItem('billing_projects') || '[]');
    setProjects(storedProjects);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "active":
        return <Badge className="bg-blue-100 text-blue-800">Active</Badge>;
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

  const viewProject = (project: BillingProject) => {
    setSelectedProject(project);
    setIsViewDialogOpen(true);
  };

  const deleteProject = (projectId: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      const updatedProjects = projects.filter(p => p.id !== projectId);
      localStorage.setItem('billing_projects', JSON.stringify(updatedProjects));
      setProjects(updatedProjects);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Total Cost</TableHead>
              <TableHead>Received</TableHead>
              <TableHead>Pending</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No projects found. Add your first project to get started.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.projectOwner}</TableCell>
                  <TableCell>₹{project.totalCost.toLocaleString()}</TableCell>
                  <TableCell className="text-green-600">₹{project.totalReceived.toLocaleString()}</TableCell>
                  <TableCell className="text-red-600">₹{project.totalPending.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={calculateProgress(project)} className="h-2 w-20" />
                      <span className="text-xs">{calculateProgress(project)}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(project.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewProject(project)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteProject(project.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Project Details</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Project Name</h4>
                  <p>{selectedProject.name}</p>
                </div>
                <div>
                  <h4 className="font-medium">Project Owner</h4>
                  <p>{selectedProject.projectOwner}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium">Description</h4>
                <p>{selectedProject.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium">Total Cost</h4>
                  <p>₹{selectedProject.totalCost.toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="font-medium">Received</h4>
                  <p className="text-green-600">₹{selectedProject.totalReceived.toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="font-medium">Pending</h4>
                  <p className="text-red-600">₹{selectedProject.totalPending.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Payment Terms</h4>
                <div className="space-y-2">
                  {selectedProject.paymentTerms.map((term) => (
                    <div key={term.id} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span>{term.description}</span>
                      <span>{term.percentage}% - {term.milestone}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Work Plan</h4>
                <div className="space-y-2">
                  {selectedProject.workPlan.map((step)  => (
                    <div key={step.id} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span>{step.departmentName}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant={step.status === 'completed' ? 'default' : 'secondary'}>
                          {step.status}
                        </Badge>
                        {step.targetDate && <span className="text-sm text-muted-foreground">{step.targetDate}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectManagement;
