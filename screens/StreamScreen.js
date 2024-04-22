import { View, Text, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import VideoPlayer from "./../components/videoPlayer";

const onlineVideoUri = [
  "https://drive.usercontent.google.com/download?id=1kik5cA-UuS1sY4LVXRTZWPYIAvgrg2FI&export=download&authuser=1&confirm=t&uuid=e1036cf5-2046-4780-aa1c-c41b78ced8b0&at=APZUnTUJln4ulOVykIIgz800GBqj:1706993118970",
  "https://drive.usercontent.google.com/download?id=1UKH3qc_0XgAUpGtasXqx8hfUHUAsZXHa&export=download&authuser=1&confirm=t&uuid=4f6f42b7-6a9c-45a1-a812-d258242eeac7&at=APZUnTXlbykI-mbnv7IDoEDE6v7Y:1706992639355",
  "https://drive.usercontent.google.com/download?id=12T9iQWU7h8eZqaOn5VsbRXsAf8IOCJ0F&export=download&authuser=1&confirm=t&uuid=710427d0-8498-45a6-b8a5-2a4f3cbfe76d&at=APZUnTUTUI_MQ3yTHS_NU6XRpIHL:1706993144253",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
];

const StreamScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-bgWhite px-2">
      <Text>Stream/ video Screen</Text>

      <ScrollView>
        {onlineVideoUri.map((videoUri, index) => (
          <VideoPlayer key={index} source={{ uri: videoUri }} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default StreamScreen;
