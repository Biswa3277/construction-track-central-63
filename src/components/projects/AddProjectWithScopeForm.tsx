
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ScopeOfWork {
  id: string;
  title: string;
  description: string;
  estimatedCost: number;
  timeline: string;
  department: string;
}

interface AddProjectWithScopeFormProps {
  onSuccess: () => void;
  selectedDepartment?: string;
}

const AddProjectWithScopeForm = ({ onSuccess, selectedDepartment }: AddProjectWithScopeFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    projectOwner: "",
    projectOwnerDetails: "",
    totalCost: "",
    status: "planning",
    startDate: "",
    expectedEndDate: "",
    projectManager: ""
  });

  const [scopeOfWorks, setScopeOfWorks] = useState<ScopeOfWork[]>([
    {
      id: "1",
      title: "",
      description: "",
      estimatedCost: 0,
      timeline: "",
      department: selectedDepartment || ""
    }
  ]);

  const departments = ["Civil", "Mechanical", "Design", "Accounts", "Tender", "Purchase", "Automation", "Engineering", "Construction", "Testing", "Quality Control", "Safety"];

  const addScopeOfWork = () => {
    const newScope: ScopeOfWork = {
      id: Date.now().toString(),
      title: "",
      description: "",
      estimatedCost: 0,
      timeline: "",
      department: selectedDepartment || ""
    };
    setScopeOfWorks([...scopeOfWorks, newScope]);
  };

  const removeScopeOfWork = (id: string) => {
    if (scopeOfWorks.length <= 1) {
      toast.error("At least one scope of work is required");
      return;
    }
    setScopeOfWorks(scopeOfWorks.filter(scope => scope.id !== id));
  };

  const updateScopeOfWork = (id: string, field: keyof ScopeOfWork, value: any) => {
    setScopeOfWorks(scopeOfWorks.map(scope => 
      scope.id === id ? { ...scope, [field]: value } : scope
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("Starting project submission...");
      
      if (!formData.name || !formData.projectOwner || !formData.totalCost) {
        toast.error("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      const validScopes = scopeOfWorks.filter(scope => scope.title && scope.description);
      if (validScopes.length === 0) {
        toast.error("Please add at least one valid scope of work");
        setIsSubmitting(false);
        return;
      }

      console.log("Valid scopes:", validScopes);

      const project = {
        id: Date.now().toString(),
        ...formData,
        totalCost: parseFloat(formData.totalCost),
        totalReceived: 0,
        totalPending: parseFloat(formData.totalCost),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        departments: validScopes.map(scope => scope.department).filter(Boolean),
        workPlan: validScopes.map((scope, index) => ({
          id: scope.id,
          departmentId: scope.department,
          departmentName: scope.department,
          targetDate: scope.timeline,
          status: 'pending' as const,
          notes: `${scope.title}: ${scope.description}`,
          estimatedCost: scope.estimatedCost
        })),
        paymentTerms: [],
        ganttTasks: [],
        projectResources: {
          totalBudget: parseFloat(formData.totalCost),
          allocatedBudget: 0,
          labor: 0,
          materials: 0,
          equipment: 0
        },
        bufferDays: 0,
        workingDaysPerWeek: 5,
        riskAssessment: {
          overall: 'medium' as const,
          technical: 'medium' as const,
          financial: 'medium' as const,
          schedule: 'medium' as const
        },
        milestones: [],
        scopeOfWorks: validScopes
      };

      console.log("Project to be saved:", project);

      const existingProjects = JSON.parse(localStorage.getItem('billing_projects') || '[]');
      console.log("Existing projects:", existingProjects.length);
      
      existingProjects.push(project);
      localStorage.setItem('billing_projects', JSON.stringify(existingProjects));
      
      console.log("Project saved successfully");
      toast.success("Project created successfully!");
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        projectOwner: "",
        projectOwnerDetails: "",
        totalCost: "",
        status: "planning",
        startDate: "",
        expectedEndDate: "",
        projectManager: ""
      });
      
      setScopeOfWorks([{
        id: "1",
        title: "",
        description: "",
        estimatedCost: 0,
        timeline: "",
        department: selectedDepartment || ""
      }]);

      onSuccess();
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
          <CardDescription>Basic project details and information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter project name"
                required
              />
            </div>
            <div>
              <Label htmlFor="projectOwner">Project Owner *</Label>
              <Select value={formData.projectOwner} onValueChange={(value) => setFormData({...formData, projectOwner: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project owner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PHED">PHED</SelectItem>
                  <SelectItem value="PWD">PWD</SelectItem>
                  <SelectItem value="Contractor">Contractor</SelectItem>
                  <SelectItem value="Company">Company</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe the project..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="totalCost">Total Cost *</Label>
              <Input
                id="totalCost"
                type="number"
                value={formData.totalCost}
                onChange={(e) => setFormData({...formData, totalCost: e.target.value})}
                placeholder="0"
                required
              />
            </div>
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="expectedEndDate">Expected End Date</Label>
              <Input
                id="expectedEndDate"
                type="date"
                value={formData.expectedEndDate}
                onChange={(e) => setFormData({...formData, expectedEndDate: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="projectManager">Project Manager</Label>
              <Input
                id="projectManager"
                value={formData.projectManager}
                onChange={(e) => setFormData({...formData, projectManager: e.target.value})}
                placeholder="Enter project manager name"
              />
            </div>
            <div>
              <Label htmlFor="status">Project Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Scope of Works</CardTitle>
            <CardDescription>Define multiple scope of works for this project</CardDescription>
          </div>
          <Button type="button" onClick={addScopeOfWork} variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add Scope
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {scopeOfWorks.map((scope, index) => (
            <Card key={scope.id} className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Scope of Work #{index + 1}</h4>
                {scopeOfWorks.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeScopeOfWork(scope.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Scope Title *</Label>
                  <Input
                    value={scope.title}
                    onChange={(e) => updateScopeOfWork(scope.id, 'title', e.target.value)}
                    placeholder="Enter scope title"
                  />
                </div>
                <div>
                  <Label>Department</Label>
                  <Select 
                    value={scope.department} 
                    onValueChange={(value) => updateScopeOfWork(scope.id, 'department', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-4">
                <Label>Description *</Label>
                <Textarea
                  value={scope.description}
                  onChange={(e) => updateScopeOfWork(scope.id, 'description', e.target.value)}
                  placeholder="Describe this scope of work..."
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label>Estimated Cost</Label>
                  <Input
                    type="number"
                    value={scope.estimatedCost}
                    onChange={(e) => updateScopeOfWork(scope.id, 'estimatedCost', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Timeline</Label>
                  <Input
                    type="date"
                    value={scope.timeline}
                    onChange={(e) => updateScopeOfWork(scope.id, 'timeline', e.target.value)}
                  />
                </div>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Project"}
        </Button>
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default AddProjectWithScopeForm;
