import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import {
  QueryClient as TanstackQueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";



const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "auth/register",
    element: <RegisterPage />,
  },
  {
    path: "auth/login",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
]);

export const queryClient = new TanstackQueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>);