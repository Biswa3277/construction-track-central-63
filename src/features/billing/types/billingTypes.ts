
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

export interface BillingProject {
  id: string;
  name: string;
  description: string;
  totalCost: number;
  projectOwner: 'PHED' | 'PWD' | 'Contractor' | 'Company' | 'Other';
  projectOwnerDetails?: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  departments: string[]; // Array of department IDs
  paymentTerms: PaymentTerm[];
  workPlan: WorkPlanStep[];
  totalReceived: number;
  totalPending: number;
  createdAt: string;
  updatedAt: string;
  startDate?: string;
  expectedEndDate?: string;
}
