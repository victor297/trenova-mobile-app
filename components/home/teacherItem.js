import { View, Text, Image } from "react-native";
import React from "react";
import { images } from "./../../assets";

const { trenova } = images;
const TeacherItem = ({ course }) => {
  return (
    <View className="max-w-[126px] min-h-[176px] bg-white p-2 rounded-xl shadow mx-2">
      {/**============== Teacher Image ================ */}
      <View className="rounded-xl bg-gold">
        <Image source={trenova} style={{ height: 115, width: 110 }} />
      </View>
      {/**============== Teacher's Name and subject ================ */}
      <View className="mt-2">
        <Text className="font-exoSemibold  text-xs capitalize text-darkGrayText">
          {course.name}
        </Text>
        <Text className="font-exo text-xs">{`${course.class} term ${course.term}`}</Text>
      </View>
    </View>
  );
};

export default TeacherItem;
