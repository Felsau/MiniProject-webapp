"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"

export default function CreateJobPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    department: "IT",
    location: "Bangkok",
    salary: "",
    description: ""
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        alert("✅ บันทึกประกาศงานสำเร็จ!")
        router.push("/dashboard") 
        router.refresh()
      } else {
        const errorData = await res.json()
        alert(`❌ ผิดพลาด: ${errorData.error || "บันทึกไม่ได้"}`)
      }
    } catch (error) {
      alert("❌ เชื่อมต่อ Server ไม่ได้")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl border border-gray-100">
        
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">ลงประกาศงานใหม่</h1>
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 flex items-center gap-1">
            <ArrowLeft size={20} /> กลับแดชบอร์ด
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อตำแหน่งงาน</label>
              <input required type="text" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">แผนก</label>
              <select className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={(e) => setFormData({...formData, department: e.target.value})}
              >
                <option value="IT">IT Development</option>
                <option value="HR">Human Resources</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">เงินเดือน</label>
              <input type="text" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="เช่น 25,000 - 40,000"
                onChange={(e) => setFormData({...formData, salary: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">สถานที่ทำงาน</label>
              <input type="text" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="กทม. / Remote"
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียดงาน</label>
            <textarea required rows={5} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
            <Save size={20} /> {loading ? "กำลังบันทึก..." : "บันทึกประกาศงาน"}
          </button>
        </form>
      </div>
    </div>
  )
}