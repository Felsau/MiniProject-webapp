"use client";

type Department = {
  dept_id: number;
  dept_name: string;
};

type Props = {
  isOpen: boolean;
  jobTitle: string;
  department: number;
  jobLevel: string;
  location: string;
  description: string;
  responsibilities: string;
  qualifications: string;
  specialConditions: string;
  hiringCount: string;
  employmentType: string;
  salaryMin: string;
  salaryMax: string;
  closeDate: string;
  departments: Department[];

  onChangeTitle: (v: string) => void;
  onChangeDepartment: (v: number) => void;
  onChangeLevel: (v: string) => void;
  onChangeLocation: (v: string) => void;
  onChangeDescription: (v: string) => void;
  onChangeResponsibilities: (v: string) => void;
  onChangeQualifications: (v: string) => void;
  onChangeSpecialConditions: (v: string) => void;
  onChangeHiringCount: (v: string) => void;
  onChangeEmploymentType: (v: string) => void;
  onChangeSalaryMin: (v: string) => void;
  onChangeSalaryMax: (v: string) => void;
  onChangeCloseDate: (v: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};

const baseInput =
  "w-full rounded-xl border border-slate-300 bg-white " +
  "px-3 py-2 text-sm text-slate-800 " +
  "placeholder:text-slate-400 " +
  "focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 " +
  "transition";

const InputField = ({ label, value, onChange, type = "text" }: any) => (
  <div>
    <label className="text-sm font-medium text-slate-700 mb-1 block">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={baseInput}
    />
  </div>
);

const TextareaField = ({ label, value, onChange, rows = 3 }: any) => (
  <div>
    <label className="text-sm font-medium text-slate-700 mb-1 block">
      {label}
    </label>
    <textarea
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={baseInput}
    />
  </div>
);

<<<<<<< HEAD
export default function CreateJobModal(props: Props) {
  if (!props.isOpen) return null;
=======
  const TextareaField = ({ label, value, onChange, rows = 2, placeholder = "" }: any) => (
    <div className="col-span-full">
      <label className="mb-1 block font-semibold text-xs" style={{ color: '#1E293B' }}>{label}</label>
      <textarea
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 transition"
        style={{ borderColor: '#E2E8F0', color: '#0F172A' }}
        onFocus={(e) => (e.currentTarget.style.borderColor = '#2563EB', e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)')}
        onBlur={(e) => (e.currentTarget.style.borderColor = '#E2E8F0', e.currentTarget.style.boxShadow = 'none')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
>>>>>>> 8ab9276cbb00cae8bade172711b4b7576c8b0674

  return (
    <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center px-4 z-50">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          props.onSubmit();
        }}
        className="bg-[#F8FAFF] w-full max-w-2xl rounded-2xl p-6 shadow-xl"
      >
        <h2 className="text-xl font-semibold text-sky-600 mb-5">
          ➕ เพิ่มตำแหน่งงาน
        </h2>

<<<<<<< HEAD
        <InputField
          label="ชื่อตำแหน่ง"
          value={props.jobTitle}
          onChange={props.onChangeTitle}
        />

        <div className="grid grid-cols-2 gap-4 mt-4">
=======
        {/* SECTION 1: Basic Info */}
        <h3 className="mb-3 mt-4 text-xs font-semibold uppercase" style={{ color: '#38BDF8' }}>ข้อมูลพื้นฐาน</h3>
        <InputField label="ชื่อตำแหน่ง" value={jobTitle} onChange={onChangeTitle} placeholder="เช่น IT Support Officer, Marketing Manager" />
        
        <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
>>>>>>> 8ab9276cbb00cae8bade172711b4b7576c8b0674
          <div>
            <label className="text-sm font-medium text-slate-700">
              แผนก
            </label>
            <select
              value={props.department}
              onChange={(e) =>
                props.onChangeDepartment(Number(e.target.value))
              }
              className={baseInput}
            >
              <option value={0}>-- เลือกแผนก --</option>
              {props.departments.map((d) => (
                <option key={d.dept_id} value={d.dept_id}>
                  {d.dept_name}
                </option>
              ))}
            </select>
          </div>
<<<<<<< HEAD

          <InputField
            label="ระดับงาน"
            value={props.jobLevel}
            onChange={props.onChangeLevel}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <InputField
            label="สถานที่ทำงาน"
            value={props.location}
            onChange={props.onChangeLocation}
          />

=======
          <InputField label="ระดับงาน" value={jobLevel} onChange={onChangeLevel} placeholder="เช่น Officer, Senior, Manager" />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <InputField label="สถานที่ทำงาน" value={location} onChange={onChangeLocation} placeholder="เช่น สำนักงานใหญ่ (อาคาร A), On-site 100%" />
>>>>>>> 8ab9276cbb00cae8bade172711b4b7576c8b0674
          <div>
            <label className="text-sm font-medium text-slate-700">
              ประเภทการจ้างงาน
            </label>
            <select
              value={props.employmentType}
              onChange={(e) =>
                props.onChangeEmploymentType(e.target.value)
              }
              className={baseInput}
            >
              <option value="">-- เลือก --</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
        </div>

<<<<<<< HEAD
        <div className="grid grid-cols-3 gap-4 mt-4">
          <InputField
            label="จำนวนรับ"
            value={props.hiringCount}
            onChange={props.onChangeHiringCount}
            type="number"
          />
          <InputField
            label="เงินเดือนต่ำสุด"
            value={props.salaryMin}
            onChange={props.onChangeSalaryMin}
            type="number"
          />
          <InputField
            label="เงินเดือนสูงสุด"
            value={props.salaryMax}
            onChange={props.onChangeSalaryMax}
            type="number"
          />
        </div>

        <div className="mt-4 space-y-3">
          <TextareaField
            label="รายละเอียดงาน"
            value={props.description}
            onChange={props.onChangeDescription}
          />
          <TextareaField
            label="หน้าที่รับผิดชอบ"
            value={props.responsibilities}
            onChange={props.onChangeResponsibilities}
          />
          <TextareaField
            label="คุณสมบัติ"
            value={props.qualifications}
            onChange={props.onChangeQualifications}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
=======
        {/* SECTION 2: Employment & Salary */}
        <h3 className="mb-3 mt-5 text-xs font-semibold uppercase" style={{ color: '#38BDF8' }}>สัญญาและค่าตอบแทน</h3>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <InputField label="จำนวนรับ" value={hiringCount} onChange={onChangeHiringCount} type="number" placeholder="เช่น 3" />
          <div>
            <label className="mb-1 block font-semibold text-xs" style={{ color: '#1E293B' }}>เงินเดือนต่ำสุด</label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                placeholder="20000"
                className="w-[70%] rounded border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 transition"
                style={{ borderColor: '#E2E8F0', color: '#0F172A' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#2563EB', e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#E2E8F0', e.currentTarget.style.boxShadow = 'none')}
                value={salaryMin}
                onChange={(e) => onChangeSalaryMin(e.target.value)}
              />
              <span className="text-xs font-medium whitespace-nowrap" style={{ color: '#64748B' }}>บาท</span>
            </div>
          </div>
          <div>
            <label className="mb-1 block font-semibold text-xs" style={{ color: '#1E293B' }}>เงินเดือนสูงสุด</label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                placeholder="35000"
                className="w-[70%] rounded border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 transition"
                style={{ borderColor: '#E2E8F0', color: '#0F172A' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#2563EB', e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#E2E8F0', e.currentTarget.style.boxShadow = 'none')}
                value={salaryMax}
                onChange={(e) => onChangeSalaryMax(e.target.value)}
              />
              <span className="text-xs font-medium whitespace-nowrap" style={{ color: '#64748B' }}>บาท</span>
            </div>
          </div>
        </div>

        {/* SECTION 3: Job Details */}
        <h3 className="mb-3 mt-5 text-xs font-semibold uppercase" style={{ color: '#38BDF8' }}>รายละเอียดงาน</h3>
        <TextareaField label="คำอธิบายงาน" value={description} onChange={onChangeDescription} rows={5} placeholder="อธิบายบทบาทสำคัญและวิสัยทัศน์ของตำแหน่งนี้" />
        <div className="mt-3 mb-4">
          <TextareaField label="หน้าที่ความรับผิดชอบ" value={responsibilities} onChange={onChangeResponsibilities} rows={5} placeholder="รับแจ้งและแก้ไขปัญหา" />
        </div>
        <div className="mt-3 mb-4">
          <TextareaField label="คุณสมบัติผู้สมัคร" value={qualifications} onChange={onChangeQualifications} rows={5} placeholder="วุฒิการศึกษา: ปริญญาตรี" />
        </div>

        {/* SECTION 4: Management */}
        <h3 className="mb-3 mt-5 text-xs font-semibold uppercase" style={{ color: '#38BDF8' }}>การจัดการ</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <TextareaField label="เงื่อนไขพิเศษ/พนักงานภายใน" value={specialConditions} onChange={onChangeSpecialConditions} rows={1} placeholder="เป็นพนักงานประจำ (Passed Probation)..." />
          <InputField label="วันปิดรับสมัคร" value={closeDate} onChange={onChangeCloseDate} type="date" />
        </div>

        <div className="flex justify-end gap-2">
>>>>>>> 8ab9276cbb00cae8bade172711b4b7576c8b0674
          <button
            type="button"
            onClick={props.onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300 transition"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition"
          >
            บันทึก
          </button>
        </div>
      </form>
    </div>
  );
}
