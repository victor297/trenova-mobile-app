import { FlatList } from "react-native";
import { View } from "react-native";
import VideoTabList from "../components/VideoTabList";

const VideoTabScreen = ({
  lessons,
  handleVideoPress,
  handleVideoDownloaded,
}) => {
  return (
    <View className="pt-4 bg-bgWhite flex-1 px-3">
      <FlatList
        data={lessons}
        renderItem={({ item }) => (
          <VideoTabList
            item={item}
            handleVideoPress={handleVideoPress}
            handleVideoDownloaded={handleVideoDownloaded}
          />
        )}
        keyExtractor={(item) => item._id.toString()}
      />
    </View>
  );
};
export default VideoTabScreen;
