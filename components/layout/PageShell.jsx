import { PAGE_BACKGROUND_STYLE } from "@/lib/dtr-constants";

export default function PageShell({ children, width = "wide" }) {
  const widthClassName = width === "narrow" ? "max-w-xl" : "max-w-4xl";

  return (
    <main
      className="min-h-screen px-4 py-6 sm:px-6 sm:py-8"
      style={{ ...PAGE_BACKGROUND_STYLE, overflowX: "hidden" }}
    >
      <div className={`mx-auto w-full ${widthClassName} space-y-5`}>
        {children}
      </div>
    </main>
  );
}
