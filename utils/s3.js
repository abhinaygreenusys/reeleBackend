const { Upload } = require("@aws-sdk/lib-storage");
const { S3Client } = require("@aws-sdk/client-s3");
const s3Images = (filename, fileBuffer) => {
  return new Promise((resolve, reject) => {
    new Upload({
      client: new S3Client({
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
        region: process.env.AWS_REGION,
      }),
      params: {
        ACL: "public-read",
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `${process.env.S3_BUCKET_FOLDER_IMAGES}/${filename}`,
        Body: fileBuffer,
      },
    })
      .done()
      .then((data) => {
        return resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const s3Videos = (filename, fileBuffer) => {
  return new Promise((resolve, reject) => {
    new Upload({
      client: new S3Client({
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
        region: process.env.AWS_REGION,
      }),
      params: {
        ACL: "public-read",
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `${process.env.S3_BUCKET_FOLDER_VIDEOS}/${filename}`,
        Body: fileBuffer,
      },
    })
      .done()
      .then((data) => {
        return resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

module.exports = { s3Images, s3Videos };
