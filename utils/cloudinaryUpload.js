import cloudinary from "../config/Cloudinary/cloudinary.config.js";

export const uploadToCloudinary = (fileBuffer, folder,mimetype) => {
  return new Promise((resolve, reject) => {
    console.log(fileBuffer,"filebuffer");
    const docTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
    const resourcesType = docTypes.includes(mimetype) ? "raw" : "image";

    if (!fileBuffer) {
      return reject(new Error("File buffer is required"));
    }
    const stream = cloudinary.uploader.upload_stream(
      { folder ,
        resource_type:resourcesType
      },
      (error, result) => {
        if (error) reject(error);
        else {
          resolve(result);
        }
      },
    );
    stream.end(fileBuffer);
  });
};
