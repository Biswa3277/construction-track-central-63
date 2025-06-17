
import { useState } from "react";
import { Search, Bell, Mail, User, Settings, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface HeaderProps {
  user: any;
}

const Header = ({ user }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  const notifications = [
    { id: 1, title: "Payment Received", message: "Payment of $5,000 received from Project Alpha", time: "2 min ago", unread: true },
    { id: 2, title: "Project Update", message: "Department Project Beta milestone completed", time: "1 hour ago", unread: true },
    { id: 3, title: "Invoice Generated", message: "Invoice #INV-001 has been generated", time: "3 hours ago", unread: false },
  ];

  const messages = [
    { id: 1, sender: "John Doe", message: "Please review the project proposal", time: "5 min ago", unread: true },
    { id: 2, sender: "Sarah Wilson", message: "Budget approval needed for Q4", time: "2 hours ago", unread: true },
    { id: 3, sender: "Mike Johnson", message: "Transportation schedule updated", time: "1 day ago", unread: false },
  ];

  const unreadNotifications = notifications.filter(n => n.unread).length;
  const unreadMessages = messages.filter(m => m.unread).length;

  return (
    <div className="flex items-center gap-4">
      {/* Search Bar */}
      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Notifications */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadNotifications > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {unreadNotifications}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0">
          <div className="p-4 border-b">
            <h4 className="font-semibold">Notifications</h4>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.map((notification) => (
              <div key={notification.id} className={`p-3 border-b hover:bg-muted/50 cursor-pointer ${notification.unread ? 'bg-blue-50' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? 'bg-blue-500' : 'bg-gray-300'}`} />
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">{notification.title}</h5>
                    <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-2 border-t">
            <Button variant="ghost" className="w-full text-sm">View All Notifications</Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Messages */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Mail className="h-5 w-5" />
            {unreadMessages > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {unreadMessages}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0">
          <div className="p-4 border-b">
            <h4 className="font-semibold">Messages</h4>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {messages.map((message) => (
              <div key={message.id} className={`p-3 border-b hover:bg-muted/50 cursor-pointer ${message.unread ? 'bg-blue-50' : ''}`}>
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">{message.sender.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h5 className="font-medium text-sm">{message.sender}</h5>
                      {message.unread && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{message.message}</p>
                    <span className="text-xs text-muted-foreground">{message.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-2 border-t">
            <Button variant="ghost" className="w-full text-sm">View All Messages</Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* User Account */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 px-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-medium">{user?.name || 'User'}</span>
              <span className="text-xs text-muted-foreground">{user?.role || 'Member'}</span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{user?.name || 'User'}</p>
              <p className="text-xs text-muted-foreground">{user?.email || 'user@example.com'}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/settings')}>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Header;
