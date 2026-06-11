'use client';

import { DAILY_TOKEN_LIMIT } from '@/constants/tokenBudget';

// Compact "k" formatting: 1500 -> 1.5k, 200000 -> 200k.
function fmt(n) {
  n = Number(n) || 0;
  if (n >= 1000) {
    const k = n / 1000;
    return (k >= 100 ? Math.round(k) : Math.round(k * 10) / 10) + 'k';
  }
  return String(n);
}

// Per-project daily token meter. Plain divs + inline styles so it drops into
// both the inline-styled studio and the MUI/CSS-var (landing, dialog)
// surfaces unchanged. Fill goes green -> amber (>=80%) -> red (>=100%);
// width clamps at 100% but the label always shows the true number.
export default function TokenMeter({
  used = 0,
  limit = DAILY_TOKEN_LIMIT,
  compact = false,
  showLabel = true,
}) {
  const lim = Number(limit) || DAILY_TOKEN_LIMIT;
  const u = Number(used) || 0;
  const pct = Math.min(100, (u / lim) * 100);
  const fill = u >= lim ? '#dc2626' : u >= lim * 0.8 ? '#d97706' : '#16a34a';
  const barH = compact ? 3 : 5;

  return (
    <div
      style={{ width: '100%' }}
      title={`${u.toLocaleString()} / ${lim.toLocaleString()} tokens today`}
    >
      <div
        style={{
          height: barH,
          borderRadius: 999,
          background: 'rgba(0,0,0,0.08)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: fill,
            borderRadius: 999,
            transition: 'width 300ms ease',
          }}
        />
      </div>
      {showLabel && (
        <div
          style={{
            marginTop: compact ? 2 : 4,
            fontSize: compact ? 9.5 : 11,
            fontWeight: 500,
            color: 'rgba(0,0,0,0.5)',
            fontFamily: 'inherit',
            whiteSpace: 'nowrap',
          }}
        >
          {fmt(u)} / {fmt(lim)} today
        </div>
      )}
    </div>
  );
}
