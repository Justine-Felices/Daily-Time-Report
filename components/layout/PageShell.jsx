import { PAGE_BACKGROUND_STYLE } from "@/lib/dtr-constants";
import { APP_CONTAINER_CLASS } from "@/lib/layout-constants";

const WIDTH_CLASS = {
  narrow: "max-w-xl mx-auto w-full",
  wide: "max-w-4xl mx-auto w-full px-4 sm:px-0",
  dashboard: APP_CONTAINER_CLASS,
};

export default function PageShell({ children, width = "wide" }) {
  const widthClassName = WIDTH_CLASS[width] ?? WIDTH_CLASS.wide;
  const isWidePage = width === "wide" || width === "narrow";

  return (
    <main
      className={`min-h-screen pb-8 pt-28 sm:pb-10 sm:pt-32 ${
        isWidePage ? "px-4 sm:px-6" : ""
      }`}
      style={{ ...PAGE_BACKGROUND_STYLE, overflowX: "hidden" }}
    >
      <div className={`${widthClassName} space-y-5`}>{children}</div>
    </main>
  );
}
