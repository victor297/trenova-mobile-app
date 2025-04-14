import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  Alert,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { images } from "../assets";
import Button from "../components/button";
import Input from "../components/input";
import { EyeIcon, PhotoIcon } from "react-native-heroicons/solid";
import RNPickerSelect from "react-native-picker-select";
import { useDispatch, useSelector } from "react-redux";
import { useLearnersignupMutation } from "../redux/api/learnersApiSlice";
import { setCredentials } from "../redux/features/auth/authSlice";
const { signup } = images;

export default function SignUpScreen() {
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    age: 0,
    class: "",
    schoolID: "",
    profileImg: "",
    password: "",
    passwordConfirm: "",
  });

  const navigation = useNavigation();
  const classOptions = [
    { label: "Select a class", value: "" },
    { label: "KG 1", value: "KG 1" },
    { label: "KG 2", value: "KG 2" },
    { label: "Nursery 1", value: "Nursery 1" },
    { label: "Nursery 2", value: "Nursery 2" },
    { label: "Grade 1", value: "Grade 1" },
    { label: "Grade 2", value: "Grade 2" },
    { label: "Grade 3", value: "Grade 3" },
    { label: "Grade 4", value: "Grade 4" },
    { label: "Grade 5", value: "Grade 5" },
    { label: "Grade 6", value: "Grade 6" },
    { label: "JSS 1", value: "JSS 1" },
    { label: "JSS 2", value: "JSS 2" },
    { label: "JSS 3", value: "JSS 3" },
    { label: "SSS 1", value: "SSS 1" },
    { label: "SSS 2", value: "SSS 2" },
    { label: "SSS 3", value: "SSS 3" },
  ];

  const [inputFocused, setInputFocused] = useState(false);

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

  const handleInputChange = (key, value) => {
    setUserData({ ...userData, [key]: value });
  };
  const [learnersignup, { isLoading }] = useLearnersignupMutation();

  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const handleSubmit = async () => {
    // Check if passwords match

    if (userData.password !== userData.passwordConfirm) {
      Alert.alert("Passwords do not match");
      return;
    }
    if (userData.password.length < 8 || userData.passwordConfirm.length < 8) {
      Alert.alert("Passwords must be upto 8 characters ");
      return;
    }
    const updatedUserData = {
      ...userData,
    };

    try {
      const res = await learnersignup(updatedUserData).unwrap();
      // dispatch(setCredentials({ ...res }));
      Alert.alert("successfully registered");
      navigation.navigate("SignIn");
    } catch (err) {
      Alert.alert(err?.data?.message || err.error);
    }
  };

  return (
    <ScrollView className="">
      <SafeAreaView className="flex-1 bg-bgWhite px-8">
        <View className="flex-1 flex justify-around">
          {/** ====================== Image ============================= */}
          {/* {inputFocused ? null : (
            <View className="flex-row justify-center mb-[-15%] mt-[-10%]">
              <Image source={signup} style={{ width: 353, height: 235 }} />
            </View>
          )} */}
          <View>
            <Text className="font-extrabold text-2xl text-gold text-center">
              Sign Up
            </Text>
          </View>
          {/** ====================== Sign Up inputs ============================= */}
          <View className="flex flex-col w-full  justify-center my-4">
            <Input
              label={"Name"}
              placeholder={"Your name"}
              value={userData.name}
              onChange={(text) => handleInputChange("name", text)}
            />
            <Input
              label={"Username"}
              placeholder={"username"}
              value={userData.username}
              onChange={(text) => handleInputChange("username", text)}
            />
            <Input
              label={"Age"}
              placeholder={"Your Age"}
              value={userData.age}
              onChange={(text) => handleInputChange("age", text)}
              keyboard="numeric"
            />
            <Text className="font-exo mb-2 font-light text-darkGrayText text-start">
              class
            </Text>
            <View className="  mb-1  bg-white h-12 rounded-lg shadow">
              <RNPickerSelect
                onValueChange={(value) => handleInputChange("class", value)}
                items={classOptions}
                placeholder={{ label: "Select a class", value: "" }}
              />
            </View>
            <Input
              label={"School UserName"}
              placeholder={"Learnnova123"}
              value={userData.schoolID}
              onChange={(text) => handleInputChange("schoolID", text)}
            />
            <Input
              label={"Password"}
              placeholder={"**********"}
              Icon={EyeIcon}
              onChange={(text) => handleInputChange("password", text)}
              last
            />
            <Input
              label={"confirm Password"}
              placeholder={"**********"}
              Icon={EyeIcon}
              onChange={(text) => handleInputChange("passwordConfirm", text)}
              last
            />
          </View>

          {/** ====== Action button -> Navigation to grade selection screen ======= */}
          {isLoading ? (
            <ActivityIndicator color="#d97706" size="large" />
          ) : (
            <Button
              primaryBtnText={"Sign Up"}
              onPrimaryBtnPress={() => handleSubmit()}
              secondaryBtnText1={"Already have an account?"}
              secondaryBtnText2={"Sign In"}
              onSecondaryBtnPress={() => navigation.navigate("SignIn")}
            />
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
