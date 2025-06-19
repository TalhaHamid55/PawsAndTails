import { fetchBaseQuery } from "@reduxjs/toolkit/query";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const createBaseQuery = (url, useAuth = true, extraHeaders) => {
  const baseUrl = `${BASE_URL}${url ? url : ""}`;

  return fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      if (useAuth) {
        const token = localStorage.getItem("token");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }

      if (extraHeaders && typeof extraHeaders === "object") {
        Object.entries(extraHeaders).forEach(([key, value]) => {
          headers.set(key, value);
        });
      }

      return headers;
    },
  });
};
