import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

export type S3Upload = {
  success: boolean;
  err: string;
  data: AWS.S3.ManagedUpload.SendData | undefined;
};
export type S3Content = {
  success: boolean;
  err: string;
  data: AWS.S3.GetObjectOutput | undefined;
};
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const bucket = process.env.AWS_BUCKET_NAME as string;

export default class s3Client {
  async getContent(key: string): Promise<S3Content> {
    const getParams = {
      Bucket: bucket,
      Key: key
    };
    try {
      const stored = await s3.getObject(getParams).promise();
      return { success: true, err: '', data: stored };
    } catch (err) {
      return { success: false, err: err as string, data: undefined };
    }
  }

  async addToBucket(
    fileName: string,
    fileContent: Buffer,
    contentType: string
  ): Promise<S3Upload> {
    const params = {
      Bucket: bucket,
      Key: fileName,
      Body: fileContent,
      ContentType: contentType
    };
    try {
      const stored = await s3.upload(params).promise();
      return { success: true, err: '', data: stored };
    } catch (err) {
      return { success: false, err: err as string, data: undefined };
    }
  }
}
