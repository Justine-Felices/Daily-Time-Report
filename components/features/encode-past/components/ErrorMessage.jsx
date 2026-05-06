import { AlertCircle } from "lucide-react";

export default function ErrorMessage({ error }) {
  if (!error) return null;

  return (
    <div 
      className="flex items-center gap-3 p-4 rounded-2xl animate-[shake_0.5s_cubic-bezier(.36,.07,.19,.97)_both]"
      style={{
        background: "rgba(244, 63, 94, 0.08)",
        border: "1px solid rgba(244, 63, 94, 0.15)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-rose-500/20 flex items-center justify-center border border-rose-500/30">
        <AlertCircle className="w-4 h-4 text-rose-500" strokeWidth={2.5} />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-white font-bold text-[11px] tracking-widest uppercase">Input Error</span>
        <p className="text-rose-200/80 text-[13px] leading-snug font-medium">
          {error}
        </p>
      </div>
    </div>
  );
}
