
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

export interface GanttTask {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  duration: number;
  progress: number;
  dependencies: string[];
  departmentId: string;
  departmentName: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: string;
  estimatedHours: number;
  actualHours: number;
  resources: {
    labor: number;
    materials: number;
    equipment: number;
  };
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed';
  criticalPath: boolean;
}

export interface ProjectMilestone {
  id: string;
  name: string;
  date: string;
  status: 'upcoming' | 'completed' | 'overdue';
  description: string;
}

export interface ProjectResources {
  totalBudget: number;
  allocatedBudget: number;
  labor: number;
  materials: number;
  equipment: number;
}

export interface RiskAssessment {
  overall: 'low' | 'medium' | 'high';
  technical: 'low' | 'medium' | 'high';
  financial: 'low' | 'medium' | 'high';
  schedule: 'low' | 'medium' | 'high';
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
  ganttTasks: GanttTask[];
  projectResources: ProjectResources;
  bufferDays: number;
  workingDaysPerWeek: number;
  projectManager: string;
  riskAssessment: RiskAssessment;
  milestones: ProjectMilestone[];
}
