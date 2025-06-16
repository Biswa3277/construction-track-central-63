
export interface Department {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentTerm {
  id: string;
  description: string;
  percentage: number;
  milestone: string;
}

export interface GanttTask {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  duration: number; // in days
  progress: number; // 0-100
  dependencies: string[]; // array of task IDs this task depends on
  departmentId: string;
  departmentName: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: string[];
  estimatedHours: number;
  actualHours: number;
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold' | 'cancelled';
  milestoneType?: 'start' | 'end' | 'payment' | 'delivery';
  notes?: string;
  resources: {
    labor: number;
    materials: number;
    equipment: number;
  };
  riskLevel: 'low' | 'medium' | 'high';
  criticalPath: boolean;
}

export interface ProjectResource {
  id: string;
  name: string;
  type: 'human' | 'equipment' | 'material';
  costPerUnit: number;
  availability: number; // percentage
  skills?: string[];
}

export interface WorkPlanStep {
  id: string;
  departmentId: string;
  departmentName: string;
  targetDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  notes?: string;
}

export interface ProjectPayment {
  id: string;
  projectId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  reference: string;
  notes?: string;
  createdAt: string;
}

export interface BillingProject {
  id: string;
  name: string;
  description: string;
  totalCost: number;
  projectOwner: 'PHED' | 'PWD' | 'Contractor' | 'Company' | 'Other';
  projectOwnerDetails?: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  departments: string[];
  paymentTerms: PaymentTerm[];
  workPlan: WorkPlanStep[];
  totalReceived: number;
  totalPending: number;
  createdAt: string;
  updatedAt: string;
  startDate?: string;
  expectedEndDate?: string;
  
  // Enhanced Gantt Chart Properties
  ganttTasks: GanttTask[];
  projectResources: ProjectResource[];
  baselineStartDate?: string;
  baselineEndDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  bufferDays: number;
  workingDaysPerWeek: number;
  holidayDates: string[];
  projectManager: string;
  stakeholders: string[];
  riskAssessment: {
    overall: 'low' | 'medium' | 'high';
    technical: 'low' | 'medium' | 'high';
    financial: 'low' | 'medium' | 'high';
    schedule: 'low' | 'medium' | 'high';
  };
}
