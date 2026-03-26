import { formatClock, formatFullDate } from "@/lib/dtr-utils";

export default function Header({ now, status }) {
  return (
    <header className="space-y-2 border-b border-gray-100 pb-5">
      <p className="text-sm text-gray-500">{formatFullDate(now)}</p>
      <h1 className="text-4xl font-extrabold tracking-tight text-green-600 sm:text-5xl">
        {formatClock(now)}
      </h1>
      <p className="text-sm font-medium text-gray-600">• Status: {status}</p>
    </header>
  );
}
