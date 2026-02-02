# ระบบการค้นหาและกรองงาน (Job Filter System)

## ภาพรวม

ระบบนี้มีการจัดระเบียบการค้นหาและกรองประกาศงานด้วยฟีเจอร์:
- ค้นหาแบบหลายฟิลด์ (Keyword Search)
- กรองตามแผนก (Department)
- กรองตามสถานที่ (Location)
- กรองตามประเภทงาน (Employment Type)
- กรองตามช่วงเงินเดือน (Salary Range)

## โครงสร้างไฟล์

### 1. Server-side Layer

#### `/src/lib/jobService.ts`
**การค้นหาและกรองหลัก**

```typescript
// Interface กำหนดเกณฑ์การกรอง
interface JobFilterCriteria {
  searchKeyword?: string;        // ค้นหาในชื่อ, รายละเอียด, คุณสมบัติ
  department?: string;            // กรองตามแผนก
  location?: string;              // กรองตามสถานที่
  employmentType?: string;         // กรองตามประเภทงาน
  salaryMin?: number;             // เงินเดือนต่ำสุด
  salaryMax?: number;             // เงินเดือนสูงสุด
  isActive?: boolean;             // แสดงเฉพาะงานที่ยังเปิดรับ
}

// ฟังก์ชันค้นหาและกรอง
export async function searchAndFilterJobs(criteria: JobFilterCriteria) {
  // ค้นหาใช้ OR logic ในหลายฟิลด์
  // กรองใช้ AND logic
  // ส่งกลับ array ของงาน
}
```

#### `/src/app/api/job/route.ts`
**API Endpoint สำหรับการกรอง**

```
GET /api/job?search=keyword&department=HR&location=Bangkok&employmentType=FULL_TIME&salaryMin=20000&salaryMax=50000
```

Query Parameters:
- `search` - ค้นหาคำสำคัญ
- `department` - แผนก
- `location` - สถานที่
- `employmentType` - ประเภทงาน
- `salaryMin` - เงินเดือนต่ำสุด
- `salaryMax` - เงินเดือนสูงสุด
- `isActive` - แสดงงานที่ยังเปิด
- `includeInactive` - admin/HR สามารถดูงานทั้งหมด

#### `/src/app/api/job/filter-options/route.ts`
**API Endpoint สำหรับตัวเลือกการกรอง**

```
GET /api/job/filter-options
```

ส่งกลับ:
```json
{
  "departments": ["HR", "IT", "Sales"],
  "locations": ["Bangkok", "Chiang Mai"],
  "employmentTypes": [
    { "value": "FULL_TIME", "label": "เต็มเวลา" },
    { "value": "PART_TIME", "label": "พาร์ตไทม์" },
    { "value": "CONTRACT", "label": "สัญญา" },
    { "value": "INTERNSHIP", "label": "ฝึกงาน" }
  ]
}
```

### 2. Client-side Layer

#### `/src/hooks/useJobFilter.ts`
**Hook สำหรับจัดการสถานะการกรอง**

```typescript
// Hook สำหรับจัดการฟิลเตอร์ที่ผู้ใช้เลือก
export function useJobFilter() {
  const { filters, updateFilter, updateMultipleFilters, resetFilters, hasActiveFilters } = useJobFilter();
  
  // - filters: ค่าปัจจุบันของทุกฟิลเตอร์
  // - updateFilter(field, value): อัปเดตฟิลเตอร์เดียว
  // - updateMultipleFilters(obj): อัปเดตหลายฟิลเตอร์พร้อมกัน
  // - resetFilters(): รีเซ็ตทุกฟิลเตอร์
  // - hasActiveFilters(): ตรวจสอบว่ามีฟิลเตอร์ที่ใช้งานอยู่หรือไม่
}

// Hook สำหรับดึงข้อมูลงานตามฟิลเตอร์
export function useFilteredJobs() {
  const { jobs, loading, error, fetchJobs } = useFilteredJobs();
  
  // - jobs: array ของงานที่กรองแล้ว
  // - loading: สถานะการโหลด
  // - error: ข้อความข้อผิดพลาด
  // - fetchJobs(filters): ดึงข้อมูลจาก API ตามฟิลเตอร์
}
```

#### `/src/components/recruitment/JobFilterComponent.tsx`
**UI Component สำหรับการกรองงาน**

Features:
- ช่องค้นหาแบบ expandable
- Dropdown เลือกแผนก
- Dropdown เลือกสถานที่
- Dropdown เลือกประเภทงาน
- Input fields สำหรับช่วงเงินเดือน
- ปุ่มรีเซ็ตฟิลเตอร์

### 3. Page Components

#### `/src/app/jobs/page.tsx`
**หน้าแสดงรายการงานพร้อมการกรอง**

ขั้นตอน:
1. โหลดตัวเลือกการกรอง จาก `/api/job/filter-options`
2. แสดง JobFilterComponent
3. ฟังฟิลเตอร์เปลี่ยนแปลง → เรียก API `/api/job?...`
4. แสดงผลลัพธ์ด้วย JobCard

## การทำงาน

### ขั้นตอนการค้นหา/กรอง

```
ผู้ใช้พิมพ์/เลือก ค่า
        ↓
JobFilterComponent อัปเดต filter state
        ↓
fetchJobs() ถูกเรียก
        ↓
ส่ง Query Parameters ไปยัง API
        ↓
API ✓ /api/job?search=...&department=...
        ↓
searchAndFilterJobs() สร้าง Prisma WHERE clause
        ↓
ค้นหา/กรองข้อมูลจาก Database
        ↓
ส่งผลลัพธ์กลับไป
        ↓
แสดงผลในหน้า (JobCard)
```

## ตัวอย่างการใช้งาน

### ค้นหาธรรมดา
```
URL: /api/job?search=developer
// ค้นหา "developer" ในชื่องาน, รายละเอียด, คุณสมบัติ
```

### กรองหลายเกณฑ์
```
URL: /api/job?search=javascript&department=IT&employmentType=FULL_TIME&salaryMin=30000&salaryMax=80000
// ค้นหา "javascript" ในแผนก IT เต็มเวลา เงินเดือน 30k-80k
```

### Admin ดูงานทั้งหมด
```
URL: /api/job?includeInactive=true
// admin/HR สามารถดูงานที่ปิดรับแล้ว
```

## Query Logic

### Keyword Search (OR Logic)
```prisma
// ค้นหา keyword ในหนึ่งในสามฟิลด์
{
  OR: [
    { title: { contains: "keyword", mode: "insensitive" } },
    { description: { contains: "keyword", mode: "insensitive" } },
    { requirements: { contains: "keyword", mode: "insensitive" } }
  ]
}
```

### Salary Range (AND Logic)
```prisma
// เงินเดือนต้องอยู่ในช่วง
{
  AND: [
    { salary_min: { gte: 20000 } },
    { salary_max: { lte: 100000 } }
  ]
}
```

## ข้อมูล Schema ที่จำเป็น

```prisma
model Job {
  id                String    @id @default(cuid())
  title             String
  description       String?
  department        String?
  location          String?
  salary            String?
  salary_min        Int?
  salary_max        Int?
  employmentType    String    @default("FULL_TIME")
  requirements      String?
  responsibilities  String?
  benefits          String?
  isActive          Boolean   @default(true)
  createdAt         DateTime  @default(now())
  postedBy          String
  postedByUser      User      @relation(fields: [postedBy], references: [id])
}
```

## ข้อสังเกต

1. **Case-insensitive Search**: ใช้ `mode: "insensitive"` ในการค้นหา
2. **Optional Filters**: ทุก filter เป็น optional สามารถใช้เดี่ยวหรือผสมกันได้
3. **Authorization**: ผู้ใช้ทั่วไปดูเฉพาะงานที่ `isActive: true` เท่านั้น
4. **Performance**: ใช้ indexes ในฐานข้อมูลเพื่อเร่งการค้นหา
5. **Error Handling**: catch errors และส่งกลับ empty array พร้อมข้อความบันทึก

## การพัฒนาต่อไป

- [ ] Pagination สำหรับรายการข้อมูลมากๆ
- [ ] Sorting (เรียงตามวันที่, เงินเดือน, etc)
- [ ] Advanced Search (regex, boolean operators)
- [ ] Search History สำหรับผู้ใช้
- [ ] Saved Searches
- [ ] Notifications เมื่อมีงานใหม่ตรงกับเกณฑ์
