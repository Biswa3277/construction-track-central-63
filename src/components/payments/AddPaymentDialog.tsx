
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AddPaymentForm from "./AddPaymentForm";

interface AddPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddPaymentDialog = ({ open, onOpenChange }: AddPaymentDialogProps) => {
  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Payment</DialogTitle>
        </DialogHeader>
        <AddPaymentForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default AddPaymentDialog;
