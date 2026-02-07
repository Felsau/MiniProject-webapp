import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import path from "path";
import fs from "fs/promises";

// ============================================
// Upload API - อัปโหลดไฟล์ Resume/CV (PDF)
// ============================================

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "resumes");
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["application/pdf"];

export async function POST(req: Request) {
  try {
    // 1. ตรวจสอบ session
    const session = await getServerSession(authOptions);
    if (!session?.user?.name) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. อ่าน FormData
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "ไม่พบไฟล์ที่อัปโหลด" }, { status: 400 });
    }

    // 3. ตรวจสอบประเภทไฟล์ (PDF เท่านั้น)
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "รองรับเฉพาะไฟล์ PDF เท่านั้น" },
        { status: 400 }
      );
    }

    // 4. ตรวจสอบขนาดไฟล์ (ไม่เกิน 5MB)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 5MB)" },
        { status: 400 }
      );
    }

    // 5. สร้างชื่อไฟล์ที่ไม่ซ้ำกัน
    const timestamp = Date.now();
    const sanitizedUsername = session.user.name.replace(/[^a-zA-Z0-9]/g, "_");
    const fileName = `resume_${sanitizedUsername}_${timestamp}.pdf`;

    // 6. สร้างโฟลเดอร์ถ้ายังไม่มี
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    // 7. เขียนไฟล์
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(UPLOAD_DIR, fileName);
    await fs.writeFile(filePath, buffer);

    // 8. ส่ง URL กลับไป
    const fileUrl = `/uploads/resumes/${fileName}`;

    return NextResponse.json(
      { success: true, url: fileUrl, fileName },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการอัปโหลดไฟล์" },
      { status: 500 }
    );
  }
}
