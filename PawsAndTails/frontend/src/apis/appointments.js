import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "./createBaseQuery";

export const appointmentsApi = createApi({
  reducerPath: "appointmentsApi",
  baseQuery: createBaseQuery("/appointments"),
  tagTypes: ["GetAppointment"],
  endpoints: (build) => ({
    addAppointment: build.mutation({
      query: (data) => ({
        url: "/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "GetAppointment", id: "LIST" }],
    }),

    getAllAppointments: build.query({
      query: () => ({
        url: "/getAll",
        method: "GET",
      }),
      providesTags: (result) =>
        result?.appointmentss
          ? [
              ...result.appointmentss.map(({ id }) => ({
                type: "GetAppointment",
                id,
              })),
              { type: "GetAppointment", id: "LIST" },
            ]
          : [{ type: "GetAppointment", id: "LIST" }],
    }),
    getAllAppointmentsByFilters: build.query({
      query: ({ search, category, service, city }) => {
        const params = new URLSearchParams();

        if (search) params.append("search", search);
        if (category) params.append("category", category);
        if (service) params.append("service", service);
        if (city) params.append("city", city);

        return {
          url: `/getAllAppointmentsByFilters?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result?.appointmentss
          ? [
              ...result.appointmentss.map(({ _id }) => ({
                type: "GetAppointment",
                id: _id,
              })),
              { type: "GetAppointment", id: "LIST" },
            ]
          : [{ type: "GetAppointment", id: "LIST" }],
    }),

    getAppointmentById: build.query({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "GET",
      }),
    }),
    updateAppointment: build.mutation({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: "GetAppointment", id: "LIST" }],
    }),
    deleteAppointment: build.mutation({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "GetAppointment", id: "LIST" }],
    }),
    updateAppointmentStatus: build.mutation({
      query: ({ id, status }) => ({
        url: `/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: [{ type: "GetAppointment", id: "LIST" }],
    }),
  }),
});

export const {
  useAddAppointmentMutation,
  useGetAllAppointmentsQuery,
  useGetAppointmentByIdQuery,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
  useGetAllAppointmentsByFiltersQuery,
  useUpdateAppointmentStatusMutation,
} = appointmentsApi;
