import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import RegisterForm from "@/components/RegisterForm"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function RegisterPage() {
  const session = await getServerSession(authOptions)

 
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">สร้างบัญชีผู้ใช้ใหม่</h1>
        <p className="text-gray-500 mb-6 text-sm">เฉพาะผู้ดูแลระบบเท่านั้นที่สามารถเพิ่มพนักงานหรือ HR ได้</p>
        
     
        <RegisterForm />
        
        <div className="mt-6 text-center">
          <a href="/dashboard" className="text-sm text-blue-600 hover:underline">
            ← กลับไปหน้าแดชบอร์ด
          </a>
        </div>
      </div>
    </div>
  )
}