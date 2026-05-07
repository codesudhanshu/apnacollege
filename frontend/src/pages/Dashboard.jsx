import { useEffect, useMemo, useState } from "react";
import { api, getErrorMessage } from "../api";
import { useAuth } from "../context/AuthContext";
import TopicSection from "../components/TopicSection";

const DIFFICULTIES = ["All", "Easy", "Medium", "Tough"];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [topics, setTopics] = useState([]);
  const [completed, setCompleted] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get("/topics");
        if (cancelled) return;
        setTopics(data.topics || []);
        setCompleted(new Set(data.completedProblemIds || []));
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredTopics = useMemo(() => {
    const q = search.trim().toLowerCase();
    return topics
      .map((t) => ({
        ...t,
        problems: t.problems.filter((p) => {
          const diffOk = difficulty === "All" || p.difficulty === difficulty;
          const target = `${t.title} ${t.description} ${p.title} ${p.difficulty}`.toLowerCase();
          const searchOk = !q || target.includes(q);
          return diffOk && searchOk;
        }),
      }))
      .filter((t) => t.problems.length > 0);
  }, [topics, search, difficulty]);

  const totals = useMemo(() => {
    const total = topics.reduce((acc, t) => acc + t.problems.length, 0);
    const done = completed.size;
    const percent = total ? Math.round((done / total) * 100) : 0;
    return { total, done, percent };
  }, [topics, completed]);

  const toggleProgress = async (problemId, value) => {
    const previous = new Set(completed);
    const next = new Set(previous);
    if (value) next.add(problemId);
    else next.delete(problemId);
    setCompleted(next);

    try {
      const { data } = await api.put("/progress", { problemId, completed: value });
      setCompleted(new Set(data.completedProblemIds || []));
    } catch (err) {
      setCompleted(previous);
      alert(getErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-ink-700/60 bg-ink-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-100">DSA Sheet</h1>
            <p className="text-xs text-slate-400">Hi, {user?.name}</p>
          </div>
          <button onClick={logout} className="btn-ghost text-sm">
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <section className="card mb-6 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Overall progress</p>
              <p className="mt-1 text-2xl font-semibold text-slate-100">
                {totals.done} / {totals.total}{" "}
                <span className="text-base font-normal text-slate-400">solved ({totals.percent}%)</span>
              </p>
            </div>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink-800 sm:max-w-sm">
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{ width: `${totals.percent}%` }}
              />
            </div>
          </div>
        </section>

        <section className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            className="input sm:flex-1"
            placeholder="Search problems or topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={
                  difficulty === d
                    ? "btn bg-accent text-white"
                    : "btn-ghost"
                }
              >
                {d}
              </button>
            ))}
          </div>
        </section>

        {loading && (
          <div className="card p-10 text-center text-slate-400">Loading topics...</div>
        )}
        {error && (
          <div className="card border-rose-500/40 bg-rose-500/10 p-5 text-sm text-rose-300">
            {error}
          </div>
        )}
        {!loading && !error && filteredTopics.length === 0 && (
          <div className="card p-10 text-center text-slate-400">
            No problems match the selected filters.
          </div>
        )}

        <div className="space-y-4">
          {filteredTopics.map((t) => (
            <TopicSection
              key={t.id}
              topic={t}
              completedSet={completed}
              onToggle={toggleProgress}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
