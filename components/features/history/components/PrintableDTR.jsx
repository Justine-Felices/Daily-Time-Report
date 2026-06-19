import { formatDayName, formatPrintDate } from "@/lib/dtr-formatters";

const TIME_CELL_STYLE = {
  borderLeft: "1px solid #000",
  borderBottom: "1px solid #000",
  padding: "8px 4px",
  textAlign: "center",
  whiteSpace: "nowrap",
};

export default function PrintableDTR({ records, totalHours }) {
  const today = new Date();
  const periodLabel = today.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div
      style={{
        background: "#fff",
        color: "#000",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "40px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          borderBottom: "3px solid #000",
          paddingBottom: "20px",
          marginBottom: "30px",
        }}
      >
        <div style={{ textAlign: "left" }}>
          <div style={{ fontSize: "10pt", color: "#666", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Official Attendance Report
          </div>
          <div
            style={{
              fontSize: "26pt",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              margin: "4px 0",
              lineHeight: 1,
            }}
          >
            DAILY TIME RECORD
          </div>
          <div style={{ fontSize: "9pt", color: "#888", fontWeight: 500 }}>
            Civil Service Form No. 48 • OJT Performance Tracking
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "10pt", fontWeight: 700, color: "#000" }}>PERIOD OF SERVICE</div>
          <div style={{ fontSize: "14pt", fontWeight: 800, color: "#3b82f6", textTransform: "uppercase" }}>
            {periodLabel}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginBottom: "30px" }}>
        <div style={{ background: "#f8fafc", padding: "15px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: "8pt", color: "#64748b", fontWeight: 700, textTransform: "uppercase", marginBottom: "8px" }}>Trainee Information</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <div style={{ fontSize: "11pt" }}><strong>Name:</strong> <span style={{ color: "#1e293b", fontWeight: 600 }}>Alex Rivera</span></div>
            <div style={{ fontSize: "11pt" }}><strong>Position:</strong> <span style={{ color: "#1e293b", fontWeight: 600 }}>OJT Trainee</span></div>
          </div>
        </div>
        <div style={{ background: "#f8fafc", padding: "15px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: "8pt", color: "#64748b", fontWeight: 700, textTransform: "uppercase", marginBottom: "8px" }}>Assignment Details</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <div style={{ fontSize: "11pt" }}><strong>Dept:</strong> <span style={{ color: "#1e293b", fontWeight: 600 }}>Information Technology</span></div>
            <div style={{ fontSize: "11pt" }}><strong>Supervisor:</strong> <span style={{ color: "#1e293b", fontWeight: 600 }}>Ms. Maria Santos</span></div>
          </div>
        </div>
      </div>

      <table
        style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: "9pt" }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid #000", borderRight: "none", padding: "10px 5px", textAlign: "center", width: "90px", background: "#000", color: "#fff" }}>DATE</th>
            <th style={{ border: "1px solid #000", borderRight: "none", padding: "10px 5px", textAlign: "center", width: "45px", background: "#000", color: "#fff" }}>DAY</th>
            <th colSpan={2} style={{ border: "1px solid #000", borderRight: "none", padding: "10px 5px", textAlign: "center", background: "#f1f5f9", fontWeight: 800 }}>MORNING PRE-NOON</th>
            <th colSpan={2} style={{ border: "1px solid #000", borderRight: "none", padding: "10px 5px", textAlign: "center", background: "#f1f5f9", fontWeight: 800 }}>AFTERNOON POST-NOON</th>
            <th colSpan={2} style={{ border: "1px solid #000", borderRight: "none", padding: "10px 5px", textAlign: "center", background: "#f1f5f9", fontWeight: 800 }}>OVERTIME ONLY</th>
            <th style={{ border: "1px solid #000", borderRight: "none", padding: "10px 5px", textAlign: "center", width: "65px", background: "#3b82f6", color: "#fff" }}>HOURS</th>
            <th style={{ border: "1px solid #000", padding: "10px 5px", textAlign: "center", width: "150px", background: "#f1f5f9", fontWeight: 800 }}>ACTIVITIES / REMARKS</th>
          </tr>
          <tr>
            <th style={{ borderLeft: "1px solid #000", borderBottom: "1px solid #000", padding: "4px" }}></th>
            <th style={{ borderLeft: "1px solid #000", borderBottom: "1px solid #000", padding: "4px" }}></th>
            <th style={{ borderLeft: "1px solid #000", borderBottom: "1px solid #000", padding: "4px", textAlign: "center", fontSize: "7pt", fontWeight: 800 }}>IN</th>
            <th style={{ borderLeft: "1px solid #000", borderBottom: "1px solid #000", padding: "4px", textAlign: "center", fontSize: "7pt", fontWeight: 800 }}>OUT</th>
            <th style={{ borderLeft: "1px solid #000", borderBottom: "1px solid #000", padding: "4px", textAlign: "center", fontSize: "7pt", fontWeight: 800 }}>IN</th>
            <th style={{ borderLeft: "1px solid #000", borderBottom: "1px solid #000", padding: "4px", textAlign: "center", fontSize: "7pt", fontWeight: 800 }}>OUT</th>
            <th style={{ borderLeft: "1px solid #000", borderBottom: "1px solid #000", padding: "4px", textAlign: "center", fontSize: "7pt", fontWeight: 800 }}>IN</th>
            <th style={{ borderLeft: "1px solid #000", borderBottom: "1px solid #000", padding: "4px", textAlign: "center", fontSize: "7pt", fontWeight: 800 }}>OUT</th>
            <th style={{ borderLeft: "1px solid #000", borderBottom: "1px solid #000", padding: "4px" }}></th>
            <th style={{ borderLeft: "1px solid #000", borderRight: "1px solid #000", borderBottom: "1px solid #000", padding: "4px" }}></th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={record.id}>
              <td style={{ borderLeft: "1px solid #000", borderBottom: "1px solid #000", padding: "8px 4px", textAlign: "center", fontWeight: 600 }}>{formatPrintDate(record.date)}</td>
              <td style={{ borderLeft: "1px solid #000", borderBottom: "1px solid #000", padding: "8px 4px", textAlign: "center", color: "#64748b" }}>{formatDayName(record.date).substring(0,3)}</td>
              <td style={TIME_CELL_STYLE}>{record.amIn || "—"}</td>
              <td style={TIME_CELL_STYLE}>{record.amOut || "—"}</td>
              <td style={TIME_CELL_STYLE}>{record.pmIn || "—"}</td>
              <td style={TIME_CELL_STYLE}>{record.pmOut || "—"}</td>
              <td style={TIME_CELL_STYLE}>{record.otIn || "—"}</td>
              <td style={TIME_CELL_STYLE}>{record.otOut || "—"}</td>
              <td style={{ borderLeft: "1px solid #000", borderBottom: "1px solid #000", padding: "8px 4px", textAlign: "center", fontWeight: 800, color: "#3b82f6" }}>{record.totalHours > 0 ? `${record.totalHours.toFixed(1)}` : ""}</td>
              <td style={{ borderLeft: "1px solid #000", borderRight: "1px solid #000", borderBottom: "1px solid #000", padding: "8px 6px", textAlign: "left", fontSize: "8pt" }}>
                {record.note
                  ? `${
                      record.status !== "Regular Duty Day"
                        ? "[" + record.status.toUpperCase() + "] "
                        : ""
                    }${record.note}`
                  : record.status !== "Regular Duty Day"
                    ? record.status
                    : ""}
              </td>
            </tr>
          ))}

          <tr style={{ background: "#000", color: "#fff", fontWeight: "black" }}>
            <td colSpan={8} style={{ padding: "12px", textAlign: "right", fontSize: "10pt", letterSpacing: "0.05em" }}>TOTAL RENDERED HOURS:</td>
            <td style={{ padding: "12px", textAlign: "center", fontSize: "12pt", fontWeight: 900 }}>{totalHours.toFixed(1)}</td>
            <td style={{ borderLeft: "1px solid #fff", padding: "12px" }}></td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: "50px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "100px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ borderBottom: "2px solid #000", paddingBottom: "5px", fontWeight: 800, fontSize: "11pt" }}>ALEX RIVERA</div>
          <div style={{ fontSize: "9pt", marginTop: "5px", color: "#666", textTransform: "uppercase", fontWeight: 600 }}>Trainee Signature</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ borderBottom: "2px solid #000", paddingBottom: "5px", fontWeight: 800, fontSize: "11pt" }}>MS. MARIA SANTOS</div>
          <div style={{ fontSize: "9pt", marginTop: "5px", color: "#666", textTransform: "uppercase", fontWeight: 600 }}>Supervisor / In-Charge</div>
        </div>
      </div>
    </div>
  );
}
