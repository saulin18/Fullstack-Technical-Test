import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "../App.css";
import {
  QueryClient as TanstackQueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Suspense } from "react";
import { lazy } from "react";
const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const OfferDetailPage = lazy(() => import("./pages/OfferDetailPage"));
import AuthLoader from "./components/containers/AuthLoader";
import Loader from "./components/Loader";



const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<Loader />}>
        <AuthLoader>
          <HomePage />,
        </AuthLoader>
      </Suspense>
    ),
  },
  {
    path: "auth/register",

    element: (
      <Suspense fallback={<Loader />}>
        <RegisterPage />,
      </Suspense>
    ),
  },
  {
    path: "auth/login",
    element: (
      <Suspense fallback={<Loader />}>
        <LoginPage />,
      </Suspense>
    ),
  },
  {
    path: "/dashboard",

    element: (
      <Suspense fallback={<Loader />}>
        <AuthLoader>
          <DashboardPage />,
        </AuthLoader>
      </Suspense>
    ),
  },

  {
    path: "offers/:id",
    element: (
      <Suspense fallback={<Loader />}>
        <OfferDetailPage />,
      </Suspense>
    ),
  },
]);

export const queryClient = new TanstackQueryClient();

const container = document.getElementById('root') as HTMLElement;

let root: ReactDOM.Root;

function render() {
  if (!root) {
    root = ReactDOM.createRoot(container);
  }


  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </React.StrictMode>
  );
}

render();
