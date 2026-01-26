"use client";

import { useState } from "react";
import { Job } from "./types";

type Props = {
  jobs: Job[];
};

export default function JobGrid({ jobs }: Props) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {jobs.map((job) => (
          <div
            key={job.job_id}
            onClick={() => setSelectedJob(job)}
            className="cursor-pointer rounded-lg p-4 hover:shadow-lg transition-shadow"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', color: '#0F172A' }}
          >
            <div className="font-bold" style={{ color: '#2563EB' }}>{job.job_title}</div>
            <div className="text-sm" style={{ color: '#475569' }}>{job.departments?.dept_name || "N/A"}</div>
            <div className="text-xs" style={{ color: '#64748B' }}>{job.work_location}</div>
          </div>
        ))}
      </div>

      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-8" style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)' }}>
          <div className="w-2xl rounded-lg p-6 shadow-xl" style={{ backgroundColor: '#F8FAFC' }}>
            <h2 className="mb-4 text-2xl font-bold" style={{ color: '#2563EB' }}>
              {selectedJob.job_title}
            </h2>

            <div className="mb-4 space-y-2 border-b pb-4">
              <p><strong className="text-gray-700">แผนก:</strong> {selectedJob.departments?.dept_name || "N/A"}</p>
              <p><strong className="text-gray-700">ระดับ:</strong> {selectedJob.job_level || "N/A"}</p>
              <p><strong className="text-gray-700">สถานที่:</strong> {selectedJob.work_location || "N/A"}</p>
              <p><strong className="text-gray-700">ประเภทการจ้าง:</strong> {selectedJob.employment_type || "N/A"}</p>
              <p><strong className="text-gray-700">จำนวนที่เปิดรับ:</strong> {selectedJob.hiring_count || 1}</p>
              {selectedJob.salary_min && selectedJob.salary_max && (
                <p><strong className="text-gray-700">เงินเดือน:</strong> {selectedJob.salary_min.toLocaleString()} - {selectedJob.salary_max.toLocaleString()} บาท</p>
              )}
            </div>

            <div className="mb-4">
              <h3 className="mb-2 font-bold text-gray-800">เกี่ยวกับบทบาทนี้</h3>
              <p className="text-sm text-gray-600">{selectedJob.job_description}</p>
            </div>

            <div className="mb-4">
              <h3 className="mb-2 font-bold text-gray-800">หน้าที่ความรับผิดชอบ</h3>
              <p className="text-sm whitespace-pre-wrap text-gray-600">{selectedJob.responsibilities}</p>
            </div>

            <div className="mb-4">
              <h3 className="mb-2 font-bold text-gray-800">คุณสมบัติผู้สมัคร</h3>
              <p className="text-sm whitespace-pre-wrap text-gray-600">{selectedJob.qualifications}</p>
            </div>

            {selectedJob.special_conditions && (
              <div className="mb-4">
                <h3 className="mb-2 font-bold text-gray-800">เงื่อนไขพิเศษ</h3>
                <p className="text-sm whitespace-pre-wrap text-gray-600">{selectedJob.special_conditions}</p>
              </div>
            )}

            {selectedJob.close_date && (
              <p className="mb-4 text-sm text-gray-600">
                <strong className="text-gray-700">วันปิดรับสมัคร:</strong> {new Date(selectedJob.close_date).toLocaleDateString('th-TH')}
              </p>
            )}

            <div className="text-right">
              <button
                onClick={() => setSelectedJob(null)}
                className="rounded px-4 py-2 text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#38BDF8' }}
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
