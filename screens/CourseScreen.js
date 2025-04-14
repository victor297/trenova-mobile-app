import React, { useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import VideoPlayer from "../components/videoPlayer";
import { themeColors } from "../theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import VideoTabScreen from "./VideoTabScreen";
import QuestionTabScreen from "./QuestionTabScreen";

const Tab = createMaterialTopTabNavigator();
const TopStack = createNativeStackNavigator();

const CourseScreen = ({ route }) => {
  const { item } = route.params;
  const [videoUri, setVideoUri] = useState(null);
  const [downloadedVideoPath, setDownloadedVideoPath] = useState(null);

  useEffect(() => {
    const loadDownloadedVideoPath = async () => {
      try {
        const storedVideoPath = await AsyncStorage.getItem(
          `downloadedVideoPath_${videoUri}`
        );
        if (storedVideoPath) {
          setDownloadedVideoPath(storedVideoPath);
        }
      } catch (error) {
        console.error("Error loading downloaded video path:", error);
      }
    };

    loadDownloadedVideoPath();
  }, [videoUri]);

  const handleVideoPress = (videoId, videoUri, downloadedVideoPath) => {
    if (downloadedVideoPath) {
      setVideoUri(downloadedVideoPath);

      setDownloadedVideoPath(downloadedVideoPath);
    } else {
      setVideoUri(videoUri);
    }
  };
  const handleVideoDownloaded = (videoId, videoUri) => {
    setVideoUri(videoUri);
    setDownloadedVideoPath(videoUri);
  };

  return (
    <>
      <VideoPlayer
        source={{ uri: videoUri }}
        downloadedVideoPath={downloadedVideoPath}
      />
      <TopStack.Navigator>
        <TopStack.Screen name="Tabs" options={{ headerShown: false }}>
          {() => (
            <TabNavigator
              lessons={item.lessons}
              questions={item.questions}
              handleVideoPress={handleVideoPress}
              handleVideoDownloaded={handleVideoDownloaded}
            />
          )}
        </TopStack.Screen>
      </TopStack.Navigator>
    </>
  );
};
const extraTabOptions = {
  tabBarStyle: {
    backgroundColor: themeColors.bgGold,
  },
  tabBarInactiveTintColor: "white",
  tabBarActiveTintColor: "yellow",
  tabBarBackgroundColor: "red", // Change navigation color
};

const TabNavigator = ({
  lessons,
  questions,
  handleVideoPress,
  handleVideoDownloaded,
}) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarIndicatorStyle: { backgroundColor: "white" },

        ...extraTabOptions,
      }}
    >
      <Tab.Screen name="Learn">
        {() => (
          <VideoTabScreen
            lessons={lessons}
            handleVideoPress={handleVideoPress}
            handleVideoDownloaded={handleVideoDownloaded}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Question">
        {() => (
          <QuestionTabScreen
            questions={questions}
            handleVideoPress={handleVideoPress}
            handleVideoDownloaded={handleVideoDownloaded}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default CourseScreen;
