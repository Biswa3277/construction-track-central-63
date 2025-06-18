
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import AddTodoForm from "./AddTodoForm";
import TodoDetailsDialog from "./TodoDetailsDialog";

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

interface ThingsToDoListProps {
  todos: Todo[];
  onTodosUpdate: () => void;
}

const ThingsToDoList = ({ todos, onTodosUpdate }: ThingsToDoListProps) => {
  const [isAddTodoOpen, setIsAddTodoOpen] = useState(false);
  const [isTodoDetailsOpen, setIsTodoDetailsOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

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

  const isOverdue = (targetDate: string, status: string) => {
    return new Date(targetDate) < new Date() && status !== 'completed';
  };

  const handleAddTodo = () => {
    setIsAddTodoOpen(false);
    onTodosUpdate();
    toast.success("Task added successfully!");
  };

  const handleViewTodo = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsTodoDetailsOpen(true);
  };

  const handleDeleteTodo = (todoId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      const storedTodos = JSON.parse(localStorage.getItem('project_todos') || '[]');
      const updatedTodos = storedTodos.filter((t: Todo) => t.id !== todoId);
      localStorage.setItem('project_todos', JSON.stringify(updatedTodos));
      onTodosUpdate();
      toast.success("Task deleted successfully!");
    }
  };

  const updateTodoStatus = (todoId: string, newStatus: string) => {
    const storedTodos = JSON.parse(localStorage.getItem('project_todos') || '[]');
    const updatedTodos = storedTodos.map((t: Todo) => 
      t.id === todoId ? { ...t, status: newStatus, progress: newStatus === 'completed' ? 100 : t.progress } : t
    );
    localStorage.setItem('project_todos', JSON.stringify(updatedTodos));
    onTodosUpdate();
    toast.success("Task status updated!");
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Things To Do List</CardTitle>
            <CardDescription>Manage your parallel tasks and deadlines</CardDescription>
          </div>
          <Button onClick={() => setIsAddTodoOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </CardHeader>
        <CardContent>
          {todos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No tasks found. Add your first task to get started.</p>
              <Button onClick={() => setIsAddTodoOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task Name</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Target Date</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todos.map((todo) => (
                    <TableRow key={todo.id} className={isOverdue(todo.targetDate, todo.status) ? "bg-red-50" : ""}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{todo.name}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {todo.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getPriorityBadge(todo.priority)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={todo.progress} className="h-2 w-20" />
                          <span className="text-xs">{todo.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {getStatusBadge(todo.status)}
                          {isOverdue(todo.targetDate, todo.status) && (
                            <Badge variant="destructive" className="text-xs">Overdue</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(todo.targetDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(todo.createdDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewTodo(todo)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {todo.status !== 'completed' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateTodoStatus(todo.id, 'completed')}
                              className="text-green-600"
                            >
                              ✓
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteTodo(todo.id)}
                          >
                            <Trash2 className="h-4 w-4" />
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

      <Dialog open={isAddTodoOpen} onOpenChange={setIsAddTodoOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <AddTodoForm onSuccess={handleAddTodo} />
        </DialogContent>
      </Dialog>

      <Dialog open={isTodoDetailsOpen} onOpenChange={setIsTodoDetailsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
          </DialogHeader>
          {selectedTodo && (
            <TodoDetailsDialog 
              todo={selectedTodo} 
              onClose={() => setIsTodoDetailsOpen(false)}
              onUpdate={onTodosUpdate}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ThingsToDoList;
