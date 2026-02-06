import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET: ดึงรายการงานที่สมัคร
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.name) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { username: session.user.name } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const applications = await prisma.application.findMany({
      where: { userId: user.id },
      include: {
        job: true, // ✅ ต้องมีตัวนี้ ข้อมูลถึงจะขึ้นโชว์บนการ์ดครับ
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(applications);
  } catch (err) {
    return NextResponse.json({ error: "Fetch error" }, { status: 500 });
  }
}

// POST: สมัครงาน
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.name) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { jobId } = body;

    // 1. ตรวจสอบว่าส่ง jobId มาจริงไหม
    if (!jobId) return NextResponse.json({ error: "Missing jobId" }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { username: session.user.name },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // 2. เช็คซ้ำอีกรอบด้วย findUnique (ถ้าตั้ง @@unique ไว้ใน schema จะใช้ findUnique ได้แม่นกว่า)
    const existing = await prisma.application.findFirst({
      where: {
        jobId: jobId,
        userId: user.id,
      },
    });

    if (existing) {
      return NextResponse.json({ error: "คุณเคยสมัครตำแหน่งนี้ไปแล้ว" }, { status: 400 });
    }

    // 3. บันทึกข้อมูล
    await prisma.application.create({
      data: {
        jobId: jobId,
        userId: user.id,
        status: "PENDING", // กำหนดสถานะเริ่มต้นให้ชัดเจน
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });

  } catch (error: any) {
    // ถ้าพลาดจากระดับ Database (เช่นกดพร้อมกัน 2 ครั้งจริงๆ) ให้ดัก Error ตรงนี้
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "คุณสมัครงานนี้ไปแล้ว (Database Error)" }, { status: 400 });
    }
    console.error("Apply Error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการสมัคร" }, { status: 500 });
  }
}