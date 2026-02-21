import { Storage } from '@google-cloud/storage';

// กำหนดค่าจาก environment variables
const bucketName = process.env.GCS_BUCKET_NAME!;
const keyFilename = process.env.GCS_KEYFILE_PATH!; // path ไปยัง service account key json

// สร้าง client
export const storage = new Storage({ keyFilename });
export const bucket = storage.bucket(bucketName);

export async function uploadPdfToGCS(fileBuffer: Buffer, destination: string, mimetype: string): Promise<string> {
  const file = bucket.file(destination);
  await file.save(fileBuffer, {
    metadata: { contentType: mimetype },
    public: true, // หากต้องการให้ไฟล์เข้าถึงได้ผ่าน URL
    resumable: false,
  });
  return `https://storage.googleapis.com/${bucketName}/${destination}`;
}
