"use client";

import { useState } from "react";
import JobGrid from "@/components/jobs/JobGrid";
import CreateJobModal from "@/components/jobs/CreateJobModal";
import { Job } from "@/components/jobs/types";

export default function AboutPage() {
  /* =======================
     State
  ======================= */
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState("");

  /* =======================
     Logic
  ======================= */
  const handleCreateJob = () => {
    if (!jobTitle.trim()) return;


    setJobs((prev) => [
      {
        id: Date.now(),
        title: jobTitle,
      },
      ...prev,
    ]);

    setJobTitle("");
    setIsModalOpen(false);
  };

  /* =======================
     Render
  ======================= */
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black
                    flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        สมัครงาน
      </h1>

      <button
        onClick={() => setIsModalOpen(true)}
        className="rounded-full bg-black px-6 py-3 text-white
                   hover:bg-zinc-800 dark:bg-white dark:text-black"
      >
        เพิ่มตำแหน่งงาน
      </button>

      <JobGrid jobs={jobs} />

      <CreateJobModal
        isOpen={isModalOpen}
        jobTitle={jobTitle}
        onChangeTitle={setJobTitle}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateJob}
      />
    </div>
  );
}
