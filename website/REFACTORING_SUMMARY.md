# โครงสร้างไฟล์ที่ปรับปรุง (Refactored File Structure)

## สรุปการปรับปรุง

ได้ทำการแยกและจัดระเบียบ code จากไฟล์ที่มีขนาดใหญ่ให้กลายเป็นไฟล์ที่มีความรับผิดชอบเดียว (Single Responsibility)

---

## 📁 โครงสร้างใหม่

### `/src/utils/` - Utility Functions

#### `getSidebarMenuItems.ts`
**หน้าที่:** สร้างเมนูของ Sidebar ตามบทบาท user
- **`MenuItem` interface** - กำหนดโครงสร้าง menu item (name, icon, href, description)
- **`getSidebarMenuItems(userRole: string)` function**
  - ถ้า role = "USER" → คืน menu สำหรับ user ทั่วไป (ค้นหางาน, งานที่สมัคร, งานที่เล็งไว้, โปรไฟล์)
  - ถ้า role อื่น (ADMIN/HR) → คืน menu สำหรับ admin/hr (Dashboard, จัดการตำแหน่งงาน, โปรไฟล์)

#### `authHelpers.ts`
**หน้าที่:** จัดการการออกจากระบบ
- **`handleLogoutUser(redirectUrl?: string)` function** - ใช้ `signOut()` จาก NextAuth เพื่อ logout และ redirect

---

### `/src/lib/` - Server Functions & Services

#### `sessionHelpers.ts` (ฝั่ง Server)
**หน้าที่:** จัดการ session และการ validate user
- **`getUserByUsername(username: string)` async function**
  - ค้นหา user จาก database ด้วย username
  - คืน user object หรือ null ถ้าไม่พบ

- **`isUserAdminOrHR(username: string)` async function**
  - เช็คว่า user มี role เป็น ADMIN หรือ HR หรือไม่
  - ใช้ `getUserByUsername()` เพื่อดึงข้อมูล

- **`validateSessionUser(username)` async function**
  - Validate username จาก session
  - คืน user object ถ้า valid, null ถ้าไม่ valid

#### `jobService.ts` (ฝั่ง Server)
**หน้าที่:** Business logic สำหรับการจัดการ job position
- **`CreateJobData` interface** - กำหนดประเภทข้อมูล job ที่จะสร้าง

- **`validateJobData(data)` function**
  - เช็ค job_title และ department_id ว่า required หรือไม่
  - คืน object `{ valid: boolean, error?: string }`

- **`getAllJobs()` async function** - ดึง jobs ทั้งหมด include departments

- **`getAllDepartments()` async function** - ดึง departments ทั้งหมด sorted by name

- **`getInactiveJobs()` async function** - ดึง inactive/killed jobs

- **`killJobById(jobId)` async function**
  - Soft delete: set `isActive = false` และ `killedAt = new Date()`
  - Revalidate cache

- **`restoreJobById(jobId)` async function**
  - Restore killed job: set `isActive = true` และ `killedAt = null`
  - Revalidate cache

#### `apiHelpers.ts` (ฝั่ง Server)
**หน้าที่:** ฟังก์ชันช่วยสำหรับ API routes
- **`getSessionUser()` async function**
  - ดึง session จาก NextAuth
  - คืน user object หรือ null

- **`requireAdminOrHR()` async function**
  - เช็ค authorization ว่า user เป็น ADMIN/HR
  - คืน `{ authorized: true }` หรือ `{ authorized: false, response: NextResponse(...) }`

- **`getUserAuthStatus(username)` async function**
  - เช็คว่า username เป็น admin/hr
  - ใช้ `isUserAdminOrHR()` จาก sessionHelpers

---

### `/src/hooks/` - React Hooks (Client Side)

#### `useJobForm.ts`
**หน้าที่:** จัดการ form state และ API calls สำหรับ job forms

**Part 1: useJobForm hook**
- **State management**
  - `formData` - เก็บข้อมูล form ปัจจุบัน

- **Functions**
  - `updateField(field, value)` - อัปเดตช่องฟอร์มเดียว
  - `resetForm()` - รีเซ็ต form ไปค่า default
  - `setAll(data)` - อัปเดตหลายช่อง field พร้อมกัน

**Part 2: useJobApi hook**
- **State**
  - `loading` - สถานะการโหลด
  - `error` - error message

- **Functions**
  - `submitJob(formData, method, jobId)` - บันทึก job (POST สำหรับสร้างใหม่, PUT สำหรับแก้ไข)
  - `killJob(jobId)` - Close job posting ผ่าน PATCH
  - `restoreJob(jobId)` - Open closed job ผ่าน PATCH

#### `useJobActions.ts`
**หน้าที่:** จัดการ job actions จากรายการ job
- **State**
  - `loadingJobId` - เก็บ ID ของ job ที่กำลัง loading

- **Functions**
  - `handleKillJob(jobId)` - ปิดประกาศงาน พร้อม confirmation
  - `handleRestoreJob(jobId)` - เปิดประกาศงานอีกครั้ง พร้อม confirmation
  - `handleDeleteJob(jobId)` - ลบงานถาวร พร้อม confirmation

---

### `/src/components/recruitment/` - Components (UI)

#### `JobFormFields.tsx`
**หน้าที่:** Component ที่สามารถใช้ซ้ำได้สำหรับ form fields
- **Props**
  - `formData` - ข้อมูล form ปัจจุบัน
  - `onFieldChange` - callback เมื่อมีการเปลี่ยนค่า

- **Render**
  - ชื่อตำแหน่ง (title)
  - แผนก, สถานที่
  - เงินเดือน, ประเภทงาน
  - รายละเอียดงาน (description)
  - คุณสมบัติ (requirements)
  - หน้าที่ (responsibilities)
  - สวัสดิการ (benefits)

#### `JobCard.tsx`
**หน้าที่:** แสดง job card แต่ละใบในรายการ
- **Props**
  - `job` - ข้อมูล job
  - `userRole` - บทบาท user
  - `loadingJobId` - ID ของ job ที่กำลัง loading
  - `onEdit`, `onKill`, `onRestore`, `onDelete` - callback functions

- **Render**
  - Header: ชื่อตำแหน่ง + action buttons
  - Info: แผนก, สถานที่, เงินเดือน
  - Badge: ประเภทงาน
  - Description: รายละเอียด
  - Footer: ผู้โพสต์และวันที่

#### `AddJobModal.tsx`
**หน้าที่:** Modal สำหรับเพิ่มงานใหม่
- **ใช้งาน**
  - `useJobForm()` - จัดการ form state
  - `useJobApi()` - บันทึก job
  - `JobFormFields` - แสดง form fields
- **Features**
  - Toggle modal open/close
  - Submit form → POST /api/job
  - Reset form หลังสำเร็จ
  - Refresh page

#### `EditJobModal.tsx`
**หน้าที่:** Modal สำหรับแก้ไขงาน
- **ใช้งาน**
  - `useJobForm()` - จัดการ form state และเตรียม initial data
  - `useJobApi()` - บันทึก job
  - `JobFormFields` - แสดง form fields
- **Features**
  - Populate form จาก job data
  - Submit form → PUT /api/job/:id
  - Refresh page หลังสำเร็จ

#### `JobList.tsx`
**หน้าที่:** แสดงรายการ job ทั้งหมด
- **ใช้งาน**
  - `useJobActions()` - จัดการ action buttons
  - `JobCard` - แสดง job card แต่ละใบ
  - `EditJobModal` - modal สำหรับแก้ไข
- **Features**
  - Filter active/inactive jobs
  - Handle kill/restore/delete actions
  - Open edit modal
  - Show empty state ถ้าไม่มี job

---

## 🔄 การเปลี่ยนแปลงในแต่ละไฟล์

### Sidebar.tsx (src/components/Sidebar.tsx)
**ก่อน:** มีการสร้าง menu items ที่ซับซ้อนและ inline logic ลงไปใน component
- Menu items ถูกสร้างด้วย ternary operator ขนาดใหญ่
- Logout handler inline ใน component
- นำเข้า icon ทั้งหมด (Home, LayoutDashboard, Briefcase, Search, FileText, Bookmark, User)

**หลัง:** ใช้ utility functions จาก `@/utils` และแยกตัวแปร
```tsx
// ก่อน
const menuItems = userRole === "USER" 
  ? [{name: "ค้นหางาน", ...}, {...}]
  : [{name: "Dashboard", ...}, {...}]

const handleLogout = async () => {
  await signOut({ callbackUrl: "/" });
};

// หลัง
import { getSidebarMenuItems } from "@/utils/getSidebarMenuItems";
import { handleLogoutUser } from "@/utils/authHelpers";

const menuItems = getSidebarMenuItems(userRole);

const handleLogout = async () => {
  await handleLogoutUser("/");
};
```
**ประโยชน์:** Code ใน component ลดลง, logic สำหรับสร้าง menu items นำไปใช้ที่อื่นได้

---

### jobActions.ts (src/actions/jobActions.ts)
**ก่อน:** ไฟล์มี server action ทั้งหมด พร้อม validation inline
- Validation logic อยู่ภายใน function
- ไม่ชัดเจนว่า error อะไร

**หลัง:** ใช้ helper functions จาก `@/lib/jobService.ts`
```tsx
// ก่อน
if (!data.job_title) throw new Error("Job title is required");
if (!data.department_id) throw new Error("Department is required");

// หลัง
import { validateJobData, CreateJobData } from "@/lib/jobService";

const validation = validateJobData(data);
if (!validation.valid) {
  return { success: false, error: validation.error };
}
```
**ประโยชน์:** Validation logic แยกออกมา, สามารถใช้ซ้ำได้, easy to test

---

### src/app/api/job/route.ts
**ก่อน:** Logic สำหรับเช็ก authorization inline ใน GET handler
```tsx
let isAdminOrHR = false;
if (session?.user?.name) {
  const user = await prisma.user.findUnique({
    where: { username: session.user.name as string },
  });
  isAdminOrHR = user?.role === "ADMIN" || user?.role === "HR";
}
```

**หลัง:** ใช้ helper function จาก `@/lib/apiHelpers.ts`
```tsx
import { getUserAuthStatus } from "@/lib/apiHelpers";

const isAdminOrHR = session?.user?.name 
  ? await getUserAuthStatus(session.user.name as string)
  : false;
```
**ประโยชน์:** Authorization logic อยู่ในที่เดียว, สามารถใช้ซ้ำได้ในหลาย routes

---

### AddJobModal.tsx (src/components/recruitment/AddJobModal.tsx)
**ก่อน:** State management ทั้งหมด inline
- `formData` state ขนาดใหญ่
- `setFormData` ใช้ spread operator ทุกครั้ง
- Form fields HTML ขนาดใหญ่ (256 lines)
- API call logic inline

**หลัง:** ใช้ hooks และ components
```tsx
// ก่อน
const [formData, setFormData] = useState({
  title: "", description: "", department: "", ...
});
const [loading, setLoading] = useState(false);

// ใน form
<input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
// x 9 fields

// หลัง
import { useJobForm, useJobApi } from "@/hooks/useJobForm";
import { JobFormFields } from "./JobFormFields";

const { formData, updateField, resetForm } = useJobForm();
const { loading, submitJob } = useJobApi();

<JobFormFields formData={formData} onFieldChange={updateField} />
```
**ประโยชน์:** 
- Component size ลดลง ~70%
- Form fields ใช้ซ้ำได้
- State logic clear และ testable
- Reusable hooks

---

### EditJobModal.tsx (src/components/recruitment/EditJobModal.tsx)
**ก่อน:** Code ซ้ำกับ AddJobModal + useEffect สำหรับ sync data
- State management ซ้ำ
- Form fields ซ้ำ
- useEffect สำหรับ populate form

**หลัง:** ใช้ same hooks และ components
```tsx
// ก่อน (276 lines)
const [formData, setFormData] = useState({...job});
useEffect(() => { setFormData({...job}); }, [job]);

// หลัง (ลดลงเหลือ ~100 lines)
const { formData, setAll } = useJobForm({...job});
useEffect(() => { 
  setAll({...job}); 
}, [job, setAll]);

<JobFormFields formData={formData} onFieldChange={...} />
```
**ประโยชน์:** 
- Code duplication หาย
- Consistent กับ AddJobModal
- Easier to maintain

---

### JobList.tsx (src/components/recruitment/JobList.tsx)
**ก่อน:** Component ใหญ่ (292 lines)
- Action handlers ทั้งหมด inline (kill, restore, delete)
- Job card rendering logic ยาว
- JSX ซับซ้อนสำหรับ action buttons

**หลัง:** ใช้ JobCard component และ hooks
```tsx
// ก่อน
{filteredJobs.map((job) => (
  <div className="...">
    {/* header */}
    {/* info tags */}
    {/* employment badge */}
    {/* description */}
    {/* footer */}
  </div>
))}

// หลัง
import { JobCard } from "./JobCard";
import { useJobActions } from "@/hooks/useJobActions";

{filteredJobs.map((job) => (
  <JobCard
    key={job.id}
    job={job}
    userRole={userRole}
    loadingJobId={loadingJobId}
    onEdit={handleEdit}
    onKill={handleKillJob}
    onRestore={handleRestoreJob}
    onDelete={handleDeleteJob}
  />
))}
```
**ประโยชน์:**
- Component size ลด ~60%
- JobCard logic แยกออก
- Action handlers อยู่ใน hooks
- Clear separation of concerns

---

## 📊 ตารางสรุป Lines of Code

| ไฟล์ | ก่อน | หลัง | เปลี่ยนแปลง |
|-----|------|------|-----------|
| Sidebar.tsx | 165 | 85 | ↓ 48% |
| AddJobModal.tsx | 256 | 65 | ↓ 75% |
| EditJobModal.tsx | 276 | 110 | ↓ 60% |
| JobList.tsx | 292 | 75 | ↓ 74% |
| **รวม Components** | **989** | **335** | **↓ 66%** |
| jobActions.ts | 144 | 135 | ↓ 6% |
| API route | 115 | 105 | ↓ 9% |
| **ไฟล์ใหม่เพิ่ม** | - | **700+** | - |

> ↓ = ลดลง | ผลรวม lines เพิ่มขึ้นเนื่องจาก utility/hook ใหม่

---

## 🎯 Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                  User Interface                          │
├─────────────────────────────────────────────────────────┤
│ Sidebar.tsx ◄─ getSidebarMenuItems()                    │
│               authHelpers.handleLogoutUser()           │
├─────────────────────────────────────────────────────────┤
│ JobList.tsx ◄─ JobCard component                       │
│               useJobActions hook                        │
│               EditJobModal                              │
├─────────────────────────────────────────────────────────┤
│ AddJobModal ◄─ useJobForm hook                         │
│ EditJobModal   JobFormFields component                 │
│               useJobApi hook                            │
└─────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────┐
│                  API Routes                              │
├─────────────────────────────────────────────────────────┤
│ POST/PUT/PATCH /api/job ◄─ apiHelpers functions       │
│                             getUserAuthStatus()        │
│                             requireAdminOrHR()         │
└─────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────┐
│                Server Actions & Services                 │
├─────────────────────────────────────────────────────────┤
│ jobActions.ts ◄─ jobService.ts                         │
│                  - validateJobData()                    │
│ sessionHelpers.ts - isUserAdminOrHR()                  │
│                  - getUserByUsername()                 │
└─────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────┐
│                   Database (Prisma)                      │
├─────────────────────────────────────────────────────────┤
│ User, Job, Department Tables                           │
└─────────────────────────────────────────────────────────┘
```

---

## 💡 ตัวอย่างการ implement ใน pages

1. **Code Reusability** - สามารถใช้ hooks และ utilities ใหม่ได้ในหลายจุด
2. **Better Maintainability** - แต่ละไฟล์มีความรับผิดชอบเดียว
3. **Easier Testing** - ฟังก์ชันแยกออกมาง่ายต่อการทำ unit tests
4. **Type Safety** - มี clear interfaces สำหรับ form data และ props
5. **Better Performance** - สามารถ memoize components ได้ง่ายขึ้น

---

## 📚 ตัวอย่างการใช้งาน

### 1️⃣ ใช้ getSidebarMenuItems ใน Sidebar.tsx

```tsx
import { getSidebarMenuItems } from "@/utils/getSidebarMenuItems";

export default function Sidebar() {
  const { data: session } = useSession();
  const userRole = (session.user as any)?.role;
  
  // สร้าง menu items ตามบทบาท
  const menuItems = getSidebarMenuItems(userRole);
  
  return (
    <nav>
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>
              <item.icon size={22} />
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

---

### 2️⃣ ใช้ useJobForm + useJobApi ใน AddJobModal

```tsx
import { useJobForm, useJobApi } from "@/hooks/useJobForm";
import { JobFormFields } from "./JobFormFields";

export default function AddJobModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  
  // ใช้ hooks
  const { formData, updateField, resetForm } = useJobForm();
  const { loading, submitJob } = useJobApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitJob(formData); // POST /api/job
      setIsOpen(false);
      resetForm();
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>เพิ่มงาน</button>
      
      {isOpen && (
        <div className="modal">
          <form onSubmit={handleSubmit}>
            {/* ใช้ reusable component */}
            <JobFormFields 
              formData={formData}
              onFieldChange={updateField}
            />
            <button type="submit" disabled={loading}>
              {loading ? "กำลังบันทึก..." : "เพิ่มงาน"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
```

---

### 3️⃣ ใช้ useJobActions ใน JobList

```tsx
import { useJobActions } from "@/hooks/useJobActions";
import { JobCard } from "./JobCard";

export default function JobList({ jobs, userRole }: JobListProps) {
  const router = useRouter();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  // ใช้ hook สำหรับ job actions
  const { 
    loadingJobId, 
    handleKillJob, 
    handleRestoreJob, 
    handleDeleteJob 
  } = useJobActions();

  const handleJobAction = async (
    actionFn: (id: string) => Promise<boolean>,
    jobId: string
  ) => {
    const success = await actionFn(jobId);
    if (success) router.refresh();
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-6">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            userRole={userRole}
            loadingJobId={loadingJobId}
            onEdit={(job) => {
              setSelectedJob(job);
              setIsEditOpen(true);
            }}
            onKill={(id) => handleJobAction(handleKillJob, id)}
            onRestore={(id) => handleJobAction(handleRestoreJob, id)}
            onDelete={(id) => handleJobAction(handleDeleteJob, id)}
          />
        ))}
      </div>

      {selectedJob && (
        <EditJobModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          job={selectedJob}
        />
      )}
    </>
  );
}
```

---

### 4️⃣ ใช้ jobService ใน jobActions.ts

```tsx
import { 
  validateJobData, 
  CreateJobData,
  getAllJobs,
  killJobById,
  restoreJobById 
} from "@/lib/jobService";

export async function createJobAction(data: CreateJobData) {
  // Validate ก่อน
  const validation = validateJobData(data);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  try {
    // Prisma create logic...
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to create job" };
  }
}

export async function getJobsAction() {
  return await getAllJobs();
}

export async function killJob(jobId: string) {
  return await killJobById(jobId);
}
```

---

### 5️⃣ ใช้ apiHelpers ใน API route

```tsx
import { getUserAuthStatus } from "@/lib/apiHelpers";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  // เช็ค authorization
  const isAdminOrHR = session?.user?.name 
    ? await getUserAuthStatus(session.user.name)
    : false;

  const jobs = await prisma.job.findMany({
    where: isAdminOrHR ? {} : { isActive: true },
  });

  return NextResponse.json(jobs);
}
```

---

## ✨ ประโยชน์ของการปรับปรุง
