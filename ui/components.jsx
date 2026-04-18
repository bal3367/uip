// ============================================
// COMPONENT PRIMITIVES
// ============================================

const { useState, useEffect, useRef, useMemo, useCallback, Fragment } = React;

// ---------- Formatters ----------
const fmt = {
  usd: (n, d = 2) => n == null ? '—' : (n < 0 ? '-' : '') + '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }),
  usdSigned: (n, d = 2) => n == null ? '—' : (n >= 0 ? '+' : '-') + '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }),
  usdCompact: (n) => {
    if (n == null) return '—';
    const a = Math.abs(n);
    const s = n < 0 ? '-' : '';
    if (a >= 1e6) return s + '$' + (a / 1e6).toFixed(2) + 'M';
    if (a >= 1e3) return s + '$' + (a / 1e3).toFixed(2) + 'k';
    return s + '$' + a.toFixed(2);
  },
  pct: (n, d = 2) => n == null ? '—' : (n >= 0 ? '+' : '') + (n * 100).toFixed(d) + '%',
  pctSimple: (n, d = 1) => n == null ? '—' : (n * 100).toFixed(d) + '%',
  num: (n, d = 2) => n == null ? '—' : n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }),
  R: (n) => n == null ? '—' : (n >= 0 ? '+' : '') + n.toFixed(2) + 'R',
  date: (d) => d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
  dateTime: (d) => d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) + ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
};

// ---------- Sparkline ----------
function Sparkline({ data, w = 120, h = 28, stroke, fill = true, baseline, variant = 'line' }) {
  if (!data || data.length === 0) return <div style={{ width: w, height: h }} />;
  const min = Math.min(...data, baseline ?? Infinity);
  const max = Math.max(...data, baseline ?? -Infinity);
  const range = max - min || 1;
  const last = data[data.length - 1];
  const first = data[0];
  const isPos = last >= first;
  const color = stroke || (isPos ? 'var(--pos)' : 'var(--neg)');
  const dx = w / (data.length - 1);
  const pts = data.map((v, i) => [i * dx, h - ((v - min) / range) * h]);

  if (variant === 'bars') {
    const bw = dx * 0.7;
    return (
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: w, height: h }}>
        {data.map((v, i) => {
          const x = i * dx;
          const barH = ((v - min) / range) * h;
          return <rect key={i} x={x - bw / 2} y={h - barH} width={bw} height={barH} fill={color} opacity={0.8} />;
        })}
      </svg>
    );
  }

  const linePath = 'M ' + pts.map(p => p.join(',')).join(' L ');
  const areaPath = linePath + ` L ${w},${h} L 0,${h} Z`;
  const gid = 'g' + Math.random().toString(36).slice(2, 8);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: w, height: h }} preserveAspectRatio="none">
      {fill && (
        <>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill={`url(#${gid})`} />
        </>
      )}
      <path d={linePath} fill="none" stroke={color} strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2" fill={color} />
    </svg>
  );
}

// ---------- Candles (decorative) ----------
function CandleChart({ w = 240, h = 80, seed = 1 }) {
  const bars = 40;
  const candles = useMemo(() => {
    const out = [];
    let v = 100;
    for (let i = 0; i < bars; i++) {
      const o = v;
      const c = v + (hashFloat(seed + i * 3.1) - 0.5) * 4;
      const high = Math.max(o, c) + hashFloat(seed + i * 7.1) * 2;
      const low = Math.min(o, c) - hashFloat(seed + i * 11.3) * 2;
      out.push({ o, c, high, low });
      v = c;
    }
    return out;
  }, [seed]);
  const all = candles.flatMap(c => [c.high, c.low]);
  const min = Math.min(...all), max = Math.max(...all);
  const range = max - min || 1;
  const cw = w / bars;
  const bw = cw * 0.6;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: w, height: h }}>
      {candles.map((c, i) => {
        const x = i * cw + cw / 2;
        const isUp = c.c >= c.o;
        const col = isUp ? 'var(--pos)' : 'var(--neg)';
        const y = (v) => h - ((v - min) / range) * h;
        const bodyY = y(Math.max(c.o, c.c));
        const bodyH = Math.abs(y(c.o) - y(c.c)) || 1;
        return (
          <g key={i}>
            <line x1={x} y1={y(c.high)} x2={x} y2={y(c.low)} stroke={col} strokeWidth="0.7" opacity="0.8" />
            <rect x={x - bw / 2} y={bodyY} width={bw} height={bodyH} fill={col} opacity="0.9" />
          </g>
        );
      })}
    </svg>
  );
}

// ---------- Pill ----------
function Pill({ tone = 'neutral', live, children, className = '' }) {
  const cls = `pill ${tone !== 'neutral' ? tone : ''} ${className}`;
  return (
    <span className={cls}>
      {live && <span className="dot dot-live" />}
      {children}
    </span>
  );
}

// ---------- Icon (minimal inline SVG set) ----------
const Icon = ({ name, size = 14, strokeWidth = 1.5, style }) => {
  const s = { width: size, height: size, ...style };
  const sw = strokeWidth;
  const common = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round', style: s };
  switch (name) {
    case 'home': return <svg {...common}><path d="M3 10.5L12 3l9 7.5V21H3z"/><path d="M9 21v-6h6v6"/></svg>;
    case 'bots': return <svg {...common}><rect x="4" y="7" width="16" height="12" rx="1"/><path d="M9 4v3M15 4v3M9 12h.01M15 12h.01M8 17h8"/></svg>;
    case 'journal': return <svg {...common}><path d="M5 4h10l4 4v12H5z"/><path d="M15 4v4h4M9 13h6M9 17h4"/></svg>;
    case 'calendar': return <svg {...common}><rect x="4" y="5" width="16" height="16" rx="1"/><path d="M4 10h16M9 3v4M15 3v4"/></svg>;
    case 'chart': return <svg {...common}><path d="M4 20V4M4 20h16"/><path d="M8 16V12M12 16V8M16 16V10"/></svg>;
    case 'settings': return <svg {...common}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 001.3 2l.1.1a2 2 0 01-2.8 2.8l-.1-.1a1.65 1.65 0 00-2 1.3 2 2 0 01-4 0 1.65 1.65 0 00-2-1.3l-.1.1a2 2 0 01-2.8-2.8l.1-.1a1.65 1.65 0 001.3-2 1.65 1.65 0 00-1.3-2l-.1-.1A2 2 0 017.1 4.7l.1.1a1.65 1.65 0 002 1.3 1.65 1.65 0 001.3-2 2 2 0 014 0 1.65 1.65 0 001.3 2 1.65 1.65 0 002-1.3l.1-.1a2 2 0 012.8 2.8l-.1.1a1.65 1.65 0 00-1.3 2"/></svg>;
    case 'plus': return <svg {...common}><path d="M12 5v14M5 12h14"/></svg>;
    case 'search': return <svg {...common}><circle cx="11" cy="11" r="7"/><path d="M20 20l-3-3"/></svg>;
    case 'filter': return <svg {...common}><path d="M3 5h18M6 12h12M10 19h4"/></svg>;
    case 'sun': return <svg {...common}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.2 4.2l1.5 1.5M18.3 18.3l1.5 1.5M2 12h2M20 12h2M4.2 19.8l1.5-1.5M18.3 5.7l1.5-1.5"/></svg>;
    case 'moon': return <svg {...common}><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/></svg>;
    case 'arrowRight': return <svg {...common}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case 'arrowLeft': return <svg {...common}><path d="M19 12H5M11 6l-6 6 6 6"/></svg>;
    case 'arrowUp': return <svg {...common}><path d="M12 19V5M6 11l6-6 6 6"/></svg>;
    case 'arrowDown': return <svg {...common}><path d="M12 5v14M6 13l6 6 6-6"/></svg>;
    case 'x': return <svg {...common}><path d="M18 6L6 18M6 6l12 12"/></svg>;
    case 'bell': return <svg {...common}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0"/></svg>;
    case 'activity': return <svg {...common}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>;
    case 'download': return <svg {...common}><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg>;
    case 'upload': return <svg {...common}><path d="M12 21V9M7 14l5-5 5 5M5 3h14"/></svg>;
    case 'play': return <svg {...common}><polygon points="6 4 20 12 6 20 6 4" fill="currentColor" stroke="none"/></svg>;
    case 'pause': return <svg {...common}><rect x="6" y="4" width="4" height="16" fill="currentColor" stroke="none"/><rect x="14" y="4" width="4" height="16" fill="currentColor" stroke="none"/></svg>;
    case 'more': return <svg {...common}><circle cx="5" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="19" cy="12" r="1" fill="currentColor"/></svg>;
    case 'grid': return <svg {...common}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;
    case 'list': return <svg {...common}><path d="M4 6h16M4 12h16M4 18h16"/></svg>;
    case 'image': return <svg {...common}><rect x="3" y="3" width="18" height="18" rx="1"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5-11 11"/></svg>;
    case 'tag': return <svg {...common}><path d="M20 12l-8 8-9-9V3h8z"/><circle cx="7.5" cy="7.5" r="1" fill="currentColor"/></svg>;
    case 'telegram': return <svg {...common}><path d="M3 11l18-7-3 17-6-5-3 5-3-7z"/></svg>;
    case 'lightning': return <svg {...common}><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" fill="currentColor" stroke="none"/></svg>;
    case 'check': return <svg {...common}><path d="M5 13l4 4L19 7"/></svg>;
    case 'edit': return <svg {...common}><path d="M11 4H4v16h16v-7M18.5 2.5a2.1 2.1 0 013 3L12 15l-4 1 1-4z"/></svg>;
    case 'copy': return <svg {...common}><rect x="9" y="9" width="13" height="13" rx="1"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>;
    case 'clock': return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case 'wallet': return <svg {...common}><rect x="3" y="6" width="18" height="14" rx="1"/><path d="M3 10h18M17 15h.01"/></svg>;
    case 'zap': return <svg {...common}><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></svg>;
    case 'book': return <svg {...common}><path d="M4 4h14a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/><path d="M8 8h10M8 12h10M8 16h6"/></svg>;
    case 'shield': return <svg {...common}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
    case 'cpu': return <svg {...common}><rect x="4" y="4" width="16" height="16" rx="1"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/></svg>;
    case 'dollar': return <svg {...common}><path d="M12 1v22M17 6a4 4 0 00-4-3h-2a4 4 0 000 8h2a4 4 0 010 8h-2a4 4 0 01-4-3"/></svg>;
    default: return <svg {...common}><circle cx="12" cy="12" r="8"/></svg>;
  }
};

// ---------- Stat Tile ----------
function StatTile({ label, value, sub, tone, big }) {
  const toneCls = tone === 'pos' ? 'pos' : tone === 'neg' ? 'neg' : '';
  return (
    <div className="stat-tile">
      <div className="label">{label}</div>
      <div className={`${big ? 'big-num' : 'num'} ${toneCls}`} style={big ? {} : { fontSize: 'var(--fs-20)', fontWeight: 500, color: tone ? undefined : 'var(--ink-0)' }}>{value}</div>
      {sub && <div className="mono" style={{ fontSize: 'var(--fs-11)', color: 'var(--ink-3)', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

// ---------- Status dot ----------
function StatusDot({ status }) { return <span className={`status-dot ${status}`} />; }

// ---------- Ticker bar ----------
function Ticker({ items }) {
  const doubled = [...items, ...items];
  return (
    <div className="ticker">
      <div className="ticker-track">
        {doubled.map((t, i) => (
          <span className="ticker-item" key={i}>
            <span className="sym">{t.sym}</span>
            {t.price != null && <span>{t.price >= 10 ? t.price.toFixed(2) : t.price.toFixed(4)}</span>}
            <span className={t.chg >= 0 ? 'pos' : 'neg'}>{t.isFunding ? (t.chg * 100).toFixed(4) + '%' : (t.chg >= 0 ? '+' : '') + (t.chg * 100).toFixed(2) + '%'}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ---------- Equity Curve (big) ----------
function EquityCurve({ data, height = 180, showGrid = true, showAxis = true }) {
  const ref = useRef(null);
  const [w, setW] = useState(600);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(() => { if (ref.current) setW(ref.current.clientWidth); });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  if (!data || data.length === 0) return <div ref={ref} style={{ height }} />;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = { t: 12, r: 48, b: 20, l: 0 };
  const cw = Math.max(0, w - pad.r);
  const ch = Math.max(0, height - pad.t - pad.b);
  const dx = cw / (data.length - 1);
  const pts = data.map((v, i) => [i * dx, pad.t + ch - ((v - min) / range) * ch]);
  const linePath = 'M ' + pts.map(p => p.join(',')).join(' L ');
  const areaPath = linePath + ` L ${cw},${pad.t + ch} L 0,${pad.t + ch} Z`;
  const color = data[data.length - 1] >= data[0] ? 'var(--pos)' : 'var(--neg)';
  const ticks = 4;
  return (
    <div ref={ref} style={{ width: '100%', height, position: 'relative' }}>
      <svg viewBox={`0 0 ${w} ${height}`} width={w} height={height} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="eqgrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {showGrid && Array.from({ length: ticks + 1 }, (_, i) => {
          const y = pad.t + (ch / ticks) * i;
          const v = max - (range / ticks) * i;
          return (
            <g key={i}>
              <line x1="0" y1={y} x2={cw} y2={y} stroke="var(--line-1)" strokeWidth="1" />
              {showAxis && <text x={cw + 8} y={y + 3} fontFamily="var(--ff-mono)" fontSize="10" fill="var(--ink-3)">{fmt.usdCompact(v)}</text>}
            </g>
          );
        })}
        <path d={areaPath} fill="url(#eqgrad)" />
        <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="3" fill={color} />
        <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="6" fill={color} opacity="0.2" />
      </svg>
    </div>
  );
}

// ---------- Grid Background pattern ----------
function GridPattern({ children, style }) {
  return <div className="grid-bg" style={style}>{children}</div>;
}

// ---------- Section header ----------
function SectionHead({ eyebrow, jp, title, action, sub }) {
  return (
    <div className="row between" style={{ marginBottom: 'var(--s-8)', gap: 'var(--s-8)' }}>
      <div className="col gap-2">
        {(eyebrow || jp) && (
          <div className="row gap-6" style={{ alignItems: 'baseline' }}>
            {eyebrow && <div className="label">{eyebrow}</div>}
            {jp && <div className="jp" style={{ fontSize: 10, color: 'var(--magenta)', letterSpacing: '0.08em' }}>{jp}</div>}
          </div>
        )}
        {title && <div className="h-2">{title}</div>}
        {sub && <div style={{ color: 'var(--ink-2)', fontSize: 'var(--fs-12)' }}>{sub}</div>}
      </div>
      {action}
    </div>
  );
}

// ---------- Bot Avatar — geometric NERV-style SVG ----------
// Each bot gets a deterministic glyph based on its id + category
function BotAvatar({ bot, size = 48, accent }) {
  const seed = (bot?.id || 'x').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const hue = (seed * 47) % 360;
  const primary = accent || (bot?.platform === 'Paradex' ? 'var(--info)'
    : bot?.platform === 'Hyperliquid' ? 'var(--magenta)'
    : bot?.platform === 'Polymarket' ? 'var(--warn)'
    : bot?.platform === 'Solana' ? 'var(--violet)'
    : 'var(--pos)');
  const glyph = seed % 6;
  const initials = (bot?.name || '??').slice(0, 2).toUpperCase();
  const kata = ['モ', 'パ', 'ハ', 'コ', 'フ', 'パ', 'プ', 'プ', 'ラ', 'ネ', 'ゼ'][seed % 11];

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={{ flexShrink: 0, display: 'block' }}>
      {/* Outer hex frame */}
      <polygon
        points="24,2 44,13 44,35 24,46 4,35 4,13"
        fill="var(--bg-2)"
        stroke={primary}
        strokeWidth="1"
      />
      {/* Inner ring */}
      <polygon
        points="24,6 40,15 40,33 24,42 8,33 8,15"
        fill="none"
        stroke={primary}
        strokeWidth="0.5"
        opacity="0.5"
      />
      {/* Center glyph — varies per seed */}
      {glyph === 0 && <circle cx="24" cy="24" r="8" fill="none" stroke={primary} strokeWidth="1.5"/>}
      {glyph === 1 && <rect x="16" y="16" width="16" height="16" fill="none" stroke={primary} strokeWidth="1.5"/>}
      {glyph === 2 && <polygon points="24,14 34,30 14,30" fill="none" stroke={primary} strokeWidth="1.5"/>}
      {glyph === 3 && <><line x1="14" y1="24" x2="34" y2="24" stroke={primary} strokeWidth="1.5"/><line x1="24" y1="14" x2="24" y2="34" stroke={primary} strokeWidth="1.5"/><circle cx="24" cy="24" r="3" fill={primary}/></>}
      {glyph === 4 && <><polygon points="24,14 32,20 32,28 24,34 16,28 16,20" fill={primary} opacity="0.18" stroke={primary} strokeWidth="1"/><circle cx="24" cy="24" r="2" fill={primary}/></>}
      {glyph === 5 && <><circle cx="24" cy="24" r="9" fill="none" stroke={primary} strokeWidth="1" strokeDasharray="2 2"/><circle cx="24" cy="24" r="4" fill={primary} opacity="0.3"/></>}
      {/* Katakana tag top-left */}
      <text x="6" y="10" fontFamily="'Zen Kaku Gothic New', sans-serif" fontSize="5" fill={primary} opacity="0.8" letterSpacing="0.5">{kata}</text>
      {/* Initials bottom-right */}
      <text x="42" y="42" fontFamily="'JetBrains Mono', monospace" fontSize="5" fill="var(--ink-2)" textAnchor="end" fontWeight="600">{initials}</text>
    </svg>
  );
}

// ---------- Progress bar ----------
function Progress({ value, max = 1, tone = 'pos', h = 4 }) {
  const pct = Math.max(0, Math.min(1, value / max)) * 100;
  const color = tone === 'pos' ? 'var(--pos)' : tone === 'neg' ? 'var(--neg)' : tone === 'warn' ? 'var(--warn)' : 'var(--accent)';
  return (
    <div style={{ background: 'var(--bg-3)', height: h, borderRadius: h / 2, overflow: 'hidden', width: '100%' }}>
      <div style={{ background: color, width: pct + '%', height: '100%' }} />
    </div>
  );
}

// ---------- Rating 1-5 ----------
function Rating({ value, max = 5 }) {
  return (
    <div className="row gap-2">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} style={{
          width: 8, height: 12,
          background: i < value ? 'var(--accent)' : 'var(--bg-3)',
          borderRadius: 1,
        }}/>
      ))}
    </div>
  );
}

// ---------- Donut ----------
function Donut({ value, max = 1, size = 48, stroke = 6, tone = 'pos', label }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value / max));
  const color = tone === 'pos' ? 'var(--pos)' : tone === 'neg' ? 'var(--neg)' : tone === 'warn' ? 'var(--warn)' : 'var(--accent)';
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} stroke="var(--bg-3)" strokeWidth={stroke} fill="none"/>
      <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={stroke} fill="none"
        strokeDasharray={`${c * pct} ${c}`} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}/>
      {label && <text x={size/2} y={size/2 + 4} textAnchor="middle" fontFamily="var(--ff-mono)" fontSize="11" fill="var(--ink-0)">{label}</text>}
    </svg>
  );
}

// ---------- Export to window ----------
Object.assign(window, {
  fmt, Sparkline, CandleChart, Pill, Icon, StatTile, StatusDot,
  Ticker, EquityCurve, GridPattern, SectionHead, Progress, Rating, Donut, BotAvatar
});
