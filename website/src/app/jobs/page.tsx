"use client";

import { useEffect, useState } from "react";
import { Briefcase, Calendar, DollarSign, MapPin, User, Bookmark } from "lucide-react";
import { JobFilterComponent } from "@/components/recruitment/JobFilterComponent";
import { useJobFilter, useFilteredJobs } from "@/hooks/useJobFilter";
import type { JobFilterCriteria } from "@/lib/jobService";

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
  postedByUser: {
    fullName: string | null;
    username: string;
  } | null;
}

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

  // Load filter options on mount
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
    // Load initial jobs
    fetchJobs({});
  }, [fetchJobs]);

  const getEmploymentTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      FULL_TIME: "เต็มเวลา",
      PART_TIME: "พาร์ทไทม์",
      CONTRACT: "สัญญาจ้าง",
      INTERNSHIP: "ฝึกงาน",
    };
    return labels[type] || type;
  };

  const handleFilterChange = (newFilters: JobFilterCriteria) => {
    fetchJobs(newFilters);
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
            <p className="text-gray-500 text-lg font-medium">
              ไม่พบตำแหน่งงานที่ค้นหา
            </p>
            <p className="text-gray-400 text-sm mt-1">
              ลองค้นหาด้วยคำอื่น หรือปรับเปลี่ยนตัวกรอง
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="group bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2" title={job.title}>
                  {job.title}
                </h3>
                
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

                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full border border-blue-100">
                    {getEmploymentTypeLabel(job.employmentType)}
                  </span>
                </div>

                {job.description && (
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                    {job.description}
                  </p>
                )}

                <div className="pt-4 border-t border-gray-100 text-xs text-gray-400 flex justify-between items-center mb-4">
                  <div className="flex items-center gap-1.5">
                    <User size={12} />
                    <span className="truncate">{job.postedByUser?.fullName || job.postedByUser?.username || "Admin"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    <span>{new Date(job.createdAt).toLocaleDateString("th-TH")}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                    สมัครงาน
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition" title="บันทึกงาน">
                    <Bookmark size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
