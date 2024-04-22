import AWS from "aws-sdk";
import { Alert } from "react-native";

// Configure AWS SDK with your DigitalOcean Spaces credentials and endpoint
const spacesEndpoint = new AWS.Endpoint("nyc3.digitaloceanspaces.com");
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: "DO00QWUMPHWUBAM9PRYE",
  secretAccessKey: "voFh7cMSqvPT1/jTbErkuHkPeTgSK3Ecp++TtJaDbDU",
});

// Specify the DigitalOcean Spaces bucket name
const bucketName = "trenova";

// Function to upload a file blob to DigitalOcean Spaces and return its location and size in MB
export const uploadFileToS3 = async (
  fileBlob,
  fileKey,
  contentType,
  onProgress
) => {
  const params = {
    Bucket: bucketName,
    Key: fileKey,
    Body: fileBlob,
    ContentType: contentType, // Specify the content type (e.g., 'image/jpeg', 'application/pdf', etc.)
    ACL: "public-read",
  };

  try {
    const response = await s3
      .upload(params)
      .on("httpUploadProgress", (progress) => {
        if (onProgress) {
          onProgress(progress);
        }
      })
      .promise();

    const fileSizeMB = getFileSizeMB(fileBlob.size); // Calculate file size based on blob size
    let location = response.Location;

    // Check if the location doesn't start with 'https://'
    if (!location.startsWith("https://")) {
      // Prepend 'https://' to the location
      location = `https://${bucketName}.${spacesEndpoint.hostname}/${fileKey}`;
    }
    return {
      location: location,
      size: fileSizeMB,
    };
  } catch (error) {
    Alert.alert("Error uploading file:", error);
    throw new Error("Error uploading file. Please try again.");
  }
};

// Helper function to calculate file size in MB
const getFileSizeMB = (bytes) => {
  return bytes / (1024 * 1024); // Convert bytes to MB
};
