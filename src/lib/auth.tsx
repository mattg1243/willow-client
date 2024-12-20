import { Navigate, useLocation } from "react-router-dom";
import { z } from "zod";

import { paths } from "@/config/paths";
import { type User } from "@/types/api";

import { api } from "./apiClient";
import { createContext, useContext, useReducer } from "react";

export const getUser = async (): Promise<User> => {
  const res = await api.get("/user");
  return res.data;
};

export const logout = async (): Promise<void> => {
  return api.post("/user/logout");
};

export const loginInputSchema = z.object({
  email: z.string().min(1, "Required").email("Invalid email"),
  password: z.string().min(5, "Required"),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export const login = async (data: LoginInput): Promise<void> => {
  return api.post("/user/login", data);
};

export const registerInputSchema = z.object({
  user: z.object({
    email: z.string().min(1, "Required").email("Invalid email"),
    password: z.string().min(5, "Required"),
    fname: z.string(),
    lname: z.string(),
  }),
  contactInfo: z
    .object({
      phone: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      street: z.string().optional(),
      zip: z.string().optional(),
    })
    .optional(),
});

export type RegisterInput = z.infer<typeof registerInputSchema>;

export const register = (data: RegisterInput): Promise<User> => {
  return api.post("/user", data);
};

// User context and reducer
export const UserContext = createContext<{
  user: User | null;
  dispatch: React.Dispatch<UserAction>;
} | null>(null);

export const useUser = () => useContext(UserContext);

type UserState = {
  user: User | null;
};

const initialState = { user: null };

type UserAction = { type: "SET_USER"; payload: User } | { type: "CLEAR_USER" };

export const userReducer = (
  state: UserState,
  action: UserAction
): UserState => {
  switch (action.type) {
    case "SET_USER":
      return { user: action.payload };
    case "CLEAR_USER":
      return { user: null };
    default:
      return state;
  }
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={{ user: state.user, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useUser();
  const location = useLocation();

  if (!user) {
    console.log({
      pathname: location.pathname,
      redirectTo: paths.auth.login.getHref(location.pathname),
    });
    return (
      <Navigate to={paths.auth.login.getHref(location.pathname)} replace />
    );
  }

  return <>{children}</>;
};
