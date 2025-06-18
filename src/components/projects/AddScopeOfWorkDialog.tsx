
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { BillingProject } from "@/features/billing/types/billingTypes";

interface AddScopeOfWorkDialogProps {
  project: BillingProject;
  onSuccess: () => void;
}

const AddScopeOfWorkDialog = ({ project, onSuccess }: AddScopeOfWorkDialogProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: "",
    targetDate: "",
    estimatedCost: ""
  });

  const departments = ["Engineering", "Construction", "Design", "Testing", "Quality Control", "Safety"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.department) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newScope = {
      id: Date.now().toString(),
      departmentId: formData.department,
      departmentName: formData.department,
      targetDate: formData.targetDate,
      status: 'pending' as const,
      notes: `${formData.title}: ${formData.description}`
    };

    // Update project in localStorage
    const existingProjects = JSON.parse(localStorage.getItem('billing_projects') || '[]');
    const updatedProjects = existingProjects.map((p: BillingProject) => 
      p.id === project.id 
        ? { ...p, workPlan: [...p.workPlan, newScope] }
        : p
    );
    localStorage.setItem('billing_projects', JSON.stringify(updatedProjects));

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Scope Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          placeholder="Enter scope title"
          required
        />
      </div>

      <div>
        <Label htmlFor="department">Department *</Label>
        <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
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

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Describe this scope of work..."
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="targetDate">Target Date</Label>
          <Input
            id="targetDate"
            type="date"
            value={formData.targetDate}
            onChange={(e) => setFormData({...formData, targetDate: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="estimatedCost">Estimated Cost</Label>
          <Input
            id="estimatedCost"
            type="number"
            value={formData.estimatedCost}
            onChange={(e) => setFormData({...formData, estimatedCost: e.target.value})}
            placeholder="0"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">Add Scope</Button>
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default AddScopeOfWorkDialog;
