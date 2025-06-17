import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Trash2 } from "lucide-react";
import { Department, PaymentTerm, WorkPlanStep, BillingProject, GanttTask, ProjectMilestone } from "../types/billingTypes";

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Project description is required"),
  totalCost: z.number().min(1, "Total cost must be greater than 0"),
  projectOwner: z.enum(["PHED", "PWD", "Contractor", "Company", "Other"]),
  projectOwnerDetails: z.string().optional(),
  startDate: z.string().optional(),
  expectedEndDate: z.string().optional(),
  projectManager: z.string().min(1, "Project manager is required"),
  bufferDays: z.number().min(0, "Buffer days must be non-negative"),
  workingDaysPerWeek: z.number().min(1).max(7, "Working days must be between 1-7"),
});

interface EnhancedAddProjectFormProps {
  onSuccess: () => void;
}

const EnhancedAddProjectForm = ({ onSuccess }: EnhancedAddProjectFormProps) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerm[]>([
    { id: "1", description: "After materials supply", percentage: 60, milestone: "Materials Supply" }
  ]);
  const [workPlan, setWorkPlan] = useState<WorkPlanStep[]>([]);
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      totalCost: 0,
      projectOwner: "PHED",
      projectOwnerDetails: "",
      projectManager: "",
      bufferDays: 7,
      workingDaysPerWeek: 5,
    },
  });

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = () => {
    const storedDepartments = JSON.parse(localStorage.getItem('billing_departments') || '[]');
    if (storedDepartments.length === 0) {
      const defaultDepartments: Department[] = [
        { id: "1", name: "Tender", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: "2", name: "Account", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: "3", name: "Survey", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: "4", name: "DPR", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: "5", name: "Designing", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: "6", name: "Consultancy", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: "7", name: "Civil", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: "8", name: "Mechanical", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: "9", name: "Electrical", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: "10", name: "Automation", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: "11", name: "IT", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: "12", name: "TPI", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      ];
      localStorage.setItem('billing_departments', JSON.stringify(defaultDepartments));
      setDepartments(defaultDepartments);
    } else {
      setDepartments(storedDepartments);
    }
  };

  const handleDepartmentChange = (departmentId: string, checked: boolean) => {
    if (checked) {
      setSelectedDepartments([...selectedDepartments, departmentId]);
      const department = departments.find(d => d.id === departmentId);
      if (department) {
        const newWorkPlanStep: WorkPlanStep = {
          id: Date.now().toString(),
          departmentId,
          departmentName: department.name,
          targetDate: "",
          status: "pending",
        };
        setWorkPlan([...workPlan, newWorkPlanStep]);
      }
    } else {
      setSelectedDepartments(selectedDepartments.filter(id => id !== departmentId));
      setWorkPlan(workPlan.filter(step => step.departmentId !== departmentId));
    }
  };

  const generateGanttTasks = (workPlan: WorkPlanStep[], startDate: string): GanttTask[] => {
    const tasks: GanttTask[] = [];
    let currentDate = new Date(startDate || new Date());

    workPlan.forEach((step, index) => {
      const taskStartDate = new Date(currentDate);
      const taskEndDate = new Date(currentDate);
      taskEndDate.setDate(taskEndDate.getDate() + 14); // Default 14 days duration
      
      const task: GanttTask = {
        id: step.id,
        name: `${step.departmentName} Task`,
        startDate: taskStartDate.toISOString().split('T')[0],
        endDate: taskEndDate.toISOString().split('T')[0],
        duration: 14,
        progress: step.status === 'completed' ? 100 : step.status === 'in-progress' ? 50 : 0,
        dependencies: index > 0 ? [workPlan[index - 1].id] : [],
        departmentId: step.departmentId,
        departmentName: step.departmentName,
        priority: "medium",
        assignedTo: "Project Team", // Fixed: Changed from empty array to string
        estimatedHours: 112, // 14 days * 8 hours
        actualHours: 0,
        resources: {
          labor: 2,
          materials: 1000,
          equipment: 1
        },
        status: "not-started",
        criticalPath: false
      };
      
      tasks.push(task);
      currentDate = new Date(taskEndDate);
      currentDate.setDate(currentDate.getDate() + 1); // Next task starts day after previous ends
    });

    return tasks;
  };

  const onSubmit = (values: z.infer<typeof projectSchema>) => {
    const totalPercentage = paymentTerms.reduce((sum, term) => sum + term.percentage, 0);
    if (totalPercentage !== 100) {
      alert("Payment terms must total 100%");
      return;
    }

    const ganttTasks = generateGanttTasks(workPlan, values.startDate || "");

    const newProject: BillingProject = {
      id: Date.now().toString(),
      name: values.name,
      description: values.description,
      totalCost: values.totalCost,
      projectOwner: values.projectOwner,
      projectOwnerDetails: values.projectOwnerDetails || "",
      status: "planning",
      departments: selectedDepartments,
      paymentTerms,
      workPlan,
      totalReceived: 0,
      totalPending: values.totalCost,  
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      startDate: values.startDate,
      expectedEndDate: values.expectedEndDate,
      ganttTasks,
      projectResources: {
        totalBudget: values.totalCost,
        allocatedBudget: 0,
        labor: ganttTasks.reduce((sum, task) => sum + task.resources.labor, 0),
        materials: ganttTasks.reduce((sum, task) => sum + task.resources.materials, 0),
        equipment: ganttTasks.reduce((sum, task) => sum + task.resources.equipment, 0)
      },
      bufferDays: values.bufferDays,
      workingDaysPerWeek: values.workingDaysPerWeek,
      projectManager: values.projectManager,
      riskAssessment: {
        overall: "medium",
        technical: "medium", 
        financial: "medium",
        schedule: "medium"
      },
      milestones
    };

    const existingProjects = JSON.parse(localStorage.getItem('billing_projects') || '[]');
    existingProjects.push(newProject);
    localStorage.setItem('billing_projects', JSON.stringify(existingProjects));

    onSuccess();
  };

  const addPaymentTerm = () => {
    const newTerm: PaymentTerm = {
      id: Date.now().toString(),
      description: "",
      percentage: 0,
      milestone: "",
    };
    setPaymentTerms([...paymentTerms, newTerm]);
  };

  const removePaymentTerm = (id: string) => {
    setPaymentTerms(paymentTerms.filter(term => term.id !== id));
  };

  const updatePaymentTerm = (id: string, field: keyof PaymentTerm, value: string | number) => {
    setPaymentTerms(paymentTerms.map(term => 
      term.id === id ? { ...term, [field]: value } : term
    ));
  };

  const updateWorkPlanStep = (id: string, field: keyof WorkPlanStep, value: string) => {
    setWorkPlan(workPlan.map(step => 
      step.id === id ? { ...step, [field]: value } : step
    ));
  };

  const addMilestone = () => {
    const newMilestone: ProjectMilestone = {
      id: Date.now().toString(),
      name: "",
      date: "",
      description: "",
      status: "upcoming" // Fixed: Changed from "pending" to "upcoming"
    };
    setMilestones([...milestones, newMilestone]);
  };

  const removeMilestone = (id: string) => {
    setMilestones(milestones.filter(milestone => milestone.id !== id));
  };

  const updateMilestone = (id: string, field: keyof ProjectMilestone, value: string) => {
    setMilestones(milestones.map(milestone => 
      milestone.id === id ? { ...milestone, [field]: value } : milestone
    ));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            name="totalCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Project Cost (₹)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Enter total cost" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
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
              <FormLabel>Project Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter project description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="projectOwner"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Owner</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project owner" />
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

          <FormField
            control={form.control}
            name="projectManager"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Manager</FormLabel>
                <FormControl>
                  <Input placeholder="Enter project manager name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
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
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bufferDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Buffer Days</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="7" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Department Involvement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {departments.filter(dept => dept.isActive).map((department) => (
                <div key={department.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={department.id}
                    checked={selectedDepartments.includes(department.id)}
                    onCheckedChange={(checked) => handleDepartmentChange(department.id, checked as boolean)}
                  />
                  <label htmlFor={department.id} className="text-sm font-medium">
                    {department.name}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Payment Terms
              <Button type="button" variant="outline" size="sm" onClick={addPaymentTerm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Term
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentTerms.map((term) => (
              <div key={term.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    placeholder="Payment description"
                    value={term.description}
                    onChange={(e) => updatePaymentTerm(term.id, 'description', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Percentage (%)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={term.percentage}
                    onChange={(e) => updatePaymentTerm(term.id, 'percentage', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Milestone</label>
                  <Input
                    placeholder="Milestone"
                    value={term.milestone}
                    onChange={(e) => updatePaymentTerm(term.id, 'milestone', e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removePaymentTerm(term.id)}
                  disabled={paymentTerms.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="text-sm text-muted-foreground">
              Total: {paymentTerms.reduce((sum, term) => sum + term.percentage, 0)}%
            </div>
          </CardContent>
        </Card>

        {workPlan.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Work Plan & Target Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {workPlan.map((step) => (
                <div key={step.id} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">{step.departmentName}</label>
                    <Input value={step.departmentName} disabled />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Target Date</label>
                    <Input
                      type="date"
                      value={step.targetDate}
                      onChange={(e) => updateWorkPlanStep(step.id, 'targetDate', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Project Milestones
              <Button type="button" variant="outline" size="sm" onClick={addMilestone}>
                <Plus className="h-4 w-4 mr-2" />
                Add Milestone
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {milestones.map((milestone) => (
              <div key={milestone.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="text-sm font-medium">Milestone Name</label>
                  <Input
                    placeholder="Milestone name"
                    value={milestone.name}
                    onChange={(e) => updateMilestone(milestone.id, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Date</label>
                  <Input
                    type="date"
                    value={milestone.date}
                    onChange={(e) => updateMilestone(milestone.id, 'date', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    placeholder="Description"
                    value={milestone.description}
                    onChange={(e) => updateMilestone(milestone.id, 'description', e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeMilestone(milestone.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="submit">Create Enhanced Project</Button>
        </div>
      </form>
    </Form>
  );
};

export default EnhancedAddProjectForm;
