"use client";

import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { FolderOpen, Pencil, Trash, X } from "phosphor-react";
import { useCallback, useEffect, useState } from "react";
import { deleteBoard, listBoards, loadBoard } from "../api/adBoardsApi";
import SaveBoardDialog from "./SaveBoardDialog";
import { renameBoard } from "../api/adBoardsApi";

const DRAWER_WIDTH = 420;

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now - d;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function BoardCard({ board, onLoad, onRename, onDelete, isLoading }) {
  return (
    <Box
      sx={(theme) => ({
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 1.5,
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
        transition: "border-color 0.15s ease, background-color 0.15s ease",
        "&:hover": {
          borderColor: alpha(theme.palette.primary.main, 0.4),
          bgcolor: alpha(theme.palette.primary.main, 0.03),
        },
      })}
    >
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={1}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            fontWeight={700}
            noWrap
            title={board.name}
            sx={{ lineHeight: 1.35 }}
          >
            {board.name}
          </Typography>
          {board.sizeSummary ? (
            <Typography variant="caption" color="text.secondary" noWrap display="block">
              {board.sizeSummary}
            </Typography>
          ) : null}
        </Box>

        <Stack direction="row" gap={0.25} flexShrink={0}>
          <Tooltip title="Rename" placement="top" arrow>
            <IconButton size="small" onClick={() => onRename(board)} sx={{ p: 0.5 }}>
              <Pencil size={14} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete" placement="top" arrow>
            <IconButton
              size="small"
              onClick={() => onDelete(board)}
              sx={{ p: 0.5, color: "error.main", "&:hover": { bgcolor: "error.50" } }}
            >
              <Trash size={14} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1} mt={0.5}>
        <Typography variant="caption" color="text.disabled">
          {board.artboardCount} artboard{board.artboardCount !== 1 ? "s" : ""} · {formatDate(board.updatedAt)}
        </Typography>

        <Button
          size="small"
          variant="outlined"
          onClick={() => onLoad(board)}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={12} color="inherit" /> : <FolderOpen size={14} />}
          sx={{ textTransform: "none", fontWeight: 600, fontSize: "0.7rem", py: 0.3, minHeight: 26 }}
        >
          {isLoading ? "Loading…" : "Load"}
        </Button>
      </Stack>
    </Box>
  );
}

/**
 * Slide-in drawer listing the current user's saved boards.
 *
 * Props:
 *   open           – boolean
 *   onClose        – () => void
 *   onLoadBoard    – (stateSnapshot: object, boardMeta: { id, name }) => void
 *   currentBoardId – string | null  (highlights the currently active board)
 */
export default function LoadBoardsDrawer({ open, onClose, onLoadBoard, currentBoardId }) {
  const [boards, setBoards] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [listError, setListError] = useState(null);

  // Rename dialog state
  const [renameTarget, setRenameTarget] = useState(null);

  // Confirm delete state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBoards = useCallback(async () => {
    setLoadingList(true);
    setListError(null);
    try {
      const res = await listBoards();
      setBoards(res.data ?? []);
    } catch (err) {
      setListError(err.message ?? "Failed to load boards.");
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    if (open) fetchBoards();
  }, [open, fetchBoards]);

  const handleLoad = async (board) => {
    setLoadingId(board.id);
    try {
      const res = await loadBoard(board.id);
      onLoadBoard(res.data.stateSnapshot, { id: board.id, name: board.name });
      onClose();
    } catch (err) {
      // Show inline error without dismissing the drawer
      setListError(err.message ?? "Failed to load board.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleRenameConfirm = async (newName) => {
    await renameBoard({ id: renameTarget.id, name: newName });
    setBoards((prev) =>
      prev.map((b) => (b.id === renameTarget.id ? { ...b, name: newName } : b)),
    );
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteBoard(deleteTarget.id);
      setBoards((prev) => prev.filter((b) => b.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setListError(err.message ?? "Failed to delete board.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: DRAWER_WIDTH,
            maxWidth: "92vw",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 2.5, py: 2, flexShrink: 0 }}
        >
          <Typography variant="subtitle1" fontWeight={800}>
            My boards
          </Typography>
          <IconButton size="small" onClick={onClose} sx={{ p: 0.5 }}>
            <X size={18} />
          </IconButton>
        </Stack>
        <Divider />

        {/* Body */}
        <Box
          sx={(theme) => ({
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
            px: 2.5,
            py: 2,
            scrollbarWidth: "thin",
            scrollbarColor: `${alpha(theme.palette.text.primary, 0.2)} transparent`,
            "&::-webkit-scrollbar": { width: 4 },
            "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: alpha(theme.palette.text.primary, 0.18),
              borderRadius: 999,
            },
          })}
        >
          {loadingList && (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 8 }}>
              <CircularProgress size={28} />
            </Stack>
          )}

          {!loadingList && listError && (
            <Stack alignItems="center" sx={{ py: 4, gap: 1.5 }}>
              <Typography variant="body2" color="error.main" textAlign="center">
                {listError}
              </Typography>
              <Button size="small" onClick={fetchBoards} sx={{ textTransform: "none" }}>
                Try again
              </Button>
            </Stack>
          )}

          {!loadingList && !listError && boards.length === 0 && (
            <Stack alignItems="center" sx={{ py: 8, gap: 1 }}>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                No saved boards yet.
              </Typography>
              <Typography variant="caption" color="text.disabled" textAlign="center">
                Use the "Save board" button to save your current work.
              </Typography>
            </Stack>
          )}

          {!loadingList && boards.length > 0 && (
            <Stack gap={1.5}>
              {boards.map((board) => (
                <BoardCard
                  key={board.id}
                  board={board}
                  onLoad={handleLoad}
                  onRename={(b) => setRenameTarget(b)}
                  onDelete={(b) => setDeleteTarget(b)}
                  isLoading={loadingId === board.id}
                  isCurrent={board.id === currentBoardId}
                />
              ))}
            </Stack>
          )}
        </Box>

        {/* Footer */}
        <Divider />
        <Box sx={{ px: 2.5, py: 1.5, flexShrink: 0 }}>
          <Typography variant="caption" color="text.disabled">
            Boards are saved per user. Loading a board replaces the current canvas.
          </Typography>
        </Box>
      </Drawer>

      {/* Rename dialog */}
      <SaveBoardDialog
        open={!!renameTarget}
        onClose={() => setRenameTarget(null)}
        onConfirm={handleRenameConfirm}
        initialName={renameTarget?.name}
        isRename
      />

      {/* Delete confirmation dialog */}
      {deleteTarget && (
        <Box
          component="div"
          role="dialog"
          aria-modal
          aria-labelledby="delete-board-title"
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 1400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(0,0,0,0.45)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeleteTarget(null);
          }}
        >
          <Box
            sx={(theme) => ({
              bgcolor: "background.paper",
              borderRadius: 2,
              p: 3,
              maxWidth: 360,
              width: "90vw",
              boxShadow: theme.shadows[16],
            })}
          >
            <Typography id="delete-board-title" variant="subtitle1" fontWeight={700} mb={1}>
              Delete board?
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2.5}>
              <strong>{deleteTarget.name}</strong> will be permanently deleted. This cannot be
              undone.
            </Typography>
            <Stack direction="row" gap={1} justifyContent="flex-end">
              <Button
                variant="text"
                color="inherit"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                sx={{ textTransform: "none" }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                startIcon={deleting ? <CircularProgress size={14} color="inherit" /> : null}
                sx={{ textTransform: "none", fontWeight: 700 }}
              >
                {deleting ? "Deleting…" : "Delete"}
              </Button>
            </Stack>
          </Box>
        </Box>
      )}
    </>
  );
}
