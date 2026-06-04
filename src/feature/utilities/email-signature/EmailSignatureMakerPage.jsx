"use client";
import React, { useState, useCallback, useLayoutEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  TextField,
  Button,
  Tabs,
  Tab,
  Alert,
  Snackbar,
} from "@mui/material";
import { ArrowLeft, CopySimple, Check, LinkedinLogo, Phone, MapPin, Envelope, Plus, Trash } from "phosphor-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

// ─── EG Logo ──────────────────────────────────────────────────────────────────

// Rendered at 50px; matches typical Outlook signature preview size
function EGLogo() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={EMAIL_SIGNATURE_LOGO_PATH}
      alt="EG"
      width={50}
      height={50}
      style={{ display: "block", width: 50, height: 50 }}
    />
  );
}

// ─── Live signature preview ────────────────────────────────────────────────────

function SignaturePreview({ data, showLinkedIn }) {
  const phones = (data.phones || []).map((p) => p.trim()).filter(Boolean);
  const hasEmail = data.email.trim().length > 0;
  const hasLinkedIn = showLinkedIn && data.linkedin.trim().length > 0;
  const hasAddress = data.address.trim().length > 0;

  return (
    <Box
      sx={{
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: 13,
        color: "#333333",
        lineHeight: 1.5,
        maxWidth: 420,
        userSelect: "none",
      }}
    >
      {/* Greeting */}
      <Typography
        sx={{
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: 13,
          color: "#555",
          mb: 1.5,
        }}
      >
        Venlig hilsen / Best regards,
      </Typography>

      {/* Name */}
      <Typography
        sx={{
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: 13,
          fontWeight: 700,
          color: "#333",
        }}
      >
        {data.name || "Your Name"}
      </Typography>

      {/* Title + Company */}
      <Typography
        sx={{
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: 13,
          color: "#333",
        }}
      >
        {[data.title, data.company].filter(Boolean).join(", ") || "Title, Company"}
      </Typography>

      {/* Spacing */}
      <Box sx={{ height: 10 }} />

      {/* Phone numbers */}
      {phones.map((line, i) => (
        <Box key={`phone-${i}-${line}`} sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.25 }}>
          <Phone size={12} style={{ color: "#555", flexShrink: 0 }} />
          <Typography
            sx={{
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: 13,
              color: "#333",
            }}
          >
            {line}
          </Typography>
        </Box>
      ))}

      {/* Email */}
      {hasEmail && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.25 }}>
          <Envelope size={12} style={{ color: "#555", flexShrink: 0 }} />
          <Typography
            component="a"
            href={`mailto:${data.email.trim()}`}
            sx={{
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: 13,
              color: "#333",
              textDecoration: "none",
            }}
          >
            {data.email.trim()}
          </Typography>
        </Box>
      )}

      {/* LinkedIn */}
      {hasLinkedIn && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.25 }}>
          <LinkedinLogo size={12} style={{ color: "#0077B5", flexShrink: 0 }} />
          <Typography
            component="a"
            href={data.linkedin}
            sx={{
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: 13,
              color: "#0077B5",
              textDecoration: "none",
            }}
          >
            LinkedIn
          </Typography>
        </Box>
      )}

      {/* Address */}
      {hasAddress && (
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.75, mt: 0.25 }}>
          <MapPin size={12} style={{ color: "#555", flexShrink: 0, marginTop: 2 }} />
          <Typography
            sx={{
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: 13,
              color: "#333",
            }}
          >
            {data.address}
          </Typography>
        </Box>
      )}

      {/* Website + Privacy policy (directly under contact block) */}
      <Box
        sx={{
          mt: phones.length > 0 || hasEmail || hasLinkedIn || hasAddress ? 0.75 : 0.5,
          display: "flex",
          gap: 1.5,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Typography
          component="a"
          href="https://egsoftware.com/global"
          target="_blank"
          rel="noreferrer"
          sx={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: 11, color: "#007080", textDecoration: "none" }}
        >
          egsoftware.com
        </Typography>
        <Typography sx={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: 11, color: "#ccc" }}>|</Typography>
        <Typography
          component="a"
          href="https://egsoftware.com/global/treatment-of-data"
          target="_blank"
          rel="noreferrer"
          sx={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: 11, color: "#007080", textDecoration: "none" }}
        >
          Privacy policy
        </Typography>
      </Box>

      {/* Divider */}
      <Box sx={{ borderTop: "1px solid #e0e0e0", my: 1.5, maxWidth: 380 }} />

      {/* EG Logo */}
      <EGLogo />
    </Box>
  );
}

// ─── Generate HTML string ─────────────────────────────────────────────────────

/** Public path served from `public/eg-logo/`; must match EGLogo preview */
const EMAIL_SIGNATURE_LOGO_PATH = "/eg-logo/EG_Logo-email.png";

/**
 * Base64 fallback for SSR / before client knows origin.
 * Outlook desktop ignores data-URI images in pasted HTML; copied HTML uses an absolute https URL instead.
 */
const EG_LOGO_B64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGMAAABkCAYAAACSPo4tAAAACXBIWXMAAA4mAAAOJgGi7yX8AAAE9WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgMTAuMC1jMDAwIDc5LmQwNGNjMTY5OCwgMjAyNS8wNy8wMi0xMjoxODoxMyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI3LjMgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDI2LTA1LTAyVDEyOjU5OjM3KzA1OjMwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNi0wNS0wMlQxMzowMzoyNSswNTozMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNi0wNS0wMlQxMzowMzoyNSswNTozMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzYwYWU5NDUtNjgyYi00MDdhLWEyN2QtMTQ4Y2ZmYzVkMzY5IiB4bXBNTTpEb2N1bWVu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";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function generateHtml(data, showLinkedIn, logoImgSrc) {
  const phones = (data.phones || []).map((p) => p.trim()).filter(Boolean);
  const emailTrimmed = data.email.trim();
  const hasEmail = emailTrimmed.length > 0;
  const hasLinkedIn = showLinkedIn && data.linkedin.trim().length > 0;
  const hasAddress = data.address.trim().length > 0;

  const phoneRows = phones
    .map(
      (line) =>
        `<tr><td style="padding:1px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#333333;">${escapeHtml(line)}</td></tr>`,
    )
    .join("\n    ");

  const emailRow = hasEmail
    ? `<tr><td style="padding:1px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;"><a href="mailto:${escapeHtml(emailTrimmed)}" style="color:#333333;text-decoration:none;">${escapeHtml(emailTrimmed)}</a></td></tr>`
    : "";

  const linkedInRow = hasLinkedIn
    ? `<tr><td style="padding:1px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;"><a href="${escapeHtml(data.linkedin.trim())}" style="color:#0077B5;text-decoration:none;">LinkedIn</a></td></tr>`
    : "";

  const addressRow = hasAddress
    ? `<tr><td style="padding-top:4px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#333333;">${escapeHtml(data.address).replace(/\n/g, "<br/>")}</td></tr>`
    : "";

  const websiteRow = `<tr><td style="padding-top:6px;"><a href="https://egsoftware.com/global" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#007080;text-decoration:none;">egsoftware.com</a> <span style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#cccccc;">|</span> <a href="https://egsoftware.com/global/treatment-of-data" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#007080;text-decoration:none;">Privacy policy</a></td></tr>`;

  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#333333;">
  <tbody>
    <tr><td style="padding-bottom:12px;font-size:13px;color:#555555;">Venlig hilsen / Best regards,</td></tr>
    <tr><td style="font-weight:bold;font-size:13px;color:#333333;">${escapeHtml(data.name || "Your Name")}</td></tr>
    <tr><td style="font-size:13px;color:#333333;">${escapeHtml([data.title, data.company].filter(Boolean).join(", ") || "Title, Company")}</td></tr>
    <tr><td style="padding-top:10px;"></td></tr>
    ${phoneRows}
    ${emailRow}
    ${linkedInRow}
    ${addressRow}
    ${websiteRow}
    <tr><td style="padding:12px 0 8px;"><hr style="border:none;border-top:1px solid #e0e0e0;margin:0;width:380px;" /></td></tr>
    <tr><td><img src="${logoImgSrc}" width="50" height="50" alt="EG" style="display:block;" /></td></tr>
  </tbody>
</table>`;
}

// ─── Field input ──────────────────────────────────────────────────────────────

function FieldInput({ label, value, onChange, placeholder, helperText, type = "text" }) {
  return (
    <TextField
      label={label}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      helperText={helperText}
      fullWidth
      size="small"
      sx={{
        "& .MuiInputBase-root": { fontSize: 13 },
        "& .MuiFormHelperText-root": { fontSize: 11, mt: 0.25 },
      }}
    />
  );
}

// ─── Copy button ──────────────────────────────────────────────────────────────

function CopyButton({ value, label = "Copy HTML", size = "medium" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [value]);

  return (
    <Button
      variant="contained"
      onClick={handleCopy}
      startIcon={
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.span key="check" initial={{ scale: 0.6 }} animate={{ scale: 1 }} exit={{ scale: 0.6 }} transition={{ duration: 0.15 }}>
              <Check size={16} weight="bold" />
            </motion.span>
          ) : (
            <motion.span key="copy" initial={{ scale: 0.6 }} animate={{ scale: 1 }} exit={{ scale: 0.6 }} transition={{ duration: 0.15 }}>
              <CopySimple size={16} />
            </motion.span>
          )}
        </AnimatePresence>
      }
      size={size}
      sx={{ minWidth: 150 }}
    >
      {copied ? "Copied!" : label}
    </Button>
  );
}

// ─── Default data ─────────────────────────────────────────────────────────────

const DEFAULT_DATA = {
  name: "Susan Meier",
  title: "Sales Director",
  company: "Construction",
  phones: ["+ 45 64 64 24 98"],
  email: "susan.meier@eg.dk",
  linkedin: "https://linkedin.com/in/",
  address: "Lautrupvang 24,\n2750 Ballerup",
};

// ─── Main page ────────────────────────────────────────────────────────────────

function EmailSignatureMakerPage() {
  const router = useRouter();
  const [data, setData] = useState(DEFAULT_DATA);
  const [showLinkedIn, setShowLinkedIn] = useState(true);
  const [tab, setTab] = useState(0);
  const [snackOpen, setSnackOpen] = useState(false);

  const configuredLogoUrl = process.env.NEXT_PUBLIC_EMAIL_SIGNATURE_LOGO_URL?.trim();
  const [signatureLogoSrc, setSignatureLogoSrc] = useState(
    () => configuredLogoUrl || EG_LOGO_B64,
  );

  useLayoutEffect(() => {
    if (configuredLogoUrl) return;
    setSignatureLogoSrc(`${window.location.origin}${EMAIL_SIGNATURE_LOGO_PATH}`);
  }, [configuredLogoUrl]);

  const html = generateHtml(data, showLinkedIn, signatureLogoSrc);

  const setField = (key) => (val) => setData((prev) => ({ ...prev, [key]: val }));

  const handleCopyRichText = useCallback(() => {
    const blob = new Blob([html], { type: "text/html" });
    const plainBlob = new Blob([""], { type: "text/plain" });
    const clipboardItem = new ClipboardItem({
      "text/html": blob,
      "text/plain": plainBlob,
    });
    navigator.clipboard.write([clipboardItem]).then(() => {
      setSnackOpen(true);
    });
  }, [html]);

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", px: { xs: 2, md: 5 }, py: { xs: 5, md: 8 } }}>
      {/* Back link */}
      <Box
        onClick={() => router.push("/utilities")}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.75,
          mb: 3,
          cursor: "pointer",
          color: "text.secondary",
          "&:hover": { color: "text.primary" },
          transition: "color 0.15s",
        }}
      >
        <ArrowLeft size={15} />
        <Typography variant="body2">Utilities</Typography>
      </Box>

      {/* Header */}
      <Box mb={5}>
        <Typography variant="h4" fontWeight={700} mb={0.5}>
          Email Signature Maker
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Fill in your details and copy a signature built for Outlook, following EG brand guidelines.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "380px 1fr" },
          gap: 4,
          alignItems: "start",
        }}
      >
        {/* ── Left: Form ─────────────────────────────────────────────────────── */}
        <Paper variant="outlined" sx={{ borderRadius: 2, p: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} mb={2.5}>
            Your details
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FieldInput label="Full name" value={data.name} onChange={setField("name")} placeholder="Susan Meier" />
            <FieldInput label="Job title" value={data.title} onChange={setField("title")} placeholder="Sales Director" />
            <FieldInput
              label="Company / Division"
              value={data.company}
              onChange={setField("company")}
              placeholder="Construction"
              helperText='e.g. "Construction", "Public", "HR & Payroll"'
            />

            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Phone numbers
              </Typography>
              {data.phones.map((phoneLine, index) => (
                <Box key={index} sx={{ display: "flex", gap: 1, alignItems: "flex-start", mb: 1 }}>
                  <TextField
                    label={data.phones.length === 1 ? "Phone" : `Phone ${index + 1}`}
                    value={phoneLine}
                    onChange={(e) => {
                      const v = e.target.value;
                      setData((prev) => ({
                        ...prev,
                        phones: prev.phones.map((p, i) => (i === index ? v : p)),
                      }));
                    }}
                    placeholder="+ 45 64 64 24 98"
                    fullWidth
                    size="small"
                    sx={{
                      "& .MuiInputBase-root": { fontSize: 13 },
                    }}
                  />
                  <IconButton
                    aria-label="Remove phone number"
                    onClick={() => {
                      setData((prev) => ({
                        ...prev,
                        phones: prev.phones.length <= 1 ? prev.phones : prev.phones.filter((_, i) => i !== index),
                      }));
                    }}
                    disabled={data.phones.length <= 1}
                    sx={{ mt: 0.25 }}
                    size="small"
                  >
                    <Trash size={18} />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="text"
                size="small"
                startIcon={<Plus size={16} />}
                onClick={() => setData((prev) => ({ ...prev, phones: [...prev.phones, ""] }))}
                sx={{ mt: 0.25 }}
              >
                Add phone number
              </Button>
            </Box>

            <FieldInput
              label="Email"
              type="email"
              value={data.email}
              onChange={setField("email")}
              placeholder="name@eg.dk"
            />

            <FieldInput
              label="LinkedIn URL"
              value={data.linkedin}
              onChange={setField("linkedin")}
              placeholder="https://linkedin.com/in/yourprofile"
              helperText={showLinkedIn ? "" : "LinkedIn is hidden; turn it on below"}
            />

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Show LinkedIn link
              </Typography>
              <Box
                onClick={() => setShowLinkedIn((v) => !v)}
                sx={{
                  width: 40,
                  height: 22,
                  borderRadius: 11,
                  bgcolor: showLinkedIn ? "primary.main" : "action.disabledBackground",
                  position: "relative",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  flexShrink: 0,
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 3,
                    left: showLinkedIn ? 21 : 3,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    bgcolor: "#fff",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    transition: "left 0.2s",
                  }}
                />
              </Box>
            </Box>

            <FieldInput
              label="Address"
              value={data.address}
              onChange={setField("address")}
              placeholder={"Lautrupvang 24,\n2750 Ballerup"}
            />
          </Box>
        </Paper>

        {/* ── Right: Preview + Export ─────────────────────────────────────────── */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Preview card */}
          <Paper
            variant="outlined"
            sx={{
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1.25,
                bgcolor: "action.hover",
                borderBottom: "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography
                variant="caption"
                fontWeight={600}
                color="text.secondary"
                sx={{ textTransform: "uppercase", letterSpacing: "0.06em", fontSize: 10, flex: 1 }}
              >
                Preview
              </Typography>
              {/* Preview chrome dots */}
              {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                <Box key={c} sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: c }} />
              ))}
            </Box>

            {/* Simulated email body */}
            <Box sx={{ p: 3, bgcolor: "background.paper" }}>
              {/* Fake email content above signature */}
              <Box sx={{ mb: 2.5 }}>
                <Box sx={{ height: 7, width: "80%", borderRadius: 1, bgcolor: "action.hover", mb: 1 }} />
                <Box sx={{ height: 7, width: "65%", borderRadius: 1, bgcolor: "action.hover", mb: 1 }} />
                <Box sx={{ height: 7, width: "72%", borderRadius: 1, bgcolor: "action.hover" }} />
              </Box>

              <SignaturePreview data={data} showLinkedIn={showLinkedIn} />
            </Box>
          </Paper>

          {/* Export card */}
          <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              sx={{
                px: 2,
                borderBottom: "1px solid",
                borderColor: "divider",
                "& .MuiTabs-indicator": { display: "none" },
                "& .MuiTab-root": { fontSize: 13, textTransform: "none", minHeight: 44, py: 1 },
              }}
            >
              <Tab label="Paste into Outlook" />
              <Tab label="HTML source" />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {tab === 0 && (
                <Box>
                  <Typography variant="body2" color="text.secondary" mb={2} sx={{ lineHeight: 1.7 }}>
                    Copy the rich-text signature, then paste it into Outlook signature settings (<strong>File → Options → Mail → Signatures</strong>).
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleCopyRichText}
                    startIcon={<CopySimple size={16} />}
                    size="medium"
                  >
                    Copy signature
                  </Button>
                  <Alert severity="info" sx={{ mt: 2, borderRadius: 1.5, fontSize: 12 }}>
                    The logo is a normal image link from this site, not hidden data pasted into the HTML. That helps <strong>Outlook for Windows</strong> show it after you paste.
                    <br />
                    <br />
                    If Outlook shows a placeholder instead, click <strong>Download pictures</strong> once while you are editing the signature, allow images from your BrandSync URL, or copy the logo from the preview above (right-click and copy the image, or select it and copy) and paste it into Outlook.
                  </Alert>
                </Box>
              )}

              {tab === 1 && (
                <Box>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Copy the HTML if you need the raw source for IT or advanced Outlook setup.
                  </Typography>
                  <Box
                    sx={{
                      bgcolor: "background.default",
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1.5,
                      p: 2,
                      mb: 2,
                      maxHeight: 240,
                      overflowY: "auto",
                    }}
                  >
                    <Typography
                      component="pre"
                      sx={{
                        fontFamily: "monospace",
                        fontSize: 11,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-all",
                        m: 0,
                        color: "text.secondary",
                        lineHeight: 1.6,
                      }}
                    >
                      {html}
                    </Typography>
                  </Box>
                  <CopyButton value={html} label="Copy HTML" />
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>

      <Snackbar
        open={snackOpen}
        autoHideDuration={2500}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setSnackOpen(false)} sx={{ width: "100%" }}>
          Signature copied. Paste it into Outlook.
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default EmailSignatureMakerPage;
