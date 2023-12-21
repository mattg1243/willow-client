import { Outlet, Navigate } from "react-router-dom";

export default function ProtectedRoute() {
  const authorized = true;

  return (authorized ? <Outlet />: <Navigate to='/login' />)
}