
export interface ExpenseItem {
  id: string;
  type: 'project' | 'other';
  category: string;
  projectId?: string;
  projectName?: string;
  description: string;
  amount: number;
  transactionType: 'received' | 'spent';
  date: string;
  paymentMethod: string;
  personName?: string;
  billAvailable: boolean;
  approvalStatus: 'Approved' | 'Hold' | 'waiting';
  createdAt: string;
  updatedAt: string;
}

export interface MonthlyStatement {
  month: string;
  year: number;
  projectExpenses: {
    totalReceived: number;
    totalSpent: number;
    balance: number;
    items: ExpenseItem[];
  };
  otherExpenses: {
    totalReceived: number;
    totalSpent: number;
    balance: number;
    items: ExpenseItem[];
  };
  overallBalance: number;
}

export const PROJECT_EXPENSE_CATEGORIES = [
  'Materials Purchase',
  'Transportation',
  'Team Travel',
  'Equipment Rental',
  'Site Preparation',
  'Labor Costs',
  'Utilities',
  'Other Project Costs'
];

export const OTHER_EXPENSE_CATEGORIES = [
  'Business Travel',
  'Accommodation',
  'Food & Meals',
  'Office Supplies',
  'Marketing',
  'Professional Services',
  'Utilities',
  'Insurance',
  'Maintenance',
  'Other Business Costs'
];

export const PAYMENT_METHODS = [
  'Cash',
  'Bank Transfer',
  'Credit Card',
  'Debit Card',
  'Cheque',
  'UPI',
  'Online Payment'
];
