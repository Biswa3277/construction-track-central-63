import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { ArrowLeft, Plus, MapPin, Clock, CheckCircle, Calendar as CalendarIcon } from "lucide-react";
import { TeamMember } from "../types/teamTypes";
import { toast } from "sonner";

interface WorkPlan {
  id: string;
  date: string;
  title: string;
  description: string;
  location: string;
  status: 'planned' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

interface TodoItem {
  id: string;
  title: string;
  description: string;
  progress: number;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
}

interface TeamMemberDashboardProps {
  member: TeamMember;
  onBack: () => void;
}

const TeamMemberDashboard = ({ member, onBack }: TeamMemberDashboardProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [workPlans, setWorkPlans] = useState<WorkPlan[]>([]);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [isAddWorkPlanOpen, setIsAddWorkPlanOpen] = useState(false);
  const [isAddTodoOpen, setIsAddTodoOpen] = useState(false);
  const [newWorkPlan, setNewWorkPlan] = useState({
    title: '',
    description: '',
    location: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: null as Date | null
  });

  useEffect(() => {
    // Load existing data for this member
    const storedWorkPlans = JSON.parse(localStorage.getItem(`workPlans_${member.id}`) || '[]');
    const storedTodos = JSON.parse(localStorage.getItem(`todos_${member.id}`) || '[]');
    setWorkPlans(storedWorkPlans);
    setTodos(storedTodos);
  }, [member.id]);

  const getDateStatus = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const hasWorkPlan = workPlans.some(wp => wp.date === dateStr);
    return hasWorkPlan ? 'has-plan' : 'no-plan';
  };

  const getSelectedDateWorkPlans = () => {
    if (!selectedDate) return [];
    const dateStr = selectedDate.toISOString().split('T')[0];
    return workPlans.filter(wp => wp.date === dateStr);
  };

  const handleAddWorkPlan = () => {
    if (!selectedDate || !newWorkPlan.title) return;

    const workPlan: WorkPlan = {
      id: Date.now().toString(),
      date: selectedDate.toISOString().split('T')[0],
      title: newWorkPlan.title,
      description: newWorkPlan.description,
      location: newWorkPlan.location,
      status: 'planned',
      priority: newWorkPlan.priority
    };

    const updatedWorkPlans = [...workPlans, workPlan];
    setWorkPlans(updatedWorkPlans);
    localStorage.setItem(`workPlans_${member.id}`, JSON.stringify(updatedWorkPlans));

    setNewWorkPlan({ title: '', description: '', location: '', priority: 'medium' });
    setIsAddWorkPlanOpen(false);
    toast.success("Work plan added successfully!");
  };

  const handleAddTodo = () => {
    if (!newTodo.title || !newTodo.dueDate) return;

    const todo: TodoItem = {
      id: Date.now().toString(),
      title: newTodo.title,
      description: newTodo.description,
      progress: 0,
      priority: newTodo.priority,
      dueDate: newTodo.dueDate.toISOString().split('T')[0],
      status: 'pending'
    };

    const updatedTodos = [...todos, todo];
    setTodos(updatedTodos);
    localStorage.setItem(`todos_${member.id}`, JSON.stringify(updatedTodos));

    setNewTodo({ title: '', description: '', priority: 'medium', dueDate: null });
    setIsAddTodoOpen(false);
    toast.success("Task added successfully!");
  };

  const updateTodoProgress = (todoId: string, newProgress: number) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === todoId) {
        let newStatus: 'pending' | 'in-progress' | 'completed';
        if (newProgress === 100) {
          newStatus = 'completed';
        } else if (newProgress > 0) {
          newStatus = 'in-progress';
        } else {
          newStatus = 'pending';
        }
        
        return { 
          ...todo, 
          progress: newProgress,
          status: newStatus
        };
      }
      return todo;
    });
    
    setTodos(updatedTodos);
    localStorage.setItem(`todos_${member.id}`, JSON.stringify(updatedTodos));
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800"
    };
    return <Badge className={colors[priority as keyof typeof colors]}>{priority.toUpperCase()}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Team Members
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{member.name} Dashboard</h1>
          <p className="text-muted-foreground">{member.role} - {member.department}</p>
        </div>
      </div>

      {/* Section Headers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex items-center gap-2 mb-2">
          <CalendarIcon className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold">Report Calendar</h2>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <h2 className="text-xl font-semibold">Things To Do</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Work Calendar Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Work Calendar
            </CardTitle>
            <CardDescription>Plan daily work activities and track completion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Calendar
                mode="single"
                selected={selectedDate || undefined}
                onSelect={setSelectedDate}
                className="rounded-md border"
                modifiers={{
                  'has-plan': (date) => getDateStatus(date) === 'has-plan',
                  'no-plan': (date) => getDateStatus(date) === 'no-plan' && date <= new Date()
                }}
                modifiersStyles={{
                  'has-plan': { backgroundColor: '#dcfce7', color: '#166534' },
                  'no-plan': { backgroundColor: '#fecaca', color: '#dc2626' }
                }}
              />
              
              <div className="flex gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-green-200 rounded"></div>
                  <span className="text-sm">Has Work Plan</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-red-200 rounded"></div>
                  <span className="text-sm">No Work Plan</span>
                </div>
              </div>

              {selectedDate && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">
                      Plans for {selectedDate.toLocaleDateString()}
                    </h4>
                    <Button size="sm" onClick={() => setIsAddWorkPlanOpen(true)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Plan
                    </Button>
                  </div>

                  {getSelectedDateWorkPlans().map((plan) => (
                    <div key={plan.id} className="p-3 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">{plan.title}</h5>
                        {getPriorityBadge(plan.priority)}
                      </div>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                      {plan.location && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {plan.location}
                        </div>
                      )}
                    </div>
                  ))}

                  {getSelectedDateWorkPlans().length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No work plans for this date
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Things To Do Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Things To Do
                </CardTitle>
                <CardDescription>Track tasks and progress</CardDescription>
              </div>
              <Button size="sm" onClick={() => setIsAddTodoOpen(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Add Task
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todos.map((todo) => (
                <div key={todo.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium">{todo.title}</h5>
                    {getPriorityBadge(todo.priority)}
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{todo.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Progress</span>
                      <span className="text-sm font-medium">{todo.progress}%</span>
                    </div>
                    <Progress value={todo.progress} className="h-2" />
                    
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={todo.progress}
                        onChange={(e) => updateTodoProgress(todo.id, parseInt(e.target.value) || 0)}
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">
                        Due: {new Date(todo.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {todos.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No tasks yet. Add your first task to get started.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Work Plan Dialog */}
      <Dialog open={isAddWorkPlanOpen} onOpenChange={setIsAddWorkPlanOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Work Plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="plan-title">Title *</Label>
              <Input
                id="plan-title"
                value={newWorkPlan.title}
                onChange={(e) => setNewWorkPlan({ ...newWorkPlan, title: e.target.value })}
                placeholder="Enter work plan title"
              />
            </div>
            
            <div>
              <Label htmlFor="plan-description">Description</Label>
              <Textarea
                id="plan-description"
                value={newWorkPlan.description}
                onChange={(e) => setNewWorkPlan({ ...newWorkPlan, description: e.target.value })}
                placeholder="Describe the work plan"
              />
            </div>
            
            <div>
              <Label htmlFor="plan-location">Location</Label>
              <Input
                id="plan-location"
                value={newWorkPlan.location}
                onChange={(e) => setNewWorkPlan({ ...newWorkPlan, location: e.target.value })}
                placeholder="Work location"
              />
            </div>
            
            <div>
              <Label htmlFor="plan-priority">Priority</Label>
              <Select value={newWorkPlan.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setNewWorkPlan({ ...newWorkPlan, priority: value })}>
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
            
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsAddWorkPlanOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddWorkPlan}>
                Add Work Plan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Todo Dialog */}
      <Dialog open={isAddTodoOpen} onOpenChange={setIsAddTodoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="todo-title">Title *</Label>
              <Input
                id="todo-title"
                value={newTodo.title}
                onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                placeholder="Enter task title"
              />
            </div>
            
            <div>
              <Label htmlFor="todo-description">Description</Label>
              <Textarea
                id="todo-description"
                value={newTodo.description}
                onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                placeholder="Describe the task"
              />
            </div>
            
            <div>
              <Label htmlFor="todo-priority">Priority</Label>
              <Select value={newTodo.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setNewTodo({ ...newTodo, priority: value })}>
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
              <Label htmlFor="todo-due-date">Due Date *</Label>
              <DatePicker
                date={newTodo.dueDate}
                setDate={(date) => setNewTodo({ ...newTodo, dueDate: date })}
                placeholder="Select due date"
              />
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsAddTodoOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTodo}>
                Add Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamMemberDashboard;
