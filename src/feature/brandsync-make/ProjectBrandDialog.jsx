'use client';

import { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Box, Stack, Typography, TextField, Button, CircularProgress, Tooltip,
} from '@mui/material';
import { X } from 'phosphor-react';
import { BRAND_PALETTES } from '@/lib/brand-substitute';

// Per-project brand picker. Used at project CREATION (mode="create", asks for a
// name too) and to EDIT an existing project's brand (mode="edit"). Both a
// color palette AND a logo are required before submit is enabled — if logos
// can't load (Strapi down) the logo grid says so and submit stays disabled.
export default function ProjectBrandDialog({
  open,
  mode = 'create',
  initialName = '',
  initialPalette = null,
  initialLogoName = null,
  submitting = false,
  onSubmit,
  onClose,
}) {
  const [name, setName] = useState(initialName);
  const [palette, setPalette] = useState(initialPalette);
  const [logoName, setLogoName] = useState(initialLogoName);
  const [logos, setLogos] = useState([]);
  const [logosLoading, setLogosLoading] = useState(false);
  const [logosError, setLogosError] = useState(null);

  // Reset to the initial values and (re)load logos whenever the dialog opens.
  useEffect(() => {
    if (!open) return;
    setName(initialName);
    setPalette(initialPalette);
    setLogoName(initialLogoName);
    setLogosLoading(true);
    setLogosError(null);
    fetch('/api/product-logos?pageSize=100')
      .then((r) => r.json())
      .then((body) => setLogos(Array.isArray(body?.data) ? body.data : []))
      .catch(() => setLogosError('Could not load logos.'))
      .finally(() => setLogosLoading(false));
    // initial* are snapshot on open; intentionally not deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const nameOk = mode === 'edit' || name.trim().length > 0;
  const canSubmit = !!palette && !!logoName && nameOk && !submitting;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit?.({ name: name.trim(), brandPalette: palette, logoName });
  };

  return (
    <Dialog open={open} onClose={submitting ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1 }}>
        <span>{mode === 'create' ? 'New project' : 'Edit brand'}</span>
        <IconButton onClick={onClose} disabled={submitting} size="small" aria-label="Close"><X size={18} /></IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {mode === 'create' && (
          <TextField
            autoFocus
            fullWidth
            size="small"
            label="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 3 }}
          />
        )}

        {/* Brand color */}
        <Typography variant="overline" sx={{ color: 'var(--bs-text-muted)' }}>Brand color</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, mt: 1, mb: 3 }}>
          {BRAND_PALETTES.map((p) => {
            const sel = palette === p;
            return (
              <Tooltip key={p} title={p} arrow>
                <Box
                  component="button"
                  type="button"
                  onClick={() => setPalette(p)}
                  sx={{
                    width: 34, height: 34, p: 0, border: 'none', background: 'transparent',
                    cursor: 'pointer', display: 'grid', placeItems: 'center',
                  }}
                >
                  <Box sx={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: `var(--bs-brand-colors-${p}-500)`,
                    border: `2px solid ${sel ? 'var(--bs-text-default)' : 'transparent'}`,
                    boxShadow: '0 0 0 1px var(--bs-border-default)',
                  }} />
                </Box>
              </Tooltip>
            );
          })}
        </Box>

        {/* Logo */}
        <Typography variant="overline" sx={{ color: 'var(--bs-text-muted)' }}>Logo</Typography>
        {logosLoading ? (
          <Stack direction="row" alignItems="center" gap={1} sx={{ py: 2, color: 'var(--bs-text-muted)' }}>
            <CircularProgress size={16} /> <Typography variant="body2">Loading logos…</Typography>
          </Stack>
        ) : logos.length === 0 ? (
          <Typography variant="body2" sx={{ py: 2, color: '#b00020' }}>
            {logosError ?? 'No logos available. A logo is required — try again when the logo service is reachable.'}
          </Typography>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, mt: 1, maxHeight: 260, overflow: 'auto', pr: 0.5 }}>
            {logos.map((l) => {
              const thumb = l.assets?.dark?.horizontal || l.assets?.logo || l.assets?.light?.horizontal;
              const sel = logoName === l.name;
              return (
                <Box
                  key={l.id}
                  component="button"
                  type="button"
                  onClick={() => setLogoName(l.name)}
                  title={l.name}
                  sx={{
                    p: 1, cursor: 'pointer', borderRadius: '8px',
                    background: sel ? 'var(--bs-color-accent-container)' : 'var(--bs-surface-raised)',
                    border: `1px solid ${sel ? 'var(--bs-color-accent-default)' : 'var(--bs-border-default)'}`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5,
                  }}
                >
                  <Box sx={{ width: '100%', height: 40, display: 'grid', placeItems: 'center', background: '#fff', borderRadius: '4px', overflow: 'hidden' }}>
                    {thumb
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={thumb} alt={l.name} style={{ maxWidth: '90%', maxHeight: '90%' }} />
                      : <span style={{ fontSize: 12, color: 'var(--bs-text-muted)' }}>{l.name?.[0] ?? '?'}</span>}
                  </Box>
                  <Typography variant="caption" noWrap sx={{ color: 'var(--bs-text-muted)', maxWidth: '100%' }}>{l.name}</Typography>
                </Box>
              );
            })}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={submitting} sx={{ color: 'var(--bs-text-muted)' }}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!canSubmit}
          startIcon={submitting ? <CircularProgress size={14} color="inherit" /> : null}
          sx={{ bgcolor: 'var(--bs-color-accent-default)', '&:hover': { bgcolor: 'var(--bs-color-accent-hover, var(--bs-color-accent-default))' } }}
        >
          {mode === 'create' ? 'Create project' : 'Save brand'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
