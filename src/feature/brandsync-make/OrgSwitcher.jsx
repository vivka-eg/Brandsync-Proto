"use client";

import { useState } from "react";
import { Button, Menu, MenuItem, Stack, Typography, Chip } from "@mui/material";
import { UsersThree, CaretDown, Check } from "phosphor-react";
import { useActiveOrg } from "@/lib/useActiveOrg";

// Active-org switcher. Picking an org persists the choice (localStorage) and
// thereby scopes new generations, MCP grounding, and browse to that org +
// Brandsync. Render it in the Make header / prompt area.
export default function OrgSwitcher() {
  const { orgs, activeOrgId, activeOrg, setActiveOrgId, loading } = useActiveOrg();
  const [anchor, setAnchor] = useState(null);

  if (loading || orgs.length === 0) return null;

  return (
    <>
      <Button
        size="small"
        startIcon={<UsersThree size={16} weight="fill" />}
        endIcon={<CaretDown size={12} weight="bold" />}
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{
          textTransform: "none",
          color: "var(--bs-text-default)",
          border: "1px solid var(--bs-border-default)",
          borderRadius: "var(--bs-border-radius-100)",
          px: 1.5,
          "&:hover": { bgcolor: "var(--bs-surface-hover)", borderColor: "var(--bs-border-neutral-hover)" },
        }}
      >
        {activeOrg?.name ?? "Organization"}
      </Button>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        slotProps={{
          paper: {
            sx: {
              bgcolor: "var(--bs-surface-base)",
              border: "1px solid var(--bs-border-default)",
              borderRadius: "var(--bs-border-radius-150)",
              minWidth: 220,
            },
          },
        }}
      >
        {orgs.map((o) => (
          <MenuItem
            key={o.id}
            selected={o.id === activeOrgId}
            onClick={() => { setActiveOrgId(o.id); setAnchor(null); }}
            sx={{ py: 1, "&.Mui-selected": { bgcolor: "var(--bs-surface-hover)" } }}
          >
            <Stack direction="row" alignItems="center" gap={1} sx={{ width: "100%" }}>
              <Typography variant="body2" sx={{ color: "var(--bs-text-default)", flex: 1 }}>
                {o.name}
              </Typography>
              {o.is_default && (
                <Chip
                  size="small"
                  label="Shared"
                  sx={{ height: 18, fontSize: "var(--bs-font-size-xs)", bgcolor: "var(--bs-surface-hover)", color: "var(--bs-text-muted)" }}
                />
              )}
              {o.id === activeOrgId && <Check size={14} weight="bold" color="var(--bs-color-accent-default)" />}
            </Stack>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
