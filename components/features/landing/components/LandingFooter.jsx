import { Clock4 } from "lucide-react";

export default function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mx-auto max-w-7xl px-4 py-20 sm:px-6"
      style={{ borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}
    >
      <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg shadow-lg shadow-blue-500/10">
            <img
              src="/logo_no_bg.png"
              alt="Logo"
              className="h-full w-full object-contain"
            />
          </span>
          <span className="text-sm font-bold" style={{ color: "#FFFFFF" }}>
            JustIn Time Report
          </span>
        </div>

        <p className="text-xs" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
          &copy; {year} JustIn Time Report. Daily Time Record for OJT students.
        </p>
      </div>
    </footer>
  );
}
