
import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Filter, 
  Download, 
  Settings, 
  AlertTriangle,
  Clock,
  Users,
  TrendingUp,
  CheckCircle,
  Circle,
  PlayCircle,
  PauseCircle
} from "lucide-react";
import { format, addDays, differenceInDays, parseISO, isWeekend } from "date-fns";
import { GanttTask, BillingProject } from "../types/billingTypes";

interface GanttChartProps {
  project: BillingProject;
  onTaskUpdate?: (taskId: string, updates: Partial<GanttTask>) => void;
}

export const GanttChart = ({ project, onTaskUpdate }: GanttChartProps) => {
  const [viewMode, setViewMode] = useState<'days' | 'weeks' | 'months'>('weeks');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCriticalPath, setShowCriticalPath] = useState(false);
  const [selectedTask, setSelectedTask] = useState<GanttTask | null>(null);

  // Calculate project timeline
  const projectStartDate = useMemo(() => {
    if (!project.startDate) return new Date();
    return parseISO(project.startDate);
  }, [project.startDate]);

  const projectEndDate = useMemo(() => {
    if (!project.expectedEndDate) return addDays(projectStartDate, 90);
    return parseISO(project.expectedEndDate);
  }, [project.expectedEndDate, projectStartDate]);

  // Filter tasks based on current filters
  const filteredTasks = useMemo(() => {
    return project.ganttTasks.filter(task => {
      const deptMatch = filterDepartment === 'all' || task.departmentId === filterDepartment;
      const statusMatch = filterStatus === 'all' || task.status === filterStatus;
      const criticalMatch = !showCriticalPath || task.criticalPath;
      return deptMatch && statusMatch && criticalMatch;
    });
  }, [project.ganttTasks, filterDepartment, filterStatus, showCriticalPath]);

  // Calculate timeline grid
  const timelineData = useMemo(() => {
    const totalDays = differenceInDays(projectEndDate, projectStartDate);
    const columns = [];
    
    let interval = 1;
    let format_str = 'MMM dd';
    
    switch (viewMode) {
      case 'days':
        interval = 1;
        format_str = 'MMM dd';
        break;
      case 'weeks':
        interval = 7;
        format_str = 'MMM dd';
        break;
      case 'months':
        interval = 30;
        format_str = 'MMM yyyy';
        break;
    }

    for (let i = 0; i <= totalDays; i += interval) {
      const date = addDays(projectStartDate, i);
      columns.push({
        date,
        label: format(date, format_str),
        isWeekend: isWeekend(date)
      });
    }
    
    return columns;
  }, [projectStartDate, projectEndDate, viewMode]);

  const getTaskPosition = (task: GanttTask) => {
    const taskStart = parseISO(task.startDate);
    const taskEnd = parseISO(task.endDate);
    const startOffset = differenceInDays(taskStart, projectStartDate);
    const duration = differenceInDays(taskEnd, taskStart);
    const totalDays = differenceInDays(projectEndDate, projectStartDate);
    
    return {
      left: `${(startOffset / totalDays) * 100}%`,
      width: `${(duration / totalDays) * 100}%`
    };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'not-started':
        return <Circle className="h-4 w-4 text-gray-400" />;
      case 'in-progress':
        return <PlayCircle className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'on-hold':
        return <PauseCircle className="h-4 w-4 text-yellow-500" />;
      case 'cancelled':
        return <Circle className="h-4 w-4 text-red-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const calculateProjectStats = () => {
    const totalTasks = project.ganttTasks.length;
    const completedTasks = project.ganttTasks.filter(t => t.status === 'completed').length;
    const inProgressTasks = project.ganttTasks.filter(t => t.status === 'in-progress').length;
    const overdueTasks = project.ganttTasks.filter(t => 
      parseISO(t.endDate) < new Date() && t.status !== 'completed'
    ).length;
    const criticalPathTasks = project.ganttTasks.filter(t => t.criticalPath).length;
    
    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      overdueTasks,
      criticalPathTasks,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
    };
  };

  const stats = calculateProjectStats();

  return (
    <div className="space-y-6">
      {/* Project Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Tasks</p>
                <p className="text-2xl font-bold">{stats.totalTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold">{stats.completedTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <PlayCircle className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">In Progress</p>
                <p className="text-2xl font-bold">{stats.inProgressTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm font-medium">Overdue</p>
                <p className="text-2xl font-bold">{stats.overdueTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Critical Path</p>
                <p className="text-2xl font-bold">{stats.criticalPathTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Progress</p>
                <p className="text-2xl font-bold">{stats.completionRate.toFixed(0)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="days">Days</SelectItem>
              <SelectItem value="weeks">Weeks</SelectItem>
              <SelectItem value="months">Months</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterDepartment} onValueChange={setFilterDepartment}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {Array.from(new Set(project.ganttTasks.map(t => t.departmentName))).map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="not-started">Not Started</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={showCriticalPath ? "default" : "outline"}
            size="sm"
            onClick={() => setShowCriticalPath(!showCriticalPath)}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Critical Path
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Gantt Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Project Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Timeline Header */}
              <div className="flex border-b">
                <div className="w-64 p-2 border-r font-medium">Task</div>
                <div className="flex-1 relative">
                  <div className="flex h-10">
                    {timelineData.map((col, index) => (
                      <div
                        key={index}
                        className={`flex-1 border-r text-xs p-1 text-center ${
                          col.isWeekend ? 'bg-gray-50' : ''
                        }`}
                      >
                        {col.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Task Rows */}
              {filteredTasks.map((task) => {
                const position = getTaskPosition(task);
                return (
                  <div key={task.id} className="flex border-b hover:bg-gray-50">
                    <div className="w-64 p-2 border-r">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(task.status)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{task.name}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {task.departmentName}
                            </Badge>
                            <div className={`w-2 h-2 rounded ${getPriorityColor(task.priority)}`} />
                            {task.criticalPath && (
                              <AlertTriangle className="h-3 w-3 text-red-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 relative h-16 p-2">
                      <div
                        className={`absolute h-6 rounded ${
                          task.criticalPath ? 'bg-red-500' : 'bg-blue-500'
                        } ${task.status === 'completed' ? 'bg-green-500' : ''}`}
                        style={position}
                        onClick={() => setSelectedTask(task)}
                      >
                        <div className="flex items-center h-full px-2">
                          <span className="text-white text-xs font-medium truncate">
                            {task.progress}%
                          </span>
                        </div>
                        <div 
                          className="absolute top-0 left-0 h-full bg-white bg-opacity-30 rounded"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                      
                      {/* Dependencies lines */}
                      {task.dependencies.map(depId => {
                        const depTask = project.ganttTasks.find(t => t.id === depId);
                        if (!depTask) return null;
                        const depPosition = getTaskPosition(depTask);
                        return (
                          <div
                            key={depId}
                            className="absolute top-8 h-px bg-gray-400"
                            style={{
                              left: `calc(${depPosition.left} + ${depPosition.width})`,
                              width: `calc(${position.left} - ${depPosition.left} - ${depPosition.width})`
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Details Panel */}
      {selectedTask && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Task Details: {selectedTask.name}
              <Button variant="ghost" size="sm" onClick={() => setSelectedTask(null)}>
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium mb-2">Schedule</h4>
                <p className="text-sm">Start: {format(parseISO(selectedTask.startDate), 'MMM dd, yyyy')}</p>
                <p className="text-sm">End: {format(parseISO(selectedTask.endDate), 'MMM dd, yyyy')}</p>
                <p className="text-sm">Duration: {selectedTask.duration} days</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Progress</h4>
                <Progress value={selectedTask.progress} className="mb-2" />
                <p className="text-sm">{selectedTask.progress}% Complete</p>
                <Badge className={getPriorityColor(selectedTask.priority) + ' text-white'}>
                  {selectedTask.priority} Priority
                </Badge>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Resources</h4>
                <p className="text-sm">Estimated: {selectedTask.estimatedHours}h</p>
                <p className="text-sm">Actual: {selectedTask.actualHours}h</p>
                <p className="text-sm">Labor: ₹{selectedTask.resources.labor.toLocaleString()}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Assignment</h4>
                <p className="text-sm">Department: {selectedTask.departmentName}</p>
                <p className="text-sm">Assigned: {selectedTask.assignedTo.join(', ')}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Status & Risk</h4>
                <div className="flex items-center space-x-2 mb-1">
                  {getStatusIcon(selectedTask.status)}
                  <span className="text-sm capitalize">{selectedTask.status.replace('-', ' ')}</span>
                </div>
                <Badge variant={selectedTask.riskLevel === 'high' ? 'destructive' : 'secondary'}>
                  {selectedTask.riskLevel} Risk
                </Badge>
              </div>
              
              {selectedTask.notes && (
                <div className="md:col-span-2 lg:col-span-3">
                  <h4 className="font-medium mb-2">Notes</h4>
                  <p className="text-sm text-gray-600">{selectedTask.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
