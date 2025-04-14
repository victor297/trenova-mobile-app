// import { createSlice } from "@reduxjs/toolkit";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const initialState = {
//   userInfo: AsyncStorage.getItem("userInfo")
//     ? JSON.parse(AsyncStorage.getItem("userInfo"))
//     : null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setCredentials: (state, action) => {
//       state.userInfo = action.payload.data.user;
//       AsyncStorage.setItem(
//         "LernersInfo",
//         JSON.stringify(action.payload.data.user)
//       );

//       const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days
//       AsyncStorage.setItem("expirationTime", expirationTime);
//     },
//     logout: (state) => {
//       state.userInfo = null;
//       AsyncStorage.clear();
//     },
//   },
// });

// export const { setCredentials, logout } = authSlice.actions;

// export default authSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  userInfo: null, // Set to null initially, we'll update it after fetching
};
// Async function to fetch userInfo from AsyncStorage
const fetchUserInfo = async () => {
  try {
    const userInfoString = await AsyncStorage.getItem("userInfo");
    const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
    return userInfo;
  } catch (error) {
    console.error("Error fetching userInfo:", error);
    return null;
  }
};

// Fetch userInfo asynchronously when creating the slice

fetchUserInfo().then((userInfo) => {
  initialState.userInfo = userInfo;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setInitialUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setCredentials: (state, action) => {
      state.userInfo = action.payload.data.learner;
      AsyncStorage.setItem(
        "userInfo",
        JSON.stringify(action.payload.data.learner)
      );

      const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days
      AsyncStorage.setItem("expirationTime", expirationTime.toString());
    },
    logout: (state) => {
      state.userInfo = null;
      AsyncStorage.removeItem("userInfo");
      // AsyncStorage.clear();
    },
  },
});

export const { setInitialUserInfo, setCredentials, logout } = authSlice.actions;

export const initializeUserInfo = () => async (dispatch) => {
  try {
    const userInfo = await fetchUserInfo();
    dispatch(setInitialUserInfo(userInfo));
  } catch (error) {
    console.error("Error initializing user info:", error);
  }
};

export default authSlice.reducer;
