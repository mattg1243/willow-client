import { Navigate, useLocation } from "react-router-dom";
import { z } from "zod";

import { paths } from "@/config/paths";
import { type User } from "@/types/api";

import { toaster } from "@/components/ui/toaster";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { api } from "./api/apiClient";

export const getUser = async (): Promise<User> => {
  return await api.get("/auth/me");
};

export const logout = async (): Promise<void> => {
  localStorage.removeItem("willowUser");
  return api.post("/auth/logout");
};

export const loginInputSchema = z.object({
  email: z.string().min(1, "Required").email("Invalid email"),
  password: z.string().min(5, "Required"),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export const login = async (data: LoginInput): Promise<void> => {
  return api.post("/auth/login", data);
};

export const registerInputSchema = z.object({
  user: z.object({
    email: z.string().min(1, "Required").email("Invalid email"),
    password: z.string().min(5, "Required"),
    fname: z.string(),
    lname: z.string(),
    rate: z.number().optional(),
  }),
  contactInfo: z.object({
    phone: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    street: z.string().optional(),
    zip: z.string().optional(),
  }),
});

export type RegisterInput = z.infer<typeof registerInputSchema>;

export const register = (data: RegisterInput): Promise<User> => {
  return api.post("/auth/register", data);
};

// User context and reducer
export const UserContext = createContext<{
  user: User | null;
  dispatch: React.Dispatch<UserAction>;
  handleLogout: () => Promise<void>;
} | null>(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

type UserState = {
  user: User | null;
  expiresAt: number | null;
};

const initialState = (): UserState => {
  const storedUser = localStorage.getItem("willowUser");

  if (!storedUser) {
    return { user: null, expiresAt: null };
  }

  const parsedState: UserState = JSON.parse(storedUser);

  if (parsedState.expiresAt && new Date().getTime() > parsedState.expiresAt) {
    return { user: null, expiresAt: null };
  }

  return parsedState;
};

type UserAction = { type: "SET_USER"; payload: User } | { type: "CLEAR_USER" };

export const userReducer = (
  state: UserState,
  action: UserAction
): UserState => {
  switch (action.type) {
    case "SET_USER":
      return {
        user: action.payload,
        expiresAt: new Date().getTime() + 30 * 60 * 1000,
      };
    case "CLEAR_USER":
      return { user: null, expiresAt: null };
    default:
      return state;
  }
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(userReducer, initialState());

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ type: "CLEAR_USER" });
      const currentPage = window.location.pathname;
      const loginPathWithRedirect = paths.auth.login.getHref(currentPage);
      toaster.create({
        title: "You're session has expired, please log back in.",
        type: "info",
      });
      window.location.replace(loginPathWithRedirect);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("willowUser", JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (state.user && state.expiresAt) {
      const timeLeft = state.expiresAt - new Date().getTime();
      if (timeLeft > 0) {
        const timer = setTimeout(handleLogout, timeLeft);
        return () => clearTimeout(timer);
      } else {
        handleLogout();
      }
    }
  }, [state, handleLogout]);

  return (
    <UserContext.Provider value={{ user: state.user, dispatch, handleLogout }}>
      {children}
    </UserContext.Provider>
  );
};

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate to={paths.auth.login.getHref(location.pathname)} replace />
    );
  }

  return <>{children}</>;
};
