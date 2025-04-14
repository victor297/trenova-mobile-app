import React, { useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Video, ResizeMode } from "expo-av";

const VideoPlayer = ({ source, downloadedVideoPath }) => {
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const [isBuffering, setIsBuffering] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  console.log("source", source);
  console.log("source2", downloadedVideoPath);
  // useEffect(() => {
  //   // Effect to refresh component when refresh state changes
  // }, [source.uri]);
  const handleBuffering = (newStatus) => {
    if (
      newStatus.isBuffering !== undefined &&
      newStatus.isBuffering !== isBuffering
    ) {
      setIsBuffering(newStatus.isBuffering);
    }
  };
  const handleLoadStart = () => {
    setLoading(true);
  };

  const handleLoad = () => {
    setLoading(false);
  };
  return (
    <View style={styles.container}>
      {isBuffering && (
        <ActivityIndicator
          size="large"
          color="#d97706"
          className="z-10"
          style={styles.loader}
        />
      )}
      {loading && (
        <View style={styles.loadingContainer} className="z-10">
          <ActivityIndicator size="large" color="#d97706" />
        </View>
      )}

      <Video
        ref={video}
        style={styles.video}
        source={
          source.uri || downloadedVideoPath
            ? {
                uri: downloadedVideoPath || source.uri,
              }
            : require("./../assets/images/video1.mp4")
        }
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        shouldPlay
        onPlaybackStatusUpdate={(newStatus) => {
          setStatus(newStatus);
          handleBuffering(newStatus);
        }}
        onLoadStart={handleLoadStart}
        onLoad={handleLoad}
      />
    </View>
  );
};

export default VideoPlayer;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ecf0f1",
  },
  video: {
    alignSelf: "center",
    width: 350,
    height: 200,
  },
  loader: {
    position: "absolute",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    position: "absolute",
  },
});
