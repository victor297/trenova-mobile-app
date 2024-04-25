import React, { useEffect, useState } from "react";
import { Pressable } from "react-native";
import { Text } from "react-native";
import { View } from "react-native";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";
import { Alert } from "react-native";

const VideoTabList = ({ item, handleVideoPress, handleVideoDownloaded }) => {
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadedVideoPath, setDownloadedVideoPath] = useState(null);
  const navigation = useNavigation();
  useEffect(() => {
    const loadDownloadedVideoPath = async () => {
      try {
        const storedVideoPath = await AsyncStorage.getItem(
          `downloadedVideoPath_${item.content}`
        );
        if (storedVideoPath) {
          setDownloadedVideoPath(storedVideoPath);
        }
      } catch (error) {
        console.error("Error loading downloaded video path:", error);
      }
    };

    loadDownloadedVideoPath();
  }, [item.content]);
  const handleDownload = async (videoId, videoUri) => {
    try {
      const randomString = Math.random().toString(36).substring(7);
      const fileName = `offlineVideo_${randomString}.mp4`;
      const downloadDest = `${FileSystem.documentDirectory}${fileName}`;

      const downloadObject = FileSystem.createDownloadResumable(
        videoUri,
        downloadDest,
        {},
        (downloadProgressEvent) => {
          const progress =
            downloadProgressEvent.totalBytesWritten /
            downloadProgressEvent.totalBytesExpectedToWrite;
          setDownloadProgress(progress);
        }
      );

      const { uri } = await downloadObject.downloadAsync();

      setDownloadedVideoPath(uri);
      handleVideoDownloaded(uri);
      await AsyncStorage.setItem(`downloadedVideoPath_${videoUri}`, uri);

      Alert.alert("Saved Successful");
      // Alert.alert("Saved Successful", `Video saved at: ${uri}`);
    } catch (error) {
      console.error("Error downloading video:", error);
      Alert.alert(
        "Download Error",
        "An error occurred while downloading the video."
      );
    } finally {
      setDownloadProgress(0);
    }
  };
  return (
    <Pressable
      className={`rounded-2xl   flex flex-row  bg-white mb-2 p-2 items-center `}
    >
      <Pressable
        onPress={() => {
          item.content.indexOf(".mp4") !== -1
            ? handleVideoPress(item._id, item.content, downloadedVideoPath)
            : navigation.navigate("PdfReader", { pdfUrl: item.content });
        }}
      >
        <View className="flex flex-col">
          <Text className="text-green-600 font-bold">
            {item.content.indexOf(".mp4") !== -1 ? "video" : "book"}
          </Text>
          <Text
            className={` text-gold ${
              item.title.length < 12 ? "text-xl" : null
            }  font-roboto  leading-none `}
          >
            {item.title}
          </Text>
          <Text className={` text-gold text-xs leading-none `}>
            click here to view {item.number}
          </Text>
        </View>
      </Pressable>

      {!downloadedVideoPath ? (
        <View className="ml-auto">
          <Pressable
            className="bg-gold rounded-xl  p-2"
            // onPress={() => handleDownload(item._id, item.content)}
            onPress={() => {
              item.content.indexOf(".mp4") !== -1
                ? handleDownload(item._id, item.content)
                : navigation.navigate("PdfReader", { pdfUrl: item.content });
            }}
          >
            <Text className=" text-white font-bold">download</Text>
          </Pressable>

          {downloadProgress > 0 && (
            <View className="bg-green-400">
              <Text className="text-white">{` ${(
                downloadProgress * 100
              ).toFixed(2)}%`}</Text>
              <ActivityIndicator
                size="small"
                color="#0000ff"
                animating={downloadProgress < 1}
              />
            </View>
          )}
        </View>
      ) : item.content.indexOf(".mp4") !== -1 ? (
        <Pressable
          className=" bg-green-700 rounded-xl ml-auto p-2"
          onPress={() => handleVideoPress(item._id, downloadedVideoPath)}
        >
          <Text className=" text-white font-bold">Watch</Text>
        </Pressable>
      ) : (
        <Pressable
          className=" bg-green-700 rounded-xl ml-auto p-2"
          onPress={() =>
            navigation.navigate("PdfReader", { pdfUrl: item.content })
          }
        >
          <Text className=" text-white font-bold">View</Text>
        </Pressable>
      )}
    </Pressable>
  );
};

export default VideoTabList;
