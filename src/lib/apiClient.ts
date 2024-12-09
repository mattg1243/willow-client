import Axios, { InternalAxiosRequestConfig } from "axios";
import { env } from "@/config/env";
import { toaster } from "@/components/ui/toaster";
import { paths } from "@/config/paths";

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = "application/json";
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
    console.log(err);
    const msg = err.response?.data || err.message;
    toaster.create({
      title: msg || "An unknown error occurred",
      type: "error",
    });

    if (err.response?.status === 401) {
      const searchParams = new URLSearchParams();
      const redirectTo =
        searchParams.get("redirectTo") || window.location.pathname;
      window.location.href = paths.auth.login.getHref(redirectTo);
    }

    return Promise.reject(err);
  }
);
