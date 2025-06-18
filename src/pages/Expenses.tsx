import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, FileSpreadsheet, Download } from "lucide-react";
import { toast } from "sonner";
import AddExpenseForm from "@/features/expenses/components/AddExpenseForm";
import ExpensesList from "@/features/expenses/components/ExpensesList";
import MonthlyStatements from "@/features/expenses/components/MonthlyStatements";
import ExcelImportExport from "@/features/expenses/components/ExcelImportExport";
import { ExpenseItem } from "@/features/expenses/types/expenseTypes";

const Expenses = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("project");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);

  useEffect(() => {
    loadExpenses();
  }, [refreshTrigger]);

  const loadExpenses = () => {
    const storedExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    setExpenses(storedExpenses);
  };

  const handleAddExpenseSuccess = () => {
    setIsAddDialogOpen(false);
    setRefreshTrigger(prev => prev + 1);
    toast.success("Expense added successfully!");
  };

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const getProjectExpenseSummary = () => {
    const projectExpenses = expenses.filter(expense => expense.type === 'project');
    let totalReceived = 0;
    let totalSpent = 0;

    projectExpenses.forEach(expense => {
      if (expense.transactionType === 'received') {
        totalReceived += expense.amount;
      } else if (expense.transactionType === 'spent') {
        totalSpent += expense.amount;
      }
    });

    return {
      totalReceived,
      totalSpent,
      balance: totalReceived - totalSpent,
      totalEntries: projectExpenses.length
    };
  };

  const getOtherExpenseSummary = () => {
    const otherExpenses = expenses.filter(expense => expense.type === 'other');
    let totalReceived = 0;
    let totalSpent = 0;

    otherExpenses.forEach(expense => {
      if (expense.transactionType === 'received') {
        totalReceived += expense.amount;
      } else if (expense.transactionType === 'spent') {
        totalSpent += expense.amount;
      }
    });

    return {
      totalReceived,
      totalSpent,
      balance: totalReceived - totalSpent,
      totalEntries: otherExpenses.length
    };
  };

  const projectSummary = getProjectExpenseSummary();
  const otherSummary = getOtherExpenseSummary();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">Expenses Management</h1>
        <div className="flex gap-2">
          <ExcelImportExport onDataChange={refreshData} />
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="project">Project Expenses</TabsTrigger>
          <TabsTrigger value="other">Other Expenses</TabsTrigger>
          <TabsTrigger value="statements">Monthly Statements</TabsTrigger>
        </TabsList>

        <TabsContent value="project" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Expenses</CardTitle>
              <CardDescription>
                Track expenses related to project materials, transportation, team movements, and project-related travel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-green-800">Total Received</h3>
                  <p className="text-2xl font-bold text-green-600">₹{projectSummary.totalReceived.toLocaleString()}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-red-800">Total Spent</h3>
                  <p className="text-2xl font-bold text-red-600">₹{projectSummary.totalSpent.toLocaleString()}</p>
                </div>
                <div className={`p-4 rounded-lg ${projectSummary.balance >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
                  <h3 className={`text-sm font-medium ${projectSummary.balance >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>Balance</h3>
                  <p className={`text-2xl font-bold ${projectSummary.balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                    ₹{projectSummary.balance.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-800">Total Entries</h3>
                  <p className="text-2xl font-bold text-gray-600">{projectSummary.totalEntries}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Project Expenses Details</CardTitle>
              <CardDescription>
                Detailed view of project expenses with running balance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExpensesList 
                type="project" 
                refreshTrigger={refreshTrigger}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="other" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Other Expenses</CardTitle>
              <CardDescription>
                Track business-related expenses, travel, accommodation, food, and other non-project expenses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-green-800">Total Received</h3>
                  <p className="text-2xl font-bold text-green-600">₹{otherSummary.totalReceived.toLocaleString()}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-red-800">Total Spent</h3>
                  <p className="text-2xl font-bold text-red-600">₹{otherSummary.totalSpent.toLocaleString()}</p>
                </div>
                <div className={`p-4 rounded-lg ${otherSummary.balance >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
                  <h3 className={`text-sm font-medium ${otherSummary.balance >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>Balance</h3>
                  <p className={`text-2xl font-bold ${otherSummary.balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                    ₹{otherSummary.balance.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-800">Total Entries</h3>
                  <p className="text-2xl font-bold text-gray-600">{otherSummary.totalEntries}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Other Expenses Details</CardTitle>
              <CardDescription>
                Detailed view of other expenses with running balance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExpensesList 
                type="other" 
                refreshTrigger={refreshTrigger}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statements" className="space-y-6">
          <MonthlyStatements refreshTrigger={refreshTrigger} />
        </TabsContent>
      </Tabs>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
          </DialogHeader>
          <AddExpenseForm 
            onSuccess={handleAddExpenseSuccess}
            defaultType={activeTab === "project" ? "project" : "other"}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Expenses;
