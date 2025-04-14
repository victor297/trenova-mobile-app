import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import VideoPlayer from "./../components/offlineVideos";

const OfflineVideoScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-bgWhite p-8 ">
      <View>
        <VideoPlayer />
        {/* <VideoPlayer source={onlineVideoUri} /> */}
      </View>
    </SafeAreaView>
  );
};

export default OfflineVideoScreen;
