
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Upload, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { ExpenseItem } from "../types/expenseTypes";

interface ExcelImportExportProps {
  onDataChange: () => void;
}

const ExcelImportExport = ({ onDataChange }: ExcelImportExportProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const exportToExcel = async () => {
    setIsExporting(true);
    try {
      const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
      
      if (expenses.length === 0) {
        toast.error("No expenses to export");
        return;
      }

      // Transform data for Excel export
      const exportData = expenses.map((expense: ExpenseItem) => ({
        'Date': new Date(expense.date).toLocaleDateString(),
        'Type': expense.type,
        'Category': expense.category,
        'Project': expense.projectName || 'Others',
        'Description': expense.description,
        'Amount': expense.amount,
        'Transaction Type': expense.transactionType,
        'Payment Method': expense.paymentMethod,
        'Person Name': expense.personName || '',
        'Bill Available': expense.billAvailable ? 'Yes' : 'No',
        'Created At': new Date(expense.createdAt).toLocaleDateString(),
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');

      // Generate filename with current date
      const filename = `expenses_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      XLSX.writeFile(workbook, filename);
      toast.success("Expenses exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export expenses");
    } finally {
      setIsExporting(false);
    }
  };

  const importFromExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const existingExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
        let importedCount = 0;

        jsonData.forEach((row: any) => {
          try {
            // Map Excel columns to expense object
            const expense: ExpenseItem = {
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              type: row['Type'] === 'project' ? 'project' : 'other',
              category: row['Category'],
              projectName: row['Project'] !== 'Others' ? row['Project'] : undefined,
              description: row['Description'],
              amount: parseFloat(row['Amount']) || 0,
              transactionType: row['Transaction Type'] === 'received' ? 'received' : 'spent',
              date: new Date(row['Date']).toISOString().split('T')[0],
              paymentMethod: row['Payment Method'],
              personName: row['Person Name'] || undefined,
              billAvailable: row['Bill Available'] === 'Yes',
              approvalStatus: 'waiting',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            existingExpenses.push(expense);
            importedCount++;
          } catch (rowError) {
            console.error("Error processing row:", row, rowError);
          }
        });

        localStorage.setItem('expenses', JSON.stringify(existingExpenses));
        onDataChange();
        toast.success(`${importedCount} expenses imported successfully!`);
      } catch (error) {
        console.error("Import error:", error);
        toast.error("Failed to import expenses. Please check the file format.");
      } finally {
        setIsImporting(false);
        // Reset file input
        event.target.value = '';
      }
    };

    reader.readAsBinaryString(file);
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        'Date': '2024-01-01',
        'Type': 'project',
        'Category': 'Materials Purchase',
        'Project': 'Amni WTP',
        'Description': 'Sample expense description',
        'Amount': 1000,
        'Transaction Type': 'spent',
        'Payment Method': 'Cash',
        'Person Name': 'John Doe',
        'Bill Available': 'Yes'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');

    XLSX.writeFile(workbook, 'expenses_template.xlsx');
    toast.success("Template downloaded successfully!");
  };

  return (
    <div className="flex gap-2">
      <Button 
        onClick={exportToExcel} 
        disabled={isExporting}
        variant="outline"
        size="sm"
      >
        <Download className="mr-2 h-4 w-4" />
        {isExporting ? "Exporting..." : "Export"}
      </Button>
      
      <Button 
        onClick={downloadTemplate}
        variant="outline"
        size="sm"
      >
        <FileSpreadsheet className="mr-2 h-4 w-4" />
        Template
      </Button>

      <div className="relative">
        <Input
          type="file"
          accept=".xlsx,.xls"
          onChange={importFromExcel}
          disabled={isImporting}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <Button 
          variant="outline" 
          size="sm"
          disabled={isImporting}
        >
          <Upload className="mr-2 h-4 w-4" />
          {isImporting ? "Importing..." : "Import"}
        </Button>
      </div>
    </div>
  );
};

export default ExcelImportExport;
