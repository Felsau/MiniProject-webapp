"use client";

import { Job } from "./types";

type Props = {
  jobs: Job[];
};

export default function JobGrid({ jobs }: Props) {
  const BOX_SIZE = 120;
  const GAP = 16;
  const STEP = BOX_SIZE + GAP;
  const CONTAINER_WIDTH = 600;
  const CONTAINER_HEIGHT = 300;
  const COLUMNS = Math.floor(CONTAINER_WIDTH / STEP);

  return (
    <div
      className="relative overflow-y-auto border border-dashed border-zinc-400"
      style={{ width: CONTAINER_WIDTH, height: CONTAINER_HEIGHT }}
    >
      <div
        className="relative"
        style={{
          height: Math.ceil(jobs.length / COLUMNS) * STEP,
        }}
      >
        {jobs.map((job, index) => {
          const col = index % COLUMNS;
          const row = Math.floor(index / COLUMNS);

          return (
            <div
              key={job.id}
              className="absolute h-[120px] w-[120px] rounded-md
                         bg-blue-600 text-white
                         transition-transform duration-500 ease-in-out
                         flex flex-col items-center justify-center
                         text-center px-2"
              style={{
                transform: `translate(${col * STEP}px, ${row * STEP}px)`,
              }}
            >
              <div className="text-sm font-bold">{job.title}</div>
              <div className="mt-1 text-xs text-blue-100">
                {job.salary}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
