import { useState } from "react";
import ProblemRow from "./ProblemRow";

export default function TopicSection({ topic, completedSet, onToggle }) {
  const [open, setOpen] = useState(true);
  const doneCount = topic.problems.filter((p) => completedSet.has(p.id)).length;
  const total = topic.problems.length;
  const percent = total ? Math.round((doneCount / total) * 100) : 0;

  return (
    <section className="card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start justify-between gap-4 p-5 text-left hover:bg-ink-800/40"
      >
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-slate-100">{topic.title}</h2>
          <p className="mt-1 text-sm text-slate-400">{topic.description}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="pill bg-ink-800 text-slate-300">
            {doneCount}/{total} done
          </span>
          <div className="h-1.5 w-28 overflow-hidden rounded-full bg-ink-800">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </button>

      {open && (
        <div className="space-y-3 border-t border-ink-700/60 p-5">
          {topic.problems.map((p) => (
            <ProblemRow
              key={p.id}
              problem={p}
              completed={completedSet.has(p.id)}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </section>
  );
}
