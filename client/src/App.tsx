import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import Dashboard from "@/pages/dashboard";
import AddSchool from "@/pages/add-school";
import Search from "@/pages/search";
import Reports from "@/pages/reports";
import MOU from "@/pages/mou";
import Notifications from "@/pages/notifications";
import Trainings from "@/pages/trainings";
import NotFound from "@/pages/not-found";


function Router() {
  return (
    <DashboardLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/add-school" component={AddSchool} />
        <Route path="/search" component={Search} />
        <Route path="/reports" component={Reports} />
        <Route path="/mou" component={MOU} />
        <Route path="/trainings" component={Trainings} />
        <Route component={NotFound} />
      </Switch>
    </DashboardLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
