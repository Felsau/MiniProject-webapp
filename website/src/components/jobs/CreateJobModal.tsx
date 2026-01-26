"use client";

type Props = {
  isOpen: boolean;

  jobTitle: string;
  department: string;
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
  departments: Array<{ dept_id: number; dept_name: string }>;

  onChangeTitle: (v: string) => void;
  onChangeDepartment: (v: string) => void;
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

export default function CreateJobModal({
  isOpen,
  jobTitle,
  department,
  jobLevel,
  location,
  description,
  responsibilities,
  qualifications,
  specialConditions,
  hiringCount,
  employmentType,
  salaryMin,
  salaryMax,
  closeDate,
  departments,
  onChangeTitle,
  onChangeDepartment,
  onChangeLevel,
  onChangeLocation,
  onChangeDescription,
  onChangeResponsibilities,
  onChangeQualifications,
  onChangeSpecialConditions,
  onChangeHiringCount,
  onChangeEmploymentType,
  onChangeSalaryMin,
  onChangeSalaryMax,
  onChangeCloseDate,
  onClose,
  onSubmit,
}: Props) {
  if (!isOpen) return null;

  console.log("Departments in modal:", departments);

  const InputField = ({ label, value, onChange, type = "text", placeholder = "" }: any) => (
    <div>
      <label className="mb-1 block font-semibold text-xs" style={{ color: '#1E293B' }}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 transition"
        style={{ borderColor: '#E2E8F0', color: '#0F172A' }}
        onFocus={(e) => (e.currentTarget.style.borderColor = '#2563EB', e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)')}
        onBlur={(e) => (e.currentTarget.style.borderColor = '#E2E8F0', e.currentTarget.style.boxShadow = 'none')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );

  const TextareaField = ({ label, value, onChange, rows = 2 }: any) => (
    <div className="col-span-full">
      <label className="mb-1 block font-semibold text-xs" style={{ color: '#1E293B' }}>{label}</label>
      <textarea
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-4 px-4" style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)' }}>
      <div className="w-full max-w-2xl rounded-xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#F8FAFC' }}>
        <h2 className="mb-6 text-lg font-bold sticky top-0 pb-4" style={{ color: '#2563EB', borderBottom: '2px solid #E2E8F0' }}>เพิ่มตำแหน่งงาน</h2>

        {/* SECTION 1: Basic Info */}
        <h3 className="mb-3 mt-4 text-xs font-semibold uppercase" style={{ color: '#38BDF8' }}>ข้อมูลพื้นฐาน</h3>
        <InputField label="ชื่อตำแหน่ง" value={jobTitle} onChange={onChangeTitle} />
        
        <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
          <div>
            <label className="mb-1 block font-semibold text-xs" style={{ color: '#1E293B' }}>แผนก</label>
            <select
              className="w-full rounded border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 transition"
              style={{ borderColor: '#E2E8F0', color: '#0F172A' }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#2563EB', e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#E2E8F0', e.currentTarget.style.boxShadow = 'none')}
              value={department}
              onChange={(e) => onChangeDepartment(e.target.value)}
            >
              <option value="">-- เลือกแผนก --</option>
              {departments && departments.length > 0 ? (
                departments.map((dept) => (
                  <option key={dept.dept_id} value={String(dept.dept_id)}>
                    {dept.dept_name}
                  </option>
                ))
              ) : (
                <option disabled>ไม่มีแผนกให้เลือก</option>
              )}
            </select>
          </div>
          <InputField label="ระดับงาน" value={jobLevel} onChange={onChangeLevel} />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <InputField label="สถานที่ทำงาน" value={location} onChange={onChangeLocation} />
          <div>
            <label className="mb-1 block font-semibold text-xs" style={{ color: '#1E293B' }}>ประเภทการจ้างงาน</label>
            <select
              className="w-full rounded border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 transition"
              style={{ borderColor: '#E2E8F0', color: '#0F172A' }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#2563EB', e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#E2E8F0', e.currentTarget.style.boxShadow = 'none')}
              value={employmentType}
              onChange={(e) => onChangeEmploymentType(e.target.value)}
            >
              <option value="">-- เลือกประเภท --</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
        </div>

        {/* SECTION 2: Employment & Salary */}
        <h3 className="mb-3 mt-5 text-xs font-semibold uppercase" style={{ color: '#38BDF8' }}>สัญญาและค่าตอบแทน</h3>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <InputField label="จำนวนรับ" value={hiringCount} onChange={onChangeHiringCount} type="number" />
          <div>
            <label className="mb-1 block font-semibold text-xs" style={{ color: '#1E293B' }}>เงินเดือนต่ำสุด</label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                placeholder="0"
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
                placeholder="0"
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
        <TextareaField label="คำอธิบายงาน" value={description} onChange={onChangeDescription} rows={5} />
        <div className="mt-3 mb-4">
          <TextareaField label="หน้าที่ความรับผิดชอบ" value={responsibilities} onChange={onChangeResponsibilities} rows={5} />
        </div>
        <div className="mt-3 mb-4">
          <TextareaField label="คุณสมบัติผู้สมัคร" value={qualifications} onChange={onChangeQualifications} rows={5} />
        </div>

        {/* SECTION 4: Management */}
        <h3 className="mb-3 mt-5 text-xs font-semibold uppercase" style={{ color: '#38BDF8' }}>การจัดการ</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <TextareaField label="เงื่อนไขพิเศษ/พนักงานภายใน" value={specialConditions} onChange={onChangeSpecialConditions} rows={1} />
          <InputField label="วันปิดรับสมัคร" value={closeDate} onChange={onChangeCloseDate} type="date" />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded px-4 py-2 text-sm"
            style={{ backgroundColor: '#E2E8F0', color: '#1E293B' }}
          >
            ยกเลิก
          </button>

          <button
            onClick={onSubmit}
            className="rounded px-4 py-2 text-white font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#2563EB' }}
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
}
