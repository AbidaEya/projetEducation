
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

// Apply dark mode immediately to prevent flash
(() => {
  try {
    const stored = localStorage.getItem('edu_dark_mode');
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    if (stored === 'true' || (stored === null && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  } catch { }
})();

createRoot(document.getElementById("root")!).render(<App />);
