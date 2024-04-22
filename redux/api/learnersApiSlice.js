import { apiSlice } from "./apiSlice";
import { LEARNERS_URL } from "../constants";

export const learnerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${LEARNERS_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    learnersignup: builder.mutation({
      query: (data) => ({
        url: `${LEARNERS_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: (id) => ({
        url: `${LEARNERS_URL}/logout/${id}`,
        method: "GET",
      }),
    }),
    getLearnerDetails: builder.query({
      query: (id) => ({
        url: `${LEARNERS_URL}/${id}`,
      }),
      providesTags: ["Learner"],
      keepUnusedDataFor: 5,
    }),
    getTopSchools: builder.query({
      query: (id) => ({
        url: `${LEARNERS_URL}/topschools`,
      }),
      providesTags: ["Learner"],
      keepUnusedDataFor: 5,
    }),
    updateLearner: builder.mutation({
      query: ({ id, data }) => ({
        url: `${LEARNERS_URL}/profile/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useLearnersignupMutation,
  useUpdateLearnerMutation,
  useGetTopSchoolsQuery,
  useGetLearnerDetailsQuery,
} = learnerApiSlice;
