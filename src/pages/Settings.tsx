import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import UISettings from "@/components/settings/UISettings";

const UserSettings = () => {
  const [user, setUser] = useState({
    name: "Admin User",
    email: "admin@example.com",
    phone: "+91 98765 43210",
    company: "ConstructTrack"
  });

  const handleUserUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("User settings updated successfully");
  };

  return (
    <form onSubmit={handleUserUpdate}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name"
              value={user.name}
              onChange={(e) => setUser({...user, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              type="email"
              value={user.email}
              onChange={(e) => setUser({...user, email: e.target.value})}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input 
              id="phone"
              value={user.phone}
              onChange={(e) => setUser({...user, phone: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input 
              id="company"
              value={user.company}
              onChange={(e) => setUser({...user, company: e.target.value})}
            />
          </div>
        </div>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
};

const CompanySettings = () => {
  const [company, setCompany] = useState({
    name: "ConstructTrack Ltd",
    address: "123 Construction Street, Building Zone, 400001",
    phone: "+91 11 2345 6789",
    email: "info@constructtrack.com",
    gstin: "27AABCT1234A1Z5",
    logo: ""
  });

  const handleCompanyUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Company settings updated successfully");
  };

  return (
    <form onSubmit={handleCompanyUpdate}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input 
            id="companyName"
            value={company.name}
            onChange={(e) => setCompany({...company, name: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea 
            id="address"
            value={company.address}
            onChange={(e) => setCompany({...company, address: e.target.value})}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyPhone">Phone</Label>
            <Input 
              id="companyPhone"
              value={company.phone}
              onChange={(e) => setCompany({...company, phone: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyEmail">Email</Label>
            <Input 
              id="companyEmail"
              type="email"
              value={company.email}
              onChange={(e) => setCompany({...company, email: e.target.value})}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="gstin">GSTIN</Label>
          <Input 
            id="gstin"
            value={company.gstin}
            onChange={(e) => setCompany({...company, gstin: e.target.value})}
          />
        </div>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
};

const NotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    paymentReminders: true,
    transportUpdates: true,
    newVendors: false,
    dailySummary: true
  });

  const handleToggle = (key: string) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key]
    });
  };

  const handleNotificationUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Notification settings updated successfully");
  };

  return (
    <form onSubmit={handleNotificationUpdate}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="emailNotifications">Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive general email notifications
            </p>
          </div>
          <Switch 
            id="emailNotifications"
            checked={notifications.emailNotifications}
            onCheckedChange={() => handleToggle("emailNotifications")}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="paymentReminders">Payment Reminders</Label>
            <p className="text-sm text-muted-foreground">
              Receive reminders for upcoming payments
            </p>
          </div>
          <Switch 
            id="paymentReminders"
            checked={notifications.paymentReminders}
            onCheckedChange={() => handleToggle("paymentReminders")}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="transportUpdates">Transportation Updates</Label>
            <p className="text-sm text-muted-foreground">
              Receive updates on material shipment status
            </p>
          </div>
          <Switch 
            id="transportUpdates"
            checked={notifications.transportUpdates}
            onCheckedChange={() => handleToggle("transportUpdates")}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="newVendors">New Vendor Alerts</Label>
            <p className="text-sm text-muted-foreground">
              Get notified when new vendors are added
            </p>
          </div>
          <Switch 
            id="newVendors"
            checked={notifications.newVendors}
            onCheckedChange={() => handleToggle("newVendors")}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="dailySummary">Daily Summary</Label>
            <p className="text-sm text-muted-foreground">
              Receive a daily summary of all activities
            </p>
          </div>
          <Switch 
            id="dailySummary"
            checked={notifications.dailySummary}
            onCheckedChange={() => handleToggle("dailySummary")}
          />
        </div>
        
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
};

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application settings</p>
      </div>

      <Tabs defaultValue="user" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="user">User Profile</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="ui">UI & Theme</TabsTrigger>
        </TabsList>
        <TabsContent value="user">
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>Manage your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <UserSettings />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Update your company details</CardDescription>
            </CardHeader>
            <CardContent>
              <CompanySettings />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationSettings />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ui">
          <Card>
            <CardHeader>
              <CardTitle>UI & Theme Settings</CardTitle>
              <CardDescription>Customize the appearance and feel of your application</CardDescription>
            </CardHeader>
            <CardContent>
              <UISettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
