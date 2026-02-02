"use client";

import { MapPin, Briefcase, Trash2, Edit2, DollarSign, Calendar, User, Power, RotateCcw } from "lucide-react";
import { getEmploymentTypeLabel } from "@/utils/jobListHelpers";

interface Job {
  id: string;
  title: string;
  description: string | null;
  department: string | null;
  location: string | null;
  salary: string | null;
  employmentType: string;
  createdAt: Date;
  isActive: boolean;
  killedAt: Date | null;
  postedByUser: {
    fullName: string | null;
    username: string;
  } | null;
}

interface JobCardProps {
  job: Job;
  userRole?: string;
  loadingJobId: string | null;
  onEdit: (job: Job) => void;
  onKill: (jobId: string) => Promise<boolean>;
  onRestore: (jobId: string) => Promise<boolean>;
  onDelete: (jobId: string) => Promise<boolean>;
}

export function JobCard({
  job,
  userRole,
  loadingJobId,
  onEdit,
  onKill,
  onRestore,
  onDelete,
}: JobCardProps) {
  return (
    <div
      className={`group bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full relative ${
        job.isActive ? "border-gray-200" : "border-yellow-200 bg-yellow-50"
      }`}
    >
      {/* Header: Title + Action Buttons */}
      <div className="flex justify-between items-start mb-3 pr-8">
        <div className="flex items-center gap-2">
          <h3
            className="text-xl font-extrabold text-gray-900 line-clamp-2 leading-tight"
            title={job.title}
          >
            {job.title}
          </h3>
          {!job.isActive && (
            <span className="px-2 py-0.5 bg-yellow-200 text-yellow-800 text-xs font-semibold rounded">
              ปิดแล้ว
            </span>
          )}
        </div>

        {/* Action Buttons */}
        {(userRole === "HR" || userRole === "ADMIN") && (
          <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1 rounded-lg shadow-sm border border-gray-100 z-10">
            {job.isActive ? (
              <>
                <button
                  onClick={() => onEdit(job)}
                  className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition disabled:opacity-50"
                  title="แก้ไข"
                  disabled={loadingJobId === job.id}
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => onKill(job.id)}
                  className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-md transition disabled:opacity-50"
                  title="ปิดประกาศงาน"
                  disabled={loadingJobId === job.id}
                >
                  <Power size={16} />
                </button>
                <button
                  onClick={() => onDelete(job.id)}
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
                  onClick={() => onRestore(job.id)}
                  className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition disabled:opacity-50"
                  title="เปิดประกาศงานอีกครั้ง"
                  disabled={loadingJobId === job.id}
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  onClick={() => onDelete(job.id)}
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

      {/* Job Info Tags */}
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

      {/* Employment Type Badge */}
      <div className="mb-4">
        <span className="inline-block px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-full shadow-sm border border-blue-700">
          {getEmploymentTypeLabel(job.employmentType)}
        </span>
      </div>

      {/* Description */}
      <div className="mb-6 flex-grow">
        {job.description ? (
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
            {job.description}
          </p>
        ) : (
          <p className="text-gray-400 text-sm italic">ไม่มีรายละเอียด</p>
        )}
      </div>

      {/* Footer: Posted By & Date */}
      <div className="pt-4 border-t border-gray-100 text-xs text-gray-400 flex justify-between items-center mt-auto">
        <div
          className="flex items-center gap-1.5"
          title={job.postedByUser?.fullName || job.postedByUser?.username}
        >
          <User size={12} />
          <span className="max-w-[80px] truncate">
            {job.postedByUser?.fullName || job.postedByUser?.username || "Admin"}
          </span>
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
  );
}
