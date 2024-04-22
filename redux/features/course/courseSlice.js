import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  courseInfo: null, // Set to null initially, we'll update it after fetching
};
// Async function to fetch courseInfo from AsyncStorage
const fetchcourseInfo = async () => {
  try {
    const courseInfoString = await AsyncStorage.getItem("courseInfo");
    const courseInfo = courseInfoString ? JSON.parse(courseInfoString) : null;
    return courseInfo;
  } catch (error) {
    console.error("Error fetching courseInfo:", error);
    return null;
  }
};

// Fetch courseInfo asynchronously when creating the slice

fetchcourseInfo().then((courseInfo) => {
  initialState.courseInfo = courseInfo;
});

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setInitialCourseInfo: (state, action) => {
      state.courseInfo = action.payload;
    },
    setCourse: (state, action) => {
      state.courseInfo = action.payload.data;
      AsyncStorage.setItem("courseInfo", JSON.stringify(action.payload.data));

      const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days
      AsyncStorage.setItem("expirationTime", expirationTime.toString());
    },

    clearDownload: (state) => {
      state.courseInfo = null;
      AsyncStorage.clear();
    },
  },
});

export const { setInitialCourseInfo, setCourse, clearDownload } =
  courseSlice.actions;

export const initializecourseInfo = () => async (dispatch) => {
  try {
    const courseInfo = await fetchcourseInfo();
    dispatch(setInitialCourseInfo(courseInfo));
  } catch (error) {
    console.error("Error initializing user info:", error);
  }
};

export default courseSlice.reducer;
