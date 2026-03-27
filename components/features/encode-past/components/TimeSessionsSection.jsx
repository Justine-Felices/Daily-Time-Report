import TimeSessionCard from "@/components/features/encode-past/components/TimeSessionCard";

export default function TimeSessionsSection({
  amIn,
  amOut,
  pmIn,
  pmOut,
  onAmInChange,
  onAmOutChange,
  onPmInChange,
  onPmOutChange,
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <TimeSessionCard
        title="AM Session"
        color="#FF69B4"
        inValue={amIn}
        outValue={amOut}
        onInChange={onAmInChange}
        onOutChange={onAmOutChange}
      />

      <TimeSessionCard
        title="PM Session"
        color="#069494"
        inValue={pmIn}
        outValue={pmOut}
        onInChange={onPmInChange}
        onOutChange={onPmOutChange}
      />
    </div>
  );
}
