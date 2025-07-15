export const paths = {
  home: {
    path: "/",
    getHref: () => "/",
  },
  auth: {
    register: {
      path: "/auth/register",
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/register${
          redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""
        }`,
    },
    login: {
      path: "/auth/login",
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/login${
          redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""
        }`,
    },
    resetPassword: {
      path: "/auth/reset-password",
      getHref: () => "/auth/reset-password",
    },
  },

  app: {
    root: {
      path: "/app",
      getHref: () => "/app",
    },
    dashboard: {
      path: "",
      getHref: () => "/app",
    },
    client: {
      path: "/app/client/:clientId",
      getHref: (id: string) => `/app/client/${id}`,
    },
    profile: {
      path: "/app/profile",
      getHref: () => "/app/profile",
    },
    payouts: {
      path: "/app/payouts",
      getHref: () => `/app/payouts`,
    },
    payoutsClient: {
      path: "/app/payouts/:clientId",
      getHref: (clientId: string) => `/app/payouts/${clientId}`,
    },
  },
} as const;
