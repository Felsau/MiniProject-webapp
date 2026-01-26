"use client";

import { useEffect, useState } from "react";
import JobGrid from "@/components/jobs/JobGrid";
import CreateJobModal from "@/components/jobs/CreateJobModal";
import { getJobsAction, createJobAction, getDepartmentsAction } from "@/actions/jobActions";
import { Job } from "@/components/jobs/types";

export default function Page() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [departments, setDepartments] = useState<Array<{ dept_id: number; dept_name: string }>>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [jobTitle, setJobTitle] = useState("");
  const [departmentId, setDepartmentId] = useState<number | "">("");
  const [jobLevel, setJobLevel] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [specialConditions, setSpecialConditions] = useState("");
  const [hiringCount, setHiringCount] = useState("1");
  const [employmentType, setEmploymentType] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [closeDate, setCloseDate] = useState("");

  const fetchJobs = async () => {
    const data = await getJobsAction();
    setJobs(data as Job[]);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Loading data...");
        const jobsData = await getJobsAction();
        const departmentsData = await getDepartmentsAction();
        console.log("Jobs Data:", jobsData);
        console.log("Departments Data:", departmentsData);
        console.log("Departments type:", typeof departmentsData);
        setJobs(jobsData as Job[]);
        setDepartments(departmentsData as Array<{ dept_id: number; dept_name: string }>);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, []);

  const handleCreateJob = async () => {
    if (!departmentId) {
      alert("Please select a department");
      return;
    }

    await createJobAction({
      job_title: jobTitle,
      department_id: Number(departmentId),
      job_level: jobLevel,
      work_location: location,
      job_description: description,
      responsibilities,
      qualifications,
      special_conditions: specialConditions,
      hiring_count: hiringCount ? Number(hiringCount) : 1,
      employment_type: employmentType,
      salary_min: salaryMin ? Number(salaryMin) : undefined,
      salary_max: salaryMax ? Number(salaryMax) : undefined,
      close_date: closeDate,
    });

    setJobTitle("");
    setDepartmentId("");
    setJobLevel("");
    setLocation("");
    setDescription("");
    setResponsibilities("");
    setQualifications("");
    setSpecialConditions("");
    setHiringCount("1");
    setEmploymentType("");
    setSalaryMin("");
    setSalaryMax("");
    setCloseDate("");
    setIsModalOpen(false);

    fetchJobs();
  };

  return (
    <div className="min-h-screen p-10" style={{ backgroundColor: '#F8FAFC' }}>
      <h1 className="mb-4 text-3xl font-bold" style={{ color: '#0F172A' }}>ระบบรับสมัครงาน</h1>

      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-6 rounded px-5 py-2 font-semibold text-white hover:opacity-90"
        style={{ backgroundColor: '#2563EB' }}
      >
        + เพิ่มตำแหน่งงาน
      </button>

      <JobGrid jobs={jobs} />

      <CreateJobModal
        isOpen={isModalOpen}
        jobTitle={jobTitle}
        department={departmentId === "" ? "" : String(departmentId)}
        jobLevel={jobLevel}
        location={location}
        description={description}
        responsibilities={responsibilities}
        qualifications={qualifications}
        specialConditions={specialConditions}
        hiringCount={hiringCount}
        employmentType={employmentType}
        salaryMin={salaryMin}
        salaryMax={salaryMax}
        closeDate={closeDate}
        departments={departments}
        onChangeTitle={setJobTitle}
        onChangeDepartment={(v) => setDepartmentId(v === "" ? "" : Number(v))}
        onChangeLevel={setJobLevel}
        onChangeLocation={setLocation}
        onChangeDescription={setDescription}
        onChangeResponsibilities={setResponsibilities}
        onChangeQualifications={setQualifications}
        onChangeSpecialConditions={setSpecialConditions}
        onChangeHiringCount={setHiringCount}
        onChangeEmploymentType={setEmploymentType}
        onChangeSalaryMin={setSalaryMin}
        onChangeSalaryMax={setSalaryMax}
        onChangeCloseDate={setCloseDate}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateJob}
      />
    </div>
  );
}
