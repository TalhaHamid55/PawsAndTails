import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "./createBaseQuery";

export const commonApi = createApi({
  reducerPath: "commonApi",
  baseQuery: createBaseQuery("/"),
  endpoints: (build) => ({
    uploadImage: build.mutation({
      query: (data) => ({
        url: "upload/image",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useUploadImageMutation } = commonApi;
