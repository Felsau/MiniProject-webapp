"use client" // สำคัญมาก! ต้องมีบรรทัดนี้เพราะปุ่มต้องกดได้ (Client Component)

import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DeleteJobButton({ id }: { id: number }) {
  const router = useRouter()

  const handleDelete = async () => {
    // 1. ถามยืนยันก่อนลบ
    if (!confirm("คุณต้องการลบประกาศงานนี้ใช่หรือไม่?")) return

    try {
      // 2. ส่งคำสั่งลบไปที่ API
      const res = await fetch(`/api/jobs/${id}`, { 
        method: "DELETE" 
      })

      if (res.ok) {
        // 3. ถ้าลบสำเร็จ ให้รีเฟรชหน้าจอทันที
        router.refresh() 
      } else {
        alert("ลบไม่สำเร็จ กรุณาลองใหม่")
      }
    } catch (error) {
      console.error(error)
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ")
    }
  }

  return (
    <button 
      onClick={handleDelete} 
      className="hover:text-red-500 p-1 transition bg-white/50 rounded-md hover:bg-red-50"
      title="ลบประกาศงาน"
    >
      <Trash2 size={18} />
    </button>
  )
}