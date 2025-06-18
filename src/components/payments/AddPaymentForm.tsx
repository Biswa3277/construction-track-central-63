import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form"; 
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

const projects = [
  { id: "1", name: "Amrit WTP" },
  { id: "2", name: "YACHULI" },
  { id: "3", name: "Sample Testing" },
  { id: "4", name: "Piyong IoT" },
  { id: "5", name: "Machuika" }
];

const vendors = [
  { id: "1", name: "King Longkai" },
  { id: "2", name: "BMP SYSTEMS" },
  { id: "3", name: "P.R.S ENTERPRISE" },
  { id: "4", name: "SKY MARKETING" },
  { id: "5", name: "Agmatic Technologies" },
  { id: "6", name: "DIVYANSHU AUTOMATION" }
];

const paymentStatuses = [
  { id: "unpaid", name: "Unpaid" },
  { id: "partial", name: "Partial" },
  { id: "paid", name: "Paid" },
  { id: "hold", name: "On Hold" }
];

const formSchema = z.object({
  projectId: z.string({ required_error: "Please select a project" }),
  vendorId: z.string({ required_error: "Please select a vendor" }),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  payableAmount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Payable amount must be a positive number",
  }),
  payablePercentage: z.string().optional(),
  description: z.string().optional(),
  paymentStatus: z.string({ required_error: "Please select a payment status" }),
  transportStatus: z.string().optional(),
  date: z.date({ required_error: "Payment date is required" }),
  invoice: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const AddPaymentForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPercentageMode, setIsPercentageMode] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectId: "",
      vendorId: "",
      amount: "",
      payableAmount: "",
      payablePercentage: "",
      description: "",
      paymentStatus: "unpaid",
      transportStatus: "not-applicable",
      invoice: "",
    },
  });

  const watchAmount = form.watch("amount");
  const watchPayablePercentage = form.watch("payablePercentage");

  // Calculate payable amount when percentage changes
  const handlePercentageChange = (percentage: string) => {
    if (isPercentageMode && watchAmount && percentage) {
      const totalAmount = Number(watchAmount);
      const percentageValue = Number(percentage);
      
      if (!isNaN(totalAmount) && !isNaN(percentageValue) && percentageValue >= 0 && percentageValue <= 100) {
        const calculatedAmount = (totalAmount * percentageValue) / 100;
        form.setValue("payableAmount", calculatedAmount.toString());
      }
    }
  };

  // Toggle between percentage and amount mode
  const handleToggleMode = (checked: boolean) => {
    setIsPercentageMode(checked);
    if (!checked) {
      form.setValue("payablePercentage", "");
    } else {
      form.setValue("payableAmount", "");
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      console.log("Payment data:", data);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Payment record added successfully");
      form.reset();
      setIsPercentageMode(false);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error("Failed to add payment record");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="projectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="vendorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vendor</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {vendors.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Amount (₹)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter total amount" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Payable Amount (₹)</Label>
              <div className="flex items-center space-x-2">
                <Label htmlFor="percentage-mode" className="text-sm">Percentage Mode</Label>
                <Switch
                  id="percentage-mode"
                  checked={isPercentageMode}
                  onCheckedChange={handleToggleMode}
                />
              </div>
            </div>
            
            {isPercentageMode ? (
              <FormField
                control={form.control}
                name="payablePercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="Enter percentage" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(e);
                            handlePercentageChange(e.target.value);
                          }}
                        />
                        <span className="absolute right-3 top-2.5 text-muted-foreground">%</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="payableAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Enter payable amount" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {isPercentageMode && watchAmount && watchPayablePercentage && (
              <div className="text-sm text-muted-foreground">
                Calculated Amount: ₹{((Number(watchAmount) * Number(watchPayablePercentage)) / 100).toLocaleString()}
              </div>
            )}
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter payment description" 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="paymentStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {paymentStatuses.map((status) => (
                      <SelectItem key={status.id} value={status.id}>
                        {status.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="transportStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transport Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="not-applicable">Not Applicable</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-transit">In Transit</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Payment Date</FormLabel>
                <DatePicker
                  date={field.value}
                  setDate={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="invoice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Invoice Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter invoice number (optional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button" onClick={() => form.reset()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Payment"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddPaymentForm;
