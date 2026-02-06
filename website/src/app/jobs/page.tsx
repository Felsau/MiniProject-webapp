"use client";

import { useEffect, useState } from "react";
import { Briefcase } from "lucide-react";
import { JobFilterComponent } from "@/components/recruitment/JobFilterComponent";
import { useJobFilter, useFilteredJobs } from "@/hooks/useJobFilter";
import type { JobFilterCriteria } from "@/lib/jobService";
import { JobCard } from "@/components/recruitment/JobCard"; // ✅ เรียกใช้ JobCard ที่เราทำไว้

interface FilterOptions {
  departments: string[];
  locations: string[];
  employmentTypes: { value: string; label: string }[];
}

export default function JobsPage() {
  const { jobs, loading, error, fetchJobs } = useFilteredJobs();
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    departments: [],
    locations: [],
    employmentTypes: [],
  });
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const response = await fetch("/api/job/filter-options");
        if (response.ok) {
          const data = await response.json();
          setFilterOptions(data);
        }
      } catch (err) {
        console.error("Error loading filter options:", err);
      } finally {
        setOptionsLoading(false);
      }
    };

    loadFilterOptions();
    fetchJobs({});
  }, [fetchJobs]);

  const handleFilterChange = (newFilters: JobFilterCriteria) => {
    fetchJobs(newFilters);
  };

  const handleApply = async (jobId: string, jobTitle: string) => {
    if (!confirm(`ยืนยันที่จะสมัครตำแหน่ง "${jobTitle}" ใช่หรือไม่?`)) return;

    setApplyingJobId(jobId);
    try {
      const res = await fetch("/api/application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "สมัครไม่สำเร็จ");

      alert(`🎉 สมัครงาน "${jobTitle}" สำเร็จเรียบร้อย!`);
    } catch (error: any) {
      console.error(error);
      alert("❌ " + error.message);
    } finally {
      setApplyingJobId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ค้นหางาน</h1>
          <p className="text-gray-600">ค้นหาตำแหน่งงานที่เหมาะสมกับคุณ</p>
        </div>

        {/* Filter Component */}
        {!optionsLoading && (
          <JobFilterComponent
            onFilterChange={handleFilterChange}
            options={filterOptions}
          />
        )}

        {/* Jobs List */}
        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center border border-gray-200 border-dashed">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="text-gray-400" size={32} />
            </div>
            <p className="text-gray-500 text-lg font-medium">ไม่พบตำแหน่งงานที่ค้นหา</p>
            <p className="text-gray-400 text-sm mt-1">ลองค้นหาด้วยคำอื่น หรือปรับเปลี่ยนตัวกรอง</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              /* ✅ ตรงนี้แหละครับที่เปลี่ยน! เราใช้ JobCard แทน div ก้อนใหญ่ๆ */
              <JobCard
                key={job.id}
                job={job}
                userRole="USER"
                isApplying={applyingJobId === job.id}
                onApply={() => handleApply(job.id, job.title)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}