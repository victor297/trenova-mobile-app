// PdfReaderScreen.js
import React from "react";
import { View, StyleSheet } from "react-native";
import Pdf from "react-native-pdf";

const PdfReaderScreen = ({ route }) => {
  const { pdfUrl } = route.params;

  return (
    <View style={styles.container}>
      <Pdf
        trustAllCerts={false}
        source={{
          uri: pdfUrl,
          cache: true,
        }}
        onLoadComplete={(numberOfPages, filePath) => {}}
        onPageChanged={(page, numberOfPages) => {}}
        onError={(error) => {}}
        style={styles.pdf}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pdf: {
    flex: 1,
    width: "100%",
  },
});

export default PdfReaderScreen;
