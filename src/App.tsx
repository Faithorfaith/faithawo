import { Switch, Route, useLocation, Redirect } from "wouter";
import { useEffect, useState } from "react";
import { HeroNew } from "./components/HeroNew";
import { Playground } from "./components/Playground";
import { Admin } from "./components/Admin";
import { CaseStudyEditor } from "./components/admin/CaseStudyEditor";
import { AllProjects } from "./components/AllProjects";
import { MaintenancePage } from "./components/MaintenancePage";
import { Contact } from "./components/Contact";
import {
  fetchSettings,
  Settings,
} from "./utils/api";
import { CaseStudy } from "./components/CaseStudy";
import { CustomCursor } from "./components/CustomCursor";

function GlobalThemeStyles() {
  return <style>{`/* existing CSS overrides */`}</style>;
}

function Portfolio() {
  return (
    <div className="min-h-screen bg-white text-black">
      <HeroNew />
    </div>
  );
}

export default function App() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    fetchSettings()
      .then((settings: Settings) => {
        setMaintenanceMode(settings.maintenanceMode);
      })
      .catch((error) => {
        console.warn('Using default settings:', error);
        // Silently use default (maintenance mode off)
        setMaintenanceMode(false);
      });
  }, []);

  if (maintenanceMode && !location.startsWith("/admin")) {
    return (
      <>
        <GlobalThemeStyles />
        <MaintenancePage />
      </>
    );
  }

  return (
    <>
      <GlobalThemeStyles />
      <CustomCursor />
      <Switch>
        <Route
          path="/admin/projects/new"
          component={CaseStudyEditor}
        />
        <Route
          path="/admin/projects/edit/:id"
          component={CaseStudyEditor}
        />
        <Route path="/admin" component={Admin} />
        <Route path="/work/:id" component={CaseStudy} />
        <Route path="/work" component={AllProjects} />
        <Route path="/playground" component={Playground} />
        <Route path="/contact" component={Contact} />
        <Route path="/" component={Portfolio} />
        <Route>{() => <Redirect to="/" />}</Route>
      </Switch>
      {/* <FloatingNav /> Hiding for new design */}
      {/* <ThemeToggle /> Removed for new design */}
    </>
  );
}