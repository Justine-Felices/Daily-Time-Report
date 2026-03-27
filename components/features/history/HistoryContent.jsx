"use client";

import { useEffect, useMemo, useState } from "react";
import { PRINT_CSS } from "@/lib/dtr-constants";
import { loadHistoryRecords } from "@/lib/dtr-storage";
import PageShell from "@/components/layout/PageShell";
import HeaderSection from "@/components/features/history/components/HeaderSection";
import ActionsSection from "@/components/features/history/components/ActionsSection";
import StatsSection from "@/components/features/history/components/StatsSection";
import FiltersSection from "@/components/features/history/components/FiltersSection";
import HistoryListSection from "@/components/features/history/components/HistoryListSection";
import PaginationSection from "@/components/features/history/components/PaginationSection";
import PrintableDTR from "@/components/features/history/components/PrintableDTR";

const PAGE_SIZE = 6;

function filterHistoryRecords(records, search, filterStatus) {
  const searchValue = search.toLowerCase();

  return records.filter((record) => {
    const noteValue = (record.note || "").toLowerCase();
    const matchSearch =
      record.date.includes(search) ||
      record.status.toLowerCase().includes(searchValue) ||
      noteValue.includes(searchValue);

    return matchSearch && (filterStatus === "All" || record.status === filterStatus);
  });
}

function sortHistoryRecords(records, sortDir) {
  return [...records].sort((left, right) => {
    const diff = new Date(left.date).getTime() - new Date(right.date).getTime();
    return sortDir === "desc" ? -diff : diff;
  });
}

export default function HistoryContent() {
  const [history] = useState(() => loadHistoryRecords());
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.id = "dtr-print-styles";
    styleElement.textContent = PRINT_CSS;
    document.head.appendChild(styleElement);

    return () => {
      document.getElementById("dtr-print-styles")?.remove();
    };
  }, []);

  const statuses = useMemo(() => {
    return [
      "All",
      ...Array.from(new Set(history.map((record) => record.status))),
    ];
  }, [history]);

  const filtered = useMemo(() => {
    const filteredRecords = filterHistoryRecords(history, search, filterStatus);
    return sortHistoryRecords(filteredRecords, sortDir);
  }, [history, search, filterStatus, sortDir]);

  const allSorted = useMemo(() => {
    return sortHistoryRecords(history, "asc");
  }, [history]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const totalHoursFiltered = filtered.reduce(
    (sum, record) => sum + (Number(record.totalHours) || 0),
    0,
  );
  const presentDays = filtered.filter((record) => record.totalHours > 0).length;
  const totalAllHours = allSorted.reduce(
    (sum, record) => sum + (Number(record.totalHours) || 0),
    0,
  );

  return (
    <PageShell width="wide">
      <div className="screen-content space-y-5">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <HeaderSection
            title="Attendance History"
            subtitle="View and review all your attendance records"
          />
          <ActionsSection onPrint={() => window.print()} />
        </div>

        <StatsSection
          totalRecords={filtered.length}
          presentDays={presentDays}
          hoursLogged={totalHoursFiltered}
        />

        <FiltersSection
          search={search}
          filterStatus={filterStatus}
          sortDir={sortDir}
          statuses={statuses}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          onFilterStatusChange={(value) => {
            setFilterStatus(value);
            setPage(1);
          }}
          onToggleSort={() =>
            setSortDir((current) => (current === "desc" ? "asc" : "desc"))
          }
        />

        <HistoryListSection records={paged} />

        <PaginationSection
          currentPage={currentPage}
          totalPages={totalPages}
          filteredCount={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>

      <div className="print-dtr">
        <PrintableDTR records={allSorted} totalHours={totalAllHours} />
      </div>
    </PageShell>
  );
}
