// ============================================
// MOCK DATA — Bots, Trades, Journal, Equity
// ============================================

const BOTS = [
  {
    id: 'monk',
    name: 'Monk',
    platform: 'Paradex',
    category: 'perp-dex',
    strategy: 'Divergence BTC/ETH',
    mode: 'live',
    status: 'live',
    pnl24h: 142.38,
    pnl7d: 1284.50,
    pnlAll: 8421.20,
    equity: 12421.20,
    startEquity: 4000,
    trades24h: 3,
    winRate: 0.62,
    sharpe: 1.42,
    drawdown: -0.08,
    lastSignal: '2m ago',
    tgBot: '@monk_paradex',
    description: 'Divergence strategy BTC/ETH. Logs price history, one-shot entry per session.',
  },
  {
    id: 'monksc',
    name: 'MonkSC',
    platform: 'Paradex',
    category: 'perp-dex',
    strategy: 'Scalp 4h Lookback',
    mode: 'live',
    status: 'live',
    pnl24h: 38.91,
    pnl7d: 412.80,
    pnlAll: 2108.33,
    equity: 6108.33,
    startEquity: 4000,
    trades24h: 11,
    winRate: 0.58,
    sharpe: 1.18,
    drawdown: -0.11,
    lastSignal: '14m ago',
    tgBot: '@zeroparabot',
    description: 'Scalp-only fork of Monk. Reads price_history.json read-only.',
  },
  {
    id: 'hl_tracker',
    name: 'HL Tracker',
    platform: 'Hyperliquid',
    category: 'perp-dex',
    strategy: 'Leaderboard Scanner',
    mode: 'signal',
    status: 'live',
    pnl24h: null,
    pnl7d: null,
    pnlAll: null,
    trades24h: 47,
    winRate: null,
    sharpe: null,
    drawdown: null,
    lastSignal: '3s ago',
    tgBot: '@hltracker_bot',
    description: 'Auto-discovers top traders. TG alerts on new open/close.',
  },
  {
    id: 'copy_bot',
    name: 'Copy Bot',
    platform: 'Hyperliquid',
    category: 'perp-dex',
    strategy: 'Paper Copytrade',
    mode: 'paper',
    status: 'paper',
    pnl24h: 84.12,
    pnl7d: 421.30,
    pnlAll: 1842.10,
    equity: 11842.10,
    startEquity: 10000,
    trades24h: 8,
    winRate: 0.55,
    sharpe: 0.94,
    drawdown: -0.14,
    lastSignal: '6m ago',
    tgBot: null,
    description: 'Mirrors top HL traders to paper book.',
  },
  {
    id: 'follow_bot',
    name: 'Follow Bot',
    platform: 'Hyperliquid',
    category: 'perp-dex',
    strategy: 'Custom Close Alerts',
    mode: 'signal',
    status: 'live',
    pnl24h: null,
    pnl7d: null,
    pnlAll: null,
    trades24h: 22,
    winRate: null,
    sharpe: null,
    drawdown: null,
    lastSignal: '41s ago',
    tgBot: '@milapolbot',
    description: 'Scans HL tracker every 3s. Custom alerts per (address, coin).',
  },
  {
    id: 'pulse',
    name: 'Pulse',
    platform: 'Hyperliquid',
    category: 'perp-dex',
    strategy: '5-Filter Confluence 4h',
    mode: 'paper',
    status: 'paper',
    pnl24h: -12.44,
    pnl7d: 184.20,
    pnlAll: 421.80,
    equity: 421.80,
    startEquity: 100,
    trades24h: 1,
    winRate: 0.71,
    sharpe: 2.10,
    drawdown: -0.06,
    lastSignal: '1h 22m ago',
    tgBot: null,
    description: '5-filter confluence + AI brain. $100 paper challenge.',
  },
  {
    id: 'pulse_bot',
    name: 'Pulse Bot',
    platform: 'Hyperliquid',
    category: 'perp-dex',
    strategy: 'MiniMax Brain + Cohort',
    mode: 'paper',
    status: 'paper',
    pnl24h: 52.18,
    pnl7d: 318.00,
    pnlAll: 1210.45,
    equity: 11210.45,
    startEquity: 10000,
    trades24h: 4,
    winRate: 0.64,
    sharpe: 1.68,
    drawdown: -0.09,
    lastSignal: '22m ago',
    tgBot: null,
    description: 'Paper trader with MiniMax brain reading profitable-30d cohort. Prop-mode integration.',
  },
  {
    id: 'prop_guard',
    name: 'Prop Guard',
    platform: 'Hyperliquid',
    category: 'compliance',
    strategy: 'propr.xyz Compliance',
    mode: 'monitor',
    status: 'live',
    pnl24h: null,
    pnl7d: null,
    pnlAll: null,
    trades24h: 0,
    winRate: null,
    sharpe: null,
    drawdown: null,
    lastSignal: '8m ago',
    tgBot: '@propguard_bot',
    description: 'propr.xyz compliance monitor. Paper phase, reads pulse_bot state.',
  },
  {
    id: 'live_bot',
    name: 'Live Bot',
    platform: 'Hyperliquid',
    category: 'perp-dex',
    strategy: 'R:R ≥ 2.5 / HIGH conf only',
    mode: 'signal',
    status: 'live',
    pnl24h: null,
    pnl7d: null,
    pnlAll: null,
    trades24h: 2,
    winRate: null,
    sharpe: null,
    drawdown: null,
    lastSignal: '4h 11m ago',
    tgBot: '@livebot_signals',
    description: 'Real-money signal agent. Alert-only. $50 start, R:R ≥ 2.5, 3/day cap, 3+ aligned traders.',
  },
  {
    id: 'neh',
    name: 'NEH Bot',
    platform: 'Polymarket',
    category: 'prediction',
    strategy: 'Nothing Ever Happens',
    mode: 'paper',
    status: 'paper',
    pnl24h: 18.40,
    pnl7d: 121.55,
    pnlAll: 482.10,
    equity: 1482.10,
    startEquity: 1000,
    trades24h: 6,
    winRate: 0.81,
    sharpe: 2.42,
    drawdown: -0.04,
    lastSignal: '12m ago',
    tgBot: '@neh_paper',
    description: 'Buys NO on non-sports yes/no markets. Paper → live phases.',
  },
  {
    id: 'zero_two',
    name: 'Zero Two',
    platform: 'Solana DLMM',
    category: 'solana',
    strategy: 'Supertrend 15m / RSI2+BB+MACD exit',
    mode: 'paper',
    status: 'paper',
    pnl24h: -24.10,
    pnl7d: 88.40,
    pnlAll: 88.40,
    equity: 1088.40,
    startEquity: 1000,
    trades24h: 2,
    winRate: 0.50,
    sharpe: 0.62,
    drawdown: -0.12,
    lastSignal: '48m ago',
    tgBot: '@zerotwo_bot',
    description: 'Rule-based 15m TA. Watchlist-driven. Rebuilt 2026-04-13 from Minimax brain.',
  },
];

// Generate equity curve (realistic random walk)
function makeEquityCurve(startEquity, endEquity, length = 60, volatility = 0.02) {
  if (startEquity == null || endEquity == null) return null;
  const points = [];
  const drift = (endEquity - startEquity) / length;
  let v = startEquity;
  for (let i = 0; i < length; i++) {
    const noise = (Math.sin(i * 1.37) * 0.5 + (hashFloat(i * 31 + startEquity) - 0.5)) * startEquity * volatility;
    v += drift + noise;
    points.push(v);
  }
  points[points.length - 1] = endEquity;
  return points;
}

function hashFloat(n) {
  const x = Math.sin(n * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

BOTS.forEach((b, i) => {
  if (b.startEquity != null && b.equity != null) {
    b.equityCurve = makeEquityCurve(b.startEquity, b.equity, 80, 0.015 + (i % 3) * 0.01);
  }
});

// ---------- Trade Journal ----------
const SETUPS = ['Divergence', 'Breakout', 'Range fade', 'Trend pullback', 'Liquidity sweep', 'OB retest', 'FVG fill', 'News reaction'];
const PAIRS = ['BTC-USD', 'ETH-USD', 'SOL-USD', 'HYPE-USD', 'DOGE-USD', 'WIF-USD', 'LINK-USD', 'AVAX-USD', 'SUI-USD', 'KAITO-USD'];
const EMOTIONS = ['Calm', 'FOMO', 'Revenge', 'Confident', 'Fearful', 'Greedy', 'Disciplined', 'Uncertain'];
const MISTAKES = ['Moved stop', 'Over-sized', 'No plan', 'Chased entry', 'Ignored R:R', 'Traded tired', 'News blind', 'Cut winner early'];

function makeTrade(i) {
  const h = (k) => hashFloat(i * 17 + k);
  const pair = PAIRS[Math.floor(h(1) * PAIRS.length)];
  const dir = h(2) > 0.5 ? 'LONG' : 'SHORT';
  const setup = SETUPS[Math.floor(h(3) * SETUPS.length)];
  const entry = 100 + h(4) * 50000;
  const size = 0.01 + h(5) * 2;
  const rMultiple = (h(6) * 6 - 2);
  const pnl = rMultiple * (size * entry * 0.002);
  const confidence = 1 + Math.floor(h(7) * 5);
  const daysAgo = i * 0.5 + h(8) * 2;
  const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  const emotion = EMOTIONS[Math.floor(h(9) * EMOTIONS.length)];
  const mistake = h(10) > 0.55 ? MISTAKES[Math.floor(h(11) * MISTAKES.length)] : null;
  const closed = h(12) > 0.15;
  return {
    id: `T-${String(2048 - i).padStart(4, '0')}`,
    pair, dir, setup,
    entry: entry,
    exit: closed ? entry * (1 + rMultiple * 0.008) : null,
    size: size,
    pnl: closed ? pnl : null,
    rMultiple: closed ? rMultiple : null,
    confidence,
    emotion,
    mistake,
    date,
    status: closed ? (pnl >= 0 ? 'WIN' : 'LOSS') : 'OPEN',
    thesis: [
      'Daily trend aligned with setup. Entry on 4h retest of previous high after liquidity sweep.',
      'News-driven spike into range. Planning to fade mean reversion back to midline.',
      'Higher-timeframe bullish OB. Waiting for 15m confirmation candle.',
      'RSI divergence on 1h. Stop below swing low, target previous swing high = 3R.',
    ][Math.floor(h(13) * 4)],
    reflection: closed ? [
      'Clean execution. Plan matched reality. Could have held for runner.',
      'Entry too early — should have waited for confirmation candle close.',
      'Fought a trend. Next time respect the higher-timeframe bias.',
      'Nailed the setup. Sized correctly. Keep doing this.',
    ][Math.floor(h(14) * 4)] : '',
    tags: ['manual'],
  };
}

const TRADES = Array.from({ length: 48 }, (_, i) => makeTrade(i));

// ---------- Portfolio equity (aggregate) ----------
const PORTFOLIO = {
  equity: 58234.90,
  equity24h: 1421.30,
  equity7d: 4218.60,
  equityAll: 18234.90,
  startCapital: 40000,
  monthlyReturn: 0.084,
  winRateAll: 0.61,
  totalTrades: 312,
  openTrades: 7,
  avgR: 1.24,
  sharpe: 1.54,
  maxDD: -0.113,
};

PORTFOLIO.equityCurve = makeEquityCurve(PORTFOLIO.startCapital, PORTFOLIO.equity, 180, 0.008);

// ---------- Calendar (P&L per day, last 42 days) ----------
const CALENDAR = (() => {
  const out = [];
  const today = new Date();
  for (let i = 41; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const h1 = hashFloat(i * 7.1);
    const h2 = hashFloat(i * 3.7);
    const trades = Math.floor(h1 * 6);
    const pnl = trades === 0 ? 0 : (h2 - 0.4) * 800;
    out.push({ date: d, pnl, trades });
  }
  return out;
})();

// ---------- Ticker feed ----------
const TICKER = [
  { sym: 'BTC', price: 94218.40, chg: 0.024 },
  { sym: 'ETH', price: 3421.88, chg: 0.018 },
  { sym: 'SOL', price: 184.22, chg: -0.012 },
  { sym: 'HYPE', price: 24.18, chg: 0.082 },
  { sym: 'KAITO', price: 1.442, chg: 0.044 },
  { sym: 'WIF', price: 2.18, chg: -0.031 },
  { sym: 'DOGE', price: 0.184, chg: 0.009 },
  { sym: 'AVAX', price: 42.81, chg: -0.008 },
  { sym: 'SUI', price: 4.18, chg: 0.022 },
  { sym: 'LINK', price: 18.42, chg: -0.005 },
  { sym: 'FUNDING 1H', price: null, chg: 0.00018, isFunding: true },
  { sym: 'US 10Y', price: 4.28, chg: -0.0042 },
  { sym: 'DXY', price: 104.81, chg: 0.0018 },
];

// ---------- Recent alerts / activity feed ----------
const ACTIVITY = [
  { t: '0s', bot: 'HL Tracker', kind: 'info', msg: '@jeff.hl opened 42k SHORT ETH' },
  { t: '41s', bot: 'Follow Bot', kind: 'warn', msg: '@hyper.ape closed BTC position +$18,421' },
  { t: '2m', bot: 'Monk', kind: 'pos', msg: 'BTC-USD divergence fired. Entry 94,120. R:R 3.1' },
  { t: '14m', bot: 'MonkSC', kind: 'pos', msg: 'ETH-USD scalp closed +$12.40 / +0.4R' },
  { t: '22m', bot: 'Pulse Bot', kind: 'info', msg: '5-filter setup rejected. Cohort alignment 2/4.' },
  { t: '48m', bot: 'Zero Two', kind: 'neg', msg: 'WIF-USD supertrend exit -$24.10 / -0.8R' },
  { t: '1h 22m', bot: 'Pulse', kind: 'warn', msg: 'Setup forming on HYPE-USD. Waiting for 4h close.' },
  { t: '4h 11m', bot: 'Live Bot', kind: 'pos', msg: 'SIGNAL: BTC-USD LONG @ 93,840. SL 93,200. TP 95,400. R:R 2.44. HIGH conf.' },
  { t: '6h', bot: 'NEH Bot', kind: 'pos', msg: 'Closed: "Will Trump tweet before noon?" NO @ 0.08 → 0.02. +$18.40' },
  { t: '8h', bot: 'Prop Guard', kind: 'info', msg: 'Daily loss 0.4% of 5% limit. Status: GREEN' },
];

window.BOTS = BOTS;
window.TRADES = TRADES;
window.PORTFOLIO = PORTFOLIO;
window.CALENDAR = CALENDAR;
window.TICKER = TICKER;
window.ACTIVITY = ACTIVITY;
window.SETUPS = SETUPS;
window.PAIRS = PAIRS;
window.EMOTIONS = EMOTIONS;
window.MISTAKES = MISTAKES;
window.hashFloat = hashFloat;
window.makeEquityCurve = makeEquityCurve;
