const difficultyStyles = {
  Easy: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
  Medium: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
  Tough: "bg-rose-500/15 text-rose-300 border border-rose-500/30",
};

export default function ProblemRow({ problem, completed, onToggle }) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-xl border border-ink-700/60 bg-ink-900/60 p-4 transition sm:flex-row sm:items-center ${
        completed ? "opacity-70" : ""
      }`}
    >
      <label className="flex cursor-pointer items-center gap-3 sm:flex-1">
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => onToggle(problem.id, e.target.checked)}
          className="h-5 w-5 cursor-pointer rounded border-ink-700 bg-ink-900 text-accent focus:ring-accent"
          aria-label={`Mark ${problem.title} as complete`}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-sm font-medium ${
                completed ? "text-slate-400 line-through" : "text-slate-100"
              }`}
            >
              {problem.title}
            </span>
            <span className={`pill ${difficultyStyles[problem.difficulty] || ""}`}>
              {problem.difficulty}
            </span>
          </div>
        </div>
      </label>

      <div className="flex flex-wrap gap-2 sm:justify-end">
        <a
          href={problem.youtubeLink}
          target="_blank"
          rel="noreferrer"
          className="btn-ghost text-xs"
        >
          YouTube
        </a>
        <a
          href={problem.practiceLink}
          target="_blank"
          rel="noreferrer"
          className="btn-ghost text-xs"
        >
          Practice
        </a>
        <a
          href={problem.articleLink}
          target="_blank"
          rel="noreferrer"
          className="btn-ghost text-xs"
        >
          Article
        </a>
      </div>
    </div>
  );
}
