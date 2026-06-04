"use client";

import { useRef, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  Buildings,
  MapPin,
  Activity,
  User,
  FileText,
  MagnifyingGlass,
  Clock,
  Question,
  Copy,
  Funnel,
  DotsThree,
  CaretRight,
  CaretLeft,
  CaretDown,
  ArrowCounterClockwise,
  Plus,
  Lock,
  Shield,
  Export,
} from "phosphor-react";

/* ─── canvas dimensions ──────────────────────────────────────── */
const NW = 640;
const NH = 420;
const CHROME_H = 38;
const SIDEBAR_W = 155;

/* ─── data ───────────────────────────────────────────────────── */
const TABLE_ROWS = [
  { name: "CleanPilot Integration",    address: "123 Main Street",  postcode: "1234", type: "Commercial",  status: "Active"   },
  { name: "CleanPilot Integration II", address: "456 Oak Avenue",   postcode: "5678", type: "Residential", status: "Inactive" },
  { name: "Dynamic_Year_Testing",      address: "789 Pine Road",    postcode: "9012", type: "Industrial",  status: "Active"   },
  { name: "testing_dynamic",           address: "321 Elm Street",   postcode: "3456", type: "Commercial",  status: "Expired"  },
  { name: "Testing_prop",              address: "654 Maple Drive",  postcode: "7890", type: "Residential", status: "Active"   },
  { name: "Lysaker Torg 4",            address: "Lysaker Torg 4",   postcode: "1366", type: "Office",      status: "Inactive" },
  { name: "Lysaker Torg 6",            address: "Lysaker Torg 6",   postcode: "1366", type: "Office",      status: "Active"   },
  { name: "Lysaker Torg 10",           address: "Lysaker Torg 10",  postcode: "1366", type: "Office",      status: "Expired"  },
];

const STATUS_STYLE = {
  Active:   { bg: "#dcfce7", color: "#16a34a" },
  Inactive: { bg: "#f1f5f9", color: "#64748b" },
  Expired:  { bg: "#fee2e2", color: "#dc2626" },
};

const NAV_ITEMS = [
  { label: "Facility",  Icon: Buildings },
  { label: "Map",       Icon: MapPin    },
  { label: "Activity",  Icon: Activity  },
  { label: "Agent",     Icon: User      },
  { label: "Agreement", Icon: FileText  },
];

const COL_TEMPLATE = "24px 2fr 1.4fr 0.7fr 0.85fr 0.9fr 1.1fr";

/* ─── helpers ────────────────────────────────────────────────── */

function TrafficDot({ color }) {
  return <Box sx={{ width: 11, height: 11, borderRadius: "50%", bgcolor: color, flexShrink: 0 }} />;
}

function Checkbox() {
  return (
    <Box
      sx={{
        width: 12, height: 12,
        border: "1.5px solid #cbd5e1",
        borderRadius: "3px",
        flexShrink: 0,
      }}
    />
  );
}

/* ─── Browser Chrome ─────────────────────────────────────────── */

function BrowserChrome() {
  return (
    <Box
      sx={{
        height: CHROME_H,
        bgcolor: "#f5f5f5",
        borderBottom: "1px solid #e2e8f0",
        display: "flex",
        alignItems: "center",
        px: 2,
        gap: "10px",
        flexShrink: 0,
      }}
    >
      {/* Traffic-light dots */}
      <Box sx={{ display: "flex", gap: "6px", alignItems: "center" }}>
        <TrafficDot color="#ef4444" />
        <TrafficDot color="#f59e0b" />
        <TrafficDot color="#22c55e" />
      </Box>

      {/* Tab square + back/forward */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <Box sx={{ width: 16, height: 13, border: "1px solid #d1d5db", borderRadius: "3px" }} />
        <Box sx={{ display: "flex", alignItems: "center", color: "#9ca3af" }}><CaretLeft size={13} /></Box>
        <Box sx={{ display: "flex", alignItems: "center", color: "#d1d5db" }}><CaretRight size={13} /></Box>
      </Box>

      {/* Shield icon; outside URL bar */}
      <Box sx={{ display: "flex", alignItems: "center", color: "#374151" }}>
        <Shield size={14} weight="fill" />
      </Box>

      {/* URL bar */}
      <Box
        sx={{
          flex: 1,
          height: 24,
          bgcolor: "white",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          px: 1.5,
          gap: 0.75,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", color: "#9ca3af", flexShrink: 0 }}>
          <Lock size={10} />
        </Box>
        <Typography sx={{ fontSize: 11, color: "#374151", flex: 1, textAlign: "center", lineHeight: 1 }}>
          https://www.eg.dk
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", color: "#9ca3af", flexShrink: 0 }}>
          <ArrowCounterClockwise size={10} />
        </Box>
      </Box>

      {/* Right chrome icons */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "6px", color: "#6b7280" }}>
        <Export size={12} />
        <Plus size={12} />
        <Box sx={{ width: 12, height: 11, border: "1px solid #d1d5db", borderRadius: "2px" }} />
      </Box>
    </Box>
  );
}

/* ─── App Sidebar (white theme) ──────────────────────────────── */

function AppSidebar() {
  return (
    <Box
      sx={{
        width: SIDEBAR_W,
        flexShrink: 0,
        bgcolor: "white",
        borderRight: "1px solid #f0f2f5",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* EG Logo; two overlapping colored squares */}
      <Box sx={{ px: 1.75, pt: 1.5, pb: 1 }}>
        <Box sx={{ position: "relative", width: 32, height: 28 }}>
          {/* Back square (navy) */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 20,
              height: 20,
              bgcolor: "#1d4ed8",
              borderRadius: "4px",
            }}
          />
          {/* Front square (blue) */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: 20,
              height: 20,
              bgcolor: "#3b82f6",
              borderRadius: "4px",
            }}
          />
        </Box>
      </Box>

      {/* Section header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 1.75,
          py: 0.75,
          borderBottom: "1px solid #f0f2f5",
          mb: 0.25,
        }}
      >
        <Typography sx={{ fontSize: 11, color: "#374151", fontWeight: 500, lineHeight: 1.3 }}>
          EG Facilit | Property
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", color: "#9ca3af", flexShrink: 0 }}>
          <CaretLeft size={11} />
        </Box>
      </Box>

      {/* Nav items */}
      <Box sx={{ flex: 1 }}>
        {NAV_ITEMS.map(({ label, Icon }) => (
          <Box
            key={label}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 1.75,
              py: 0.85,
              cursor: "pointer",
              "&:hover": { bgcolor: "#f9fafb" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", color: "#6b7280" }}>
                <Icon size={13} />
              </Box>
              <Typography sx={{ fontSize: 11, color: "#374151", fontWeight: 400 }}>
                {label}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", color: "#9ca3af" }}>
              <CaretDown size={10} />
            </Box>
          </Box>
        ))}
      </Box>

      {/* Bottom user area */}
      <Box
        sx={{
          borderTop: "1px solid #f0f2f5",
          px: 1.5,
          py: 0.85,
          display: "flex",
          alignItems: "center",
          gap: 0.85,
        }}
      >
        <Box
          sx={{
            width: 26, height: 26,
            borderRadius: "50%",
            bgcolor: "#b45309",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Typography sx={{ fontSize: 9, color: "white", fontWeight: 700, lineHeight: 1 }}>FM</Typography>
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: 10, color: "#111827", fontWeight: 600, lineHeight: 1.3 }}>
            Facility Manager
          </Typography>
          <Typography noWrap sx={{ fontSize: 9, color: "#6b7280", lineHeight: 1.3 }}>
            manager@eg.dk
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", color: "#9ca3af" }}>
          <CaretRight size={10} />
        </Box>
      </Box>
    </Box>
  );
}

/* ─── Toolbar button ─────────────────────────────────────────── */

function ToolbarBtn({ children, blue }) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        border: blue ? "none" : "1px solid #e2e8f0",
        borderRadius: "6px",
        px: "8px",
        py: "4px",
        bgcolor: blue ? "#3b82f6" : "white",
        flexShrink: 0,
      }}
    >
      {children}
    </Box>
  );
}

/* ─── Main content area ──────────────────────────────────────── */

function AppMainContent() {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        bgcolor: "white",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Top action bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: 2.5,
          py: 0.75,
          borderBottom: "1px solid #f0f2f5",
          gap: 1.5,
          flexShrink: 0,
          bgcolor: "white",
        }}
      >
        <Box
          sx={{
            display: "flex", alignItems: "center", gap: 0.75,
            border: "1px solid #e2e8f0",
            borderRadius: "18px",
            px: 1.25, py: 0.4,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", color: "#94a3b8" }}><MagnifyingGlass size={10} /></Box>
          <Typography sx={{ fontSize: 10, color: "#94a3b8" }}>Search</Typography>
        </Box>

        <Box sx={{ flex: 1 }} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", color: "#64748b" }}><Clock size={10} /></Box>
            <Typography sx={{ fontSize: 9.5, color: "#64748b" }}>Recent History</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", color: "#64748b" }}><Question size={10} /></Box>
            <Typography sx={{ fontSize: 9.5, color: "#64748b" }}>Help</Typography>
          </Box>
          <Box
            sx={{
              width: 22, height: 22,
              borderRadius: "50%",
              bgcolor: "#3b82f6",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Typography sx={{ fontSize: 8.5, color: "white", fontWeight: 700, lineHeight: 1 }}>US</Typography>
          </Box>
        </Box>
      </Box>

      {/* Page content */}
      <Box sx={{ px: 2.5, pt: 1.5, flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", bgcolor: "white" }}>
        {/* Heading */}
        <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#0f172a", mb: 1, lineHeight: 1 }}>
          Property
        </Typography>

        {/* Toolbar */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "6px", mb: 0.75, flexWrap: "nowrap" }}>
          <ToolbarBtn>
            <Typography sx={{ fontSize: 9.5, color: "#374151" }}>My reports</Typography>
            <Box sx={{ display: "flex", alignItems: "center", color: "#9ca3af" }}><CaretDown size={8} /></Box>
          </ToolbarBtn>

          <ToolbarBtn>
            <Typography sx={{ fontSize: 9.5, color: "#374151" }}>+ New report</Typography>
          </ToolbarBtn>

          {[Copy, Funnel, DotsThree].map((Icon, i) => (
            <Box
              key={i}
              sx={{
                width: 24, height: 24,
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#6b7280",
              }}
            >
              <Icon size={11} />
            </Box>
          ))}

          <Box sx={{ flex: 1 }} />

          <ToolbarBtn>
            <Typography sx={{ fontSize: 9, color: "#374151" }}>+ Add agent roles</Typography>
          </ToolbarBtn>

          <ToolbarBtn blue>
            <Typography sx={{ fontSize: 9, color: "white", fontWeight: 600 }}>+ New row</Typography>
          </ToolbarBtn>
        </Box>

        {/* Row count */}
        <Typography sx={{ fontSize: 9, color: "#94a3b8", mb: 0.75 }}>
          Showing rows 1-10 out of 100
        </Typography>

        {/* Table */}
        <Box sx={{ border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden", flex: 1, bgcolor: "white" }}>
          {/* Header */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: COL_TEMPLATE,
              bgcolor: "#f8fafc",
              borderBottom: "1px solid #e2e8f0",
              px: 1.5, py: 0.75,
              gap: 0.5,
              alignItems: "center",
            }}
          >
            <Checkbox />
            {["Name", "Address", "Post code", "Type", "Status", "Last Updated"].map((col) => (
              <Typography key={col} sx={{ fontSize: 9, fontWeight: 600, color: "#64748b", lineHeight: 1 }}>
                {col}
              </Typography>
            ))}
          </Box>

          {/* Rows */}
          {TABLE_ROWS.map((row, i) => {
            const s = STATUS_STYLE[row.status];
            return (
              <Box
                key={i}
                sx={{
                  display: "grid",
                  gridTemplateColumns: COL_TEMPLATE,
                  borderBottom: i < TABLE_ROWS.length - 1 ? "1px solid #f1f5f9" : "none",
                  px: 1.5,
                  py: 0.6,
                  gap: 0.5,
                  alignItems: "center",
                  bgcolor: "white",
                  "&:hover": { bgcolor: "#f8fafc" },
                }}
              >
                <Checkbox />
                <Typography noWrap sx={{ fontSize: 9.5, color: "#0f172a", lineHeight: 1.2 }}>{row.name}</Typography>
                <Typography noWrap sx={{ fontSize: 9,   color: "#64748b", lineHeight: 1.2 }}>{row.address}</Typography>
                <Typography       sx={{ fontSize: 9,   color: "#64748b", lineHeight: 1.2 }}>{row.postcode}</Typography>
                <Typography noWrap sx={{ fontSize: 9,   color: "#64748b", lineHeight: 1.2 }}>{row.type}</Typography>
                <Box>
                  <Box sx={{ display: "inline-flex", px: 1, py: 0.25, borderRadius: "12px", bgcolor: s.bg }}>
                    <Typography sx={{ fontSize: 8.5, color: s.color, fontWeight: 600, lineHeight: 1 }}>
                      {row.status}
                    </Typography>
                  </Box>
                </Box>
                <Typography sx={{ fontSize: 9, color: "#94a3b8", lineHeight: 1.2 }}>00/00/0000</Typography>
              </Box>
            );
          })}
        </Box>

        {/* Pagination */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            py: 0.85,
            flexShrink: 0,
            bgcolor: "white",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <Typography sx={{ fontSize: 9, color: "#64748b" }}>Rows per page</Typography>
            <Box
              sx={{
                display: "flex", alignItems: "center", gap: 0.5,
                border: "1px solid #e2e8f0",
                borderRadius: "5px",
                px: 0.75, py: 0.3,
              }}
            >
              <Typography sx={{ fontSize: 9, color: "#374151" }}>12</Typography>
              <Box sx={{ display: "flex", alignItems: "center", color: "#9ca3af" }}><CaretDown size={7} /></Box>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", color: "#94a3b8" }}><CaretLeft size={11} /></Box>
            <Box
              sx={{
                width: 20, height: 20,
                borderRadius: "5px",
                bgcolor: "#f1f5f9",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <Typography sx={{ fontSize: 9, fontWeight: 600, color: "#374151", lineHeight: 1 }}>2</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", color: "#94a3b8" }}><CaretRight size={11} /></Box>
            <Typography sx={{ fontSize: 9, color: "#64748b" }}>of 10 pages</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/* ─── Root export ────────────────────────────────────────────── */

export default function DashboardUIPreview() {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(0.65);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / NW);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: "100%",
        height: NH * scale,
        position: "relative",
        overflow: "hidden",
        borderRadius: "10px",
        bgcolor: "#e8ecf0",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: NW,
          height: NH,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#e8ecf0",
        }}
      >
        <Box
          sx={{
            width: NW - 40,
            height: NH - 30,
            bgcolor: "#ffffff",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 4px 24px rgba(0,0,0,0.13)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <BrowserChrome />
          <Box sx={{ display: "flex", flex: 1, overflow: "hidden", bgcolor: "#ffffff" }}>
            <AppSidebar />
            <AppMainContent />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
