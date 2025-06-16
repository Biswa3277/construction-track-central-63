
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, Trash2, Calendar, Users, Settings } from "lucide-react";
import { addDays, format } from "date-fns";
import { BillingProject, GanttTask, PaymentTerm, ProjectResource } from "../types/billingTypes";

const ganttTaskSchema = z.object({
  name: z.string().min(3, "Task name must be at least 3 characters"),
  departmentId: z.string().min(1, "Department is required"),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  assignedTo: z.array(z.string()).min(1, "At least one person must be assigned"),
  estimatedHours: z.number().min(1, "Estimated hours must be positive"),
  dependencies: z.array(z.string()).optional(),
  notes: z.string().optional(),
  resources: z.object({
    labor: z.number().min(0),
    materials: z.number().min(0),
    equipment: z.number().min(0)
  })
});

const projectResourceSchema = z.object({
  name: z.string().min(2, "Resource name required"),
  type: z.enum(['human', 'equipment', 'material']),
  costPerUnit: z.number().min(0),
  availability: z.number().min(0).max(100),
  skills: z.array(z.string()).optional()
});

const paymentTermSchema = z.object({
  description: z.string().min(3, "Description required"),
  percentage: z.number().min(1).max(100),
  milestone: z.string().min(3, "Milestone required")
});

const formSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  totalCost: z.number().min(1, "Total cost must be positive"),
  projectOwner: z.enum(['PHED', 'PWD', 'Contractor', 'Company', 'Other']),
  projectOwnerDetails: z.string().optional(),
  startDate: z.date({ required_error: "Start date is required" }),
  expectedEndDate: z.date({ required_error: "End date is required" }),
  projectManager: z.string().min(3, "Project manager name required"),
  stakeholders: z.array(z.string()),
  bufferDays: z.number().min(0).max(30),
  workingDaysPerWeek: z.number().min(5).max(7),
  holidayDates: z.array(z.string()),
  departments: z.array(z.string()).min(1, "At least one department required"),
  ganttTasks: z.array(ganttTaskSchema),
  projectResources: z.array(projectResourceSchema),
  paymentTerms: z.array(paymentTermSchema).min(1, "At least one payment term required"),
  riskAssessment: z.object({
    overall: z.enum(['low', 'medium', 'high']),
    technical: z.enum(['low', 'medium', 'high']),
    financial: z.enum(['low', 'medium', 'high']),
    schedule: z.enum(['low', 'medium', 'high'])
  })
});

type FormValues = z.infer<typeof formSchema>;

const departments = [
  { id: "civil", name: "Civil Engineering" },
  { id: "mechanical", name: "Mechanical Engineering" },
  { id: "electrical", name: "Electrical Engineering" },
  { id: "design", name: "Design & Architecture" },
  { id: "procurement", name: "Procurement" },
  { id: "finance", name: "Finance & Accounts" },
  { id: "quality", name: "Quality Assurance" },
  { id: "safety", name: "Safety & Compliance" }
];

const commonStakeholders = [
  "Project Owner", "Site Engineer", "Quality Inspector", 
  "Safety Officer", "Procurement Manager", "Finance Controller"
];

const commonTasks = [
  { name: "Site Survey & Soil Testing", dept: "civil", hours: 80, priority: "high" as const },
  { name: "Design & Engineering", dept: "design", hours: 120, priority: "critical" as const },
  { name: "Permit & Approval", dept: "civil", hours: 40, priority: "high" as const },
  { name: "Material Procurement", dept: "procurement", hours: 60, priority: "medium" as const },
  { name: "Foundation Work", dept: "civil", hours: 200, priority: "critical" as const },
  { name: "Structural Work", dept: "civil", hours: 300, priority: "critical" as const },
  { name: "MEP Installation", dept: "mechanical", hours: 150, priority: "high" as const },
  { name: "Quality Testing", dept: "quality", hours: 80, priority: "high" as const },
  { name: "Final Inspection", dept: "quality", hours: 40, priority: "medium" as const }
];

interface EnhancedAddProjectFormProps {
  onSuccess?: (project: BillingProject) => void;
}

export const EnhancedAddProjectForm = ({ onSuccess }: EnhancedAddProjectFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      totalCost: 0,
      projectOwner: "PHED",
      projectOwnerDetails: "",
      projectManager: "",
      stakeholders: [],
      bufferDays: 5,
      workingDaysPerWeek: 6,
      holidayDates: [],
      departments: [],
      ganttTasks: [],
      projectResources: [],
      paymentTerms: [],
      riskAssessment: {
        overall: "medium",
        technical: "medium",
        financial: "medium",
        schedule: "medium"
      }
    }
  });

  const { fields: taskFields, append: appendTask, remove: removeTask } = useFieldArray({
    control: form.control,
    name: "ganttTasks"
  });

  const { fields: resourceFields, append: appendResource, remove: removeResource } = useFieldArray({
    control: form.control,
    name: "projectResources"
  });

  const { fields: paymentFields, append: appendPayment, remove: removePayment } = useFieldArray({
    control: form.control,
    name: "paymentTerms"
  });

  const addCommonTasks = () => {
    const selectedDepts = form.getValues("departments");
    const startDate = form.getValues("startDate");
    
    if (!startDate || selectedDepts.length === 0) {
      toast.error("Please set project start date and select departments first");
      return;
    }

    const tasksToAdd =  commonTasks.filter(task => selectedDepts.includes(task.dept));
    let currentDate = startDate;

    tasksToAdd.forEach((task, index) => {
      const duration = Math.ceil(task.hours / 8); // Convert hours to days
      const endDate = addDays(currentDate, duration);
      
      appendTask({
        name: task.name,
        departmentId: task.dept,
        startDate: currentDate,
        endDate: endDate,
        priority: task.priority,
        assignedTo: ["Team Lead"],
        estimatedHours: task.hours,
        dependencies: index > 0 ? [taskFields[index - 1]?.id || ""] : [],
        notes: "",
        resources: {
          labor: task.hours * 500, // ₹500 per hour
          materials: task.hours * 200,
          equipment: task.hours * 100
        }
      });
      
      currentDate = addDays(endDate, 1);
    });

    toast.success(`Added ${tasksToAdd.length} common tasks`);
  };

  const calculateTaskDependencies = () => {
    const tasks = form.getValues("ganttTasks");
    tasks.forEach((task, index) => {
      if (index > 0) {
        // Auto-set dependency to previous task if in sequence
        form.setValue(`ganttTasks.${index}.dependencies`, [tasks[index - 1].name]);
      }
    });
    toast.success("Dependencies calculated automatically");
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Create the project with enhanced data
      const project: BillingProject = {
        id: `project_${Date.now()}`,
        name: data.name,
        description: data.description,
        totalCost: data.totalCost,
        projectOwner: data.projectOwner,
        projectOwnerDetails: data.projectOwnerDetails,
        status: 'planning',
        departments: data.departments,
        paymentTerms: data.paymentTerms.map((term, index) => ({
          id: `payment_${Date.now()}_${index}`,
          description: term.description,
          percentage: term.percentage,
          milestone: term.milestone
        })),
        workPlan: [],
        totalReceived: 0,
        totalPending: data.totalCost,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        startDate: data.startDate?.toISOString(),
        expectedEndDate: data.expectedEndDate?.toISOString(),
        
        // Enhanced Gantt properties
        ganttTasks: data.ganttTasks.map((task, index) => {
          const dept = departments.find(d => d.id === task.departmentId);
          return {
            id: `task_${Date.now()}_${index}`,
            name: task.name,
            startDate: task.startDate.toISOString(),
            endDate: task.endDate.toISOString(),
            duration: Math.ceil((task.endDate.getTime() - task.startDate.getTime()) / (1000 * 60 * 60 * 24)),
            progress: 0,
            dependencies: task.dependencies || [],
            departmentId: task.departmentId,
            departmentName: dept?.name || task.departmentId,
            priority: task.priority,
            assignedTo: task.assignedTo,
            estimatedHours: task.estimatedHours,
            actualHours: 0,
            status: 'not-started' as const,
            notes: task.notes,
            resources: task.resources,
            riskLevel: task.priority === 'critical' ? 'high' as const : 'medium' as const,
            criticalPath: task.priority === 'critical'
          };
        }),
        projectResources: data.projectResources.map((resource, index) => ({
          id: `resource_${Date.now()}_${index}`,
          name: resource.name,
          type: resource.type,
          costPerUnit: resource.costPerUnit,
          availability: resource.availability,
          skills: resource.skills
        })),
        baselineStartDate: data.startDate?.toISOString(),
        baselineEndDate: data.expectedEndDate?.toISOString(),
        bufferDays: data.bufferDays,
        workingDaysPerWeek: data.workingDaysPerWeek,
        holidayDates: data.holidayDates,
        projectManager: data.projectManager,
        stakeholders: data.stakeholders,
        riskAssessment: data.riskAssessment
      };

      // Save to localStorage (in real app, this would be an API call)
      const existingProjects = JSON.parse(localStorage.getItem('billing_projects') || '[]');
      existingProjects.push(project);
      localStorage.setItem('billing_projects', JSON.stringify(existingProjects));
      
      toast.success("Project created successfully with Gantt chart!");
      
      if (onSuccess) {
        onSuccess(project);
      }
    } catch (error) {
      toast.error("Failed to create project");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter project name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="projectOwner"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Owner</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="PHED">PHED</SelectItem>
                            <SelectItem value="PWD">PWD</SelectItem>
                            <SelectItem value="Contractor">Contractor</SelectItem>
                            <SelectItem value="Company">Company</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Detailed project description"
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="totalCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Cost (₹)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="projectManager"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Manager</FormLabel>
                        <FormControl>
                          <Input placeholder="Manager name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Project Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <DatePicker
                          date={field.value}
                          setDate={field.onChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="expectedEndDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expected End Date</FormLabel>
                        <DatePicker
                          date={field.value}
                          setDate={field.onChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="bufferDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Buffer Days</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>Additional days for risk mitigation</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="workingDaysPerWeek"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Working Days per Week</FormLabel>
                        <Select onValueChange={(val) => field.onChange(Number(val))} defaultValue={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="5">5 Days</SelectItem>
                            <SelectItem value="6">6 Days</SelectItem>
                            <SelectItem value="7">7 Days</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="departments"
                  render={() => (
                    <FormItem>
                      <FormLabel>Involved Departments</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {departments.map((dept) => (
                          <FormField
                            key={dept.id}
                            control={form.control}
                            name="departments"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(dept.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, dept.id])
                                        : field.onChange(field.value?.filter((value) => value !== dept.id));
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {dept.name}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Project Tasks
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addCommonTasks}
                    >
                      Add Common Tasks
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={calculateTaskDependencies}
                    >
                      Auto Dependencies
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => appendTask({
                        name: "",
                        departmentId: "",
                        startDate: new Date(),
                        endDate: addDays(new Date(), 7),
                        priority: "medium",
                        assignedTo: [],
                        estimatedHours: 40,
                        dependencies: [],
                        notes: "",
                        resources: { labor: 0, materials: 0, equipment: 0 }
                      })}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {taskFields.map((task, index) => (
                    <Card key={task.id} className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Task {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTask(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name={`ganttTasks.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Task Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Task name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`ganttTasks.${index}.departmentId`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Department</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select department" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {departments.map((dept) => (
                                    <SelectItem key={dept.id} value={dept.id}>
                                      {dept.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`ganttTasks.${index}.priority`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Priority</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="low">Low</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="high">High</SelectItem>
                                  <SelectItem value="critical">Critical</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`ganttTasks.${index}.startDate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Date</FormLabel>
                              <DatePicker
                                date={field.value}
                                setDate={field.onChange}
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`ganttTasks.${index}.endDate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Date</FormLabel>
                              <DatePicker
                                date={field.value}
                                setDate={field.onChange}
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`ganttTasks.${index}.estimatedHours`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Estimated Hours</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Project Resources
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendResource({
                      name: "",
                      type: "human",
                      costPerUnit: 0,
                      availability: 100,
                      skills: []
                    })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Resource
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {resourceFields.map((resource, index) => (
                    <Card key={resource.id} className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Resource {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeResource(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <FormField
                          control={form.control}
                          name={`projectResources.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Resource Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Resource name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`projectResources.${index}.type`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="human">Human</SelectItem>
                                  <SelectItem value="equipment">Equipment</SelectItem>
                                  <SelectItem value="material">Material</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`projectResources.${index}.costPerUnit`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cost per Unit (₹)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`projectResources.${index}.availability`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Availability (%)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number"
                                  max="100"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Payment Terms
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendPayment({
                      description: "",
                      percentage: 0,
                      milestone: ""
                    })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Payment Term
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentFields.map((payment, index) => (
                    <Card key={payment.id} className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Payment Term {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePayment(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name={`paymentTerms.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Input placeholder="Payment description" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`paymentTerms.${index}.percentage`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Percentage (%)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number"
                                  max="100"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`paymentTerms.${index}.milestone`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Milestone</FormLabel>
                              <FormControl>
                                <Input placeholder="Milestone description" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Project"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
