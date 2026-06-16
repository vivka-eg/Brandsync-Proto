"use client";
import { getUserEmail } from "@/lib/userEmail";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Stack,
  Typography,
  Button,
  ButtonBase,
  InputBase,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  X,
  Plus,
  Users,
  UsersThree,
  ArrowLeft,
  ArrowRight,
  EnvelopeSimple,
  ShieldCheck,
  Copy,
  Check,
  SignIn,
} from "phosphor-react";

// LOCAL DEV ONLY — same hardcoded user as the other Make dialogs.
// When real auth lands, all of these switch in lockstep.

function RoleChip({ role, isDefault }) {
  if (role === "admin") {
    return (
      <Chip
        size="small"
        icon={<ShieldCheck size={12} weight="fill" />}
        label="Admin"
        sx={{
          height: 20,
          bgcolor: "var(--bs-color-accent-container)",
          color: "var(--bs-color-accent-default)",
          "& .MuiChip-icon": { color: "var(--bs-color-accent-default)", ml: 0.5 },
          fontSize: "var(--bs-font-size-xs)",
        }}
      />
    );
  }
  if (role === "member") {
    return (
      <Chip
        size="small"
        label="Member"
        sx={{ height: 20, bgcolor: "var(--bs-surface-hover)", color: "var(--bs-text-muted)", fontSize: "var(--bs-font-size-xs)" }}
      />
    );
  }
  if (isDefault) {
    return (
      <Chip
        size="small"
        label="Default · everyone"
        sx={{ height: 20, bgcolor: "var(--bs-surface-hover)", color: "var(--bs-text-muted)", fontSize: "var(--bs-font-size-xs)" }}
      />
    );
  }
  return null;
}

function OrgRow({ org, onOpen }) {
  return (
    <ButtonBase
      onClick={() => onOpen(org)}
      sx={{
        width: "100%",
        textAlign: "left",
        bgcolor: "var(--bs-surface-raised)",
        border: "1px solid var(--bs-border-default)",
        borderRadius: "var(--bs-border-radius-150)",
        p: 2,
        display: "flex",
        alignItems: "center",
        gap: 2,
        transition: "border-color 0.15s, transform 0.15s",
        "&:hover": { borderColor: "var(--bs-border-neutral-hover)", transform: "translateY(-1px)" },
        "&:focus-visible": { outline: "2px solid var(--bs-border-primary)", outlineOffset: 2 },
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "var(--bs-border-radius-100)",
          bgcolor: "var(--bs-color-accent-container)",
          color: "var(--bs-color-accent-default)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <UsersThree size={20} weight="fill" />
      </Box>
      <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" alignItems="center" gap={1}>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{ color: "var(--bs-text-default)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
          >
            {org.name}
          </Typography>
          <RoleChip role={org.my_role} isDefault={org.is_default} />
        </Stack>
        <Stack direction="row" alignItems="center" gap={0.5}>
          <Users size={12} color="var(--bs-text-muted)" />
          <Typography variant="caption" sx={{ color: "var(--bs-text-muted)" }}>
            {org.member_count} {org.member_count === 1 ? "member" : "members"}
          </Typography>
        </Stack>
      </Stack>
      <ArrowRight size={16} color="var(--bs-text-muted)" />
    </ButtonBase>
  );
}

function TextField({ value, onChange, onEnter, placeholder, autoFocus }) {
  return (
    <InputBase
      autoFocus={autoFocus}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => { if (e.key === "Enter" && onEnter) onEnter(); }}
      sx={{
        flex: 1,
        px: 1.5,
        py: 1,
        color: "var(--bs-text-default)",
        fontSize: "var(--bs-font-size-md)",
        bgcolor: "var(--bs-surface-base)",
        border: "1px solid var(--bs-border-default)",
        borderRadius: "var(--bs-border-radius-100)",
        "&:focus-within": { borderColor: "var(--bs-border-primary)" },
      }}
    />
  );
}

function PrimaryButton({ children, disabled, onClick, startIcon, size = "small" }) {
  return (
    <Button
      size={size}
      variant="contained"
      disabled={disabled}
      onClick={onClick}
      startIcon={startIcon}
      sx={{
        textTransform: "none",
        bgcolor: "var(--bs-color-accent-default)",
        color: "var(--bs-text-inverse)",
        "&:hover": { bgcolor: "var(--bs-color-accent-hover)" },
      }}
    >
      {children}
    </Button>
  );
}

// ── Invite panel (admins only) ─────────────────────────────────────────────
function InvitePanel({ orgId }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [invites, setInvites] = useState([]);
  const [lastToken, setLastToken] = useState(null);
  const [copied, setCopied] = useState(false);

  const loadInvites = async () => {
    try {
      const res = await fetch(`/api/orgs/${orgId}/invitations?userEmail=${encodeURIComponent(getUserEmail())}`);
      const body = await res.json();
      if (res.ok) setInvites(body.invitations || []);
    } catch { /* non-fatal */ }
  };

  useEffect(() => { loadInvites(); }, [orgId]);

  const submit = async () => {
    const e = email.trim().toLowerCase();
    if (!e || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/orgs/${orgId}/invitations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: getUserEmail(), email: e, role }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || `HTTP ${res.status}`);
      setLastToken(body.invitation.token);
      setEmail("");
      setCopied(false);
      loadInvites();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Stack spacing={1.5} sx={{ p: 2, bgcolor: "var(--bs-surface-raised)", border: "1px solid var(--bs-border-default)", borderRadius: "var(--bs-border-radius-150)" }}>
      <Stack direction="row" alignItems="center" gap={1}>
        <EnvelopeSimple size={16} color="var(--bs-text-default)" />
        <Typography variant="body2" fontWeight={600} sx={{ color: "var(--bs-text-default)" }}>
          Invite someone
        </Typography>
      </Stack>

      <Stack direction="row" gap={1} alignItems="stretch">
        <TextField value={email} onChange={setEmail} onEnter={submit} placeholder="name@company.com" />
        <Button
          size="small"
          onClick={() => setRole(role === "admin" ? "member" : "admin")}
          sx={{ textTransform: "none", minWidth: 92, borderRadius: "var(--bs-border-radius-100)", border: "1px solid var(--bs-border-default)", color: "var(--bs-text-default)", "&:hover": { bgcolor: "var(--bs-surface-hover)" } }}
        >
          {role === "admin" ? "Admin" : "Member"}
        </Button>
        <PrimaryButton disabled={!email.trim() || submitting} onClick={submit}>
          {submitting ? "Inviting…" : "Invite"}
        </PrimaryButton>
      </Stack>

      {error && (
        <Typography variant="caption" sx={{ color: "var(--bs-color-error-default)" }}>{error}</Typography>
      )}

      {lastToken && (
        <Stack
          direction="row"
          alignItems="center"
          gap={1}
          sx={{ p: 1, bgcolor: "var(--bs-surface-base)", border: "1px dashed var(--bs-border-default)", borderRadius: "var(--bs-border-radius-100)" }}
        >
          <Typography variant="caption" sx={{ color: "var(--bs-text-muted)", flexShrink: 0 }}>Invite code:</Typography>
          <Typography variant="caption" sx={{ color: "var(--bs-text-default)", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}>
            {lastToken}
          </Typography>
          <IconButton
            size="small"
            aria-label="Copy invite code"
            onClick={() => { navigator.clipboard?.writeText(lastToken); setCopied(true); }}
          >
            {copied ? <Check size={14} color="var(--bs-color-success-default)" /> : <Copy size={14} />}
          </IconButton>
        </Stack>
      )}

      {invites.length > 0 && (
        <Stack spacing={0.5}>
          <Typography variant="caption" sx={{ color: "var(--bs-text-muted)" }}>Invitations</Typography>
          {invites.map((inv) => (
            <Stack key={inv.id} direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 0.5 }}>
              <Typography variant="caption" sx={{ color: "var(--bs-text-default)" }}>{inv.email}</Typography>
              <Chip
                size="small"
                label={inv.status}
                sx={{
                  height: 18,
                  fontSize: "var(--bs-font-size-xs)",
                  bgcolor: inv.status === "accepted" ? "var(--bs-color-success-container, var(--bs-surface-hover))" : "var(--bs-surface-hover)",
                  color: inv.status === "accepted" ? "var(--bs-color-success-default)" : "var(--bs-text-muted)",
                }}
              />
            </Stack>
          ))}
        </Stack>
      )}
    </Stack>
  );
}

// ── Org detail (members + invite) ──────────────────────────────────────────
function OrgDetail({ org, onBack }) {
  const [members, setMembers] = useState(null);
  const [error, setError] = useState(null);
  const isAdmin = org.my_role === "admin";

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/orgs/${org.id}/members?userEmail=${encodeURIComponent(getUserEmail())}`);
        const body = await res.json();
        if (!res.ok) throw new Error(body?.error || `HTTP ${res.status}`);
        setMembers(body.members || []);
      } catch (e) {
        setError(e.message);
        setMembers([]);
      }
    })();
  }, [org.id]);

  return (
    <Stack spacing={1.5}>
      <Button
        size="small"
        startIcon={<ArrowLeft size={14} />}
        onClick={onBack}
        sx={{ alignSelf: "flex-start", textTransform: "none", color: "var(--bs-text-muted)", "&:hover": { bgcolor: "var(--bs-surface-hover)" } }}
      >
        All orgs
      </Button>

      <Stack direction="row" alignItems="center" gap={1}>
        <Typography variant="h6" fontWeight={700} sx={{ color: "var(--bs-text-default)" }}>{org.name}</Typography>
        <RoleChip role={org.my_role} isDefault={org.is_default} />
      </Stack>

      {isAdmin && <InvitePanel orgId={org.id} />}

      <Typography variant="caption" sx={{ color: "var(--bs-text-muted)", pt: 0.5 }}>Members</Typography>
      {members === null && !error && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
          <CircularProgress size={20} sx={{ color: "var(--bs-color-accent-default)" }} />
        </Box>
      )}
      {error && <Typography variant="body2" sx={{ color: "var(--bs-color-error-default)" }}>{error}</Typography>}
      {members && members.map((m) => (
        <Stack
          key={m.user_id}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ p: 1.5, bgcolor: "var(--bs-surface-raised)", border: "1px solid var(--bs-border-default)", borderRadius: "var(--bs-border-radius-100)" }}
        >
          <Stack direction="row" alignItems="center" gap={1.5}>
            <Box sx={{ width: 28, height: 28, borderRadius: "50%", bgcolor: "var(--bs-surface-hover)", color: "var(--bs-text-default)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "var(--bs-font-size-xs)", fontWeight: 700 }}>
              {(m.email?.[0] || "?").toUpperCase()}
            </Box>
            <Typography variant="body2" sx={{ color: "var(--bs-text-default)" }}>{m.email}</Typography>
          </Stack>
          <RoleChip role={m.role} />
        </Stack>
      ))}
    </Stack>
  );
}

// ── Create-org + join-by-code forms ────────────────────────────────────────
function CreateOrgForm({ onCancel, onCreated }) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const submit = async () => {
    const n = name.trim();
    if (!n || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/orgs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: getUserEmail(), name: n }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || `HTTP ${res.status}`);
      onCreated(body.org);
    } catch (e) {
      setError(e.message);
      setSubmitting(false);
    }
  };

  return (
    <Stack spacing={1.5} sx={{ p: 2, bgcolor: "var(--bs-surface-raised)", border: "1px solid var(--bs-border-default)", borderRadius: "var(--bs-border-radius-150)" }}>
      <Typography variant="body2" fontWeight={600} sx={{ color: "var(--bs-text-default)" }}>New organization</Typography>
      <Stack direction="row" gap={1}>
        <TextField value={name} onChange={setName} onEnter={submit} placeholder="e.g. Acme Design" autoFocus />
        <PrimaryButton disabled={!name.trim() || submitting} onClick={submit}>
          {submitting ? "Creating…" : "Create"}
        </PrimaryButton>
      </Stack>
      {error && <Typography variant="caption" sx={{ color: "var(--bs-color-error-default)" }}>{error}</Typography>}
      <Button size="small" onClick={onCancel} sx={{ alignSelf: "flex-start", textTransform: "none", color: "var(--bs-text-muted)" }}>Cancel</Button>
    </Stack>
  );
}

function JoinForm({ onJoined }) {
  const [token, setToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const submit = async () => {
    const t = token.trim();
    if (!t || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/invitations/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: getUserEmail(), token: t }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || `HTTP ${res.status}`);
      setToken("");
      onJoined();
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Stack spacing={1} sx={{ pt: 1, borderTop: "1px solid var(--bs-border-default)" }}>
      <Typography variant="caption" sx={{ color: "var(--bs-text-muted)" }}>Have an invite code?</Typography>
      <Stack direction="row" gap={1}>
        <TextField value={token} onChange={setToken} onEnter={submit} placeholder="Paste invite code" />
        <Button
          size="small"
          variant="outlined"
          startIcon={<SignIn size={14} />}
          disabled={!token.trim() || submitting}
          onClick={submit}
          sx={{ textTransform: "none", borderColor: "var(--bs-border-default)", color: "var(--bs-text-default)", "&:hover": { borderColor: "var(--bs-border-neutral-hover)", bgcolor: "var(--bs-surface-hover)" } }}
        >
          {submitting ? "Joining…" : "Join"}
        </Button>
      </Stack>
      {error && <Typography variant="caption" sx={{ color: "var(--bs-color-error-default)" }}>{error}</Typography>}
    </Stack>
  );
}

export default function OrgDialog({ open, onClose }) {
  const [orgs, setOrgs] = useState(null); // null = not loaded
  const [loadError, setLoadError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    setLoadError(null);
    try {
      const res = await fetch(`/api/orgs?userEmail=${encodeURIComponent(getUserEmail())}`);
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || `HTTP ${res.status}`);
      setOrgs(body.orgs || []);
    } catch (e) {
      setLoadError(e.message);
      setOrgs([]);
    }
  };

  useEffect(() => {
    if (open) {
      setSelected(null);
      setCreating(false);
      setOrgs(null);
      load();
    }
  }, [open]);

  const handleCreated = (org) => {
    setCreating(false);
    load();
    setSelected({ ...org, my_role: "admin", member_count: 1 });
  };

  const showList = !selected;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            bgcolor: "var(--bs-surface-base)",
            border: "1px solid var(--bs-border-default)",
            borderRadius: "var(--bs-border-radius-200)",
            backgroundImage: "none",
          },
        },
      }}
    >
      <DialogTitle
        component="div"
        sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, py: 2.5, px: 4, borderBottom: "1px solid var(--bs-border-default)" }}
      >
        <Stack>
          <Typography variant="h6" fontWeight={700} sx={{ color: "var(--bs-text-default)" }}>
            Organizations &amp; members
          </Typography>
          <Typography variant="caption" sx={{ color: "var(--bs-text-muted)" }}>
            Manage who can see your team's patterns.
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" gap={1}>
          {showList && !creating && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<Plus size={14} weight="bold" />}
              onClick={() => setCreating(true)}
              sx={{ textTransform: "none", borderColor: "var(--bs-border-default)", color: "var(--bs-text-default)", "&:hover": { borderColor: "var(--bs-border-neutral-hover)", bgcolor: "var(--bs-surface-hover)" } }}
            >
              New org
            </Button>
          )}
          <IconButton onClick={onClose} size="small" aria-label="Close">
            <X size={18} />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ px: 4, py: 4 }}>
        {selected ? (
          <OrgDetail org={selected} onBack={() => { setSelected(null); load(); }} />
        ) : (
          <Stack spacing={1.5}>
            {creating && <CreateOrgForm onCancel={() => setCreating(false)} onCreated={handleCreated} />}

            {orgs === null && !loadError && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress size={24} sx={{ color: "var(--bs-color-accent-default)" }} />
              </Box>
            )}

            {loadError && (
              <Typography variant="body2" sx={{ color: "var(--bs-color-error-default)" }}>
                Couldn't load orgs: {loadError}
              </Typography>
            )}

            {orgs && orgs.length > 0 && (
              <Stack spacing={1}>
                {orgs.map((o) => (
                  <OrgRow key={o.id} org={o} onOpen={setSelected} />
                ))}
              </Stack>
            )}

            <JoinForm onJoined={load} />
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
