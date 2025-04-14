import React from "react";
import { View, Text, Button } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WeekScreeen from "../screens/WeekScreeen";
import CourseScreen from "../screens/CourseScreen";
import SubjectScreen from "../screens/SubjectScreen";

const Stack = createNativeStackNavigator();

const CourseNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Select Subject"
        component={SubjectScreen}
        options={{
          headerStyle: {
            backgroundColor: "white",
          },
        }}
      />
      <Stack.Screen name="Week" component={WeekScreeen} />
      <Stack.Screen name="Learn" component={CourseScreen} />
    </Stack.Navigator>
  );
};

export default CourseNavigator;
