"use client";

import { useState } from "react";
import { Briefcase } from "lucide-react";
import EditJobModal from "./EditJobModal";
import { useRouter } from "next/navigation";
import { useJobActions } from "@/hooks/useJobActions";
import { JobCard } from "./JobCard";

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
  const { loadingJobId, handleKillJob, handleRestoreJob, handleDeleteJob } = useJobActions();

  const handleEdit = (job: Job) => {
    setSelectedJob(job);
    setIsEditModalOpen(true);
  };

  const handleJobAction = async (
    actionFn: (jobId: string) => Promise<boolean>,
    jobId: string
  ) => {
    const success = await actionFn(jobId);
    if (success) {
      router.refresh();
    }
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
          <JobCard
            key={job.id}
            job={job}
            userRole={userRole}
            loadingJobId={loadingJobId}
            onEdit={handleEdit}
            onKill={(jobId) => handleJobAction(handleKillJob, jobId)}
            onRestore={(jobId) => handleJobAction(handleRestoreJob, jobId)}
            onDelete={(jobId) => handleJobAction(handleDeleteJob, jobId)}
          />
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
        />
      )}
    </>
  );
}