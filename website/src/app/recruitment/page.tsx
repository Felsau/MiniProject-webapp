import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getAllJobs } from "@/lib/jobService"; 
import JobList from "@/components/recruitment/JobList"; // ✅ เรียกใช้ JobList ตัวใหม่
import AddJobModal from "@/components/recruitment/AddJobModal";
import { Briefcase, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function RecruitmentPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const userRole = (session.user as { role?: string })?.role;

  // 1. ดึงข้อมูลงานทั้งหมดจาก Database
  const jobs = await getAllJobs();
  
  // 2. คำนวณสถิติเบื้องต้น
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(j => j.isActive).length;

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              ระบบจัดหางาน
            </h1>
            <p className="text-gray-600 text-lg">จัดการตำแหน่งงานและรับสมัครพนักงานใหม่</p>
          </div>
          
          {/* ปุ่มเพิ่มงาน */}
          <AddJobModal />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
                <Briefcase className="text-blue-600"/> 
                <span className="font-bold text-gray-700">งานทั้งหมด</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalJobs}</p>
         </div>
         <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="text-green-600"/> 
                <span className="font-bold text-gray-700">กำลังเปิดรับ</span>
            </div>
            <p className="text-3xl font-bold text-green-600">{activeJobs}</p>
         </div>
      </div>

      {/* Job List Container */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6">
          {/* ✅ ส่งแค่ jobs กับ userRole พอ (ไม่ต้องส่ง jobId หรือฟังก์ชันอื่น) */}
          <JobList jobs={jobs} userRole={userRole} />
        </div>
      </div>
    </div>
  );
}