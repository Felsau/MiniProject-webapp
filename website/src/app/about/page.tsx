"use client";

import { useState } from "react";

/* =======================
   🗄️ Mock Database
======================= */

type Color = {
  name: string;
  value: string;
};

const COLOR_DB: Color[] = [
  { name: "blue", value: "#3b82f6" },
  { name: "green", value: "#22c55e" },
  { name: "orange", value: "#f97316" },
  { name: "purple", value: "#a855f7" },
  { name: "pink", value: "#ec4899" },
  { name: "teal", value: "#14b8a6" },
  { name: "yellow", value: "#eab308" },
];

type Box = {
  id: number;
  color: Color;
};

export default function AboutPage() {
  /* =======================
     State
  ======================= */
  const [boxes, setBoxes] = useState<Box[]>([]);

  const [searchInput, setSearchInput] = useState("");
  const [activeFilter, setActiveFilter] = useState("");

  // modal + custom color
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customColorName, setCustomColorName] = useState("");
  const [customColorValue, setCustomColorValue] = useState("#3b82f6");

  /* =======================
     Layout config
  ======================= */
  const BOX_SIZE = 80;
  const GAP = 16;
  const STEP = BOX_SIZE + GAP;
  const CONTAINER_WIDTH = 600;
  const CONTAINER_HEIGHT = 300;
  const COLUMNS = Math.floor(CONTAINER_WIDTH / STEP);

  /* =======================
     Logic
  ======================= */

  const handleCreateCustomBox = () => {
    if (!customColorName.trim()) return;

    setBoxes((prev) => [
      {
        id: Date.now(),
        color: {
          name: customColorName.toLowerCase(),
          value: customColorValue,
        },
      },
      ...prev,
    ]);

    setCustomColorName("");
    setCustomColorValue("#3b82f6");
    setIsModalOpen(false);
  };

  const handleSearch = () => {
    setActiveFilter(searchInput.trim().toLowerCase());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  /* =======================
     Filter
  ======================= */
  const filteredBoxes = boxes.filter((box) =>
    activeFilter === "" ? true : box.color.name.includes(activeFilter)
  );

  /* =======================
     Render
  ======================= */
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        About Page
      </h1>

      {/* สร้างกล่อง */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="rounded-full bg-black px-6 py-3 text-white hover:bg-zinc-800 dark:bg-white dark:text-black"
      >
        สร้างแผ่นสี่เหลี่ยม
      </button>

      {/* ค้นหา */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="ค้นหาสี เช่น blue, green"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-[260px] rounded border px-4 py-2 text-sm
                     focus:outline-none focus:ring focus:ring-blue-300
                     dark:bg-zinc-900 dark:text-white"
        />

        <button
          onClick={handleSearch}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
        >
          ค้นหา
        </button>
      </div>

      {/* พื้นที่แสดงผล */}
      <div
        className="relative overflow-y-auto border border-dashed border-zinc-400"
        style={{ width: CONTAINER_WIDTH, height: CONTAINER_HEIGHT }}
      >
        <div
          className="relative"
          style={{
            height: Math.ceil(filteredBoxes.length / COLUMNS) * STEP,
          }}
        >
          {filteredBoxes.map((box, index) => {
            const col = index % COLUMNS;
            const row = Math.floor(index / COLUMNS);

            return (
              <div
                key={box.id}
                className="absolute h-20 w-20 rounded-md
                           transition-transform duration-500 ease-in-out
                           flex items-center justify-center text-xs font-semibold text-white"
                style={{
                  backgroundColor: box.color.value,
                  transform: `translate(${col * STEP}px, ${row * STEP}px)`,
                }}
              >
                {box.color.name}
              </div>
            );
          })}
        </div>
      </div>

      {/* =======================
          Modal
      ======================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[360px] rounded-xl bg-white p-6 shadow-lg dark:bg-zinc-900">
            <h2 className="mb-4 text-xl font-bold text-zinc-900 dark:text-white">
              สร้างสีใหม่
            </h2>

            {/* ชื่อสี */}
            <label className="mb-1 block text-sm text-zinc-600 dark:text-zinc-300">
              ชื่อสี
            </label>
            <input
              type="text"
              placeholder="เช่น blue, mint"
              value={customColorName}
              onChange={(e) => setCustomColorName(e.target.value)}
              className="mb-4 w-full rounded border px-3 py-2 text-sm
                         focus:outline-none focus:ring focus:ring-blue-300
                         dark:bg-zinc-800 dark:text-white"
            />

            {/* เลือกสี */}
            <label className="mb-1 block text-sm text-zinc-600 dark:text-zinc-300">
              เลือกสี
            </label>
            <input
              type="color"
              value={customColorValue}
              onChange={(e) => setCustomColorValue(e.target.value)}
              className="mb-6 h-12 w-full cursor-pointer"
            />

            {/* ปุ่ม */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                ยกเลิก
              </button>

              <button
                onClick={handleCreateCustomBox}
                className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-500"
              >
                ตกลง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
