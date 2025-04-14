import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import Button from "../components/button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";

const QuestionTabScreen = ({
  questions,
  handleVideoPress,
  handleVideoDownloaded,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuest, setCurrentQuest] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadedVideoPath, setDownloadedVideoPath] = useState(null);
  useEffect(() => {
    const currentQuestion = questions[currentQuestionIndex];

    const loadDownloadedVideoPath = async () => {
      try {
        const storedVideoPath = await AsyncStorage.getItem(
          `downloadedVideoPath_${currentQuestion?.text}`
        );
        if (storedVideoPath) {
          setDownloadedVideoPath(storedVideoPath);
        }
      } catch (error) {
        console.error("Error loading downloaded video path:", error);
      }
    };

    loadDownloadedVideoPath();
  }, [currentQuestionIndex]);
  const handleDownload = async (videoId, videoUri) => {
    setCurrentQuest(videoUri);
    try {
      const randomString = Math.random().toString(36).substring(7);
      const fileName = `offlineVideo_${randomString}.mp4`;
      const downloadDest = `${FileSystem.documentDirectory}${fileName}`;

      const downloadObject = FileSystem.createDownloadResumable(
        videoUri,
        downloadDest,
        {},
        (downloadProgressEvent) => {
          const progress =
            downloadProgressEvent.totalBytesWritten /
            downloadProgressEvent.totalBytesExpectedToWrite;
          setDownloadProgress(progress);
        }
      );

      const { uri } = await downloadObject.downloadAsync();

      setDownloadedVideoPath(uri);
      handleVideoDownloaded(uri);
      await AsyncStorage.setItem(`downloadedVideoPath_${videoUri}`, uri);

      Alert.alert("Saved Successful");
      // Alert.alert("Saved Successful", `Video saved at: ${uri}`);
    } catch (error) {
      console.error("Error downloading video:", error);
      Alert.alert(
        "Download Error",
        "An error occurred while downloading the video."
      );
    } finally {
      setDownloadProgress(0);
    }
  };
  if (questions.length < 1) {
    return (
      <View className="p-4 bg-red-300 rounded-xl mt-5 mx-5">
        <Text className=" text-white">
          No Questions Available for You at the moment
        </Text>
      </View>
    );
  }
  const handleOptionSelect = (optionIndex) => {
    // Toggle selection even if the same option is clicked again
    setSelectedOptionIndex(
      selectedOptionIndex === optionIndex ? null : optionIndex
    );
  };

  const handleNextQuestion = () => {
    if (selectedOptionIndex !== null) {
      const currentQuestion = questions[currentQuestionIndex];
      if (selectedOptionIndex + 1 === currentQuestion.correctOption) {
        setScore(score + 1);
      }
      setSelectedOptionIndex(null);
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setShowScore(true);
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setScore(0);
    setShowScore(false);
  };

  const renderQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    return (
      <View className="mx-4 mb-auto ">
        {currentQuestion?.text.indexOf(".mp4") !== -1 ? (
          <Pressable
            className={`rounded-2xl   flex flex-row  bg-white mb-2 p-2 items-center `}
          >
            <Pressable
              className="bg-gold rounded-xl  p-2"
              onPress={() =>
                handleVideoPress(
                  currentQuestion._id,
                  currentQuestion.text,
                  downloadedVideoPath
                )
              }
            >
              <Text className=" text-white font-bold">Video Question</Text>
            </Pressable>
            {!downloadedVideoPath ? (
              <View className="ml-auto">
                <Pressable
                  className="bg-gold rounded-xl  p-2"
                  // onPress={() => handleDownload(currentQuestion._id, currentQuestion.text)}
                  onPress={() => {
                    currentQuestion.text.indexOf(".mp4") !== -1
                      ? handleDownload(
                          currentQuestion._id,
                          currentQuestion.text
                        )
                      : null;
                    //   handleDownload(
                    //       currentQuestion._id,
                    //       currentQuestion.text
                    //     );
                    // navigation.navigate("PdfReader", {
                    //   pdfUrl: currentQuestion.text,
                    // });
                  }}
                >
                  <Text className=" text-white font-bold">download</Text>
                </Pressable>

                {downloadProgress > 0 && (
                  <View className="bg-green-400">
                    <Text className="text-white">{`${(
                      downloadProgress * 100
                    ).toFixed(2)}%`}</Text>
                    <ActivityIndicator
                      size="small"
                      color="#0000ff"
                      animating={downloadProgress < 1}
                    />
                  </View>
                )}
              </View>
            ) : currentQuestion.text.indexOf(".mp4") !== -1 ? (
              <Pressable
                className=" bg-green-700 rounded-xl ml-auto p-2"
                onPress={() =>
                  handleVideoPress(currentQuestion._id, downloadedVideoPath)
                }
              >
                <Text className=" text-white font-bold">Watch Offline</Text>
              </Pressable>
            ) : (
              <Pressable
                className=" bg-green-700 rounded-xl ml-auto p-2"
                onPress={() =>
                  navigation.navigate("PdfReader", {
                    pdfUrl: currentQuestion.text,
                  })
                }
              >
                <Text className=" text-white font-bold">View Offline</Text>
              </Pressable>
            )}
          </Pressable>
        ) : (
          <Text className=" font-bold p-2">{currentQuestion?.text}</Text>
        )}
        {currentQuestion?.options.map((option, index) => (
          <TouchableOpacity
            className=" rounded-xl pl-4 "
            key={index}
            onPress={() => handleOptionSelect(index)}
            style={[
              styles.optionButton,
              selectedOptionIndex === index && styles.selectedOption,
            ]}
          >
            <Text>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderFinalScore = () => {
    return (
      <View>
        <View className="bg-green-500 h-32 w-64  mb-4 self-center rounded-xl justify-center">
          <Text className="text-center font-extrabold text-xl text-white ">
            Your score is: {score}/{questions.length}
          </Text>
        </View>
        <Button
          primaryBtnText={"Restart Quiz"}
          onPrimaryBtnPress={handleRestartQuiz}
        />
      </View>
    );
  };

  return (
    <View className="pt-4 bg-bgWhite  flex-1 px-2">
      {showScore ? renderFinalScore() : renderQuestion()}
      {selectedOptionIndex !== null && !showScore && (
        // <Button title="Next" onPress={handleNextQuestion} />
        <Button
          primaryBtnText={"continue"}
          onPrimaryBtnPress={handleNextQuestion}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  optionButton: {
    backgroundColor: "#ffffff",
    padding: 10,
    marginVertical: 5,
  },
  selectedOption: {
    backgroundColor: "green",
  },
});

export default QuestionTabScreen;
