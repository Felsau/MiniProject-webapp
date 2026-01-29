import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Link from "next/link"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import DeleteJobButton from "@/components/DeleteJobButton" // นำเข้าปุ่มลบ
import {
  LayoutDashboard,
  PlusCircle,
  Users,
  LogOut,
  Search,
  Pencil,
  UserPlus,
  User
} from "lucide-react"

export default async function DashboardPage() {
  // 1. เช็คสิทธิ์การเข้าใช้งาน
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const userRole = session?.user?.role // ดึง Role มาเก็บไว้ใช้ง่ายๆ

  // 2. ดึงข้อมูลงานจาก Database
  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: true } // ดึงข้อมูลคนโพสต์มาด้วย (เผื่อใช้)
  })

  return (
    <div className="flex h-screen bg-gray-50 font-sans">

      {/* 🟢 SIDEBAR (เมนูซ้ายมือ) */}
      <aside className="w-64 bg-[#0f172a] text-white flex flex-col fixed h-full">
        {/* Logo */}
        <div className="p-6 text-2xl font-bold tracking-wider border-b border-gray-800 flex items-center gap-2">
          <div className="bg-blue-600 w-8 h-8 rounded flex items-center justify-center">💼</div>
          RECRUIT.
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">

          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-900/50">
            <LayoutDashboard size={20} />
            <span>แดชบอร์ด</span>
          </Link>

          {/* ❌ ลบบรรทัด 'บัญชีของฉัน' ตรงนี้ทิ้งไปเลยครับ */}

          {(userRole === 'ADMIN' || userRole === 'HR') && (
            <Link href="/create-job" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition">
              <PlusCircle size={20} />
              <span>เพิ่มงาน / ประกาศงาน</span>
            </Link>
          )}

          {userRole === 'ADMIN' && (
            <Link href="/register" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition">
              <UserPlus size={20} />
              <span>เพิ่มพนักงานใหม่</span>
            </Link>
          )}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-800 space-y-2"> {/* เพิ่ม space-y-2 เพื่อเว้นระยะห่าง */}

          {/* ✅ เพิ่มปุ่ม 'บัญชีของฉัน' ตรงนี้ครับ */}
          <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition">
            <User size={20} />
            <span>บัญชีของฉัน</span>
          </Link>

          {/* ปุ่มออกจากระบบ (อันเดิม) */}
          <Link href="/api/auth/signout" className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-lg transition">
            <LogOut size={20} />
            <span>ออกจากระบบ</span>
          </Link>

        </div>
      </aside>



      {/* ⚪ MAIN CONTENT (พื้นที่ขวามือ) */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">

        {/* Header Bar */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">แดชบอร์ดจัดการงาน</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded font-bold">{userRole}</span>
              <p className="text-gray-500 text-sm">ยินดีต้อนรับ, {session.user?.name}</p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="ค้นหาตำแหน่งงาน..."
              className="pl-10 pr-4 py-2 border rounded-full bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 shadow-sm"
            />
          </div>
        </header>

        {/* 🟡 Cards Grid Area */}
        {jobs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-400">ยังไม่มีประกาศงานในขณะนี้</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition group">

                {/* Card Header */}
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    {job.department}
                  </span>

                  {/* ปุ่มจัดการ (เห็นเฉพาะเจ้าของโพสต์ หรือ Admin) */}
                  <div className="flex gap-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="hover:text-blue-600 p-1"><Pencil size={18} /></button>
                    {/* 👇 ปุ่มลบ ใช้ Component ที่เราทำไว้ */}
                    <DeleteJobButton id={job.id} />
                  </div>
                </div>

                {/* Card Body */}
                <h3 className="text-xl font-bold text-gray-800 mb-1">{job.title}</h3>
                <p className="text-emerald-600 font-semibold mb-3">{job.salary || 'ไม่ระบุเงินเดือน'} บาท</p>
                <p className="text-gray-500 text-sm line-clamp-2">
                  {job.description}
                </p>

                <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between text-xs text-gray-400">
                  <span>📍 {job.location}</span>
                  <span>โพสต์เมื่อ: {new Date(job.createdAt).toLocaleDateString('th-TH')}</span>
                </div>

              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  )
}