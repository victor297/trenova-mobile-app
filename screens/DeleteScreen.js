import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  Alert,
  Pressable,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";

const DeleteScreen = () => {
  const [savedItems, setSavedItems] = useState([]);
  const extractWordsInParentheses = (str) => {
    const regex = /\(([^)]+)\)/;
    const matches = str.match(regex);
    return matches && matches.length > 1 ? matches[1] : "Video Unknown";
  };

  useEffect(() => {
    const fetchSavedItems = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const savedVideoKeys = keys.filter((key) =>
          key.startsWith("downloadedVideoPath_")
        );
        const savedItems = await AsyncStorage.multiGet(savedVideoKeys);
        setSavedItems(savedItems);
        console.log(savedItems);
      } catch (error) {
        console.error("Error fetching saved items:", error);
      }
    };

    fetchSavedItems();
  }, []);

  const deleteItem = async (key, uri) => {
    try {
      await AsyncStorage.removeItem(key);
      await FileSystem.deleteAsync(uri); // Delete the file from the file system
      setSavedItems(savedItems.filter((item) => item[0] !== key));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const deleteAllItems = async () => {
    try {
      await Promise.all(
        savedItems.map(async (item) => {
          await AsyncStorage.removeItem(item[0]);
          await FileSystem.deleteAsync(item[1]);
        })
      );
      setSavedItems([]);
    } catch (error) {
      console.error("Error deleting all items:", error);
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, padding: 20 }}
      className="bg-bgWhite"
    >
      {savedItems.length === 0 ? (
        <Text className="pt-32 text-center">No saved items</Text>
      ) : (
        <View className="w-full mt-4 mb-6">
          {savedItems?.map((item, index) => (
            <View key={item._id} className=" mx-2 mt-4">
              <Pressable
                className={`rounded-xl flex flex-row justify-between bg-red-200 mb-2 p-2 items-center `}
              >
                <Text
                  className={`text-center text-white bg-green-500 px-2 rounded-md font-exo  font-bold text-sm`}
                >
                  {extractWordsInParentheses(item[0])} {index + 1}
                </Text>
                <Text
                  className={`text-center text-white bg-red-400 px-2 rounded-md font-exo  font-bold text-xl`}
                  onPress={() => deleteItem(item[0], item[1])}
                >
                  delete
                </Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}
      {savedItems.length > 0 && (
        <Pressable
          onPress={deleteAllItems}
          className="py-3 bg-red-400 px-2 mb-2 rounded-xl w-full  max-h-[58px] flex items-center justify-center"
        >
          <Text className=" font-exoSemibold text-center text-bgWhite">
            Delete All
          </Text>
        </Pressable>
      )}
    </ScrollView>
  );
};

export default DeleteScreen;
