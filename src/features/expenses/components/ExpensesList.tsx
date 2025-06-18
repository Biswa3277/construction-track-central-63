import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Trash2, Check, X } from "lucide-react";
import { ExpenseItem } from "../types/expenseTypes";
import { toast } from "sonner";

interface ExpensesListProps {
  type: 'project' | 'other';
  refreshTrigger: number;
}

interface ExpenseWithBalance extends ExpenseItem {
  debit: number;
  credit: number;
  balance: number;
}

const ExpensesList = ({ type, refreshTrigger }: ExpensesListProps) => {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<ExpenseWithBalance[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [transactionFilter, setTransactionFilter] = useState("all");

  useEffect(() => {
    loadExpenses();
  }, [refreshTrigger]);

  useEffect(() => {
    filterExpenses();
  }, [expenses, searchQuery, categoryFilter, transactionFilter, type]);

  const loadExpenses = () => {
    const storedExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    setExpenses(storedExpenses);
  };

  const filterExpenses = () => {
    let filtered = expenses.filter(expense => expense.type === type);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(expense =>
        expense.description.toLowerCase().includes(query) ||
        expense.category.toLowerCase().includes(query) ||
        (expense.projectName && expense.projectName.toLowerCase().includes(query)) ||
        (expense.personName && expense.personName.toLowerCase().includes(query))
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(expense => expense.category === categoryFilter);
    }

    if (transactionFilter !== "all") {
      filtered = filtered.filter(expense => expense.transactionType === transactionFilter);
    }

    // Sort by date
    const sortedExpenses = filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Calculate running balance
    let runningBalance = 0;
    const expensesWithBalance: ExpenseWithBalance[] = sortedExpenses.map((expense) => {
      let debit = 0;
      let credit = 0;

      if (expense.transactionType === 'spent') {
        debit = expense.amount;
        runningBalance -= expense.amount;
      } else if (expense.transactionType === 'received' || expense.transactionType === 'total_received') {
        credit = expense.amount;
        runningBalance += expense.amount;
      }

      return {
        ...expense,
        debit,
        credit,
        balance: runningBalance
      };
    });

    setFilteredExpenses(expensesWithBalance);
  };

  const deleteExpense = (id: string) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    setExpenses(updatedExpenses);
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    toast.success("Expense deleted successfully");
  };

  const getUniqueCategories = () => {
    const categories = expenses
      .filter(expense => expense.type === type)
      .map(expense => expense.category);
    return [...new Set(categories)];
  };

  const formatAmount = (amount: number) => {
    return amount === 0 ? '' : amount.toFixed(2);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search expenses..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {getUniqueCategories().map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={transactionFilter} onValueChange={setTransactionFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Transactions</SelectItem>
            <SelectItem value="received">Received</SelectItem>
            <SelectItem value="spent">Spent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-bold border-r min-w-[100px]">Date</TableHead>
                <TableHead className="font-bold border-r min-w-[150px]">Description</TableHead>
                <TableHead className="font-bold border-r min-w-[120px]">Category</TableHead>
                {type === 'project' && <TableHead className="font-bold border-r min-w-[120px]">Project/Others</TableHead>}
                <TableHead className="font-bold border-r min-w-[100px]">Type</TableHead>
                <TableHead className="font-bold border-r min-w-[120px]">Payment Method</TableHead>
                <TableHead className="font-bold border-r min-w-[120px]">Person Name</TableHead>
                <TableHead className="font-bold border-r min-w-[100px]">Bill Available</TableHead>
                <TableHead className="font-bold border-r text-center min-w-[100px]">Debit</TableHead>
                <TableHead className="font-bold border-r text-center min-w-[100px]">Credit</TableHead>
                <TableHead className="font-bold border-r text-center min-w-[100px]">Balance</TableHead>
                <TableHead className="font-bold text-center min-w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="border-r">{new Date(expense.date).toLocaleDateString()}</TableCell>
                  <TableCell className="border-r max-w-xs truncate">{expense.description}</TableCell>
                  <TableCell className="border-r">{expense.category}</TableCell>
                  {type === 'project' && <TableCell className="border-r">{expense.projectName || 'Others'}</TableCell>}
                  <TableCell className="border-r">
                    <Badge variant={expense.transactionType === 'spent' ? 'destructive' : 'default'}>
                      {expense.transactionType === 'received' ? 'Received' : 
                       expense.transactionType === 'total_received' ? 'Total Received' : 'Spent'}
                    </Badge>
                  </TableCell>
                  <TableCell className="border-r">{expense.paymentMethod}</TableCell>
                  <TableCell className="border-r">{expense.personName || '-'}</TableCell>
                  <TableCell className="border-r text-center">
                    {expense.billAvailable ? (
                      <Check className="h-4 w-4 text-green-600 mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-red-600 mx-auto" />
                    )}
                  </TableCell>
                  <TableCell className="border-r text-right text-red-600">
                    {formatAmount(expense.debit)}
                  </TableCell>
                  <TableCell className="border-r text-right text-green-600">
                    {formatAmount(expense.credit)}
                  </TableCell>
                  <TableCell className={`border-r text-right font-semibold ${
                    expense.balance < 0 ? 'text-red-600' : expense.balance > 0 ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {expense.balance.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteExpense(expense.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredExpenses.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No expenses found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpensesList;
