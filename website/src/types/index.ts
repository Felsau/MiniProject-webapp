import { Job, Application } from "@prisma/client";

// สร้าง Type กลางสำหรับ Job ที่มีข้อมูล User และจำนวนผู้สมัครติดมาด้วย
export interface JobWithCount extends Job {
  postedByUser: {
    fullName: string | null;
    username: string;
  } | null;
  _count?: {
    applications: number;
  };
}