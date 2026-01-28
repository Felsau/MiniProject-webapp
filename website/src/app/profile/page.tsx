import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft, User, Briefcase, Calendar, Shield, Mail, Phone, MapPin } from "lucide-react"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { username: session.user?.name as string },
    include: { jobs: { orderBy: { createdAt: 'desc' } } }
  })

  if (!user) return <div>ไม่พบข้อมูล</div>

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
      
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition mb-4">
          <ArrowLeft size={20} /> กลับแดชบอร์ด
        </Link>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 🟢 การ์ดข้อมูลส่วนตัว (ซ้ายมือ) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-500 to-blue-600"></div>
            
            <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center mb-3 border-4 border-white shadow-md relative z-10 mt-8">
              <User size={48} className="text-gray-400" />
            </div>
            
            {/* ชื่อจริง หรือ Username */}
            <h2 className="text-xl font-bold text-gray-800">
              {user.fullName || user.username}
            </h2>
            <p className="text-blue-600 font-medium text-sm mb-4">
              {user.position || "ยังไม่ระบุตำแหน่ง"}
            </p>

            {/* รายละเอียดติดต่อ */}
            <div className="w-full space-y-3 text-left border-t pt-4">
              <div className="flex items-center gap-3 text-gray-600 text-sm">
                <Mail size={16} className="text-gray-400" />
                <span>{user.email || "-"}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 text-sm">
                <Phone size={16} className="text-gray-400" />
                <span>{user.phone || "-"}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 text-sm">
                <Shield size={16} className="text-gray-400" />
                <span className="uppercase">{user.role} Account</span>
              </div>
            </div>
          </div>

          {/* About Me */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-2">เกี่ยวกับฉัน</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              {user.bio || "ยังไม่ได้เขียนแนะนำตัว..."}
            </p>
          </div>
        </div>

        {/* 🔵 พื้นที่ขวา: สถิติ & งาน */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <p className="text-gray-400 text-xs mb-1">ประกาศงานทั้งหมด</p>
              <p className="text-2xl font-bold text-blue-600">{user.jobs.length}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <p className="text-gray-400 text-xs mb-1">วันที่เข้าร่วม</p>
              <p className="text-lg font-bold text-gray-800">{new Date(user.createdAt).toLocaleDateString('th-TH')}</p>
            </div>
          </div>

          {/* Job History */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Briefcase size={20} className="text-blue-500" />
              ประวัติการลงประกาศงาน
            </h3>
            
            <div className="space-y-4">
              {user.jobs.length === 0 ? (
                <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed">
                  ยังไม่มีประวัติการลงประกาศงาน
                </div>
              ) : (
                user.jobs.map((job) => (
                  <div key={job.id} className="group flex justify-between items-start p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition cursor-pointer">
                    <div>
                      <h4 className="font-bold text-gray-700 group-hover:text-blue-600 transition">{job.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{job.department} • {job.location}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md font-medium">
                        Active
                      </span>
                      <p className="text-xs text-gray-400 mt-2">{new Date(job.createdAt).toLocaleDateString('th-TH')}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}