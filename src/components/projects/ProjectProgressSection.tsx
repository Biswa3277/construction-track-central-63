
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Eye, Edit, FolderPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import AddProjectWithScopeForm from "./AddProjectWithScopeForm";
import ProjectDetailsDialog from "./ProjectDetailsDialog";
import AddScopeOfWorkDialog from "./AddScopeOfWorkDialog";
import { BillingProject } from "@/features/billing/types/billingTypes";

interface ProjectProgressSectionProps {
  projects: BillingProject[];
  onProjectsUpdate: () => void;
}

const ProjectProgressSection = ({ projects, onProjectsUpdate }: ProjectProgressSectionProps) => {
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isProjectDetailsOpen, setIsProjectDetailsOpen] = useState(false);
  const [isAddScopeOpen, setIsAddScopeOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<BillingProject | null>(null);

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

  const handleAddProject = () => {
    setIsAddProjectOpen(false);
    onProjectsUpdate();
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
    onProjectsUpdate();
    toast.success("Scope of work added successfully!");
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Project Progress & Management</CardTitle>
            <CardDescription>Manage ongoing projects and their scope of works</CardDescription>
          </div>
          <Button onClick={() => setIsAddProjectOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No projects found. Add your first project to get started.</p>
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
                    <TableHead>Scope Count</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
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
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
          </DialogHeader>
          <AddProjectWithScopeForm onSuccess={handleAddProject} />
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

export default ProjectProgressSection;
