"use client";

import { useEffect, useMemo, useState } from "react";
import { PRINT_CSS } from "@/lib/dtr-constants";
import { loadHistoryRecords } from "@/lib/dtr-storage";
import { fetchAttendanceHistoryRecords } from "@/lib/supabase-history";
import { fetchCurrentUserOverallInternHours } from "@/lib/supabase-overall-hours";
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

    return (
      matchSearch && (filterStatus === "All" || record.status === filterStatus)
    );
  });
}

function sortHistoryRecords(records, sortDir) {
  return [...records].sort((left, right) => {
    const diff = new Date(left.date).getTime() - new Date(right.date).getTime();
    return sortDir === "desc" ? -diff : diff;
  });
}

async function buildDtrPdf(records, totalHours) {
  const [{ jsPDF }, autoTableModule] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
  const autoTable = autoTableModule.default;
  const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.text("Daily Time Record", 40, 44);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(`Generated: ${new Date().toLocaleString("en-US")}`, 40, 62);

  autoTable(pdf, {
    startY: 80,
    margin: { left: 40, right: 40 },
    head: [["Date", "AM In", "AM Out", "PM In", "PM Out", "Status", "Hours"]],
    body: records.map((record) => [
      record.date,
      record.amIn || "",
      record.amOut || "",
      record.pmIn || "",
      record.pmOut || "",
      record.status || "",
      Number(record.totalHours || 0).toFixed(1),
    ]),
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 8,
      cellPadding: 4,
      lineColor: [0, 0, 0],
      lineWidth: 0.3,
      textColor: [0, 0, 0],
    },
    headStyles: {
      fillColor: [245, 247, 250],
      textColor: [0, 0, 0],
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { cellWidth: 52 },
      2: { cellWidth: 52 },
      3: { cellWidth: 52 },
      4: { cellWidth: 52 },
      5: { cellWidth: 110 },
      6: { cellWidth: 45, halign: "right" },
    },
  });

  const footerY = (pdf.lastAutoTable?.finalY || 80) + 18;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.text(`Total Hours: ${totalHours.toFixed(1)}`, 555, footerY, {
    align: "right",
  });

  return pdf;
}

export default function HistoryContent() {
  const [history, setHistory] = useState(() => loadHistoryRecords());
  const [overallHoursLogged, setOverallHoursLogged] = useState(null);
  const [isOverallHoursLoading, setIsOverallHoursLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let mounted = true;

    const loadSupabaseHistory = async () => {
      const [records, totalHours] = await Promise.all([
        fetchAttendanceHistoryRecords(),
        fetchCurrentUserOverallInternHours(),
      ]);

      if (!mounted) return;

      if (records.length > 0) {
        setHistory(records);
      }

      if (totalHours !== null) {
        setOverallHoursLogged(totalHours);
      }

      setIsOverallHoursLoading(false);
    };

    loadSupabaseHistory();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const styleId = "dtr-print-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = PRINT_CSS;
      document.head.appendChild(style);
    }

    return () => {
      document.getElementById(styleId)?.remove();
    };
  }, []);

  const statuses = useMemo(() => {
    const uniqueStatuses = Array.from(
      new Set(history.map((row) => row.status)),
    );
    return ["All", ...uniqueStatuses];
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
  const hoursLogged = isOverallHoursLoading
    ? null
    : overallHoursLogged ?? totalHoursFiltered;
  const presentDays = filtered.filter((record) => record.totalHours > 0).length;
  const totalAllHours = allSorted.reduce(
    (sum, record) => sum + (Number(record.totalHours) || 0),
    0,
  );

  const handlePrint = async () => {
    const pdf = await buildDtrPdf(allSorted, totalAllHours);
    const blob = pdf.output("blob");
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, "_blank", "noopener,noreferrer");
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 60_000);
  };

  return (
    <PageShell width="wide">
      <div className="screen-content space-y-5">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <HeaderSection
            title="Attendance History"
            subtitle="View and review all your attendance records"
          />
          <ActionsSection onPrint={handlePrint} />
        </div>

        <StatsSection
          totalRecords={filtered.length}
          presentDays={presentDays}
          hoursLogged={hoursLogged}
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
