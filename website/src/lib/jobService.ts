import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Job creation data interface
 */
export interface CreateJobData {
  job_title: string;
  department_id: number;
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
  if (!data.department_id) {
    return { valid: false, error: "Department is required" };
  }
  return { valid: true };
}

/**
 * Get all jobs with departments
 */
export async function getAllJobs() {
  try {
    return await prisma.job_position.findMany({
      include: {
        departments: true,
      },
      orderBy: {
        job_id: "desc",
      },
    });
  } catch (error) {
    console.error("Fetch Jobs Error:", error);
    return [];
  }
}

/**
 * Get all departments sorted by name
 */
export async function getAllDepartments() {
  try {
    return await prisma.departments.findMany({
      orderBy: {
        dept_name: "asc",
      },
    });
  } catch (error) {
    console.error("Fetch Departments Error:", error);
    return [];
  }
}

/**
 * Job filter criteria interface
 */
export interface JobFilterCriteria {
  searchKeyword?: string;      // ค้นหา title, description, requirements
  department?: string;          // filter by department name
  location?: string;            // filter by location
  employmentType?: string;      // FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP
  salaryMin?: number;          // filter salary range
  salaryMax?: number;
  isActive?: boolean;          // filter active/inactive
}

/**
 * Search and filter jobs
 */
export async function searchAndFilterJobs(criteria: JobFilterCriteria) {
  try {
    const where: any = {};

    // Keyword search - ค้นหาใน title, description, requirements
    if (criteria.searchKeyword) {
      where.OR = [
        { title: { contains: criteria.searchKeyword } },
        { description: { contains: criteria.searchKeyword } },
        { requirements: { contains: criteria.searchKeyword } },
      ];
    }

    // Filter by department
    if (criteria.department) {
      where.department = { contains: criteria.department };
    }

    // Filter by location
    if (criteria.location) {
      where.location = { contains: criteria.location };
    }

    // Filter by employment type
    if (criteria.employmentType) {
      where.employmentType = criteria.employmentType;
    }

    // Filter by salary range
    if (criteria.salaryMin !== undefined || criteria.salaryMax !== undefined) {
      where.AND = [];
      if (criteria.salaryMin !== undefined) {
        where.AND.push({ salary_min: { gte: criteria.salaryMin } });
      }
      if (criteria.salaryMax !== undefined) {
        where.AND.push({ salary_max: { lte: criteria.salaryMax } });
      }
    }

    // Filter by active status
    if (criteria.isActive !== undefined) {
      where.isActive = criteria.isActive;
    }

    const jobs = await prisma.job.findMany({
      where,
      include: {
        postedByUser: {
          select: {
            fullName: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
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
export async function getInactiveJobs() {
  try {
    return await prisma.job.findMany({
      where: {
        isActive: false,
      },
      include: {
        postedByUser: true,
      },
      orderBy: {
        killedAt: "desc",
      },
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
