"use client";

import { useEffect, useState } from "react";
import { FileText, Calendar, Clock, CheckCircle, XCircle, MapPin, Briefcase, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. ดึงข้อมูลจาก API
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch("/api/application");
        if (res.ok) {
          const data = await res.json();
          console.log("Data received:", data);
          setApplications(data);
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // 2. คำนวณตัวเลขสำหรับ Stats Cards
  const stats = {
    total: applications.length,
    // ใช้ .toUpperCase() เพื่อให้ไม่ว่าใน DB จะเป็นตัวเล็กหรือใหญ่ ก็คำนวณถูกเสมอ
    pending: applications.filter((app: any) => app.status?.toUpperCase() === "PENDING").length,
    accepted: applications.filter((app: any) => app.status?.toUpperCase() === "ACCEPTED").length,
    rejected: applications.filter((app: any) => app.status?.toUpperCase() === "REJECTED").length,
  };

  // 3. ฟังก์ชันช่วยเลือกสีและข้อความสถานะ
  const getStatusDetails = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return { text: "ได้รับการติดต่อ", color: "text-green-600 bg-green-50", icon: <CheckCircle size={16} /> };
      case "REJECTED":
        return { text: "ไม่ผ่าน", color: "text-red-600 bg-red-50", icon: <XCircle size={16} /> };
      default:
        return { text: "รอพิจารณา", color: "text-yellow-600 bg-yellow-50", icon: <Clock size={16} /> };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">งานที่สมัครไปแล้ว</h1>
          <p className="text-gray-600">ติดตามสถานะการสมัครงานของคุณ</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="ทั้งหมด" count={stats.total} icon={<FileText className="text-blue-500" size={20} />} />
          <StatCard title="รอพิจารณา" count={stats.pending} icon={<Clock className="text-yellow-500" size={20} />} />
          <StatCard title="ได้รับการติดต่อ" count={stats.accepted} icon={<CheckCircle className="text-green-500" size={20} />} />
          <StatCard title="ไม่ผ่าน" count={stats.rejected} icon={<XCircle className="text-red-500" size={20} />} />
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {applications.length === 0 ? (
            /* Empty State */
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-gray-400" size={32} />
              </div>
              <p className="text-gray-500 text-lg font-medium">คุณยังไม่ได้สมัครงานใดๆ</p>
              <p className="text-gray-400 text-sm mt-1">เริ่มต้นค้นหาและสมัครงานที่คุณสนใจได้เลย</p>
              <Link href="/jobs" className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                ไปค้นหางาน
              </Link>
            </div>
          ) : (
            /* ข้อมูลตารางการสมัคร */
            <div className="divide-y divide-gray-100">
              {applications.map((app: any) => {
                const status = getStatusDetails(app.status);
                return (
                  <div key={app.id} className="p-6 hover:bg-gray-50 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg text-blue-600 hidden sm:block">
                        <Briefcase size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{app.job.title}</h3>
                        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1"><MapPin size={14} /> {app.job.location}</span>
                          <span className="flex items-center gap-1"><Calendar size={14} /> สมัครเมื่อ {new Date(app.createdAt).toLocaleDateString("th-TH")}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-4 md:pt-0">
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${status.color}`}>
                        {status.icon}
                        {status.text}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Component ย่อยสำหรับ Card สถิติ
function StatCard({ title, count, icon }: { title: string; count: number; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-600 text-sm">{title}</span>
        {icon}
      </div>
      <p className="text-3xl font-bold text-gray-900">{count}</p>
    </div>
  );
}