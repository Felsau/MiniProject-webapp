"use client";

import { useState } from "react";
import { MapPin, Briefcase, Trash2, Edit2, DollarSign, Calendar, User, Power, RotateCcw } from "lucide-react";
import EditJobModal from "./EditJobModal";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Job {
  id: string;
  title: string;
  description: string | null;
  department: string | null;
  location: string | null;
  salary: string | null;
  employmentType: string;
  requirements: string | null;
  responsibilities: string | null;
  benefits: string | null;
  createdAt: Date;
  isActive: boolean;
  killedAt: Date | null;
  postedByUser: {
    fullName: string | null;
    username: string;
  } | null;
}

interface JobListProps {
  jobs: Job[];
  userRole?: string;
  showInactive?: boolean;
}

export default function JobList({ jobs, userRole, showInactive = false }: JobListProps) {
  const router = useRouter();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loadingJobId, setLoadingJobId] = useState<string | null>(null);

  const handleKillJob = async (jobId: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะปิดประกาศงานนี้?")) return;

    setLoadingJobId(jobId);
    try {
      const res = await fetch(`/api/job/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "kill" }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("ไม่สามารถปิดประกาศงานได้");
      }
    } catch (_error) {
      alert("เกิดข้อผิดพลาด");
    } finally {
      setLoadingJobId(null);
    }
  };

  const handleRestoreJob = async (jobId: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะเปิดประกาศงานนี้อีกครั้ง?")) return;

    setLoadingJobId(jobId);
    try {
      const res = await fetch(`/api/job/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore" }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("ไม่สามารถเปิดประกาศงานได้");
      }
    } catch (_error) {
      alert("เกิดข้อผิดพลาด");
    } finally {
      setLoadingJobId(null);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบงานนี้ถาวร?")) return;

    try {
      const res = await fetch(`/api/job/${jobId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("ไม่สามารถลบงานได้");
      }
    } catch (_error) {
      alert("เกิดข้อผิดพลาด");
    }
  };

  const handleEdit = (job: Job) => {
    setSelectedJob(job);
    setIsEditModalOpen(true);
  };

  const getEmploymentTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      FULL_TIME: "เต็มเวลา",
      PART_TIME: "พาร์ทไทม์",
      CONTRACT: "สัญญาจ้าง",
      INTERNSHIP: "ฝึกงาน",
    };
    return labels[type] || type;
  };

  // Filter jobs based on showInactive prop
  const filteredJobs = showInactive ? jobs : jobs.filter((job) => job.isActive);

  if (filteredJobs.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-10 text-center border border-gray-200 border-dashed">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="text-gray-400" size={32} />
        </div>
        <p className="text-gray-500 text-lg font-medium">ยังไม่มีตำแหน่งงานในขณะนี้</p>
        <p className="text-gray-400 text-sm mt-1">ลองเพิ่มประกาศงานใหม่ดูสิ</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className={`group bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full relative ${
              job.isActive 
                ? "border-gray-200" 
                : "border-yellow-200 bg-yellow-50"
            }`}
          >
            {/* 1. ส่วนหัว: ชื่อตำแหน่ง + ปุ่ม Action */}
            <div className="flex justify-between items-start mb-3 pr-8">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1" title={job.title}>
                    {job.title}
                  </h3>
                  {!job.isActive && (
                    <span className="px-2 py-0.5 bg-yellow-200 text-yellow-800 text-xs font-semibold rounded">
                      ปิดแล้ว
                    </span>
                  )}
                </div>

                {/* ปุ่มแก้ไข/ลบ/Kill/Restore */}
                {(userRole === "HR" || userRole === "ADMIN") && (
                    <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1 rounded-lg shadow-sm border border-gray-100 z-10">
                        {job.isActive ? (
                          <>
                            <button
                              onClick={() => handleEdit(job)}
                              className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition disabled:opacity-50"
                              title="แก้ไข"
                              disabled={loadingJobId === job.id}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleKillJob(job.id)}
                              className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-md transition disabled:opacity-50"
                              title="ปิดประกาศงาน"
                              disabled={loadingJobId === job.id}
                            >
                              <Power size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(job.id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition disabled:opacity-50"
                              title="ลบถาวร"
                              disabled={loadingJobId === job.id}
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleRestoreJob(job.id)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition disabled:opacity-50"
                              title="เปิดประกาศงานอีกครั้ง"
                              disabled={loadingJobId === job.id}
                            >
                              <RotateCcw size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(job.id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition disabled:opacity-50"
                              title="ลบถาวร"
                              disabled={loadingJobId === job.id}
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                    </div>
                )}
            </div>

            {/* 2. Tags ข้อมูล (แผนก, สถานที่, เงินเดือน) */}
            <div className="space-y-2 mb-4 text-sm text-gray-500">
                {job.department && (
                  <div className="flex items-center gap-2">
                    <Briefcase size={14} className="text-gray-400" />
                    <span>{job.department}</span>
                  </div>
                )}
                {job.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-gray-400" />
                    <span>{job.location}</span>
                  </div>
                )}
                {job.salary && (
                  <div className="flex items-center gap-2 font-medium text-emerald-600">
                    <DollarSign size={14} />
                    <span>{job.salary}</span>
                  </div>
                )}
            </div>

            {/* 3. Badge ประเภทงาน */}
            <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full border border-blue-100">
                  {getEmploymentTypeLabel(job.employmentType)}
                </span>
            </div>

            {/* 4. คำอธิบายงาน (ใช้ flex-grow ดันส่วน footer ลงล่างสุด) */}
            <div className="mb-6 flex-grow">
               {job.description ? (
                  <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                    {job.description}
                  </p>
               ) : (
                  <p className="text-gray-400 text-sm italic">ไม่มีรายละเอียด</p>
               )}
            </div>

            {/* 5. Footer: คนโพสต์ & วันที่ */}
            <div className="pt-4 border-t border-gray-100 text-xs text-gray-400 flex justify-between items-center mt-auto">
                <div className="flex items-center gap-1.5" title={job.postedByUser?.fullName || job.postedByUser?.username}>
                   <User size={12} />
                   <span className="max-w-[80px] truncate">{job.postedByUser?.fullName || job.postedByUser?.username || "Admin"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                   <Calendar size={12} />
                   <span>{new Date(job.createdAt).toLocaleDateString("th-TH")}</span>
                   {job.killedAt && (
                     <span className="ml-2" title="วันที่ปิด">
                       • {new Date(job.killedAt).toLocaleDateString("th-TH")}
                     </span>
                   )}
                </div>
            </div>

        </div>
      ))}
    </div>

    {selectedJob && (
      <EditJobModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedJob(null);
        }}
        job={selectedJob}
        onSuccess={() => {
          setIsEditModalOpen(false);
          setSelectedJob(null);
          router.refresh();
        }}
      />
    )}
    </>
  );
}