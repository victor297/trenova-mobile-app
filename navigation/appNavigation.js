import { View, Text, Image } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import SelectGradeScreen from "../screens/SelectGradeScreen";
import SelectProvinceScreen from "../screens/SelectProvinceScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  HomeIcon,
  ShoppingBagIcon,
  Squares2X2Icon,
} from "react-native-heroicons/solid";
import StreamScreen from "../screens/StreamScreen";
// import PdfListScreen from "../screens/PdfScreen";
import { themeColors } from "../theme";
import { images } from "../assets";
import OfflineVideoScreen from "../screens/OfflineVideoScreen";
import { useSelector } from "react-redux";
import Profile from "../screens/Profile";
import CourseNavigator from "./CourseNavigator";
import PdfReaderScreen from "../screens/PdfRaderScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

{
  /** ============== App Navigator =================== */
}
export default function AppNavigation() {
  const { userInfo } = useSelector((state) => state.auth);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userInfo === null ? (
          <>
            <Stack.Screen
              name="Welcome"
              options={{ headerShown: false }}
              component={WelcomeScreen}
            />
            <Stack.Screen
              name="SignIn"
              options={{ headerShown: false }}
              component={LoginScreen}
            />
            <Stack.Screen
              name="SignUp"
              options={{ headerShown: false }}
              component={SignUpScreen}
            />
            <Stack.Screen
              name="SelectGrade"
              options={{ headerShown: false }}
              component={SelectGradeScreen}
            />
            <Stack.Screen
              name="SelectProvince"
              options={{ headerShown: false }}
              component={SelectProvinceScreen}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Home"
              options={{ headerShown: false }}
              component={BottomTabNavigator}
            />
            <Stack.Screen
              name="SelectProvince"
              options={{ headerShown: false }}
              component={SelectProvinceScreen}
            />
            <Stack.Screen name="PdfReader" component={PdfReaderScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

{
  /** ============== Bottom Tab Navigator =================== */
}

const { streamIcon, classWorkIcon, exploreIcon, avatar } = images;
const extraTabOptions = {
  tabBarLabelStyle: { fontFamily: "exo" },
  tabBarStyle: { borderTopRightRadius: 12, borderTopLeftRadius: 12 },
  tabBarActiveTintColor: themeColors.bgPurple,
  tabBarInactiveTintColor: themeColors.bgGold,
};
function BottomTabNavigator() {
  return (
    <Tab.Navigator initialRouteName="Explore">
      <Tab.Screen
        name="Explore"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon(props) {
            return (
              // Custom tab bar icon
              <Image
                source={exploreIcon}
                style={{
                  tintColor: props.color,
                  width: props.size,
                  height: props.size,
                }}
                {...props}
              />
            );
          },
          ...extraTabOptions,
        }}
      />
      <Tab.Screen
        name="Course"
        component={CourseNavigator}
        options={{
          headerShown: false,
          tabBarIcon(props) {
            return (
              // Custom tab bar icon
              <Image
                source={streamIcon}
                style={{
                  tintColor: props.color,
                  width: props.size,
                  height: props.size,
                }}
                {...props}
              />
            );
          },
          ...extraTabOptions,
        }}
      />

      {/* <Tab.Screen
        name="offline"
        component={OfflineVideoScreen}
        options={{
          headerShown: false,
          tabBarIcon(props) {
            return (
              // Custom tab bar icon
              <Image
                source={classWorkIcon}
                style={{
                  tintColor: props.color,
                  width: props.size,
                  height: props.size,
                }}
                {...props}
              />
            );
          },
          ...extraTabOptions,
        }}
      /> */}
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          tabBarIcon(props) {
            return (
              // Custom tab bar icon
              <Image
                source={avatar}
                style={{
                  tintColor: props.color,
                  width: props.size,
                  height: props.size,
                }}
                {...props}
              />
            );
          },
          ...extraTabOptions,
        }}
      />
    </Tab.Navigator>
  );
}
