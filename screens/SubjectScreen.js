import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useSelector } from "react-redux";
import SubjectHeader from "../components/SubjectHeader";
import SubjectBody from "../components/SubjectBody";
import { useNavigation } from "@react-navigation/native";

const SubjectScreen = ({}) => {
  const { courseInfo } = useSelector((state) => state.course);
  const [refreshing, setRefreshing] = React.useState(false);
  const navigation = useNavigation();
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    navigation.navigate("Explore");
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView className="bg-bgWhite items-center px-5 pt-5 pb-[-35px] flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className=" mt-5 ">
          <SubjectHeader />
        </View>
        {Array.isArray(courseInfo) ? (
          <View className="w-full mt-4 mb-12">
            {courseInfo?.map((item) => (
              <SubjectBody key={item._id} item={item} />
            ))}
            {/* <FlatList
              data={courseInfo}
              // horizontal={true}
              renderItem={({ item }) => <SubjectBody item={item} />}
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            /> */}
          </View>
        ) : (
          <View className="p-4 bg-red-300 rounded-xl mt-5">
            <Text className=" text-white">
              No course Available for You at the moment contact School Admin
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SubjectScreen;
