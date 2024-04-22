import { View, Text, Image } from "react-native";
import React from "react";
import Rating from "./rating";
import { images } from "./../../assets";

const { trenova } = images;
const InstitutionItem = ({ school }) => {
  // Function to calculate the school rating based on learner count
  const calculateSchoolRating = (learnerCount) => {
    if (learnerCount >= 0 && learnerCount <= 50) {
      return 1; // 1 star for 0-50 learners
    } else if (learnerCount > 50 && learnerCount <= 150) {
      return 2; // 2 stars for 51-150 learners
    } else if (learnerCount > 150 && learnerCount <= 300) {
      return 3; // 3 stars for 151-300 learners
    } else if (learnerCount > 300 && learnerCount <= 500) {
      return 4; // 4 stars for 301-500 learners
    } else {
      return 5; // 5 stars for 500+ learners
    }
  };

  return (
    <View className="bg-blue-200 rounded-xl flex flex-row w-full min-h-[176px] items-center align-middle justify-between p-2 mb-4 shadow">
      {/**============== Institution Image ================ */}
      <View className="rounded-xl">
        <Image source={trenova} style={{ height: 150, width: 110 }} />
      </View>

      {/**============== Institution information ================ */}
      <View className="w-[52%]   flex-col flex space-y-1 py-2">
        <Text className="font-exoSemibold text-darkGrayText text-xl capitalize">
          {school.name}
        </Text>

        {/**============== Rating and reviews ================ */}
        <View className="flex flex-row items-center space-x-2">
          <Rating rating={calculateSchoolRating(school.learnerCount)} />
          {/* <Text className="font-roboto text-darkGrayText text-xs text-left">
            {institution.rating + "  " + `(${institution.reviews})`}
          </Text> */}
        </View>
        <View className="flex flex-col space-y-1">
          <Text className="font-robotoBold text-darkGrayText text-sm capitalize">
            {school.learnerCount}
          </Text>
          <Text className="font-roboto text-xs">Total learners</Text>
        </View>
      </View>
    </View>
  );
};

export default InstitutionItem;
