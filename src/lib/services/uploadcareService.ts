// src/lib/services/uploadcareService.ts

const UPLOADCARE_PUBLIC_KEY = process.env.UPLOADCARE_PUBLIC_KEY!;

export async function uploadToUploadcare(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('UPLOADCARE_PUB_KEY', UPLOADCARE_PUBLIC_KEY);
  formData.append('UPLOADCARE_STORE', '1');
  formData.append('file', file);

  const response = await fetch('https://upload.uploadcare.com/base/', {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Uploadcare upload failed');
  }
  const data = await response.json();
  // คืนลิงก์ไฟล์ที่อัปโหลดสำเร็จ
  return `https://ucarecdn.com/${data.file}/`;
}
