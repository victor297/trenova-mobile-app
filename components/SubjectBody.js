import React from "react";
import { Text, Pressable, Image } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { images } from "../assets";
const { course } = images;

const SubjectBody = ({ item }) => {
  const navigation = useNavigation();
  return (
    <Pressable
      className={` flex w-full flex-row my-2  items-center p-4 bg-gold rounded-xl `}
      onPress={() => navigation.navigate("Week", { item })}
    >
      <Image source={course} style={{ height: 53, width: 80 }} />
      <Text className={`text-center text-white font-exo font-bold`}>
        {item.name}
      </Text>
    </Pressable>
  );
};

export default SubjectBody;
