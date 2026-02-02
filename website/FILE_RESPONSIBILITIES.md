# File Structure & Responsibilities

## 📁 Utilities (`/src/utils/`)
- **getSidebarMenuItems.ts** - สร้าง menu items ของ Sidebar ตามบทบาท user (USER vs ADMIN/HR)
- **authHelpers.ts** - จัดการการ logout ผ่าน NextAuth
- **jobListHelpers.ts** - ฟังก์ชันช่วยสำหรับ job list (label conversion, etc)

## 📁 Server Libraries (`/src/lib/`)
- **sessionHelpers.ts** - ดึงข้อมูล user จาก database, เช็ค authorization (admin/hr)
- **jobService.ts** - Business logic สำหรับ job (validation, CRUD, soft delete)
- **apiHelpers.ts** - ฟังก์ชันช่วยสำหรับ API routes (session, authorization checks)

## 🪝 React Hooks (`/src/hooks/`)
- **useJobForm.ts** - จัดการ form state และ API calls สำหรับ job forms (POST/PUT)
- **useJobActions.ts** - จัดการ job actions (kill/restore/delete) ใน job list

## 🎨 Components (`/src/components/recruitment/`)
- **JobFormFields.tsx** - Reusable form fields component (9 fields) ใช้ใน AddJobModal และ EditJobModal
- **JobCard.tsx** - Job card UI component แสดงรายละเอียด job แต่ละใบ
- **AddJobModal.tsx** - Modal สำหรับเพิ่มงานใหม่ (refactored)
- **EditJobModal.tsx** - Modal สำหรับแก้ไขงาน (refactored)
- **JobList.tsx** - แสดงรายการ job ทั้งหมด (refactored)
- **Sidebar.tsx** - Sidebar navigation (refactored)

## 📋 Server Actions (`/src/actions/`)
- **jobActions.ts** - Server actions สำหรับสร้าง/ดึง job (refactored)

## 🔌 API Routes (`/src/app/api/`)
- **route.ts (job)** - GET/POST jobs (refactored)
