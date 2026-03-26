const PROFILE = {
  name: "OJT Trainee",
  role: "Daily Time Report User",
  school: "Sample University",
  supervisor: "Ms. Jane Supervisor",
  targetHours: 500,
  completedHours: 274,
};

export default function ProfilePage() {
  const progress = Math.min(
    100,
    Math.round((PROFILE.completedHours / PROFILE.targetHours) * 100),
  );

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <section className="mx-auto w-full max-w-200 space-y-5 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <header className="space-y-1 border-b border-gray-100 pb-4">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Profile
          </h1>
          <p className="text-sm text-gray-500">
            Account and progress information for your OJT attendance tracking.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-gray-50 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Name
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {PROFILE.name}
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Role
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {PROFILE.role}
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              School
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {PROFILE.school}
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Supervisor
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {PROFILE.supervisor}
            </p>
          </div>
        </div>

        <section className="space-y-2 rounded-xl border border-gray-200 p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
            OJT Completion
          </h2>
          <p className="text-sm text-gray-600">
            {PROFILE.completedHours.toFixed(2)} h of {PROFILE.targetHours} h
            completed
          </p>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-cyan-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs font-semibold text-cyan-700">
            {progress}% complete
          </p>
        </section>
      </section>
    </main>
  );
}
