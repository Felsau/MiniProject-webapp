export type Job = {
  job_id: number;
  job_title: string;
  department_id: number | null;
  job_level: string | null;
  work_location: string | null;
  job_description: string | null;
  responsibilities: string | null;
  qualifications: string | null;
  special_conditions: string | null;
  hiring_count: number | null;
  employment_type: string | null;
  salary_min: number | null;
  salary_max: number | null;
  open_date: Date | null;
  close_date: Date | null;
  status: string | null;
  departments: {
    dept_id: number;
    dept_name: string;
  } | null;
};
