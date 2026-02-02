"use client";

import { useCallback, useState } from "react";

/**
 * Hook for managing job list actions
 */
export function useJobActions() {
  const [loadingJobId, setLoadingJobId] = useState<string | null>(null);

  const handleKillJob = useCallback(async (jobId: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะปิดประกาศงานนี้?")) return false;

    setLoadingJobId(jobId);
    try {
      const res = await fetch(`/api/job/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "kill" }),
      });

      if (!res.ok) {
        alert("ไม่สามารถปิดประกาศงานได้");
        return false;
      }

      return true;
    } catch {
      alert("เกิดข้อผิดพลาด");
      return false;
    } finally {
      setLoadingJobId(null);
    }
  }, []);

  const handleRestoreJob = useCallback(async (jobId: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะเปิดประกาศงานนี้อีกครั้ง?")) return false;

    setLoadingJobId(jobId);
    try {
      const res = await fetch(`/api/job/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore" }),
      });

      if (!res.ok) {
        alert("ไม่สามารถเปิดประกาศงานได้");
        return false;
      }

      return true;
    } catch {
      alert("เกิดข้อผิดพลาด");
      return false;
    } finally {
      setLoadingJobId(null);
    }
  }, []);

  const handleDeleteJob = useCallback(async (jobId: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบงานนี้ถาวร?")) return false;

    setLoadingJobId(jobId);
    try {
      const res = await fetch(`/api/job/${jobId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("ไม่สามารถลบงานได้");
        return false;
      }

      return true;
    } catch {
      alert("เกิดข้อผิดพลาด");
      return false;
    } finally {
      setLoadingJobId(null);
    }
  }, []);

  return {
    loadingJobId,
    handleKillJob,
    handleRestoreJob,
    handleDeleteJob,
  };
}
