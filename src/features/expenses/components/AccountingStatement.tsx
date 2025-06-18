import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { ExpenseItem } from "../types/expenseTypes";

interface AccountingStatementProps {
  refreshTrigger: number;
}

interface StatementEntry {
  id: string;
  date: string;
  description: string;
  category: string;
  project: string;
  type: 'project' | 'other' | 'opening' | 'totals';
  amount: number;
  paymentMethod: string;
  personName: string;
  billAvailable: boolean;
  transactionType: 'received' | 'spent' | 'total_received' | 'opening' | 'totals';
  debit: number;
  credit: number;
  balance: number;
}

const AccountingStatement = ({ refreshTrigger }: AccountingStatementProps) => {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [statementEntries, setStatementEntries] = useState<StatementEntry[]>([]);
  const [typeFilter, setTypeFilter] = useState<'all' | 'project' | 'other'>('all');

  useEffect(() => {
    loadExpenses();
  }, [refreshTrigger]);

  useEffect(() => {
    generateStatement();
  }, [expenses, typeFilter]);

  const loadExpenses = () => {
    const storedExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    setExpenses(storedExpenses);
  };

  const generateStatement = () => {
    let filteredExpenses = expenses;
    
    if (typeFilter !== 'all') {
      filteredExpenses = expenses.filter(expense => expense.type === typeFilter);
    }

    // Sort by date
    const sortedExpenses = filteredExpenses.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let runningBalance = 0;
    const entries: StatementEntry[] = [];

    // Starting balance entry
    entries.push({
      id: 'opening',
      date: '',
      description: 'Opening Balance',
      category: '',
      project: '',
      type: 'opening',
      amount: 0,
      paymentMethod: '',
      personName: '',
      billAvailable: false,
      transactionType: 'opening',
      debit: 0,
      credit: 0,
      balance: 0
    });

    sortedExpenses.forEach((expense) => {
      let debit = 0;
      let credit = 0;

      if (expense.transactionType === 'spent') {
        debit = expense.amount;
        runningBalance -= expense.amount; // Subtract debit from balance
      } else if (expense.transactionType === 'received' || expense.transactionType === 'total_received') {
        credit = expense.amount;
        runningBalance += expense.amount; // Add credit to balance
      }

      entries.push({
        id: expense.id,
        date: new Date(expense.date).toLocaleDateString(),
        description: expense.description,
        category: expense.category,
        project: expense.projectName || 'Others',
        type: expense.type,
        amount: expense.amount,
        paymentMethod: expense.paymentMethod,
        personName: expense.personName || '',
        billAvailable: expense.billAvailable || false,
        transactionType: expense.transactionType,
        debit,
        credit,
        balance: runningBalance
      });
    });

    // Calculate totals - excluding opening balance
    const totalDebit = entries.reduce((sum, entry) => entry.id !== 'opening' ? sum + entry.debit : sum, 0);
    const totalCredit = entries.reduce((sum, entry) => entry.id !== 'opening' ? sum + entry.credit : sum, 0);

    // Add totals row
    entries.push({
      id: 'totals',
      date: '',
      description: 'TOTALS',
      category: '',
      project: '',
      type: 'totals',
      amount: 0,
      paymentMethod: '',
      personName: '',
      billAvailable: false,
      transactionType: 'totals',
      debit: totalDebit,
      credit: totalCredit,
      balance: runningBalance
    });

    setStatementEntries(entries);
  };

  const formatAmount = (amount: number) => {
    return amount === 0 ? '' : amount.toFixed(2);
  };

  const getTypeBadge = (type: string) => {
    if (type === 'opening' || type === 'totals') return null;
    
    return type === 'project' ? 
      <Badge variant="default">Project</Badge> : 
      <Badge variant="secondary">Other</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Accounting Statement</CardTitle>
          <Select value={typeFilter} onValueChange={(value: 'all' | 'project' | 'other') => setTypeFilter(value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Expenses</SelectItem>
              <SelectItem value="project">Project Expenses Only</SelectItem>
              <SelectItem value="other">Other Expenses Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-bold border-r min-w-[100px]">Date</TableHead>
                  <TableHead className="font-bold border-r min-w-[150px]">Description</TableHead>
                  <TableHead className="font-bold border-r min-w-[120px]">Category</TableHead>
                  <TableHead className="font-bold border-r min-w-[120px]">Project/Others</TableHead>
                  <TableHead className="font-bold border-r min-w-[100px]">Type</TableHead>
                  <TableHead className="font-bold border-r min-w-[120px]">Payment Method</TableHead>
                  <TableHead className="font-bold border-r min-w-[120px]">Person Name</TableHead>
                  <TableHead className="font-bold border-r min-w-[100px]">Bill Available</TableHead>
                  <TableHead className="font-bold border-r text-center min-w-[100px]">Debit</TableHead>
                  <TableHead className="font-bold border-r text-center min-w-[100px]">Credit</TableHead>
                  <TableHead className="font-bold text-center min-w-[100px]">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statementEntries.map((entry, index) => (
                  <TableRow 
                    key={entry.id} 
                    className={`
                      ${entry.id === 'opening' || entry.id === 'totals' ? 'bg-gray-100 font-semibold' : ''}
                      ${entry.id === 'totals' ? 'border-t-2 border-gray-400' : ''}
                    `}
                  >
                    <TableCell className="border-r">
                      {entry.date}
                    </TableCell>
                    <TableCell className="border-r">
                      {entry.description}
                    </TableCell>
                    <TableCell className="border-r">
                      {entry.category}
                    </TableCell>
                    <TableCell className="border-r">
                      {entry.project}
                    </TableCell>
                    <TableCell className="border-r">
                      {getTypeBadge(entry.type)}
                    </TableCell>
                    <TableCell className="border-r">
                      {entry.paymentMethod}
                    </TableCell>
                    <TableCell className="border-r">
                      {entry.personName || '-'}
                    </TableCell>
                    <TableCell className="border-r text-center">
                      {entry.id === 'opening' || entry.id === 'totals' ? '-' : (
                        entry.billAvailable ? (
                          <Check className="h-4 w-4 text-green-600 mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-red-600 mx-auto" />
                        )
                      )}
                    </TableCell>
                    <TableCell className="border-r text-right text-red-600">
                      {formatAmount(entry.debit)}
                    </TableCell>
                    <TableCell className="border-r text-right text-green-600">
                      {formatAmount(entry.credit)}
                    </TableCell>
                    <TableCell className={`text-right font-semibold ${
                      entry.balance < 0 ? 'text-red-600' : entry.balance > 0 ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {entry.balance.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountingStatement;
