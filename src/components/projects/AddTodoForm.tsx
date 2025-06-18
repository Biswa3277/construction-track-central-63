
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

interface AddTodoFormProps {
  onSuccess: () => void;
}

const AddTodoForm = ({ onSuccess }: AddTodoFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    progress: 0,
    targetDate: "",
    remarks: "",
    status: "pending",
    priority: "medium"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.targetDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const todo = {
      id: Date.now().toString(),
      ...formData,
      createdDate: new Date().toISOString(),
    };

    const existingTodos = JSON.parse(localStorage.getItem('project_todos') || '[]');
    existingTodos.push(todo);
    localStorage.setItem('project_todos', JSON.stringify(existingTodos));

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Task Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          placeholder="Enter task name"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Task Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Describe the task..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="progress">Progress: {formData.progress}%</Label>
        <Slider
          value={[formData.progress]}
          onValueChange={(value) => setFormData({...formData, progress: value[0]})}
          max={100}
          step={5}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="targetDate">Target Date *</Label>
        <Input
          id="targetDate"
          type="date"
          value={formData.targetDate}
          onChange={(e) => setFormData({...formData, targetDate: e.target.value})}
          required
        />
      </div>

      <div>
        <Label htmlFor="remarks">Remarks</Label>
        <Textarea
          id="remarks"
          value={formData.remarks}
          onChange={(e) => setFormData({...formData, remarks: e.target.value})}
          placeholder="Any additional notes or remarks..."
          rows={2}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">Add Task</Button>
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default AddTodoForm;
