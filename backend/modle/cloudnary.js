import cloudinary from 'cloudinary'; // Correct way to import cloudinary package.
import fs from 'fs'; // Correct import for fs module.

cloudinary.config({
  cloud_name: 'dgx2rwbt8',
  api_key: '865788229419493',
  api_secret: 'GKRRVK-zRbz-kEDXvEndHyHpE9Q'
});

// Function to upload a file
const uploadFile = async (localFile) => {
  try {
    const response = await cloudinary.uploader.upload(localFile, {
      resource_type: 'auto', // Automatically detect the file type (image, video, etc.)
    });
    return response;
  } catch (err) {
    console.error('Error during file upload:', err); // Log the error for debugging purposes
    fs.unlinkSync(localFile); // Delete the file from the local filesystem if upload fails
    throw err; // Propagate the error after cleanup
  }
};

export default uploadFile;
