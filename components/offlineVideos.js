import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Button,
  Alert,
  ActivityIndicator,
  Text,
  StyleSheet,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";

const VideoPlayer = () => {
  const [downloadedVideoPath, setDownloadedVideoPath] = useState(null);
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});

  useEffect(() => {
    const loadDownloadedVideoPath = async () => {
      try {
        const storedVideoPath = await AsyncStorage.getItem(
          "downloadedVideoPath"
        );
        if (storedVideoPath) {
          setDownloadedVideoPath(storedVideoPath);
        }
      } catch (error) {
        console.error("Error loading downloaded video path:", error);
      }
    };

    loadDownloadedVideoPath();
  }, []);

  const playVideo = async () => {
    if (videoRef.current) {
      await videoRef.current.playAsync();
    }
  };

  return (
    <View>
      {downloadedVideoPath ? (
        <>
          <Video
            ref={video}
            style={styles.video}
            source={{ uri: downloadedVideoPath }}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping
            onPlaybackStatusUpdate={(status) => setStatus(() => status)}
          />
          <Button title="Play Video" onPress={playVideo} />
        </>
      ) : (
        <Text>No downloaded video yet kindly download</Text>
      )}
    </View>
  );
};

export default VideoPlayer;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
  },
  video: {
    alignSelf: "center",
    width: 320,
    height: 200,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
