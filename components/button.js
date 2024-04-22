import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";

const Button = ({
  onPrimaryBtnPress,
  primaryBtnText,
  showSecondaryBtn = true,
  secondaryBtnText1,
  secondaryBtnText2,
  onSecondaryBtnPress,
}) => {
  return (
    <View className="flex  flex-col items-center gap-8">
      {/** ====================== Main Button ============================= */}
      <Pressable
        onPress={onPrimaryBtnPress}
        className="py-3 bg-gold px-7 rounded-xl w-[267px] max-h-[58px] flex items-center justify-center"
      >
        <Text className="text-xl font-exoSemibold text-center text-bgWhite">
          {primaryBtnText}
        </Text>
      </Pressable>
      {/** ====================== Secondary pressable ============================= */}
      {showSecondaryBtn ? (
        <View className="flex-row justify-center">
          <Text className="text-darkGrayText font-exo text-lg">
            {secondaryBtnText1}{" "}
          </Text>
          <Pressable onPress={onSecondaryBtnPress}>
            <Text className="font-exo text-gold text-lg">
              {secondaryBtnText2}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
};

export default Button;
