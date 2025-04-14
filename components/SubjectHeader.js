import * as React from "react";
import { View, Image, Text } from "react-native";
import { images } from "../assets";

const { course } = images;

function SubjectHeader(props) {
  return (
    <View className="bg-white rounded-xl flex flex-row justify-between p-2 w-full">
      <View className="flex-1">
        <Text className="text-gold flex flex-wrap">
          Find a course you want to learn!
        </Text>
        <View className="px-2.5 py-3 mt-4 w-28 text-white bg-gold rounded-[33px]">
          <Text className="text-white">Check Now</Text>
        </View>
      </View>
      <View>
        <Image
          source={course}
          style={{ height: 83, width: 120 }}
          // loading="lazy"
          // srcSet="..."
          className="z-10 self-stretch my-auto w-full"
        />
      </View>
    </View>
  );
}

export default SubjectHeader;
