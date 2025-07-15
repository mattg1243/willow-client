import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { paths } from "@/config/paths";
import { ClientRoute } from "./routes/app/Client";
import { DashboardRoute } from "./routes/app/Dashboard";
import { ProfileRoute } from "./routes/app/Profile";
import { LoginRoute } from "./routes/auth/Login";
import { RegisterRoute } from "./routes/auth/Register";
import { ResetPasswordRoute } from "./routes/auth/ResetPassword";
import { LandingRoute } from "./routes/landing";
import { PayoutsRoute } from "./routes/Payouts";

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
      path: paths.auth.resetPassword.path,
      element: <ResetPasswordRoute />,
    },
    {
      path: paths.app.dashboard.getHref(),
      element: <DashboardRoute />,
    },
    {
      path: paths.app.client.path,
      element: <ClientRoute />,
    },
    {
      path: paths.app.profile.path,
      element: <ProfileRoute />,
    },
    {
      path: paths.app.payouts.path,
      element: <PayoutsRoute />,
    },
    {
      path: paths.app.payoutsClient.path,
      element: <PayoutsRoute />,
    },
  ]);

export const AppRouter = () => {
  const router = createAppRouter();

  return <RouterProvider router={router} />;
};
