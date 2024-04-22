import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  Keyboard,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { images } from "../assets";
import Button from "../components/button";
import Input from "../components/input";
import { EyeIcon } from "react-native-heroicons/solid";
import { useLoginMutation } from "../redux/api/learnersApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/features/auth/authSlice";

const { signin } = images;

export default function SignInScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [inputFocused, setInputFocused] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });

  const [login, { isLoading }] = useLoginMutation();

  const handleInputChange = (key, value) => {
    setUserData({ ...userData, [key]: value });
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      _keyboardDidShow
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      _keyboardDidHide
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const _keyboardDidShow = () => {
    setInputFocused(true);
  };

  const _keyboardDidHide = () => {
    setInputFocused(false);
  };
  const handleSubmit = async () => {
    // Navigate to the next screen with user data

    try {
      const res = await login(userData).unwrap();
      dispatch(setCredentials({ ...res }));
      // navigation.navigate("Home");
    } catch (err) {
      Alert.alert(err?.data?.message || err.error);
    }
    // navigation.navigate("SelectGrade", { userData });
  };

  return (
    <SafeAreaView className="flex-1 bg-bgWhite px-8">
      <View className="flex-1 flex justify-around my-4">
        {/** ====================== Image ============================= */}
        {inputFocused ? null : (
          <View className="flex-row justify-center">
            <Image source={signin} style={{ width: 324, height: 324 }} />
          </View>
        )}

        {/** ====================== Sign In inputs ============================= */}
        <View className="flex flex-col w-full items-center justify-center ">
          <Input
            label={"Username"}
            placeholder={"Trenova123"}
            value={userData.username}
            onChange={(text) => handleInputChange("username", text)}
          />
          <Input
            label={"Password"}
            placeholder={"**********"}
            Icon={EyeIcon}
            onChange={(text) => handleInputChange("password", text)}
            last
          />
        </View>

        {/** ====================== Action button ============================= */}
        {isLoading ? (
          <ActivityIndicator color="#d97706" size="large" />
        ) : (
          <Button
            primaryBtnText={"Sign In"}
            onPrimaryBtnPress={() => handleSubmit()}
            secondaryBtnText1={"Don't have an account?"}
            secondaryBtnText2={"Sign Up"}
            onSecondaryBtnPress={() => navigation.navigate("SignUp")}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
