import HistoryRow from "@/components/features/history/components/HistoryRow";

export default function HistoryItemCard({ record, isLoading = false }) {
  return <HistoryRow record={record} isLoading={isLoading} />;
}
