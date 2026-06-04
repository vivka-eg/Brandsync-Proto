"use client";
import Sidebar from "./components/Sidebar";
import { HomePageContextProvider, useHomePageContext } from "./context/HomePageContext";
import FilterBar from "./components/Home";
import Icons from "./components/home/Icons";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Fade,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { ArrowUp, DownloadSimple, X } from "phosphor-react";

// ─── Scroll to top ────────────────────────────────────────────────────────────

function ScrollToTopButton({ scrollRef }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = scrollRef?.current;
    if (!el) return;
    const onScroll = () => setVisible(el.scrollTop > 400);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [scrollRef]);

  return (
    <Fade in={visible}>
      <Tooltip title="Back to top" placement="left">
        <IconButton
          onClick={() => scrollRef?.current?.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            zIndex: 1200,
            width: 44,
            height: 44,
            bgcolor: "action.active",
            color: "background.default",
            boxShadow: 3,
            "&:hover": { bgcolor: "text.primary" },
            transition: "background-color 0.2s ease",
          }}
        >
          <ArrowUp size={20} weight="bold" />
        </IconButton>
      </Tooltip>
    </Fade>
  );
}

// ─── Collection badge (inline with filter bar) ────────────────────────────────

function CollectionBadge() {
  const { selectedIds, clearSelection, downloadZipRef } = useHomePageContext();
  const [downloading, setDownloading] = useState(false);
  const count = selectedIds.size;
  const visible = count > 0;

  // ESC clears selection when badge is active
  useEffect(() => {
    if (!visible) return;
    const handler = (e) => { if (e.key === "Escape") clearSelection(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [visible, clearSelection]);

  const handleZip = async () => {
    setDownloading(true);
    try { await downloadZipRef.current?.(); }
    finally { setDownloading(false); }
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      aria-hidden={!visible}
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(4px)",
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.22s ease, transform 0.22s ease",
        flexShrink: 0,
      }}
    >
      <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ flexShrink: 0 }}>
        {count} selected
      </Typography>

      <Button
        size="small"
        variant="contained"
        disableElevation
        startIcon={
          downloading
            ? <CircularProgress size={13} sx={{ color: "inherit" }} />
            : <DownloadSimple size={14} />
        }
        onClick={handleZip}
        disabled={downloading}
        sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 500, height: 32 }}
      >
        Download ZIP
      </Button>

      <Tooltip title="Clear selection (Esc)">
        <IconButton
          size="small"
          onClick={clearSelection}
          aria-label="Clear selection"
          sx={{ width: 28, height: 28, color: "text.secondary" }}
        >
          <X size={14} weight="bold" />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}

// ─── Page layout ──────────────────────────────────────────────────────────────

function PageContent() {
  const { scrollContainerRef: scrollRef } = useHomePageContext();

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "flex-start",
        bgcolor: "background.default",
      }}
    >
      <Sidebar />
      {/* Spacer to offset fixed sidebar */}
      <Box aria-hidden sx={{ width: 280, flexShrink: 0 }} />

      {/* Right column — own scroll container so position:sticky works */}
      <Box
        ref={scrollRef}
        sx={{ flex: 1, minWidth: 0, height: "calc(100vh - 64px)", overflowY: "auto" }}
      >
        <Box sx={{ px: 4 }}>
          <Container maxWidth="xl" disableGutters>

            {/* ── Title — scrolls away ── */}
            <Box sx={{ pt: { xs: 2, md: 4 }, pb: 3 }}>
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
                  fontWeight: 700,
                  lineHeight: 1.2,
                  mb: 0.5,
                }}
              >
                Icons
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "text.secondary", fontSize: { xs: "0.9rem", md: "1rem" } }}
              >
                Browse and download icons for your projects
              </Typography>
            </Box>

          </Container>
        </Box>

        {/* ── Sticky toolbar — filter bar + collection badge ── */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            bgcolor: "background.default",
            borderBottom: "1px solid",
            borderColor: "divider",
            px: 4,
            py: 1.5,
          }}
        >
          <Container maxWidth="xl" disableGutters>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <FilterBar />
              <CollectionBadge />
            </Stack>
          </Container>
        </Box>

        {/* ── Icon grid ── */}
        <Box sx={{ px: 4, pt: 3, pb: 6 }}>
          <Container maxWidth="xl" disableGutters>
            <Icons />
          </Container>
        </Box>

        <ScrollToTopButton scrollRef={scrollRef} />
      </Box>
    </Box>
  );
}

function HomePage() {
  return (
    <HomePageContextProvider>
      <PageContent />
    </HomePageContextProvider>
  );
}

export default HomePage;
