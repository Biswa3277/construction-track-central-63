
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

const Expenses = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("project");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddExpenseSuccess = () => {
    setIsAddDialogOpen(false);
    setRefreshTrigger(prev => prev + 1);
    toast.success("Expense added successfully!");
  };

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

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
