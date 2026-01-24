"use client";

type Props = {
  isOpen: boolean;
  jobTitle: string;
  salary: string;
  onChangeTitle: (value: string) => void;
  onChangeSalary: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export default function CreateJobModal({
  isOpen,
  jobTitle,
  salary,
  onChangeTitle,
  onChangeSalary,
  onClose,
  onSubmit,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[360px] rounded-xl bg-white p-6 shadow-lg dark:bg-zinc-900">
        <h2 className="mb-4 text-xl font-bold text-zinc-900 dark:text-white">
          เพิ่มตำแหน่งงาน
        </h2>

        {/* ชื่อตำแหน่งงาน */}
        <label className="mb-1 block text-sm text-zinc-600 dark:text-zinc-300">
          ชื่อตำแหน่งงาน
        </label>
        <input
          type="text"
          placeholder="เช่น Frontend Developer"
          value={jobTitle}
          onChange={(e) => onChangeTitle(e.target.value)}
          className="mb-4 w-full rounded border px-3 py-2 text-sm
                     focus:outline-none focus:ring focus:ring-blue-300
                     dark:bg-zinc-800 dark:text-white"
        />

        {/* เงินเดือน */}
        <label className="mb-1 block text-sm text-zinc-600 dark:text-zinc-300">
          เงินเดือน
        </label>
        <input
          type="text"
          placeholder="30,000 - 50,000 บาท"
          value={salary}
          onChange={(e) => onChangeSalary(e.target.value)}
          className="mb-6 w-full rounded border px-3 py-2 text-sm
                     focus:outline-none focus:ring focus:ring-blue-300
                     dark:bg-zinc-800 dark:text-white"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded px-4 py-2 text-sm
                       text-zinc-600 hover:bg-zinc-100
                       dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            ยกเลิก
          </button>

          <button
            onClick={onSubmit}
            className="rounded bg-blue-600 px-4 py-2
                       text-sm text-white hover:bg-blue-500"
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
}
