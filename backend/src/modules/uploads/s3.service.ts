import AWS from "aws-sdk";

const s3 = new AWS.S3({
  region: process.env.AWS_REGION || "us-east-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const BUCKET = process.env.AWS_S3_BUCKET || "hmp-vitam-bucket";

export async function uploadPdfToS3(key: string, body: Buffer): Promise<string> {
  try {
    await s3.putObject({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: "application/pdf",
      ServerSideEncryption: "AES256"
    }).promise();
    
    return `s3://${BUCKET}/${key}`;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("Failed to upload file to S3");
  }
}

export function getSignedUrl(key: string, expiresIn: number = 300): string {
  try {
    return s3.getSignedUrl("getObject", {
      Bucket: BUCKET,
      Key: key,
      Expires: expiresIn // 5 minutos por defecto
    });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw new Error("Failed to generate signed URL");
  }
}

export async function deleteFromS3(key: string): Promise<void> {
  try {
    await s3.deleteObject({
      Bucket: BUCKET,
      Key: key
    }).promise();
  } catch (error) {
    console.error("Error deleting from S3:", error);
    throw new Error("Failed to delete file from S3");
  }
}

export async function uploadFileToS3(
  key: string, 
  body: Buffer, 
  contentType: string
): Promise<string> {
  try {
    await s3.putObject({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
      ServerSideEncryption: "AES256"
    }).promise();
    
    return `s3://${BUCKET}/${key}`;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("Failed to upload file to S3");
  }
}

