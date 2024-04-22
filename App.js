import AppNavigation from "./navigation/appNavigation";
import * as Font from "expo-font";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import store from "./redux/store";
import { initializeUserInfo } from "./redux/features/auth/authSlice";

export default function App() {
  const [isFontLoaded, setFontLoaded] = useState(false);
  const loadCustomFont = async () => {
    await Font.loadAsync({
      exo: require("./assets/fonts/Exo/static/Exo-Regular.ttf"),
      exoSemibold: require("./assets/fonts/Exo/static/Exo-SemiBold.ttf"),
      roboto: require("./assets/fonts/Roboto/Roboto-Light.ttf"),
      robotoBold: require("./assets/fonts/Roboto/Roboto-Bold.ttf"),
    });

    setFontLoaded(true);
  };

  store.dispatch(initializeUserInfo());
  // store.dispatch(initializecourseInfo());

  useEffect(() => {
    loadCustomFont();
  }, []);

  if (!isFontLoaded) {
    return null;
  }
  return (
    <Provider store={store}>
      <StatusBar style="dark" />
      <AppNavigation />
    </Provider>
  );
}
