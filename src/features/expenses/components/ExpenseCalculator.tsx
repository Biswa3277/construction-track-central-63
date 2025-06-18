
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Badge } from "@/components/ui/badge";
import { Calculator, Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { ExpenseItem } from "../types/expenseTypes";

interface ExpenseCalculatorProps {
  refreshTrigger: number;
}

const ExpenseCalculator = ({ refreshTrigger }: ExpenseCalculatorProps) => {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [durationType, setDurationType] = useState<'single' | 'range' | 'month'>('single');
  const [singleDate, setSingleDate] = useState<Date | null>(null);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [calculationResult, setCalculationResult] = useState<{
    totalReceived: number;
    totalSpent: number;
    balance: number;
    receivedEntries: ExpenseItem[];
    spentEntries: ExpenseItem[];
  } | null>(null);

  useEffect(() => {
    loadExpenses();
  }, [refreshTrigger]);

  const loadExpenses = () => {
    const storedExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    setExpenses(storedExpenses);
  };

  const filterExpensesByDate = (expenses: ExpenseItem[]) => {
    if (durationType === 'single' && singleDate) {
      const targetDate = singleDate.toISOString().split('T')[0];
      return expenses.filter(expense => expense.date === targetDate);
    }
    
    if (durationType === 'range' && fromDate && toDate) {
      const from = fromDate.toISOString().split('T')[0];
      const to = toDate.toISOString().split('T')[0];
      return expenses.filter(expense => expense.date >= from && expense.date <= to);
    }
    
    if (durationType === 'month' && selectedMonth) {
      const [year, month] = selectedMonth.split('-');
      return expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getFullYear() === parseInt(year) && 
               expenseDate.getMonth() === parseInt(month) - 1;
      });
    }
    
    return [];
  };

  const calculateExpenses = () => {
    const filteredExpenses = filterExpensesByDate(expenses);
    
    const receivedEntries = filteredExpenses.filter(expense => 
      expense.transactionType === 'received'
    );
    
    const spentEntries = filteredExpenses.filter(expense => 
      expense.transactionType === 'spent'
    );
    
    const totalReceived = receivedEntries.reduce((sum, expense) => sum + expense.amount, 0);
    const totalSpent = spentEntries.reduce((sum, expense) => sum + expense.amount, 0);
    const balance = totalReceived - totalSpent;
    
    setCalculationResult({
      totalReceived,
      totalSpent,
      balance,
      receivedEntries,
      spentEntries
    });
  };

  const getAvailableMonths = () => {
    const months = expenses.map(expense => {
      const date = new Date(expense.date);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    });
    return [...new Set(months)].sort().reverse();
  };

  const resetCalculation = () => {
    setCalculationResult(null);
    setSingleDate(null);
    setFromDate(null);
    setToDate(null);
    setSelectedMonth('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Expense Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Duration Selection */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Select Duration Type</label>
            <Select value={durationType} onValueChange={(value: 'single' | 'range' | 'month') => {
              setDurationType(value);
              resetCalculation();
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single Date</SelectItem>
                <SelectItem value="range">Date Range</SelectItem>
                <SelectItem value="month">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Selection Based on Duration Type */}
          {durationType === 'single' && (
            <div>
              <label className="text-sm font-medium mb-2 block">Select Date</label>
              <DatePicker
                date={singleDate}
                setDate={setSingleDate}
                placeholder="Pick a date"
              />
            </div>
          )}

          {durationType === 'range' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">From Date</label>
                <DatePicker
                  date={fromDate}
                  setDate={setFromDate}
                  placeholder="From date"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">To Date</label>
                <DatePicker
                  date={toDate}
                  setDate={setToDate}
                  placeholder="To date"
                />
              </div>
            </div>
          )}

          {durationType === 'month' && (
            <div>
              <label className="text-sm font-medium mb-2 block">Select Month</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableMonths().map((month) => {
                    const [year, monthNum] = month.split('-');
                    const monthName = new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleString('default', { month: 'long' });
                    return (
                      <SelectItem key={month} value={month}>
                        {monthName} {year}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Calculate Button */}
        <div className="flex gap-2">
          <Button onClick={calculateExpenses} disabled={
            (durationType === 'single' && !singleDate) ||
            (durationType === 'range' && (!fromDate || !toDate)) ||
            (durationType === 'month' && !selectedMonth)
          }>
            <Calculator className="mr-2 h-4 w-4" />
            Calculate Expenses
          </Button>
          
          {calculationResult && (
            <Button variant="outline" onClick={resetCalculation}>
              Reset
            </Button>
          )}
        </div>

        {/* Results */}
        {calculationResult && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Total Received</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{calculationResult.totalReceived.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-700">
                    {calculationResult.receivedEntries.length} transactions
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">Total Spent</span>
                  </div>
                  <p className="text-2xl font-bold text-red-600">
                    ₹{calculationResult.totalSpent.toLocaleString()}
                  </p>
                  <p className="text-xs text-red-700">
                    {calculationResult.spentEntries.length} transactions
                  </p>
                </CardContent>
              </Card>

              <Card className={calculationResult.balance >= 0 ? 'bg-blue-50' : 'bg-orange-50'}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className={`text-sm font-medium ${calculationResult.balance >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
                      Current Balance
                    </span>
                  </div>
                  <p className={`text-2xl font-bold ${calculationResult.balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                    ₹{calculationResult.balance.toLocaleString()}
                  </p>
                  <Badge variant={calculationResult.balance >= 0 ? 'default' : 'destructive'} className="text-xs">
                    {calculationResult.balance >= 0 ? 'Surplus' : 'Deficit'}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-green-700">Received Entries</CardTitle>
                </CardHeader>
                <CardContent>
                  {calculationResult.receivedEntries.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No received entries found</p>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {calculationResult.receivedEntries.map((entry) => (
                        <div key={entry.id} className="flex justify-between items-center p-2 bg-green-50 rounded">
                          <div>
                            <p className="font-medium text-sm">{entry.description}</p>
                            <p className="text-xs text-muted-foreground">{new Date(entry.date).toLocaleDateString()}</p>
                          </div>
                          <span className="font-semibold text-green-600">+₹{entry.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-red-700">Spent Entries</CardTitle>
                </CardHeader>
                <CardContent>
                  {calculationResult.spentEntries.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No spent entries found</p>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {calculationResult.spentEntries.map((entry) => (
                        <div key={entry.id} className="flex justify-between items-center p-2 bg-red-50 rounded">
                          <div>
                            <p className="font-medium text-sm">{entry.description}</p>
                            <p className="text-xs text-muted-foreground">{new Date(entry.date).toLocaleDateString()}</p>
                          </div>
                          <span className="font-semibold text-red-600">-₹{entry.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  function getAvailableMonths() {
    const months = expenses.map(expense => {
      const date = new Date(expense.date);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    });
    return [...new Set(months)].sort().reverse();
  }

  function resetCalculation() {
    setCalculationResult(null);
    setSingleDate(null);
    setFromDate(null);
    setToDate(null);
    setSelectedMonth('');
  }
};

export default ExpenseCalculator;
