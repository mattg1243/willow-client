import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { paths } from "@/config/paths";
import { LandingRoute } from "./routes/landing";
import { LoginRoute } from "./routes/auth/Login";
import { RegisterRoute } from "./routes/auth/Register";
import { DashboardRoute } from "./routes/app/Dashboard";
import { ClientRoute } from "./routes/app/Client";

const createAppRouter = () =>
  createBrowserRouter([
    {
      path: paths.home.path,
      element: <LandingRoute />,
    },
    {
      path: paths.auth.register.path,
      element: <RegisterRoute />,
    },
    {
      path: paths.auth.login.path,
      element: <LoginRoute />,
    },
    {
      path: paths.app.dashboard.getHref(),
      element: <DashboardRoute />,
    },
    {
      path: paths.app.client.path,
      element: <ClientRoute />,
    },
  ]);

export const AppRouter = () => {
  const router = createAppRouter();

  return <RouterProvider router={router} />;
};
