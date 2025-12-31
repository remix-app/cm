import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Property from "./pages/Property";
import Expenses from "./pages/Expenses";
import ExpenseDetail from "./pages/ExpenseDetail";
import Payments from "./pages/Payments";
import Publications from "./pages/Publications";
import Messages from "./pages/Messages";
import Votations from "./pages/Votations";
import Packages from "./pages/Packages";
import Visits from "./pages/Visits";
import Incidents from "./pages/Incidents";
import Insurances from "./pages/Insurances";
import Documents from "./pages/Documents";
import TaxValidation from "./pages/TaxValidation";
import Funds from "./pages/Funds";
import Delinquency from "./pages/Delinquency";
import Profile from "./pages/Profile";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/property"} component={Property} />
      <Route path={"/expenses"} component={Expenses} />
      <Route path={"/expenses/:id"} component={ExpenseDetail} />
      <Route path={"/payments"} component={Payments} />
      <Route path={"/publications"} component={Publications} />
      <Route path={"/messages"} component={Messages} />
      <Route path={"/votations"} component={Votations} />
      <Route path={"/packages"} component={Packages} />
      <Route path={"/visits"} component={Visits} />
      <Route path={"/incidents"} component={Incidents} />
      <Route path={"/insurances"} component={Insurances} />
      <Route path={"/documents"} component={Documents} />
      <Route path={"/tax-validation"} component={TaxValidation} />
      <Route path={"/funds"} component={Funds} />
      <Route path={"/delinquency"} component={Delinquency} />
      <Route path={"/profile"} component={Profile} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
