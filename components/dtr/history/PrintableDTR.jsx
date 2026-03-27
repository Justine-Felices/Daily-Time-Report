import { formatDayName, formatPrintDate } from "@/lib/dtr-formatters";

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
        fontFamily: "'Times New Roman', Times, serif",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          textAlign: "center",
          borderBottom: "2px solid #000",
          paddingBottom: "12px",
          marginBottom: "14px",
        }}
      >
        <div style={{ fontSize: "11pt", color: "#444", marginBottom: "2px" }}>
          Republic of the Philippines
        </div>
        <div
          style={{
            fontSize: "20pt",
            fontWeight: "bold",
            letterSpacing: "0.04em",
            margin: "4px 0",
          }}
        >
          DAILY TIME RECORD
        </div>
        <div style={{ fontSize: "10pt", color: "#555" }}>
          CS Form No. 48 - On-the-Job Training (OJT) Attendance
        </div>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "14px",
          fontSize: "10pt",
        }}
      >
        <tbody>
          <tr>
            <td style={{ width: "50%", padding: "4px 0" }}>
              <strong>Name:</strong>{" "}
              <span
                style={{
                  borderBottom: "1px solid #000",
                  display: "inline-block",
                  minWidth: "200px",
                }}
              >
                Alex Rivera
              </span>
            </td>
            <td style={{ width: "50%", padding: "4px 0" }}>
              <strong>Period:</strong>{" "}
              <span
                style={{
                  borderBottom: "1px solid #000",
                  display: "inline-block",
                  minWidth: "160px",
                }}
              >
                {periodLabel}
              </span>
            </td>
          </tr>
          <tr>
            <td style={{ padding: "4px 0" }}>
              <strong>Position:</strong>{" "}
              <span
                style={{
                  borderBottom: "1px solid #000",
                  display: "inline-block",
                  minWidth: "180px",
                }}
              >
                OJT Trainee
              </span>
            </td>
            <td style={{ padding: "4px 0" }}>
              <strong>Department:</strong>{" "}
              <span
                style={{
                  borderBottom: "1px solid #000",
                  display: "inline-block",
                  minWidth: "160px",
                }}
              >
                Information Technology
              </span>
            </td>
          </tr>
          <tr>
            <td style={{ padding: "4px 0" }}>
              <strong>Supervisor:</strong>{" "}
              <span
                style={{
                  borderBottom: "1px solid #000",
                  display: "inline-block",
                  minWidth: "180px",
                }}
              >
                Ms. Maria Santos
              </span>
            </td>
            <td style={{ padding: "4px 0" }}>
              <strong>Company:</strong>{" "}
              <span
                style={{
                  borderBottom: "1px solid #000",
                  display: "inline-block",
                  minWidth: "160px",
                }}
              >
                TechCorp Inc.
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: "9pt" }}
      >
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th
              style={{
                border: "1px solid #000",
                padding: "6px 4px",
                textAlign: "center",
                width: "80px",
              }}
            >
              DATE
            </th>
            <th
              style={{
                border: "1px solid #000",
                padding: "6px 4px",
                textAlign: "center",
                width: "40px",
              }}
            >
              DAY
            </th>
            <th
              colSpan={2}
              style={{
                border: "1px solid #000",
                padding: "6px 4px",
                textAlign: "center",
              }}
            >
              A.M.
            </th>
            <th
              colSpan={2}
              style={{
                border: "1px solid #000",
                padding: "6px 4px",
                textAlign: "center",
              }}
            >
              P.M.
            </th>
            <th
              style={{
                border: "1px solid #000",
                padding: "6px 4px",
                textAlign: "center",
                width: "55px",
              }}
            >
              HOURS
            </th>
            <th
              style={{
                border: "1px solid #000",
                padding: "6px 4px",
                textAlign: "center",
                width: "120px",
              }}
            >
              REMARKS
            </th>
          </tr>
          <tr style={{ background: "#f8f8f8" }}>
            <th style={{ border: "1px solid #000", padding: "3px 4px" }}></th>
            <th style={{ border: "1px solid #000", padding: "3px 4px" }}></th>
            <th
              style={{
                border: "1px solid #000",
                padding: "3px 4px",
                textAlign: "center",
                fontSize: "8pt",
              }}
            >
              IN
            </th>
            <th
              style={{
                border: "1px solid #000",
                padding: "3px 4px",
                textAlign: "center",
                fontSize: "8pt",
              }}
            >
              OUT
            </th>
            <th
              style={{
                border: "1px solid #000",
                padding: "3px 4px",
                textAlign: "center",
                fontSize: "8pt",
              }}
            >
              IN
            </th>
            <th
              style={{
                border: "1px solid #000",
                padding: "3px 4px",
                textAlign: "center",
                fontSize: "8pt",
              }}
            >
              OUT
            </th>
            <th style={{ border: "1px solid #000", padding: "3px 4px" }}></th>
            <th style={{ border: "1px solid #000", padding: "3px 4px" }}></th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr
              key={record.id}
              style={{ background: index % 2 === 0 ? "#fff" : "#fafafa" }}
            >
              <td
                style={{
                  border: "1px solid #000",
                  padding: "4px",
                  textAlign: "center",
                }}
              >
                {formatPrintDate(record.date)}
              </td>
              <td
                style={{
                  border: "1px solid #000",
                  padding: "4px",
                  textAlign: "center",
                }}
              >
                {formatDayName(record.date)}
              </td>
              <td
                style={{
                  border: "1px solid #000",
                  padding: "4px",
                  textAlign: "center",
                }}
              >
                {record.amIn || ""}
              </td>
              <td
                style={{
                  border: "1px solid #000",
                  padding: "4px",
                  textAlign: "center",
                }}
              >
                {record.amOut || ""}
              </td>
              <td
                style={{
                  border: "1px solid #000",
                  padding: "4px",
                  textAlign: "center",
                }}
              >
                {record.pmIn || ""}
              </td>
              <td
                style={{
                  border: "1px solid #000",
                  padding: "4px",
                  textAlign: "center",
                }}
              >
                {record.pmOut || ""}
              </td>
              <td
                style={{
                  border: "1px solid #000",
                  padding: "4px",
                  textAlign: "center",
                  fontWeight: record.totalHours > 0 ? "bold" : "normal",
                }}
              >
                {record.totalHours > 0 ? `${record.totalHours}h` : ""}
              </td>
              <td
                style={{
                  border: "1px solid #000",
                  padding: "4px",
                  textAlign: "left",
                  fontSize: "8pt",
                }}
              >
                {record.note
                  ? `${
                      record.status !== "Regular Duty Day"
                        ? `${record.status} - `
                        : ""
                    }${record.note}`
                  : record.status !== "Regular Duty Day"
                    ? record.status
                    : ""}
              </td>
            </tr>
          ))}

          <tr style={{ background: "#f0f0f0", fontWeight: "bold" }}>
            <td
              colSpan={6}
              style={{
                border: "1px solid #000",
                padding: "6px 4px",
                textAlign: "right",
                fontSize: "9pt",
              }}
            >
              TOTAL HOURS RENDERED:
            </td>
            <td
              style={{
                border: "1px solid #000",
                padding: "6px 4px",
                textAlign: "center",
                fontSize: "10pt",
              }}
            >
              {totalHours.toFixed(1)}h
            </td>
            <td style={{ border: "1px solid #000", padding: "6px 4px" }}></td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: "20px", fontSize: "9pt", lineHeight: 1.5 }}>
        <p style={{ fontStyle: "italic", marginBottom: "14px" }}>
          I certify on my honor that the above is a true and correct report of
          the hours of work performed, record of which was made daily at the
          time of arrival at and departure from office.
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "40px",
            marginTop: "24px",
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                borderBottom: "1px solid #000",
                minHeight: "28px",
                marginBottom: "4px",
              }}
            />
            <div style={{ textAlign: "center" }}>
              <strong>Alex Rivera</strong>
              <br />
              Signature of Employee / Date
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                borderBottom: "1px solid #000",
                minHeight: "28px",
                marginBottom: "4px",
              }}
            />
            <div style={{ textAlign: "center" }}>
              <strong>Ms. Maria Santos</strong>
              <br />
              Verified by Supervisor / Date
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: "24px",
          borderTop: "1px solid #ccc",
          paddingTop: "8px",
          textAlign: "center",
          fontSize: "8pt",
          color: "#666",
        }}
      >
        Generated by TimeTrack Daily Time Report System -{" "}
        {new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
    </div>
  );
}
