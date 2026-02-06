import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getUserAuthStatus } from "@/lib/apiHelpers";
import { searchAndFilterJobs, type JobFilterCriteria } from "@/lib/jobService";

/**
 * GET all active jobs (or all jobs if admin)
 * Supports filtering by search, department, location, employmentType, salaryMin, salaryMax, isActive
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const session = await getServerSession(authOptions);

    // Determine if user is admin/hr
    const isAdminOrHR = session?.user?.name
      ? await getUserAuthStatus(session.user.name as string)
      : false;

    // Build filter criteria from query parameters
    const filterCriteria: JobFilterCriteria = {
      searchKeyword: searchParams.get("search") || undefined,
      department: searchParams.get("department") || undefined,
      location: searchParams.get("location") || undefined,
      employmentType: searchParams.get("employmentType") || undefined,
      salaryMin: searchParams.get("salaryMin")
        ? parseInt(searchParams.get("salaryMin")!)
        : undefined,
      salaryMax: searchParams.get("salaryMax")
        ? parseInt(searchParams.get("salaryMax")!)
        : undefined,
      isActive: searchParams.get("isActive") === "false" ? false : true,
    };

    // If admin/hr requests inactive jobs, set isActive to undefined (show all)
    if (isAdminOrHR && searchParams.get("includeInactive") === "true") {
      filterCriteria.isActive = undefined;
    }

    // Use the filter service if any filters are provided
    const hasFilters = Object.values(filterCriteria).some(
      (v) => v !== undefined && v !== "" && v !== true
    );

    if (hasFilters || searchParams.get("search")) {
      const jobs = await searchAndFilterJobs(filterCriteria);
      return NextResponse.json(jobs, { status: 200 });
    }

    // Default: return active jobs or all jobs if admin
    const jobs = await prisma.job.findMany({
      where: isAdminOrHR ? {} : { isActive: true },
      include: {
        postedByUser: {
          select: {
            fullName: true,
            username: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูล" },
      { status: 500 }
    );
  }
}

/**
 * POST create a new job
 */
export async function POST(req: Request) {
  try {
    // 1. เช็คว่า Login หรือยัง?
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.name) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบก่อน" },
        { status: 401 }
      );
    }

    // 2. ดึงข้อมูล User คนที่โพสต์
    const user = await prisma.user.findUnique({
      where: { username: session.user.name as string },
    });

    if (!user) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูลผู้ใช้" },
        { status: 404 }
      );
    }

    // 3. รับข้อมูลจากฟอร์ม
    const body = await req.json();
    const {
      title,
      description,
      department,
      location,
      salary,
      employmentType,
      requirements,
      responsibilities,
      benefits,
    } = body;

    // 4. บันทึกลง Database
    const newJob = await prisma.job.create({
      data: {
        title,
        description: description || null,
        department: department || null,
        location: location || null,
        salary: salary || null,
        employmentType: employmentType || "FULL_TIME",
        requirements: requirements || null,
        responsibilities: responsibilities || null,
        benefits: benefits || null,
        postedBy: user.id,
      },
    });

    return NextResponse.json(
      { message: "สร้างประกาศงานสำเร็จ", job: newJob },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการบันทึก" },
      { status: 500 }
    );
  }
}