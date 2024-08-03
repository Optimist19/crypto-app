import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import "./App.css";
import Home from "./components/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CryptoDetails from "./components/CryptoDetails";

import { loader as cryptoDetailsLoader } from "./components/CryptoDetails";

import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import PageNotFound from "./components/PageNotFound";

function App() {
  const queryClient = new QueryClient();

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      errorElement: <PageNotFound />,
    },
    {
      path: "path/:name",
      element: <CryptoDetails />,
      loader: cryptoDetailsLoader
    },
    {
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        {/* {children} */}
        <ModeToggle />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
