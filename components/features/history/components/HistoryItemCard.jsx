import HistoryRow from "@/components/features/history/components/HistoryRow";

export default function HistoryItemCard({
  record,
  isLoading = false,
  isPending = false,
  onSaveRecord,
  onDeleteRecord,
}) {
  return (
    <HistoryRow
      record={record}
      isLoading={isLoading}
      isPending={isPending}
      onSaveRecord={onSaveRecord}
      onDeleteRecord={onDeleteRecord}
    />
  );
}
