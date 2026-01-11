import { createRoot } from "react-dom/client";
import { Providers } from "./providers.tsx";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Providers>
      <App />
    </Providers>
  </BrowserRouter>
);
