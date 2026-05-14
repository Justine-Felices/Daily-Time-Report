import EmptyState from "@/components/features/history/components/EmptyState";
import HistoryItemCard from "@/components/features/history/components/HistoryItemCard";

export default function HistoryListSection({
  records,
  isLoading = false,
  pendingRecordId = null,
  onSaveRecord,
  onDeleteRecord,
}) {
  if (isLoading) {
    return (
      <div className="w-full overflow-x-auto rounded-2xl border border-white/10 bg-[#1C1C1E] backdrop-blur-md">
        <table className="w-full border-collapse">
          <tbody>
            {Array.from({ length: 7 }).map((_, index) => (
              <HistoryItemCard
                key={`history-skeleton-${index}`}
                record={{ id: `history-skeleton-${index}` }}
                isLoading
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (records.length === 0) {
    return <EmptyState message="No records found" />;
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-white/10 bg-[#1C1C1E] backdrop-blur-md">
      <table className="w-full border-collapse">
        <tbody>
          {records.map((record) => (
            <HistoryItemCard
              key={record.id}
              record={record}
              isPending={record.id === pendingRecordId}
              onSaveRecord={onSaveRecord}
              onDeleteRecord={onDeleteRecord}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
