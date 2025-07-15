import { toaster } from "@/components/ui/toaster";
import { env } from "@/config/env";
import { paths } from "@/config/paths";
import Axios, { InternalAxiosRequestConfig } from "axios";

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = ["application/json", "text"];
  }

  config.withCredentials = true;
  return config;
}

export const api = Axios.create({
  baseURL: env.API_URL,
});

api.interceptors.request.use(authRequestInterceptor);
api.interceptors.response.use(
  (res) => {
    return res.data;
  },
  (err) => {
    console.error(err);
    const msg = err.response?.data?.error || err.response?.data || err.message;
    toaster.create({
      title: msg || "An unknown error occurred",
      type: "error",
    });

    if (
      err.response?.status === 401 &&
      window.location.pathname !== "/auth/login"
    ) {
      localStorage.removeItem("willowUser");
      const searchParams = new URLSearchParams();
      const redirectTo =
        searchParams.get("redirectTo") || window.location.pathname;
      window.location.href = paths.auth.login.getHref(redirectTo);
    }

    return Promise.reject(err);
  }
);
