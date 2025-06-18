
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
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
        runningBalance -= expense.amount;
      } else if (expense.transactionType === 'received' || expense.transactionType === 'total_received') {
        credit = expense.amount;
        runningBalance += expense.amount;
      }

      entries.push({
        id: expense.id,
        date: new Date(expense.date).toLocaleDateString(),
        description: expense.description,
        category: expense.category,
        project: expense.projectName || '-',
        type: expense.type,
        amount: expense.amount,
        paymentMethod: expense.paymentMethod,
        transactionType: expense.transactionType,
        debit,
        credit,
        balance: runningBalance
      });
    });

    // Calculate totals
    const totalDebit = entries.reduce((sum, entry) => sum + entry.debit, 0);
    const totalCredit = entries.reduce((sum, entry) => sum + entry.credit, 0);

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

  const getTransactionTypeBadge = (transactionType: string) => {
    if (transactionType === 'opening' || transactionType === 'totals') return null;
    
    if (transactionType === 'spent') {
      return <Badge variant="destructive">Spent</Badge>;
    } else if (transactionType === 'received') {
      return <Badge className="bg-blue-500">Received</Badge>;
    } else if (transactionType === 'total_received') {
      return <Badge className="bg-cyan-500">Total Received</Badge>;
    }
    return null;
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
                  <TableHead className="font-bold border-r min-w-[120px]">Project</TableHead>
                  <TableHead className="font-bold border-r min-w-[100px]">Type</TableHead>
                  <TableHead className="font-bold border-r min-w-[100px]">Amount</TableHead>
                  <TableHead className="font-bold border-r min-w-[120px]">Payment Method</TableHead>
                  <TableHead className="font-bold border-r text-center min-w-[100px]">Debit</TableHead>
                  <TableHead className="font-bold border-r text-center min-w-[100px]">Credit</TableHead>
                  <TableHead className="font-bold text-center min-w-[100px]">Balance</TableHead>
                  <TableHead className="font-bold min-w-[100px]">Actions</TableHead>
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
                    <TableCell className="border-r text-right">
                      {entry.amount > 0 ? `₹${entry.amount.toLocaleString()}` : ''}
                    </TableCell>
                    <TableCell className="border-r">
                      {entry.paymentMethod}
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
                    <TableCell>
                      {entry.id !== 'opening' && entry.id !== 'totals' && (
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <h3 className="text-sm font-medium text-red-800">Total Debits (Spent)</h3>
            <p className="text-xl font-bold text-red-600">
              ₹{statementEntries.reduce((sum, entry) => sum + entry.debit, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <h3 className="text-sm font-medium text-green-800">Total Credits (Received)</h3>
            <p className="text-xl font-bold text-green-600">
              ₹{statementEntries.reduce((sum, entry) => sum + entry.credit, 0).toLocaleString()}
            </p>
          </div>
          <div className={`p-4 rounded-lg text-center ${
            statementEntries[statementEntries.length - 1]?.balance >= 0 ? 'bg-blue-50' : 'bg-orange-50'
          }`}>
            <h3 className={`text-sm font-medium ${
              statementEntries[statementEntries.length - 1]?.balance >= 0 ? 'text-blue-800' : 'text-orange-800'
            }`}>
              Final Balance
            </h3>
            <p className={`text-xl font-bold ${
              statementEntries[statementEntries.length - 1]?.balance >= 0 ? 'text-blue-600' : 'text-orange-600'
            }`}>
              ₹{(statementEntries[statementEntries.length - 1]?.balance || 0).toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountingStatement;
