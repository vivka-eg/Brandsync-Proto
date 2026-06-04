"use client";

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import { useMCPAuthContext } from "@/context/mcp/MCPAuthContext";
import {
  getToolsSummary,
  getUsersSummary,
  getUsersList,
  getTimeline,
} from "@/api/mcp/analytics";
import { Activity, ChartBar, Users, Warning } from "phosphor-react";
import { notFound } from "next/navigation";

function StatCard({ label, value, loading }) {
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "12px",
        px: 2.5,
        py: 2,
      }}
    >
      <Typography
        sx={{
          fontSize: "11px",
          fontWeight: 700,
          color: "text.secondary",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          mb: 0.75,
        }}
      >
        {label}
      </Typography>
      {loading ? (
        <Skeleton variant="text" width={56} height={32} />
      ) : (
        <Typography
          sx={{
            fontSize: "22px",
            fontWeight: 800,
            color: "text.primary",
            lineHeight: 1,
          }}
        >
          {value ?? "—"}
        </Typography>
      )}
    </Box>
  );
}

function SectionCard({ title, icon, children }) {
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "12px",
        overflow: "hidden",
        mb: 2,
      }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        {icon}
        <Typography
          sx={{ fontSize: "13px", fontWeight: 700, color: "text.primary" }}
        >
          {title}
        </Typography>
      </Box>
      {children}
    </Box>
  );
}

const TABLE_HEADER_SX = {
  fontSize: "11px",
  fontWeight: 700,
  color: "text.secondary",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const TABLE_ROW_SX = {
  borderBottom: "1px solid",
  borderColor: "divider",
  "&:last-child": { borderBottom: "none" },
  "&:hover": { bgcolor: "action.hover" },
};

export default function McpAnalyticsContent() {
  const { isSuperAdmin } = useMCPAuthContext();

  const [toolsData, setToolsData] = useState(null);
  const [usersData, setUsersData] = useState(null);
  const [usersList, setUsersList] = useState(null);
  const [timeline, setTimeline] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [tools, users, ul, tl] = await Promise.all([
          getToolsSummary(30),
          getUsersSummary(),
          getUsersList(30),
          getTimeline(30),
        ]);
        setToolsData(tools.data);
        setUsersData(users.data);
        setUsersList(ul.data);
        setTimeline(tl.data);
      } catch {
        setError(
          "Could not load analytics. Check that the analytics server is reachable.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const totalCalls = toolsData?.tools?.reduce((s, t) => s + t.calls, 0) ?? null;
  const totalErrors =
    toolsData?.tools?.reduce((s, t) => s + t.errors, 0) ?? null;
  const errorRate =
    totalCalls > 0
      ? `${((totalErrors / totalCalls) * 100).toFixed(1)}%`
      : totalCalls === 0
        ? "0%"
        : null;

  if (!isSuperAdmin) notFound();

  return (
    <Box sx={{ maxWidth: 860 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Chip
          icon={<Activity size={14} weight="fill" color="#6366f1" />}
          label="Admin"
          variant="outlined"
          size="small"
          sx={{
            mb: 1.5,
            borderRadius: "6px",
            fontWeight: 600,
            fontSize: "12px",
            borderColor: "rgba(99,102,241,0.3)",
            bgcolor: "rgba(99,102,241,0.05)",
            color: "text.primary",
          }}
        />
        <Typography
          variant="h1"
          fontWeight={800}
          sx={{
            fontSize: { xs: "24px", md: "28px" },
            color: "text.primary",
            letterSpacing: "-0.02em",
            mb: 0.5,
          }}
        >
          MCP Analytics
        </Typography>
        <Typography sx={{ fontSize: "14px", color: "text.secondary" }}>
          Tool usage, error rates, and user activity — last 30 days.
        </Typography>
      </Box>

      {error && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 1.5,
            mb: 2.5,
            borderRadius: "10px",
            bgcolor: "rgba(239,68,68,0.05)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <Warning size={18} weight="fill" color="#ef4444" />
          <Typography sx={{ fontSize: "13px", color: "text.secondary" }}>
            {error}
          </Typography>
        </Box>
      )}

      {/* Stats grid — 3 columns × 2 rows */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 1.5,
          mb: 2.5,
        }}
      >
        <StatCard
          label="Total Calls (30d)"
          value={loading ? null : totalCalls?.toLocaleString()}
          loading={loading}
        />
        <StatCard
          label="Errors"
          value={loading ? null : totalErrors?.toLocaleString()}
          loading={loading}
        />
        <StatCard
          label="Error Rate"
          value={loading ? null : errorRate}
          loading={loading}
        />
        <StatCard
          label="Active Users (30d)"
          value={loading ? null : usersData?.users?.activeLast30}
          loading={loading}
        />
        <StatCard
          label="Active Users (7d)"
          value={loading ? null : usersData?.users?.activeLast7}
          loading={loading}
        />
        <StatCard
          label="Total Users"
          value={loading ? null : usersData?.users?.total}
          loading={loading}
        />
      </Box>

      {/* Tools table */}
      <SectionCard
        title="Tool Calls"
        icon={<ChartBar size={14} weight="duotone" color="#10b981" />}
      >
        {loading && (
          <Box
            sx={{
              px: 2.5,
              py: 1.5,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} variant="text" height={28} />
            ))}
          </Box>
        )}
        {!loading && toolsData?.tools?.length > 0 && (
          <>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 72px 72px 60px 88px",
                gap: 2,
                px: 2.5,
                py: 1.25,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              {["Tool", "Calls", "Avg ms", "Errors", "Error Rate"].map((h) => (
                <Typography key={h} sx={TABLE_HEADER_SX}>
                  {h}
                </Typography>
              ))}
            </Box>
            {toolsData.tools.map((t) => (
              <Box
                key={t.tool}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 72px 72px 60px 88px",
                  gap: 2,
                  px: 2.5,
                  py: 1.25,
                  ...TABLE_ROW_SX,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "'JetBrains Mono','Fira Code',monospace",
                    fontSize: "12px",
                    color: "text.primary",
                  }}
                >
                  {t.tool}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "text.primary",
                  }}
                >
                  {t.calls.toLocaleString()}
                </Typography>
                <Typography sx={{ fontSize: "13px", color: "text.secondary" }}>
                  {t.avgMs}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "13px",
                    color: t.errors > 0 ? "error.main" : "text.secondary",
                  }}
                >
                  {t.errors}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "13px",
                    color: t.errors > 0 ? "error.main" : "text.secondary",
                  }}
                >
                  {t.errorRate}
                </Typography>
              </Box>
            ))}
          </>
        )}
        {!loading && !toolsData?.tools?.length && !error && (
          <Typography
            sx={{ px: 2.5, py: 2.5, fontSize: "13px", color: "text.secondary" }}
          >
            No tool activity in this period.
          </Typography>
        )}
      </SectionCard>

      {/* Timeline */}
      {!loading && timeline?.days?.length > 0 && (
        <SectionCard
          title="Daily Timeline"
          icon={<Activity size={14} weight="duotone" color="#6366f1" />}
        >
          <Box sx={{ px: 2.5, pt: 2, pb: 1, overflowX: "auto" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                gap: "3px",
                minWidth: 500,
                height: 100,
              }}
            >
              {(() => {
                const max = Math.max(...timeline.days.map((d) => d.calls), 1);
                return timeline.days.map((d) => (
                  <Box
                    key={d.date}
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "9px",
                        color: "text.secondary",
                        mb: 0.25,
                        lineHeight: 1,
                      }}
                    >
                      {d.calls || ""}
                    </Typography>
                    <Box
                      sx={{
                        width: "100%",
                        height: `${Math.max((d.calls / max) * 64, 3)}px`,
                        bgcolor:
                          d.errors > 0
                            ? "rgba(239,68,68,0.45)"
                            : "rgba(99,102,241,0.45)",
                        borderRadius: "3px 3px 0 0",
                      }}
                    />
                  </Box>
                ));
              })()}
            </Box>
            {/* Date labels on a separate row so they don't push bar height */}
            <Box sx={{ display: "flex", gap: "3px", minWidth: 500, mt: 0.5 }}>
              {timeline.days.map((d) => (
                <Box
                  key={d.date}
                  sx={{ flex: 1, display: "flex", justifyContent: "center" }}
                >
                  <Typography
                    sx={{
                      fontSize: "9px",
                      color: "text.secondary",
                      writingMode: "vertical-rl",
                      transform: "rotate(180deg)",
                      lineHeight: 1,
                    }}
                  >
                    {d.date.slice(5)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </SectionCard>
      )}

      {/* Users table */}
      <SectionCard
        title="User Activity (30d)"
        icon={<Users size={14} weight="duotone" color="#6366f1" />}
      >
        {loading && (
          <Box
            sx={{
              px: 2.5,
              py: 1.5,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="text" height={28} />
            ))}
          </Box>
        )}
        {!loading && usersList?.users?.length > 0 && (
          <>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 72px 160px",
                gap: 2,
                px: 2.5,
                py: 1.25,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              {["User", "Calls", "Last Active"].map((h) => (
                <Typography key={h} sx={TABLE_HEADER_SX}>
                  {h}
                </Typography>
              ))}
            </Box>
            {usersList.users.map((u) => (
              <Box
                key={u.user}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 72px 160px",
                  gap: 2,
                  px: 2.5,
                  py: 1.25,
                  ...TABLE_ROW_SX,
                }}
              >
                <Typography sx={{ fontSize: "13px", color: "text.primary" }}>
                  {u.user}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "text.primary",
                  }}
                >
                  {u.calls.toLocaleString()}
                </Typography>
                <Typography sx={{ fontSize: "13px", color: "text.secondary" }}>
                  {u.lastActive ? new Date(u.lastActive).toLocaleString() : "—"}
                </Typography>
              </Box>
            ))}
          </>
        )}
        {!loading && !usersList?.users?.length && !error && (
          <Typography
            sx={{ px: 2.5, py: 2.5, fontSize: "13px", color: "text.secondary" }}
          >
            No user activity in this period.
          </Typography>
        )}
      </SectionCard>
    </Box>
  );
}
