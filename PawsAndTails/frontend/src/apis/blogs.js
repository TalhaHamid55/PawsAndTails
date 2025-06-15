import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "./createBaseQuery";

export const blogsApi = createApi({
  reducerPath: "blogsApi",
  baseQuery: createBaseQuery("/blogs"),
  tagTypes: ["GetBlog"],
  endpoints: (build) => ({
    addBlog: build.mutation({
      query: (data) => ({
        url: "/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "GetBlog", id: "LIST" }],
    }),

    getAllBlogs: build.query({
      query: () => ({
        url: "/getAll",
        method: "GET",
      }),
      providesTags: (result) =>
        result?.blogss
          ? [
              ...result.blogss.map(({ id }) => ({
                type: "GetBlog",
                id,
              })),
              { type: "GetBlog", id: "LIST" },
            ]
          : [{ type: "GetBlog", id: "LIST" }],
    }),
    getAllBlogsByFilters: build.query({
      query: ({ search, category }) => {
        const params = new URLSearchParams();

        if (search) params.append("search", search);
        if (category) params.append("category", category);
        return {
          url: `/getAllBlogsByFilters?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result?.blogss
          ? [
              ...result.blogss.map(({ _id }) => ({
                type: "GetBlog",
                id: _id,
              })),
              { type: "GetBlog", id: "LIST" },
            ]
          : [{ type: "GetBlog", id: "LIST" }],
    }),

    getBlogById: build.query({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "GET",
      }),
    }),
    updateBlog: build.mutation({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: "GetBlog", id: "LIST" }],
    }),
    deleteBlog: build.mutation({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "GetBlog", id: "LIST" }],
    }),
  }),
});

export const {
  useAddBlogMutation,
  useGetAllBlogsQuery,
  useGetBlogByIdQuery,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useGetAllBlogsByFiltersQuery,
} = blogsApi;
