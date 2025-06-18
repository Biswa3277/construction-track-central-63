
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExpenseItem } from "../types/expenseTypes";

interface AccountingStatementProps {
  refreshTrigger: number;
}

interface StatementEntry {
  id: string;
  date: string;
  description: string;
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
      debit: totalDebit,
      credit: totalCredit,
      balance: runningBalance
    });

    setStatementEntries(entries);
  };

  const formatAmount = (amount: number) => {
    return amount === 0 ? '' : amount.toFixed(2);
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
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-bold border-r">Date</TableHead>
                <TableHead className="font-bold border-r">Description</TableHead>
                <TableHead className="font-bold border-r text-center">Debit</TableHead>
                <TableHead className="font-bold border-r text-center">Credit</TableHead>
                <TableHead className="font-bold text-center">Balance</TableHead>
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
                  <TableCell className="border-r text-right">
                    {formatAmount(entry.debit)}
                  </TableCell>
                  <TableCell className="border-r text-right">
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
