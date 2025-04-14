import { apiSlice } from "./apiSlice";
import { COURSES_URL } from "../constants";

export const courseApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query({
      query: (params) => {
        // Construct the full URL with query parameters
        let queryString = "";
        if (params.class) queryString += `class=${params.class}&`;
        if (params.term) queryString += `term=${params.term}&`;
        if (params.school)
          queryString += `school=${params.school}&isPublish=true&`;

        const url = `${COURSES_URL}${queryString ? `?${queryString}` : ""}`;
        return { url };
      },
      providesTags: ["Course"],
      keepUnusedDataFor: 5,
    }),

    getCourseDetails: builder.query({
      query: (id) => ({
        url: `${COURSES_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetCoursesQuery, useGetCourseDetailsQuery } = courseApiSlice;
