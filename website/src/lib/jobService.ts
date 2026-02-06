import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { JobWithCount } from "@/types"; // ⚠️ อย่าลืมสร้างไฟล์ types/index.ts ตามที่เคยแนะนำนะครับ

/**
 * Job creation data interface
 */
export interface CreateJobData {
  job_title: string;
  department_id: number; // อาจต้องแก้เป็น string ถ้าคุณเก็บเป็น text ในอนาคต
  job_level?: string;
  work_location?: string;
  job_description?: string;
  responsibilities?: string;
  qualifications?: string;
  special_conditions?: string;
  hiring_count?: number;
  employment_type?: string;
  salary_min?: number;
  salary_max?: number;
  close_date?: string;
}

/**
 * Validate job creation data
 */
export async function validateJobData(data: CreateJobData): Promise<{ valid: boolean; error?: string }> {
  if (!data.job_title) {
    return { valid: false, error: "Job title is required" };
  }
  return { valid: true };
}

/**
 * Get all jobs (With Applicant Count)
 */
export async function getAllJobs(): Promise<JobWithCount[]> {
  try {
    return await prisma.job.findMany({
      include: {
        postedByUser: {
          select: {
            fullName: true,
            username: true,
          }
        },
        // ✅ เพิ่มส่วนนี้: นับจำนวนใบสมัคร
        _count: {
          select: { applications: true }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Fetch Jobs Error:", error);
    return [];
  }
}

/**
 * Job filter criteria interface
 */
export interface JobFilterCriteria {
  searchKeyword?: string;
  department?: string;
  location?: string;
  employmentType?: string;
  salaryMin?: number;
  salaryMax?: number;
  isActive?: boolean;
}

/**
 * Search and filter jobs
 */
export async function searchAndFilterJobs(criteria: JobFilterCriteria): Promise<JobWithCount[]> {
  try {
    const where: any = {};

    if (criteria.searchKeyword) {
      where.OR = [
        { title: { contains: criteria.searchKeyword } },
        { description: { contains: criteria.searchKeyword } },
        { requirements: { contains: criteria.searchKeyword } },
      ];
    }
    if (criteria.department) where.department = { contains: criteria.department };
    if (criteria.location) where.location = { contains: criteria.location };
    if (criteria.employmentType) where.employmentType = criteria.employmentType;
    if (criteria.isActive !== undefined) where.isActive = criteria.isActive;

    const jobs = await prisma.job.findMany({
      where,
      include: {
        postedByUser: {
          select: { fullName: true, username: true },
        },
        _count: {
          select: { applications: true }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    return jobs;
  } catch (error) {
    console.error("Search and Filter Jobs Error:", error);
    return [];
  }
}

/**
 * Get inactive jobs
 */
export async function getInactiveJobs(): Promise<JobWithCount[]> {
  try {
    return await prisma.job.findMany({
      where: { isActive: false },
      include: {
        postedByUser: true,
        _count: { select: { applications: true } }
      },
      orderBy: { killedAt: "desc" },
    });
  } catch (error) {
    console.error("Fetch Inactive Jobs Error:", error);
    return [];
  }
}

/**
 * Kill (soft delete) a job
 */
export async function killJobById(jobId: string) {
  try {
    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        isActive: false,
        killedAt: new Date(),
      },
    });
    revalidatePath("/");
    return { success: true, job: updatedJob };
  } catch (error) {
    console.error("Kill Job Error:", error);
    return { success: false, error: "ไม่สามารถปิดประกาศงานได้" };
  }
}

/**
 * Restore a killed job
 */
export async function restoreJobById(jobId: string) {
  try {
    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        isActive: true,
        killedAt: null,
      },
    });
    revalidatePath("/");
    return { success: true, job: updatedJob };
  } catch (error) {
    console.error("Restore Job Error:", error);
    return { success: false, error: "ไม่สามารถเปิดประกาศงานได้" };
  }
}