import EmptyState from "@/components/features/history/components/EmptyState";
import HistoryItemCard from "@/components/features/history/components/HistoryItemCard";

export default function HistoryListSection({ records, isLoading = false }) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <HistoryItemCard
            key={`history-skeleton-${index}`}
            record={{ id: `history-skeleton-${index}` }}
            isLoading
          />
        ))}
      </div>
    );
  }

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
