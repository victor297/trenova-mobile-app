// PdfListScreen.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const PdfListScreen = () => {
  const navigation = useNavigation();

  const pdfList = [
    "https://drive.usercontent.google.com/download?id=18j4U0LjVUOMjqPL41cfTm75n5AGYtp7F&export=download&authuser=0&confirm=t&uuid=34e150c0-ac80-4ea5-97ff-bbcf98c0f369&at=APZUnTWviesDvgjDMU5bmcG6TxMF:1706616632790",

    "https://www.pdf995.com/samples/pdf.pdf",
    // Add more PDF URLs as needed
    "https://www.pdf995.com/samples/widgets.pdf",
  ];

  const handlePdfPress = (pdfUrl) => {
    navigation.navigate("PdfReader", { pdfUrl });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>PDF List</Text>
      {pdfList.map((pdfUrl, index) => (
        <TouchableOpacity
          key={index}
          style={styles.pdfItem}
          onPress={() => handlePdfPress(pdfUrl)}
        >
          <Text className="text-white">{`click to read Trenova  civil right leader  ${
            index + 1
          }`}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
  },
  pdfItem: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ddd",
    backgroundColor: "blue",
  },
});

export default PdfListScreen;
