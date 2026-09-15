import { createRoot } from "react-dom/client";
import { AppProviders } from "./components/providers/AppProviders";
import { SiteHeader } from "./components/layout/SiteHeader";
import { StakePageModule } from "./modules/StakePageModule";
import "./styles/global.css";

function App() {
  return (
    <AppProviders>
      <div className="flex min-h-svh flex-col bg-background text-foreground">
        <SiteHeader />
        <StakePageModule />
      </div>
    </AppProviders>
  );
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element was not found.");

createRoot(rootElement).render(<App />);
