import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    // 1. เช็คว่า Login หรือยัง?
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบก่อน" }, { status: 401 })
    }

    // 2. ดึงข้อมูล User คนที่โพสต์ (เพื่อเอา ID)
    const user = await prisma.user.findUnique({
      where: { username: session.user.name as string } // หรือใช้ email ถ้าคุณใช้ email login
    })

    if (!user) {
      return NextResponse.json({ error: "ไม่พบข้อมูลผู้ใช้" }, { status: 404 })
    }

    // 3. รับข้อมูลจากหน้าฟอร์ม
    const body = await req.json()
    const { title, department, location, salary, description } = body

    // 4. บันทึกลง Database
    const newJob = await prisma.job.create({
      data: {
        title,
        department,
        location,
        salary,
        description,
        authorId: user.id // เชื่อมโยงว่าใครเป็นคนโพสต์
      }
    })

    return NextResponse.json({ message: "สร้างประกาศงานสำเร็จ", job: newJob }, { status: 201 })

  } catch (error) {
    console.error("Error creating job:", error)
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการบันทึก" }, { status: 500 })
  }
}