"use client";

import { useEffect, useMemo, useState } from "react";
import { PRINT_CSS } from "@/lib/dtr-constants";
import { formatPdfTimeCell } from "@/lib/dtr-formatters";
import {
  deleteAttendanceHistoryRecord,
  fetchAttendanceHistoryRecords,
  updateAttendanceHistoryRecord,
} from "@/lib/supabase-history";
import { fetchCurrentUserOverallInternHours } from "@/lib/supabase-overall-hours";
import { fetchCurrentUserProfile } from "@/lib/supabase-user-profiles";
import PageShell from "@/components/layout/PageShell";
import HeaderSection from "@/components/features/history/components/HeaderSection";
import ActionsSection from "@/components/features/history/components/ActionsSection";
import StatsSection from "@/components/features/history/components/StatsSection";
import FiltersSection from "@/components/features/history/components/FiltersSection";
import HistoryListSection from "@/components/features/history/components/HistoryListSection";
import PaginationSection from "@/components/features/history/components/PaginationSection";
import PrintableDTR from "@/components/features/history/components/PrintableDTR";

const PAGE_SIZE = 7;

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

async function buildDtrPdf(records, totalHours, profile) {
  const [{ jsPDF }, autoTableModule] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
  const autoTable = autoTableModule.default;
  const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 40;

  const colors = {
    primary: [0, 0, 0], // Black
    secondary: [245, 245, 245], // Very Light Gray for totals
    text: [20, 20, 20],
    white: [255, 255, 255],
    border: [200, 200, 200], // Gray border
  };

  const dateOptions = { year: "numeric", month: "short", day: "numeric" };
  const monthLabelOptions = { year: "numeric", month: "long" };
  const formattedGeneratedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // --- Header Layout ---
  const headerY = 55;

  // Title Section (Bigger and more prominent)
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14); // Increased from 10
  pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  pdf.text("STUDENT DAILY TIME RECORD", margin, headerY - 18);

  pdf.setFontSize(10); // Increased from 8
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(80, 80, 80);
  pdf.text(
    `Student: ${profile?.full_name || "N/A"} | Generated: ${formattedGeneratedDate}`,
    margin,
    headerY - 3,
  );

  const formatRecordDate = (record) => {
    if (!record?.date) return "N/A";
    const parts = record.date.split("-");
    if (parts.length !== 3) return record.date;
    const [year, month, day] = parts;
    const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
    if (Number.isNaN(dateObj.getTime())) return record.date;
    return dateObj.toLocaleDateString("en-US", dateOptions);
  };

  const sortedRecords = [...records].sort((left, right) => {
    const leftTime = left?.date ? new Date(left.date).getTime() : 0;
    const rightTime = right?.date ? new Date(right.date).getTime() : 0;
    return leftTime - rightTime;
  });

  const monthGroups = [];
  const monthMap = new Map();

  sortedRecords.forEach((record) => {
    if (!record?.date) return;

    const parts = record.date.split("-");
    if (parts.length !== 3) return;

    const [year, month] = parts;
    const monthKey = `${year}-${month}`;
    let group = monthMap.get(monthKey);
    if (!group) {
      const labelDate = new Date(Number(year), Number(month) - 1, 1);
      const label = labelDate
        .toLocaleDateString("en-US", monthLabelOptions)
        .toUpperCase();
      group = { label, records: [], monthTotal: 0 };
      monthMap.set(monthKey, group);
      monthGroups.push(group);
    }
    group.records.push(record);
    group.monthTotal += Number(record.totalHours || 0);
  });

  const tableHead = [
    [
      "Date",
      "AM In",
      "AM Out",
      "PM In",
      "PM Out",
      "OT In",
      "OT Out",
      "Status",
      "Hours",
    ],
  ];

  const timeCellPadding = { top: 7, right: 3, bottom: 7, left: 3 };

  const tableStyles = {
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 8.5,
      cellPadding: 7,
      lineColor: colors.border,
      lineWidth: 0.5,
      textColor: [30, 30, 30],
      valign: "middle",
    },
    headStyles: {
      fillColor: colors.primary,
      textColor: colors.white,
      fontStyle: "bold",
      halign: "center",
      lineWidth: 0,
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: 85 },
      1: { cellWidth: 50, halign: "center", cellPadding: timeCellPadding },
      2: { cellWidth: 50, halign: "center", cellPadding: timeCellPadding },
      3: { cellWidth: 50, halign: "center", cellPadding: timeCellPadding },
      4: { cellWidth: 50, halign: "center", cellPadding: timeCellPadding },
      5: { cellWidth: 44, halign: "center", cellPadding: timeCellPadding },
      6: { cellWidth: 44, halign: "center", cellPadding: timeCellPadding },
      7: { cellWidth: 92, halign: "center" },
      8: { cellWidth: 45, halign: "center", fontStyle: "bold" },
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255],
    },
  };

  let cursorY = 75;
  const ensureSpace = (needed) => {
    if (cursorY + needed > pageHeight - margin) {
      pdf.addPage();
      cursorY = margin + 20;
    }
  };

  monthGroups.forEach((group, index) => {
    const headerHeight = 30;

    ensureSpace(headerHeight + 50);

    // --- Month Header Section (Minimalist) ---
    const textX = margin;
    const textY = cursorY;

    // Month Year Text (Black)
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text(group.label, textX, textY + 15);

    // Monthly Total
    const totalText = `Monthly Total: ${group.monthTotal.toFixed(1)} Hours`;
    pdf.setFontSize(10);
    const totalWidth = pdf.getTextWidth(totalText);
    pdf.text(totalText, pageWidth - margin - totalWidth, textY + 13);

    cursorY += 25;

    autoTable(pdf, {
      startY: cursorY,
      margin: { left: margin, right: margin },
      head: tableHead,
      body: group.records.map((record) => [
        formatRecordDate(record),
        formatPdfTimeCell(record.amIn),
        formatPdfTimeCell(record.amOut),
        formatPdfTimeCell(record.pmIn),
        formatPdfTimeCell(record.pmOut),
        formatPdfTimeCell(record.otIn),
        formatPdfTimeCell(record.otOut),
        record.status || "Regular Duty Day",
        Number(record.totalHours || 0).toFixed(1),
      ]),
      ...tableStyles,
    });

    cursorY = (pdf.lastAutoTable?.finalY || cursorY) + 40;
  });

  // Final Total Hours
  ensureSpace(40);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text(
    `OVERALL TOTAL HOURS: ${totalHours.toFixed(1)}`,
    pageWidth - margin,
    cursorY,
    {
      align: "right",
    },
  );

  cursorY += 45;
  const totalWidth = pageWidth - margin * 2;
  const blockWidth = totalWidth / 2;
  const lineMargin = 30;

  const signatures = [
    {
      title: "Approved By (OJT Supervisor)",
      name: "Signature over Printed Name",
      sub: "",
    },
    {
      title: "Verified By (HR Department)",
      name: "Signature over Printed Name",
      sub: "",
    },
  ];

  ensureSpace(100);
  signatures.forEach((sig, i) => {
    const startX = margin + i * blockWidth;
    const centerX = startX + blockWidth / 2;

    // Top Title
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);
    pdf.text(sig.title, centerX, cursorY, { align: "center" });

    // Signature Line
    pdf.setDrawColor(180, 180, 180);
    pdf.setLineWidth(0.8);
    pdf.line(
      startX + lineMargin,
      cursorY + 22,
      startX + blockWidth - lineMargin,
      cursorY + 22,
    );

    // Bottom Name/Label
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text(sig.name, centerX, cursorY + 34, { align: "center" });
  });

  return pdf;
}

export default function HistoryContent() {
  const [history, setHistory] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [overallHoursLogged, setOverallHoursLogged] = useState(null);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [isOverallHoursLoading, setIsOverallHoursLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [pendingRecordId, setPendingRecordId] = useState(null);
  const [warningMessage, setWarningMessage] = useState(null);

  // Auto-dismiss warning after 8 seconds
  useEffect(() => {
    if (!warningMessage) return;
    const timer = setTimeout(() => setWarningMessage(null), 8000);
    return () => clearTimeout(timer);
  }, [warningMessage]);

  useEffect(() => {
    let mounted = true;

    const loadSupabaseHistory = async () => {
      try {
        const [records, totalHours, profile] = await Promise.all([
          fetchAttendanceHistoryRecords(),
          fetchCurrentUserOverallInternHours(),
          fetchCurrentUserProfile(),
        ]);

        if (!mounted) return;

        setHistory(records);
        setUserProfile(profile);

        if (totalHours !== null) {
          setOverallHoursLogged(totalHours);
        }
      } finally {
        if (!mounted) return;
        setIsHistoryLoading(false);
        setIsOverallHoursLoading(false);
      }
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
    : (overallHoursLogged ?? totalHoursFiltered);
  const presentDays = filtered.filter((record) => record.totalHours > 0).length;
  const totalAllHours = allSorted.reduce(
    (sum, record) => sum + (Number(record.totalHours) || 0),
    0,
  );

  const availableMonths = useMemo(() => {
    const months = new Map();
    allSorted.forEach((record) => {
      if (!record?.date) return;
      const [year, month] = record.date.split("-");
      const key = `${year}-${month}`;
      if (!months.has(key)) {
        const date = new Date(Number(year), Number(month) - 1, 1);
        months.set(key, {
          key,
          label: date.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          }),
        });
      }
    });
    return Array.from(months.values()).sort((a, b) =>
      b.key.localeCompare(a.key),
    );
  }, [allSorted]);

  const handlePrint = async (monthKey) => {
    let recordsToPrint = allSorted;
    let hoursToPrint = totalAllHours;

    if (monthKey && monthKey !== "all") {
      recordsToPrint = allSorted.filter((r) => r.date.startsWith(monthKey));
      hoursToPrint = recordsToPrint.reduce(
        (sum, r) => sum + (Number(r.totalHours) || 0),
        0,
      );
    }

    const pdf = await buildDtrPdf(recordsToPrint, hoursToPrint, userProfile);
    const blob = pdf.output("blob");
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, "_blank", "noopener,noreferrer");
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 60_000);
  };

  const handleSaveRecord = async (payload) => {
    setPendingRecordId(payload.id);

    try {
      const savedRecord = await updateAttendanceHistoryRecord(payload);
      setHistory((prev) =>
        prev.map((record) =>
          record.id === savedRecord.id ? savedRecord : record,
        ),
      );
      setOverallHoursLogged(null);

      const otSent = Boolean(payload.otIn || payload.otOut);
      const otSaved = Boolean(savedRecord?.otIn || savedRecord?.otOut);
      if (otSent && !otSaved) {
        setWarningMessage(
          "Note: Overtime (OT) times were not saved because your database does not currently support OT or has constraints preventing it.",
        );
      }

      return { ok: true };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save changes.";
      return { ok: false, message };
    } finally {
      setPendingRecordId(null);
    }
  };

  const handleDeleteRecord = async (recordId) => {
    setPendingRecordId(recordId);

    try {
      await deleteAttendanceHistoryRecord({ id: recordId });
      setHistory((prev) => prev.filter((record) => record.id !== recordId));
      setOverallHoursLogged(null);
      return { ok: true };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete entry.";
      return { ok: false, message };
    } finally {
      setPendingRecordId(null);
    }
  };

  return (
    <PageShell width="wide">
      <div className="screen-content space-y-5 pt-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <HeaderSection
            title="Activity Logs"
            subtitle="View and review all your attendance records"
          />
          <ActionsSection
            onPrint={handlePrint}
            availableMonths={availableMonths}
          />
        </div>

        <StatsSection
          totalRecords={filtered.length}
          presentDays={presentDays}
          hoursLogged={hoursLogged}
          isLoading={isHistoryLoading || isOverallHoursLoading}
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

        <HistoryListSection
          records={paged}
          isLoading={isHistoryLoading}
          pendingRecordId={pendingRecordId}
          onSaveRecord={handleSaveRecord}
          onDeleteRecord={handleDeleteRecord}
        />

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
