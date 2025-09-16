import "dotenv/config";
import {
  DeleteObjectCommand,
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import logger from "./logger";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
  forcePathStyle: false,
});

//   storage: multerS3({
// const upload = multer({
//     s3,
//     bucket: process.env.S3_BUCKET_NAME || "",
//     acl: "public-read",
//     metadata: (req, file, cb) => {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: (req, file, cb) => {
//       const fileName = `${Date.now().toString()}-${file.originalname}`;
//       cb(null, fileName);
//     },
//   }),
// });

export const uploadMediaToS3 = (file: Express.Multer.File): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const fileName = `${Date.now()}-${file.originalname}`;

    // const params = {
    //   Bucket: process.env.S3_BUCKET_NAME!,
    //   Key: fileName,
    //   Body: file.buffer,
    //   ContentType: file.mimetype,
    //   ACL: "public-read" as ObjectCannedACL,
    // };

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read" as ObjectCannedACL,
    };

    try {
      const command = new PutObjectCommand(params);
      const result = await s3.send(command);
      resolve({
        ...result,
        orginalName: file.originalname,
        url: `https://${process.env.AWS_S3_BUCKET_NAME}.t3.storage.dev/${fileName}`,
        key: fileName,
      });
    } catch (error) {
      logger.error("Error while uploading media to S3", error);
      reject(error);
    }
  });
};

export const deleteMediaFromS3 = async (key: string): Promise<void> => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
  };

  try {
    const command = new DeleteObjectCommand(params);
    await s3.send(command);
    logger.info(`Deleted file ${key} from S3 bucket sucessfully.`);
  } catch (error) {
    logger.error(`Error deleting file ${key} from S3`, error);
    throw error;
  }
};
