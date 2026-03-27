import EmptyState from "@/components/features/history/components/EmptyState";
import HistoryItemCard from "@/components/features/history/components/HistoryItemCard";

export default function HistoryListSection({ records }) {
  if (records.length === 0) {
    return <EmptyState message="No records found" />;
  }

  return (
    <div className="space-y-2">
      {records.map((record) => (
        <HistoryItemCard key={record.id} record={record} />
      ))}
    </div>
  );
}
