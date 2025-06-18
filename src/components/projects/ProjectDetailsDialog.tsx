
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BillingProject } from "@/features/billing/types/billingTypes";

interface ProjectDetailsDialogProps {
  project: BillingProject;
  onClose: () => void;
}

const ProjectDetailsDialog = ({ project }: ProjectDetailsDialogProps) => {
  const calculateProgress = () => {
    if (project.totalCost === 0) return 0;
    return Math.round((project.totalReceived / project.totalCost) * 100);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium">Project Name</h4>
          <p>{project.name}</p>
        </div>
        <div>
          <h4 className="font-medium">Project Owner</h4>
          <p>{project.projectOwner}</p>
        </div>
      </div>
      
      <div>
        <h4 className="font-medium">Description</h4>
        <p>{project.description}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <h4 className="font-medium">Total Cost</h4>
          <p>₹{project.totalCost.toLocaleString()}</p>
        </div>
        <div>
          <h4 className="font-medium">Received</h4>
          <p className="text-green-600">₹{project.totalReceived.toLocaleString()}</p>
        </div>
        <div>
          <h4 className="font-medium">Pending</h4>
          <p className="text-red-600">₹{project.totalPending.toLocaleString()}</p>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Progress</h4>
        <div className="flex items-center gap-2">
          <Progress value={calculateProgress()} className="flex-1" />
          <span className="text-sm font-medium">{calculateProgress()}%</span>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Scope of Works</h4>
        <div className="space-y-2">
          {project.workPlan.map((scope) => (
            <div key={scope.id} className="flex justify-between items-center p-2 bg-muted rounded">
              <span>{scope.departmentName}</span>
              <div className="flex items-center gap-2">
                <Badge variant={scope.status === 'completed' ? 'default' : 'secondary'}>
                  {scope.status}
                </Badge>
                {scope.targetDate && <span className="text-sm text-muted-foreground">{scope.targetDate}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsDialog;
