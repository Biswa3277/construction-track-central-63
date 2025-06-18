
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, Download, FileSpreadsheet } from "lucide-react";
import * as XLSX from 'xlsx';
import { toast } from "sonner";

interface PaymentExcelImportExportProps {
  onDataChange?: () => void;
}

const PaymentExcelImportExport = ({ onDataChange }: PaymentExcelImportExportProps) => {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    const templateData = [
      ['SL No.', 'Description', 'Project Name', 'Company Name', 'PO Reference', 'PO Date', 'AC No', 'IFSC Code', 'Branch Bank', 'Total Amount', 'Priority', 'Status'],
      ['1', 'Sample Description', 'Sample Project', 'Sample Company', 'PO123456', '2024-01-15', '123456789', 'SBIN0001234', 'Sample Bank Branch', '100000', 'High', 'unpaid'],
      ['2', 'Another Description', 'Another Project', 'Another Company', 'PO789012', '2024-01-16', '987654321', 'HDFC0001234', 'Another Bank Branch', '50000', 'Medium', 'partial'],
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(templateData);
    XLSX.utils.book_append_sheet(wb, ws, 'Payment Template');
    XLSX.writeFile(wb, 'Payment_Import_Template.xlsx');
    toast.success("Template downloaded successfully!");
  };

  const exportAllPayments = () => {
    const storedPayments = JSON.parse(localStorage.getItem('vendorPayments') || '[]');
    
    if (storedPayments.length === 0) {
      toast.error("No payments to export");
      return;
    }

    const exportData = [
      ['SL No.', 'Description', 'Project Name', 'Company Name', 'PO Reference', 'PO Date', 'AC No', 'IFSC Code', 'Branch Bank', 'Total Amount', 'Paid', 'Payable Amount', 'Priority', 'Status', 'Remarks'],
      ...storedPayments.map((payment: any) => [
        payment.slNo,
        payment.description,
        payment.projectName,
        payment.companyName,
        payment.poReference,
        payment.poDate,
        payment.acNo,
        payment.ifscCode,
        payment.branchBank,
        payment.totalAmount,
        payment.paid,
        payment.payableAmount,
        payment.priority,
        payment.status,
        payment.remarks || ''
      ])
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(exportData);
    XLSX.utils.book_append_sheet(wb, ws, 'All Payments');
    XLSX.writeFile(wb, `All_Payments_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("All payments exported successfully!");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Skip header row
        const rows = jsonData.slice(1) as any[][];
        const importedPayments: any[] = [];
        const errors: string[] = [];

        rows.forEach((row, index) => {
          const rowNum = index + 2;
          
          if (row.length < 12) {
            errors.push(`Row ${rowNum}: Missing required columns`);
            return;
          }

          const [slNo, description, projectName, companyName, poReference, poDate, acNo, ifscCode, branchBank, totalAmount, priority, status] = row;

          if (!description || description.trim() === '') {
            errors.push(`Row ${rowNum}: Description is required`);
            return;
          }

          if (isNaN(totalAmount) || totalAmount <= 0) {
            errors.push(`Row ${rowNum}: Invalid total amount`);
            return;
          }

          if (!['High', 'Medium', 'Low'].includes(priority)) {
            errors.push(`Row ${rowNum}: Invalid priority. Must be 'High', 'Medium', or 'Low'`);
            return;
          }

          if (!['paid', 'partial', 'unpaid', 'hold'].includes(status)) {
            errors.push(`Row ${rowNum}: Invalid status. Must be 'paid', 'partial', 'unpaid', or 'hold'`);
            return;
          }

          const payment = {
            id: `import_${Date.now()}_${index}`,
            slNo: parseInt(slNo) || index + 1,
            description: description.trim(),
            projectName: projectName?.trim() || '',
            companyName: companyName?.trim() || '',
            poReference: poReference?.trim() || '',
            poDate: poDate?.trim() || '',
            acNo: acNo?.trim() || '',
            ifscCode: ifscCode?.trim() || '',
            branchBank: branchBank?.trim() || '',
            totalAmount: parseFloat(totalAmount),
            paid: 0,
            payableAmount: parseFloat(totalAmount),
            priority: priority as 'High' | 'Medium' | 'Low',
            status: status as 'paid' | 'partial' | 'unpaid' | 'hold',
          };

          importedPayments.push(payment);
        });

        if (errors.length > 0) {
          toast.error(`Import failed with ${errors.length} errors. Check console for details.`);
          console.error('Import errors:', errors);
          return;
        }

        if (importedPayments.length === 0) {
          toast.error("No valid payments found in the file");
          return;
        }

        // Save to localStorage
        const existingPayments = JSON.parse(localStorage.getItem('vendorPayments') || '[]');
        const allPayments = [...existingPayments, ...importedPayments];
        localStorage.setItem('vendorPayments', JSON.stringify(allPayments));

        toast.success(`Successfully imported ${importedPayments.length} payments`);
        setIsImportDialogOpen(false);
        onDataChange?.();
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Import error:', error);
        toast.error("Failed to import file. Please check the format.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <>
      <div className="flex gap-2">
        <Button variant="outline" onClick={downloadTemplate}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Template
        </Button>
        <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Import
        </Button>
        <Button variant="outline" onClick={exportAllPayments}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Payments from Excel</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>Please ensure your Excel file has the following columns in order:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>SL No.</li>
                <li>Description</li>
                <li>Project Name</li>
                <li>Company Name</li>
                <li>PO Reference</li>
                <li>PO Date</li>
                <li>AC No</li>
                <li>IFSC Code</li>
                <li>Branch Bank</li>
                <li>Total Amount</li>
                <li>Priority (High/Medium/Low)</li>
                <li>Status (paid/partial/unpaid/hold)</li>
              </ul>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={downloadTemplate} className="flex-1">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Download Template
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1"
              >
                <Upload className="mr-2 h-4 w-4" />
                Choose File
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentExcelImportExport;
