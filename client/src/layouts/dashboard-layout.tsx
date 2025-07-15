import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  FileText,
  Bell,
  Upload,
  Menu,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: FileText,
  },
  {
    name: "Beneficiaries",
    href: "/mou",
    icon: Upload,
  },
  {
    name: "Trainings",
    href: "/trainings",
    icon: Bell,
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const Sidebar = () => (
    <div className="flex h-full flex-col bg-white dark:bg-gray-900 border-r border-border">
      <div className="flex h-20 items-center px-6 border-b border-border">
        <div className="flex items-center space-x-2">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh7MA0grRFPZDHYotT3FQ8wntj3eV0tH6ma_6r1RqJeKWjMaauVrVCQkNq6S2pu-O1-C4&usqp=CAU" className="h-12 w-12 text-primary" />
          <div>
            <h1 className="text-sm font-bold text-foreground">STARBOOKS Region 1</h1>
            <p className="text-xs text-muted-foreground">Monitoring System</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <Button 
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="h-screen bg-background">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <div className="flex h-full">
          {/* Desktop sidebar */}
          <div className="hidden lg:flex lg:w-64 lg:flex-col">
            <Sidebar />
          </div>

          {/* Main content */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Top navigation */}
            <header className="flex h-20 items-center justify-between border-b border-border bg-white dark:bg-gray-900 px-6">
              <div className="flex items-center">
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <div className="lg:hidden flex items-center ml-2 space-x-2">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh7MA0grRFPZDHYotT3FQ8wntj3eV0tH6ma_6r1RqJeKWjMaauVrVCQkNq6S2pu-O1-C4&usqp=CAU" className="h-10 w-10 text-primary" />
                  <div>
                    <h1 className="text-sm font-bold text-foreground">STARTBOOKS</h1>
                    <p className="text-xs text-muted-foreground">Monitoring System</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-s font-medium text-foreground">Admin</p>
                  <p className="text-xs text-muted-foreground">DOST-1</p>
                </div>
              </div>
            </header>

            {/* Page content */}
            <main className="flex-1 overflow-auto bg-background px-4 py-4 text-sm">
              <div className="max-w-screen-lg mx-auto space-y-4"></div>
              {children}
            </main>
          </div>
        </div>

        <SheetContent side="left" className="w-64 p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>
    </div>
  );
}
