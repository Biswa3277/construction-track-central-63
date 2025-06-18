import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, FileText } from "lucide-react";
import { ExpenseItem, MonthlyStatement } from "../types/expenseTypes";
import * as XLSX from 'xlsx';
import { toast } from "sonner";

interface MonthlyStatementsProps {
  refreshTrigger: number;
}

const MonthlyStatements = ({ refreshTrigger }: MonthlyStatementsProps) => {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [statements, setStatements] = useState<MonthlyStatement[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedStatement, setSelectedStatement] = useState<MonthlyStatement | null>(null);

  useEffect(() => {
    loadExpenses();
  }, [refreshTrigger]);

  useEffect(() => {
    generateMonthlyStatements();
  }, [expenses]);

  const loadExpenses = () => {
    const storedExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    setExpenses(storedExpenses);
  };

  const generateMonthlyStatements = () => {
    const monthlyData: { [key: string]: ExpenseItem[] } = {};

    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = [];
      }
      monthlyData[monthKey].push(expense);
    });

    const statements: MonthlyStatement[] = Object.entries(monthlyData).map(([monthKey, monthExpenses]) => {
      const [year, month] = monthKey.split('-');
      
      const projectExpenses = monthExpenses.filter(e => e.type === 'project');
      const otherExpenses = monthExpenses.filter(e => e.type === 'other');

      const projectReceived = projectExpenses.filter(e => e.transactionType === 'received').reduce((sum, e) => sum + e.amount, 0);
      const projectSpent = projectExpenses.filter(e => e.transactionType === 'spent').reduce((sum, e) => sum + e.amount, 0);
      
      const otherReceived = otherExpenses.filter(e => e.transactionType === 'received').reduce((sum, e) => sum + e.amount, 0);
      const otherSpent = otherExpenses.filter(e => e.transactionType === 'spent').reduce((sum, e) => sum + e.amount, 0);

      return {
        month: new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'long' }),
        year: parseInt(year),
        projectExpenses: {
          totalReceived: projectReceived,
          totalSpent: projectSpent,
          balance: projectReceived - projectSpent,
          items: projectExpenses
        },
        otherExpenses: {
          totalReceived: otherReceived,
          totalSpent: otherSpent,
          balance: otherReceived - otherSpent,
          items: otherExpenses
        },
        overallBalance: (projectReceived + otherReceived) - (projectSpent + otherSpent)
      };
    });

    setStatements(statements.sort((a, b) => b.year - a.year || b.month.localeCompare(a.month)));
  };

  const handleMonthChange = (monthKey: string) => {
    setSelectedMonth(monthKey);
    const statement = statements.find(s => `${s.year}-${s.month}` === monthKey);
    setSelectedStatement(statement || null);
  };

  const exportToExcel = (statement: MonthlyStatement) => {
    const wb = XLSX.utils.book_new();

    // Summary sheet
    const summaryData = [
      ['Monthly Expense Statement'],
      [`${statement.month} ${statement.year}`],
      [''],
      ['Summary'],
      ['Category', 'Received', 'Spent', 'Balance'],
      ['Project Expenses', statement.projectExpenses.totalReceived, statement.projectExpenses.totalSpent, statement.projectExpenses.balance],
      ['Other Expenses', statement.otherExpenses.totalReceived, statement.otherExpenses.totalSpent, statement.otherExpenses.balance],
      ['Total', statement.projectExpenses.totalReceived + statement.otherExpenses.totalReceived, statement.projectExpenses.totalSpent + statement.otherExpenses.totalSpent, statement.overallBalance],
    ];

    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

    // Project expenses sheet
    if (statement.projectExpenses.items.length > 0) {
      const projectData = [
        ['Date', 'Description', 'Category', 'Project', 'Type', 'Amount', 'Payment Method'],
        ...statement.projectExpenses.items.map(item => [
          item.date,
          item.description,
          item.category,
          item.projectName || '',
          item.transactionType,
          item.amount,
          item.paymentMethod
        ])
      ];
      const projectWs = XLSX.utils.aoa_to_sheet(projectData);
      XLSX.utils.book_append_sheet(wb, projectWs, 'Project Expenses');
    }

    // Other expenses sheet
    if (statement.otherExpenses.items.length > 0) {
      const otherData = [
        ['Date', 'Description', 'Category', 'Type', 'Amount', 'Payment Method'],
        ...statement.otherExpenses.items.map(item => [
          item.date,
          item.description,
          item.category,
          item.transactionType,
          item.amount,
          item.paymentMethod
        ])
      ];
      const otherWs = XLSX.utils.aoa_to_sheet(otherData);
      XLSX.utils.book_append_sheet(wb, otherWs, 'Other Expenses');
    }

    XLSX.writeFile(wb, `Monthly_Statement_${statement.month}_${statement.year}.xlsx`);
    toast.success("Monthly statement exported successfully!");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Statements</CardTitle>
          <CardDescription>View and export monthly expense statements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <Select value={selectedMonth} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {statements.map((statement) => {
                  const monthKey = `${statement.year}-${statement.month}`;
                  return (
                    <SelectItem key={monthKey} value={monthKey}>
                      {statement.month} {statement.year}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            {selectedStatement && (
              <Button onClick={() => exportToExcel(selectedStatement)}>
                <Download className="mr-2 h-4 w-4" />
                Export to Excel
              </Button>
            )}
          </div>

          {selectedStatement ? (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-sm font-medium text-green-800">Project Received</h3>
                    <p className="text-xl font-bold text-green-600">₹{selectedStatement.projectExpenses.totalReceived.toLocaleString()}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-sm font-medium text-red-800">Project Spent</h3>
                    <p className="text-xl font-bold text-red-600">₹{selectedStatement.projectExpenses.totalSpent.toLocaleString()}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-sm font-medium text-orange-800">Other Expenses</h3>
                    <p className="text-xl font-bold text-orange-600">₹{selectedStatement.otherExpenses.totalSpent.toLocaleString()}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className={`text-sm font-medium ${selectedStatement.overallBalance >= 0 ? 'text-blue-800' : 'text-red-800'}`}>
                      Overall Balance
                    </h3>
                    <p className={`text-xl font-bold ${selectedStatement.overallBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                      ₹{selectedStatement.overallBalance.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Project Expenses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span>Received:</span>
                        <span className="text-green-600 font-semibold">₹{selectedStatement.projectExpenses.totalReceived.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Spent:</span>
                        <span className="text-red-600 font-semibold">₹{selectedStatement.projectExpenses.totalSpent.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-medium">Balance:</span>
                        <span className={`font-bold ${selectedStatement.projectExpenses.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                          ₹{selectedStatement.projectExpenses.balance.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Other Expenses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span>Received:</span>
                        <span className="text-green-600 font-semibold">₹{selectedStatement.otherExpenses.totalReceived.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Spent:</span>
                        <span className="text-red-600 font-semibold">₹{selectedStatement.otherExpenses.totalSpent.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-medium">Balance:</span>
                        <span className={`font-bold ${selectedStatement.otherExpenses.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                          ₹{selectedStatement.otherExpenses.balance.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              {statements.length === 0 ? (
                <div>
                  <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No expense data available to generate statements.</p>
                </div>
              ) : (
                <p>Select a month to view the statement</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlyStatements;
