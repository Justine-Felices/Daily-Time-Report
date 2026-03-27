"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  ChevronDown,
  Clock,
  Filter,
  History as HistoryIcon,
  Printer,
  Search,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { PRINT_CSS } from "@/lib/dtr-constants";
import { loadHistoryRecords } from "@/lib/dtr-storage";
import PageShell from "@/components/layout/PageShell";
import GlassCard from "@/components/ui/cards/GlassCard";
import HistoryRow from "@/components/features/dtr/history/HistoryRow";
import PrintableDTR from "@/components/features/dtr/history/PrintableDTR";

const PAGE_SIZE = 6;

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
    return history
      .filter((record) => {
        const noteValue = (record.note || "").toLowerCase();
        const searchValue = search.toLowerCase();
        const matchSearch =
          record.date.includes(search) ||
          record.status.toLowerCase().includes(searchValue) ||
          noteValue.includes(searchValue);

        return (
          matchSearch &&
          (filterStatus === "All" || record.status === filterStatus)
        );
      })
      .sort((left, right) => {
        const diff =
          new Date(left.date).getTime() - new Date(right.date).getTime();
        return sortDir === "desc" ? -diff : diff;
      });
  }, [history, search, filterStatus, sortDir]);

  const allSorted = useMemo(() => {
    return [...history].sort(
      (left, right) =>
        new Date(left.date).getTime() - new Date(right.date).getTime(),
    );
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
          <div>
            <div className="mb-1 flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-xl"
                style={{
                  background: "linear-gradient(135deg,#069494,#FF69B4)",
                  boxShadow: "0 4px 12px rgba(6,148,148,0.35)",
                }}
              >
                <HistoryIcon size={15} color="#fff" />
              </div>
              <h1
                style={{
                  color: "#1E293B",
                  fontFamily: "'Inter',sans-serif",
                  margin: 0,
                }}
              >
                Attendance History
              </h1>
            </div>
            <p
              style={{
                color: "#64748B",
                fontSize: "13px",
                fontFamily: "'Inter',sans-serif",
                margin: 0,
              }}
            >
              View and review all your attendance records
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="flex shrink-0 items-center gap-2 rounded-xl transition-all"
            style={{
              padding: "10px 18px",
              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1.5px solid rgba(6,148,148,0.3)",
              color: "#069494",
              fontFamily: "'Inter',sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow:
                "0 3px 14px rgba(6,148,148,0.15), inset 0 1px 0 rgba(255,255,255,0.9)",
              letterSpacing: "0.02em",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.background =
                "linear-gradient(135deg,#069494,#0aacac)";
              event.currentTarget.style.color = "#fff";
              event.currentTarget.style.boxShadow =
                "0 4px 16px rgba(6,148,148,0.38)";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.background = "rgba(255,255,255,0.75)";
              event.currentTarget.style.color = "#069494";
              event.currentTarget.style.boxShadow =
                "0 3px 14px rgba(6,148,148,0.15), inset 0 1px 0 rgba(255,255,255,0.9)";
            }}
          >
            <Printer size={14} />
            Print DTR (PDF)
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              label: "TOTAL RECORDS",
              value: filtered.length,
              icon: HistoryIcon,
              color: "#069494",
            },
            {
              label: "PRESENT DAYS",
              value: presentDays,
              icon: CheckCircle,
              color: "#16A34A",
            },
            {
              label: "HOURS LOGGED",
              value: `${totalHoursFiltered.toFixed(1)}h`,
              icon: Clock,
              color: "#FF69B4",
            },
          ].map(({ label, value, icon: Icon, color }) => (
            <GlassCard key={label} padding="16px">
              <div className="mb-2 flex items-center gap-1.5">
                <Icon size={12} color={color} />
                <span
                  style={{
                    color: "#94A3B8",
                    fontSize: "8px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    fontFamily: "'Inter',sans-serif",
                  }}
                >
                  {label}
                </span>
              </div>
              <div
                style={{
                  color: "#1E293B",
                  fontSize: "20px",
                  fontWeight: 800,
                  fontFamily: "'Inter',sans-serif",
                  letterSpacing: "-0.02em",
                }}
              >
                {value}
              </div>
            </GlassCard>
          ))}
        </div>

        <GlassCard padding="16px">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={14}
                color="rgba(6,148,148,0.5)"
                className="absolute top-1/2 left-3 -translate-y-1/2"
              />
              <input
                type="text"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search by date, status, notes..."
                className="w-full outline-none"
                style={{
                  padding: "9px 12px 9px 34px",
                  background: "rgba(240,253,253,0.6)",
                  border: "1.5px solid rgba(6,148,148,0.15)",
                  borderRadius: "12px",
                  color: "#1E293B",
                  fontFamily: "'Inter',sans-serif",
                  fontSize: "13px",
                }}
              />
            </div>

            <div className="relative sm:w-48">
              <Filter
                size={13}
                color="rgba(6,148,148,0.5)"
                className="absolute top-1/2 left-3 -translate-y-1/2"
              />
              <select
                value={filterStatus}
                onChange={(event) => {
                  setFilterStatus(event.target.value);
                  setPage(1);
                }}
                className="w-full appearance-none outline-none"
                style={{
                  padding: "9px 36px 9px 32px",
                  background: "rgba(240,253,253,0.6)",
                  border: "1.5px solid rgba(6,148,148,0.15)",
                  borderRadius: "12px",
                  color: "#1E293B",
                  fontFamily: "'Inter',sans-serif",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                {statuses.map((statusValue) => (
                  <option key={statusValue} value={statusValue}>
                    {statusValue}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                color="#069494"
                className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
              />
            </div>

            <button
              onClick={() =>
                setSortDir((current) => (current === "desc" ? "asc" : "desc"))
              }
              className="flex items-center gap-2 rounded-xl transition-all"
              style={{
                padding: "9px 14px",
                background: "rgba(6,148,148,0.08)",
                border: "1.5px solid rgba(6,148,148,0.2)",
                color: "#069494",
                fontFamily: "'Inter',sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                borderRadius: "12px",
              }}
            >
              <TrendingUp size={13} />
              {sortDir === "desc" ? "Newest" : "Oldest"}
            </button>
          </div>
        </GlassCard>

        <div className="space-y-2">
          {paged.length === 0 ? (
            <GlassCard padding="40px" className="flex flex-col items-center">
              <XCircle
                size={36}
                color="rgba(6,148,148,0.25)"
                style={{ marginBottom: "12px" }}
              />
              <div
                style={{
                  color: "#64748B",
                  fontFamily: "'Inter',sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                No records found
              </div>
            </GlassCard>
          ) : (
            paged.map((record) => (
              <HistoryRow key={record.id} record={record} />
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <span
              style={{
                color: "#64748B",
                fontSize: "12px",
                fontFamily: "'Inter',sans-serif",
              }}
            >
              {(currentPage - 1) * PAGE_SIZE + 1}-
              {Math.min(currentPage * PAGE_SIZE, filtered.length)} of{" "}
              {filtered.length}
            </span>
            <div className="flex gap-1.5">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg transition-all"
                    style={{
                      background:
                        pageNum === currentPage
                          ? "linear-gradient(135deg,#069494,#0aacac)"
                          : "rgba(255,255,255,0.7)",
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                      color: pageNum === currentPage ? "#fff" : "#64748B",
                      border:
                        pageNum === currentPage
                          ? "1px solid rgba(6,148,148,0.3)"
                          : "1px solid rgba(6,148,148,0.14)",
                      cursor: "pointer",
                      fontFamily: "'Inter',sans-serif",
                      fontSize: "13px",
                      fontWeight: 600,
                      boxShadow:
                        pageNum === currentPage
                          ? "0 2px 8px rgba(6,148,148,0.3)"
                          : "none",
                    }}
                  >
                    {pageNum}
                  </button>
                ),
              )}
            </div>
          </div>
        )}
      </div>

      <div className="print-dtr">
        <PrintableDTR records={allSorted} totalHours={totalAllHours} />
      </div>
    </PageShell>
  );
}
