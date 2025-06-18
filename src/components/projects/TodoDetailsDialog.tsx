
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Todo {
  id: string;
  name: string;
  description: string;
  progress: number;
  targetDate: string;
  createdDate: string;
  remarks: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

interface TodoDetailsDialogProps {
  todo: Todo;
  onClose: () => void;
  onUpdate: () => void;
}

const TodoDetailsDialog = ({ todo, onClose, onUpdate }: TodoDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(todo);

  const handleSave = () => {
    const existingTodos = JSON.parse(localStorage.getItem('project_todos') || '[]');
    const updatedTodos = existingTodos.map((t: Todo) => 
      t.id === todo.id ? formData : t
    );
    localStorage.setItem('project_todos', JSON.stringify(updatedTodos));
    
    setIsEditing(false);
    onUpdate();
    toast.success("Task updated successfully!");
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return <Badge variant="secondary">Medium</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Task Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select value={formData.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setFormData({...formData, priority: value})}>
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
            <Select value={formData.status} onValueChange={(value: 'pending' | 'in-progress' | 'completed') => setFormData({...formData, status: value})}>
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
          <Label htmlFor="targetDate">Target Date</Label>
          <Input
            id="targetDate"
            type="date"
            value={formData.targetDate}
            onChange={(e) => setFormData({...formData, targetDate: e.target.value})}
          />
        </div>

        <div>
          <Label htmlFor="remarks">Remarks</Label>
          <Textarea
            id="remarks"
            value={formData.remarks}
            onChange={(e) => setFormData({...formData, remarks: e.target.value})}
            rows={2}
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave} className="flex-1">Save Changes</Button>
          <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold">{todo.name}</h3>
        <Button variant="outline" onClick={() => setIsEditing(true)}>Edit</Button>
      </div>

      <div>
        <h4 className="font-medium mb-2">Description</h4>
        <p className="text-muted-foreground">{todo.description || "No description provided"}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Priority</h4>
          {getPriorityBadge(todo.priority)}
        </div>
        <div>
          <h4 className="font-medium mb-2">Status</h4>
          {getStatusBadge(todo.status)}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Progress</h4>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${todo.progress}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium">{todo.progress}%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-1">Created Date</h4>
          <p className="text-sm text-muted-foreground">{new Date(todo.createdDate).toLocaleDateString()}</p>
        </div>
        <div>
          <h4 className="font-medium mb-1">Target Date</h4>
          <p className="text-sm text-muted-foreground">{new Date(todo.targetDate).toLocaleDateString()}</p>
        </div>
      </div>

      {todo.remarks && (
        <div>
          <h4 className="font-medium mb-2">Remarks</h4>
          <p className="text-muted-foreground">{todo.remarks}</p>
        </div>
      )}
    </div>
  );
};

export default TodoDetailsDialog;
