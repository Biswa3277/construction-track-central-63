
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, MapPin, Clock, CheckCircle, Calendar as CalendarIcon, Save, Edit, Trash2 } from "lucide-react";
import { TeamMember } from "../types/teamTypes";
import { toast } from "sonner";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, differenceInDays } from "date-fns";

interface WorkPlan {
  id: string;
  startDate: string;
  endDate: string;
  title: string;
  description: string;
  location: string;
  status: 'planned' | 'completed' | 'leave';
  priority: 'low' | 'medium' | 'high';
  startTime?: string;
  endTime?: string;
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
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [workPlans, setWorkPlans] = useState<WorkPlan[]>([]);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [isAddTodoOpen, setIsAddTodoOpen] = useState(false);
  const [selectedWorkPlan, setSelectedWorkPlan] = useState<WorkPlan | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [workPlanForm, setWorkPlanForm] = useState({
    title: '',
    description: '',
    location: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    startTime: '',
    endTime: '',
    status: 'planned' as 'planned' | 'completed' | 'leave'
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

  useEffect(() => {
    // Reset form when dates change
    if (selectedDates.length > 0) {
      // Check if there's an existing work plan for these dates
      const existingPlan = workPlans.find(wp => {
        const planStart = new Date(wp.startDate);
        const planEnd = new Date(wp.endDate);
        return selectedDates.some(date => {
          const dateStr = date.toISOString().split('T')[0];
          return dateStr >= wp.startDate && dateStr <= wp.endDate;
        });
      });
      
      if (existingPlan) {
        setSelectedWorkPlan(existingPlan);
        setWorkPlanForm({
          title: existingPlan.title,
          description: existingPlan.description,
          location: existingPlan.location,
          priority: existingPlan.priority,
          startTime: existingPlan.startTime || '',
          endTime: existingPlan.endTime || '',
          status: existingPlan.status
        });
        setIsEditing(false);
      } else {
        setSelectedWorkPlan(null);
        setWorkPlanForm({
          title: '',
          description: '',
          location: '',
          priority: 'medium',
          startTime: '',
          endTime: '',
          status: 'planned'
        });
        setIsEditing(true);
      }
    } else {
      setSelectedWorkPlan(null);
      setIsEditing(false);
    }
  }, [selectedDates, workPlans]);

  const getDateStatus = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const workPlan = workPlans.find(wp => dateStr >= wp.startDate && dateStr <= wp.endDate);
    
    if (workPlan) {
      return workPlan.status === 'leave' ? 'leave' : 'has-plan';
    }
    return 'no-plan';
  };

  const getDateWorkPlan = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return workPlans.find(wp => dateStr >= wp.startDate && dateStr <= wp.endDate);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    const isAlreadySelected = selectedDates.some(d => d.toDateString() === date.toDateString());
    
    if (isAlreadySelected) {
      // Remove date from selection
      setSelectedDates(selectedDates.filter(d => d.toDateString() !== date.toDateString()));
    } else {
      // Add date to selection (max 6 days)
      if (selectedDates.length < 6) {
        setSelectedDates([...selectedDates, date].sort((a, b) => a.getTime() - b.getTime()));
      } else {
        toast.error("Maximum 6 days can be selected at once");
      }
    }
  };

  const handleSaveWorkPlan = () => {
    if (selectedDates.length === 0 || !workPlanForm.title) {
      toast.error("Please select dates and fill in the required fields");
      return;
    }

    const sortedDates = selectedDates.sort((a, b) => a.getTime() - b.getTime());
    const startDate = sortedDates[0].toISOString().split('T')[0];
    const endDate = sortedDates[sortedDates.length - 1].toISOString().split('T')[0];

    const newWorkPlan: WorkPlan = {
      id: selectedWorkPlan?.id || Date.now().toString(),
      startDate,
      endDate,
      title: workPlanForm.title,
      description: workPlanForm.description,
      location: workPlanForm.location,
      status: workPlanForm.status,
      priority: workPlanForm.priority,
      startTime: workPlanForm.startTime,
      endTime: workPlanForm.endTime
    };

    let updatedWorkPlans;
    if (selectedWorkPlan) {
      // Update existing
      updatedWorkPlans = workPlans.map(wp => wp.id === selectedWorkPlan.id ? newWorkPlan : wp);
    } else {
      // Add new
      updatedWorkPlans = [...workPlans, newWorkPlan];
    }

    setWorkPlans(updatedWorkPlans);
    localStorage.setItem(`workPlans_${member.id}`, JSON.stringify(updatedWorkPlans));
    setSelectedWorkPlan(newWorkPlan);
    setIsEditing(false);
    setSelectedDates([]);
    toast.success("Work plan saved successfully!");
  };

  const handleDeleteWorkPlan = () => {
    if (!selectedWorkPlan) return;

    const updatedWorkPlans = workPlans.filter(wp => wp.id !== selectedWorkPlan.id);
    setWorkPlans(updatedWorkPlans);
    localStorage.setItem(`workPlans_${member.id}`, JSON.stringify(updatedWorkPlans));
    setSelectedWorkPlan(null);
    setSelectedDates([]);
    setIsEditing(false);
    toast.success("Work plan deleted successfully!");
  };

  const handleEditWorkPlan = () => {
    if (!selectedWorkPlan) return;
    
    // Generate dates from start to end
    const startDate = new Date(selectedWorkPlan.startDate);
    const endDate = new Date(selectedWorkPlan.endDate);
    const dates = eachDayOfInterval({ start: startDate, end: endDate });
    
    setSelectedDates(dates);
    setIsEditing(true);
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

  const getStatusBadge = (status: string) => {
    const colors = {
      planned: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      leave: "bg-gray-100 text-gray-800"
    };
    return <Badge className={colors[status as keyof typeof colors]}>{status.toUpperCase()}</Badge>;
  };

  const getMonthWorkPlans = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    
    return workPlans.filter(wp => {
      const planStart = new Date(wp.startDate);
      const planEnd = new Date(wp.endDate);
      return planStart <= monthEnd && planEnd >= monthStart;
    });
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

      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Report Calendar
          </TabsTrigger>
          <TabsTrigger value="todos" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Things To Do
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-6">
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-6 w-6" />
              <h2 className="text-2xl font-bold">Work Calendar</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Calendar Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Calendar</CardTitle>
                  <CardDescription>Select dates to plan work activities (max 6 days)</CardDescription>
                </CardHeader>
                <CardContent>
                  <TooltipProvider>
                    <Calendar
                      mode="single"
                      selected={undefined}
                      onSelect={handleDateSelect}
                      month={currentMonth}
                      onMonthChange={setCurrentMonth}
                      className="rounded-md border w-full"
                      modifiers={{
                        'has-plan': (date) => getDateStatus(date) === 'has-plan',
                        'no-plan': (date) => getDateStatus(date) === 'no-plan' && date <= new Date(),
                        'leave': (date) => getDateStatus(date) === 'leave',
                        'selected': (date) => selectedDates.some(d => d.toDateString() === date.toDateString())
                      }}
                      modifiersStyles={{
                        'has-plan': { backgroundColor: '#dcfce7', color: '#166534' },
                        'no-plan': { backgroundColor: '#fecaca', color: '#dc2626' },
                        'leave': { backgroundColor: '#e5e7eb', color: '#6b7280' },
                        'selected': { backgroundColor: '#3b82f6', color: '#ffffff' }
                      }}
                      components={{
                        Day: ({ date, ...props }) => {
                          const workPlan = getDateWorkPlan(date);
                          const isSelected = selectedDates.some(d => d.toDateString() === date.toDateString());
                          
                          const dayElement = (
                            <button 
                              {...props}
                              onClick={() => handleDateSelect(date)}
                              className={`h-9 w-9 p-0 font-normal hover:bg-accent hover:text-accent-foreground ${isSelected ? 'bg-primary text-primary-foreground' : ''}`}
                            >
                              {date.getDate()}
                            </button>
                          );

                          if (workPlan) {
                            return (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  {dayElement}
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="p-2">
                                    <p className="font-medium">{workPlan.title}</p>
                                    {workPlan.location && (
                                      <p className="text-sm flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {workPlan.location}
                                      </p>
                                    )}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            );
                          }

                          return dayElement;
                        }
                      }}
                    />
                  </TooltipProvider>
                  
                  <div className="flex gap-2 mt-4 text-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-green-200 rounded"></div>
                      <span>Has Work Plan</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-red-200 rounded"></div>
                      <span>No Work Plan</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-gray-300 rounded"></div>
                      <span>On Leave</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span>Selected</span>
                    </div>
                  </div>

                  {selectedDates.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="font-medium">Selected Dates ({selectedDates.length}/6):</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedDates.map(date => format(date, 'MMM dd')).join(', ')}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Task Details Panel */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {selectedDates.length > 0 
                      ? `Work Plan for ${selectedDates.length} day${selectedDates.length > 1 ? 's' : ''}` 
                      : selectedWorkPlan 
                        ? `Work Plan Details` 
                        : 'Select dates to plan work'
                    }
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(selectedDates.length > 0 || selectedWorkPlan) ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          value={workPlanForm.title}
                          onChange={(e) => setWorkPlanForm({ ...workPlanForm, title: e.target.value })}
                          placeholder="Enter work plan title"
                          disabled={!isEditing}
                        />
                      </div>

                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={workPlanForm.description}
                          onChange={(e) => setWorkPlanForm({ ...workPlanForm, description: e.target.value })}
                          placeholder="Describe the work plan"
                          disabled={!isEditing}
                        />
                      </div>

                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={workPlanForm.location}
                          onChange={(e) => setWorkPlanForm({ ...workPlanForm, location: e.target.value })}
                          placeholder="Work location"
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="start-time">Start Time</Label>
                          <Input
                            id="start-time"
                            type="time"
                            value={workPlanForm.startTime}
                            onChange={(e) => setWorkPlanForm({ ...workPlanForm, startTime: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="end-time">End Time</Label>
                          <Input
                            id="end-time"
                            type="time"
                            value={workPlanForm.endTime}
                            onChange={(e) => setWorkPlanForm({ ...workPlanForm, endTime: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="priority">Priority</Label>
                          <Select 
                            value={workPlanForm.priority} 
                            onValueChange={(value: 'low' | 'medium' | 'high') => setWorkPlanForm({ ...workPlanForm, priority: value })}
                            disabled={!isEditing}
                          >
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
                          <Select 
                            value={workPlanForm.status} 
                            onValueChange={(value: 'planned' | 'completed' | 'leave') => setWorkPlanForm({ ...workPlanForm, status: value })}
                            disabled={!isEditing}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="planned">Planned</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="leave">On Leave</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-4">
                        {isEditing ? (
                          <>
                            <Button onClick={handleSaveWorkPlan} className="flex items-center gap-2">
                              <Save className="h-4 w-4" />
                              Save
                            </Button>
                            {selectedWorkPlan && (
                              <Button variant="outline" onClick={() => setIsEditing(false)}>
                                Cancel
                              </Button>
                            )}
                          </>
                        ) : (
                          selectedWorkPlan && (
                            <>
                              <Button onClick={handleEditWorkPlan} className="flex items-center gap-2">
                                <Edit className="h-4 w-4" />
                                Edit
                              </Button>
                              <Button variant="destructive" onClick={handleDeleteWorkPlan} className="flex items-center gap-2">
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </Button>
                            </>
                          )
                        )}
                      </div>

                      {selectedWorkPlan && !isEditing && (
                        <div className="pt-4 border-t">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">Priority:</span>
                            {getPriorityBadge(selectedWorkPlan.priority)}
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">Status:</span>
                            {getStatusBadge(selectedWorkPlan.status)}
                          </div>
                          {selectedWorkPlan.startTime && selectedWorkPlan.endTime && (
                            <p className="text-sm text-muted-foreground">
                              Time: {selectedWorkPlan.startTime} - {selectedWorkPlan.endTime}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            Duration: {format(new Date(selectedWorkPlan.startDate), 'MMM dd')} - {format(new Date(selectedWorkPlan.endDate), 'MMM dd')}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      Select dates from the calendar to create work plans
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Work Plans Table */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Work Plans - {format(currentMonth, 'MMMM yyyy')}</CardTitle>
                <CardDescription>Overview of all work plans for the current month</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getMonthWorkPlans().map((workPlan) => (
                      <TableRow key={workPlan.id}>
                        <TableCell className="font-medium">{workPlan.title}</TableCell>
                        <TableCell>
                          {format(new Date(workPlan.startDate), 'MMM dd')} - {format(new Date(workPlan.endDate), 'MMM dd')}
                        </TableCell>
                        <TableCell>{workPlan.location || '-'}</TableCell>
                        <TableCell>
                          {workPlan.startTime && workPlan.endTime 
                            ? `${workPlan.startTime} - ${workPlan.endTime}`
                            : '-'
                          }
                        </TableCell>
                        <TableCell>{getPriorityBadge(workPlan.priority)}</TableCell>
                        <TableCell>{getStatusBadge(workPlan.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSelectedWorkPlan(workPlan);
                                const startDate = new Date(workPlan.startDate);
                                const endDate = new Date(workPlan.endDate);
                                const dates = eachDayOfInterval({ start: startDate, end: endDate });
                                setSelectedDates(dates);
                                setWorkPlanForm({
                                  title: workPlan.title,
                                  description: workPlan.description,
                                  location: workPlan.location,
                                  priority: workPlan.priority,
                                  startTime: workPlan.startTime || '',
                                  endTime: workPlan.endTime || '',
                                  status: workPlan.status
                                });
                                setIsEditing(true);
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => {
                                setSelectedWorkPlan(workPlan);
                                handleDeleteWorkPlan();
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {getMonthWorkPlans().length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                          No work plans for this month
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="todos" className="mt-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6" />
                <h2 className="text-2xl font-bold">Things To Do</h2>
              </div>
              <Button onClick={() => setIsAddTodoOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>

            <Card>
              <CardContent className="pt-6">
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
        </TabsContent>
      </Tabs>

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
