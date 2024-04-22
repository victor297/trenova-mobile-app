import React, { useState } from "react";
import Button from "../components/button";
import { useNavigation } from "@react-navigation/native";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import {
  useGetLearnerDetailsQuery,
  useLogoutMutation,
  useUpdateLearnerMutation,
} from "../redux/api/learnersApiSlice";
import { logout } from "../redux/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Image } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { launchCamera } from "react-native-image-picker";
import { PermissionsAndroid } from "react-native";
import { PhotoIcon } from "react-native-heroicons/solid";
import { uploadFileToS3 } from "../utils/aws";
import { Pressable } from "react-native";
import { ScrollView } from "react-native";

const Profile = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const navigation = useNavigation();
  const [logOutApi] = useLogoutMutation();
  const [isLogging, setIsLogging] = useState(false);
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [updateLearner, { error }] = useUpdateLearnerMutation();

  const { data, isLoading, isError, refetch } = useGetLearnerDetailsQuery(
    userInfo._id
  );
  const logoutHandler = async () => {
    setIsLogging(true);
    try {
      const netInfo = await NetInfo.fetch();
      const isConnected = netInfo.isConnected;
      if (isConnected) {
        const result = await logOutApi(userInfo._id);
        if (result?.error) {
          Alert.alert("Network request failed");
          setIsLogging(false);
        }
        if (result.data?.status === "success") {
          await dispatch(logout());
          navigation.navigate("SignIn");
          setIsLogging(false);
        }
      } else {
        Alert.alert("internet not available");
        setIsLogging(false);
      }
    } catch (error) {
      setIsLogging(false);

      console.error(error);
    }
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "App Camera Permission",
          message: "App needs access to your camera",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        handleCameraLaunch();
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleCameraLaunch = () => {
    console.log("uploaded", uploaded);
    const options = {
      mediaType: "photo",
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled camera");
      } else if (response.error) {
        console.log("Camera Error: ", response.error);
      } else {
        let imageUri =
          response.uri || (response.assets && response.assets[0].uri);
        if (imageUri) {
          setSelectedImage(imageUri);
          setFileName(response.assets[0].fileName);
        } else {
          console.log("Image URI not found in response");
        }
      }
    });
  };

  const handleFileUpload = async (filePath, fileName) => {
    if (!filePath || !fileName) {
      Alert.alert("Error", "Please select an image first.");
      setUploading(true);
      setUploading(false);

      return null;
    }

    try {
      const fileBlob = await fetch(filePath).then((response) =>
        response.blob()
      );
      const fileKey = `profile/${fileName}`; // Generate a unique file key
      const contentType = "image/jpeg"; // Adjust content type as needed for your file

      const uploadResult = await uploadFileToS3(fileBlob, fileKey, contentType);
      console.log("Upload result:", uploadResult);
      setUploaded(true);
      setUploading(false);
      return uploadResult;
      // Handle successful upload (e.g., update UI with uploaded file info)
    } catch (error) {
      console.error("Error uploading file to", error);
      setUploading(false);

      return null; // Reject the promise on error
    }
  };

  const uploadImageToSpaces = async () => {
    if (!selectedImage) {
      Alert.alert("Error", "Please select an image first.");
      return null;
    }

    try {
      setUploading(true);

      // Call the uploadFileToS3 function from AWS SDK to upload the selectedImage
      const imageUrl = await uploadFileToS3(selectedImage);

      Alert.alert("Success", "Image uploaded successfully!");
      setSelectedImageUrl(imageUrl);
      return imageUrl; // Resolve with the uploaded image URL
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert(
        "Error",
        "An error occurred while uploading the image. Please try again."
      );
      return null; // Reject the promise on error
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    // Check if passwords match
    setUploading(true);

    const uploadedUrl = await handleFileUpload(selectedImage, fileName);

    if (!uploadedUrl?.location) {
      setUploading(false);

      Alert.alert("kindly take selfie again");
      return;
    }

    const updatedUserData = {
      profileImg: uploadedUrl?.location,
    };

    try {
      const res = await updateLearner({
        id: userInfo._id,
        data: updatedUserData,
      })
        .unwrap()
        .then((payload) => {
          Alert.alert("Profile updated successfully");
          refetch();
        })
        .catch((error) =>
          error.status == 401
            ? Alert.alert("Unauthorized", error?.data?.message)
            : Alert.alert(error?.data?.message || "something went rong")
        ); // dispatch(setCredentials({ ...res }));
      setSelectedImage(null);
    } catch (err) {
      Alert.alert(err?.data?.message || err.error);
    }
  };

  return (
    <ScrollView className="bg-bgWhite">
      <SafeAreaView className="flex-1 bg-bgWhite mt-8 p-4 ">
        {isLoading ? (
          <ActivityIndicator color="#d97706" size="large" />
        ) : data ? (
          <View className="flex flex-col items-center justify-center w-full">
            <View className=" h-28 w-28 rounded-full my-6  border-2 border-gold">
              <Image
                className="w-full h-full rounded-full  "
                source={{ uri: data.learner.profileImg }}
              />
            </View>
            <Text className=" bg-white p-4 rounded-xl w-full my-2">
              <Text className="text-gray-500 font-bold">Username: </Text>
              {data.learner.username}
            </Text>
            <Text className=" bg-white p-4 rounded-xl w-full my-2">
              <Text className="text-gray-500 font-bold">Name: </Text>
              {data.learner.name}
            </Text>
            <Text className=" bg-white p-4 rounded-xl w-full my-2">
              <Text className="text-gray-500 font-bold">School: </Text>
              {data.learner.schoolID.name}
            </Text>
            <View className="flex flex-row w-full justify-between ">
              <Text className=" bg-white p-4 rounded-xl w-[49%] my-2">
                <Text className="text-gray-500 font-bold">Class: </Text>
                {data.learner.class}
              </Text>
              <Text className=" bg-white p-4 rounded-xl w-[49%] my-2">
                <Text className="text-gray-500 font-bold">Age: </Text>
                {data.learner.age}
              </Text>
            </View>

            <Pressable onPress={uploaded ? null : requestCameraPermission}>
              <View className="w-[100%]  my-2 flex-row justify-between bg-gold rounded-xl p-2">
                <Text className="text-white font-bold"> upload selfie</Text>

                <PhotoIcon color={"white"} />
              </View>
            </Pressable>
            {selectedImage && (
              <View className="items-center mb-2">
                <Image
                  source={{ uri: selectedImage }}
                  style={{ width: 100, height: 100 }}
                />
              </View>
            )}
            {uploading ? (
              <ActivityIndicator color="#d97706" size="large" />
            ) : (
              // <Button
              //   primaryBtnText={"update picture"}
              //   onPrimaryBtnPress={() => handleSubmit()}
              //     />
              <Pressable
                onPress={handleSubmit}
                className="py-3 bg-green-400 px-2 rounded-xl w-full mb-2 max-h-[58px] flex items-center justify-center"
              >
                <Text className=" font-exoSemibold text-center text-bgWhite">
                  update picture{" "}
                </Text>
              </Pressable>
            )}
            {isLogging ? (
              <ActivityIndicator />
            ) : (
              // <Button
              //   primaryBtnText={"LogOut"}
              //   onPrimaryBtnPress={() => logoutHandler()}
              //     />
              <Pressable
                onPress={logoutHandler}
                className="py-3 bg-red-400 px-2 rounded-xl w-full  max-h-[58px] flex items-center justify-center"
              >
                <Text className=" font-exoSemibold text-center text-bgWhite">
                  LogOut
                </Text>
              </Pressable>
            )}
          </View>
        ) : (
          <Text>You are curently offline</Text>
        )}
      </SafeAreaView>
    </ScrollView>
  );
};

export default Profile;
