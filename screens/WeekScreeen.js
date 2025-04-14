import React from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  Pressable,
  Image,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useSelector } from "react-redux";
import SubjectHeader from "../components/SubjectHeader";
import { images } from "../assets";
import { useNavigation } from "@react-navigation/native";
const { course } = images;

const WeekScreen = ({ route }) => {
  const { item } = route.params;
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
        <View className=" mt-5">
          <SubjectHeader />
        </View>
        <View className="w-full mt-4 mb-12">
          {item?.content.map((item) => (
            <View key={item._id} className=" mx-2 mt-4">
              <Pressable
                className={`rounded-xl flex flex-row bg-gold mb-2 p-2 items-center `}
                onPress={() => navigation.navigate("Learn", { item })}
              >
                <Text
                  className={`text-center text-white font-exo  font-bold text-xl`}
                >
                  Week {item.week}
                </Text>
                <Image
                  className="ml-auto"
                  source={course}
                  style={{ height: 53, width: 120 }}
                />
              </Pressable>
            </View>
          ))}
          {/* <FlatList
            data={item.content}
            className="  "
            renderItem={({ item }) => (
              <View className=" mx-2 mt-4">
                <Pressable
                  className={`rounded-xl flex flex-row bg-gold mb-2 p-2 items-center `}
                  onPress={() => navigation.navigate("Learn", { item })}
                >
                  <Text
                    className={`text-center text-white font-exo  font-bold text-xl`}
                  >
                    Week {item.week}
                  </Text>
                  <Image
                    className="ml-auto"
                    source={course}
                    style={{ height: 53, width: 120 }}
                  />
                </Pressable>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          /> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WeekScreen;
