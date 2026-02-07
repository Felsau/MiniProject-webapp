# 📝 Changelog

All notable changes to this project will be documented in this file.

## [1.3.0] - 2026-02-06

### ✨ Added
- 📎 **ระบบอัปโหลด Resume/CV (PDF)**
  - User สามารถแนบไฟล์ Resume (PDF, สูงสุด 5MB) ตอนสมัครงาน
  - Modal สมัครงานใหม่พร้อม Drag & Drop UI
  - Upload API (`/api/upload`) รองรับ validation ประเภทไฟล์ + ขนาด
  - เก็บไฟล์ที่ `public/uploads/resumes/`
  - เพิ่ม field `resumeUrl` ใน Application model (Prisma)
  - HR/Admin ดาวน์โหลด Resume ได้จากหน้า Applications
  - User เห็นลิงก์ดาวน์โหลด Resume ของตัวเองได้

---

## [1.2.0] - 2026-02-06

### ✨ Added
- 📧 **Email Notifications** — ส่ง email อัตโนมัติด้วย Nodemailer
  - ส่งยืนยันเมื่อ User สมัครงาน
  - แจ้ง HR/Admin เมื่อมีใบสมัครใหม่
  - แจ้งผลการพิจารณา (ACCEPTED / REJECTED) ให้ผู้สมัคร
- 📄 **Pagination สำหรับ User** — หน้าค้นหางาน `/jobs` แบ่งหน้า 6 รายการ/หน้า
  - ปุ่มเลขหน้าแบบย่อ (1 … 4 5 6 … 10)
  - แสดงจำนวนผลลัพธ์และหน้าปัจจุบัน
  - รองรับ filter + pagination ร่วมกัน

### 🔧 Fixed
- แก้ Turbopack root config สำหรับ monorepo workspace

### 🧹 Removed
- ลบ documentation เก่าที่ไม่จำเป็น (DETAILED_REFACTORING_GUIDE, REFACTORING_SUMMARY, FILE_RESPONSIBILITIES, STRUCTURE, CONTRIBUTING, FILTER_SYSTEM)
- ลบไฟล์ default SVG ของ Next.js ที่ไม่ได้ใช้
- ลบไฟล์ database ซ้ำซ้อน (dev.db, Database.sqbpro)

---

## [1.1.0] - 2026-02-02

### ✨ Added
- ระบบใบสมัครงาน (Application System)
  - User สมัครงานได้
  - HR/Admin ตรวจสอบ/อนุมัติ/ปฏิเสธใบสมัคร
  - ป้องกันสมัครซ้ำ (@@unique)
- Job Filter & Search System
  - ค้นหาตามคำค้น, แผนก, สถานที่, ประเภทงาน, เงินเดือน
  - Filter Component พร้อม UI
- Kill/Restore Job (Soft Delete)
- Pagination สำหรับ API `/api/job`

---

## [1.0.0] - 2026-01-30

### ✨ Added
- Complete authentication system with NextAuth.js
- User registration and login functionality
- Role-based access control (Admin, HR, User)
- Job posting creation and management
- User profile management
- Dashboard with job listings
- Responsive navigation (Navbar + Sidebar)
- Database schema with Prisma ORM
- Sample data seeding script

### 🧪 Test Data
| Username | Role | Description |
|----------|------|-------------|
| `admin` | ADMIN | Full system access |
| `hr` | HR | Can manage jobs |
| `john.dev` | USER | Regular user |
| `jane.design` | USER | Regular user |

Password ทุก account: `123456`

---

## TODO / Future Plans

### Phase 1 (MVP Essentials)
- [ ] ระบบ Bookmark/Save Jobs
- [ ] ระบบ Resume Upload
- [ ] Email Verification สำหรับ register
- [ ] ระบบ Password Reset
- [ ] ดูรายชื่อผู้สมัครแต่ละตำแหน่ง (HR)

### Phase 2 (Enhancement)
- [ ] Rating/Notes สำหรับผู้สมัคร (HR)
- [ ] Analytics Dashboard (HR)
- [ ] Job Categories / Tags
- [ ] Dark Mode

### Phase 3 (Advanced)
- [ ] Messaging System
- [ ] Real-time Notifications (WebSocket)
- [ ] Bulk Actions (อนุมัติ/ปฏิเสธหลายรายการ)
- [ ] Candidate Pipeline (Kanban board)

---

**Note**: This project follows [Semantic Versioning](https://semver.org/).
