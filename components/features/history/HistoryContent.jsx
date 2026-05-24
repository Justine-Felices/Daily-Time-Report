"use client";

import { useEffect, useMemo, useState } from "react";
import { PRINT_CSS } from "@/lib/dtr-constants";
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

  const dateOptions = { year: "numeric", month: "long", day: "numeric" };
  const monthLabelOptions = { year: "numeric", month: "long" };
  const formattedGeneratedDate = new Date().toLocaleDateString(
    "en-US",
    dateOptions,
  );

  // --- Inspired Header Layout ---
  const headerY = 55;
  const iconSize = 38;

  // Simple Clipboard Icon Drawing
  pdf.setDrawColor(2, 30, 60);
  pdf.setLineWidth(2);
  pdf.roundedRect(margin, headerY - 18, iconSize, iconSize + 2, 4, 4);
  pdf.line(margin + 12, headerY - 18, margin + 26, headerY - 18); // clip
  
  // Icon Internal Details
  pdf.setLineWidth(1);
  pdf.line(margin + 8, headerY - 5, margin + 30, headerY - 5);
  pdf.line(margin + 8, headerY + 1, margin + 30, headerY + 1);
  pdf.line(margin + 8, headerY + 7, margin + 20, headerY + 7);

  // Title Section
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(22);
  pdf.setTextColor(2, 30, 60);
  pdf.text("DAILY TIME RECORD", margin + 50, headerY + 2);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);
  pdf.setTextColor(80, 80, 80);
  pdf.text("On-the-Job Training (OJT)", margin + 50, headerY + 18);

  // Metadata Right Aligned
  const metaX = pageWidth - margin - 170;
  pdf.setFontSize(9);
  pdf.setTextColor(0, 0, 0);
  
  const labels = ["Student Name:", "Target Hours:", "Generated On:"];
  const values = [profile?.full_name || "N/A", profile?.target_hours || "0", formattedGeneratedDate];
  
  labels.forEach((label, i) => {
    const y = headerY - 8 + (i * 14);
    pdf.setFont("helvetica", "bold");
    pdf.text(label, metaX, y);
    pdf.setFont("helvetica", "normal");
    pdf.text(values[i].toString(), metaX + 75, y);
  });

  // Thick Divider Line
  pdf.setDrawColor(2, 30, 60);
  pdf.setLineWidth(1.5);
  pdf.line(margin, headerY + 36, pageWidth - margin, headerY + 36);

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
  const unknownGroup = { label: "Unknown Month", records: [] };

  sortedRecords.forEach((record) => {
    if (!record?.date) {
      unknownGroup.records.push(record);
      return;
    }

    const parts = record.date.split("-");
    if (parts.length !== 3) {
      unknownGroup.records.push(record);
      return;
    }

    const [year, month] = parts;
    const monthKey = `${year}-${month}`;
    let group = monthMap.get(monthKey);
    if (!group) {
      const labelDate = new Date(Number(year), Number(month) - 1, 1);
      const label = labelDate.toLocaleDateString("en-US", monthLabelOptions);
      group = { label, records: [] };
      monthMap.set(monthKey, group);
      monthGroups.push(group);
    }
    group.records.push(record);
  });

  if (unknownGroup.records.length) {
    monthGroups.push(unknownGroup);
  }

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

  const tableStyles = {
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
      0: { cellWidth: 80 },
      1: { cellWidth: 45 },
      2: { cellWidth: 45 },
      3: { cellWidth: 45 },
      4: { cellWidth: 45 },
      5: { cellWidth: 45 },
      6: { cellWidth: 45 },
      7: { cellWidth: 120 },
      8: { cellWidth: 45, halign: "right" },
    },
  };

  let cursorY = 110;
  const ensureSpace = (needed) => {
    if (cursorY + needed > pageHeight - margin) {
      pdf.addPage();
      cursorY = margin;
    }
  };

  monthGroups.forEach((group) => {
    ensureSpace(24);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.text(group.label, margin, cursorY);
    cursorY += 10;

    autoTable(pdf, {
      startY: cursorY,
      margin: { left: margin, right: margin },
      head: tableHead,
      body: group.records.map((record) => [
        formatRecordDate(record),
        record.amIn || "",
        record.amOut || "",
        record.pmIn || "",
        record.pmOut || "",
        record.otIn || "",
        record.otOut || "",
        record.status || "",
        Number(record.totalHours || 0).toFixed(1),
      ]),
      ...tableStyles,
    });

    cursorY = (pdf.lastAutoTable?.finalY || cursorY) + 18;
  });

  ensureSpace(24);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.text(`Total Hours: ${totalHours.toFixed(1)}`, pageWidth - margin, cursorY, {
    align: "right",
  });
  cursorY += 28;

  // --- Signature Section Inspired by Layout ---
  const signatureBlockHeight = 90;
  ensureSpace(signatureBlockHeight);
  
  cursorY += 35;
  const totalWidth = pageWidth - (margin * 2);
  const blockWidth = totalWidth / 2;
  const lineMargin = 30;

  const signatures = [
    { 
      title: "Approved By (OJT Supervisor)", 
      name: "Signature over Printed Name",
      sub: "" 
    },
    { 
      title: "Verified By (HR Department)", 
      name: "Signature over Printed Name",
      sub: "" 
    }
  ];

  signatures.forEach((sig, i) => {
    const startX = margin + (i * blockWidth);
    const centerX = startX + (blockWidth / 2);
    
    // Top Title
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(2, 30, 60);
    pdf.text(sig.title, centerX, cursorY, { align: "center" });

    // Signature Line
    pdf.setDrawColor(180, 180, 180);
    pdf.setLineWidth(0.8);
    pdf.line(startX + lineMargin, cursorY + 22, startX + blockWidth - lineMargin, cursorY + 22);

    // Bottom Name/Label
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(60, 60, 60);
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

  const handlePrint = async () => {
    const pdf = await buildDtrPdf(allSorted, totalAllHours, userProfile);
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
          <ActionsSection onPrint={handlePrint} />
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
