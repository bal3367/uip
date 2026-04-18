// ============================================
// SCREEN: OVERVIEW (Home Dashboard)
// ============================================

// ---------- Mock data for hot coins + news (module scope) ----------
const HOT_COINS = [
  { sym: 'HYPE',  price: 24.18,   chg: 0.082,  volUsd: 142.4e6, traders: 12, longShort: 0.78, topAddr: '@jeff.hl' },
  { sym: 'BTC',   price: 94218.4, chg: 0.024,  volUsd: 1.42e9,  traders: 18, longShort: 0.64, topAddr: '@hyper.ape' },
  { sym: 'ETH',   price: 3421.88, chg: 0.018,  volUsd: 842e6,   traders: 14, longShort: 0.58, topAddr: '@0xsun' },
  { sym: 'KAITO', price: 1.442,   chg: 0.044,  volUsd: 48.2e6,  traders: 9,  longShort: 0.82, topAddr: '@milady' },
  { sym: 'SUI',   price: 4.18,    chg: 0.022,  volUsd: 24.1e6,  traders: 7,  longShort: 0.71, topAddr: '@farmer' },
  { sym: 'WIF',   price: 2.18,    chg: -0.031, volUsd: 18.4e6,  traders: 6,  longShort: 0.22, topAddr: '@degen.sol' },
  { sym: 'SOL',   price: 184.22,  chg: -0.012, volUsd: 412e6,   traders: 11, longShort: 0.41, topAddr: '@cobie.wen' },
  { sym: 'AVAX',  price: 42.81,   chg: -0.008, volUsd: 12.8e6,  traders: 4,  longShort: 0.33, topAddr: '@trench' },
];

const NEWS_INSIGHTS = [
  { tag: 'MACRO',   t: '8m',  headline: 'Fed minutes signal hold — risk assets bid',    body: 'Dot plot points to one cut by Q3. DXY sold into 104.6 support; crypto majors catching flows.', impact: 'pos' },
  { tag: 'FLOW',    t: '22m', headline: 'HYPE OI at ATH · 3rd consecutive day',         body: '$412M OI across HL perps. Funding +0.018%/h. Top cohort rotating from ETH into HYPE.',     impact: 'pos' },
  { tag: 'COHORT',  t: '41m', headline: '6/11 tracked traders net long BTC 4H',          body: 'Alignment score 0.68. Pulse filter triggered pre-alert on 94,120 retest.',                impact: 'info' },
  { tag: 'ONCHAIN', t: '1h',  headline: 'Whale moved 3,200 ETH to Binance',              body: 'Address 0x4a…c3 historically front-runs supply events. Watch for spot pressure.',        impact: 'warn' },
  { tag: 'AI',      t: '2h',  headline: 'MiniMax brain: "structure breaking down on SOL"', body: 'Pulse Bot confidence score dropped to 0.31 on SOL 4H. Cohort exits detected.',          impact: 'neg' },
  { tag: 'NEH',     t: '3h',  headline: 'Polymarket: 4 new yes/no markets resolved NO',  body: 'Base rate 79%. NEH Bot edge intact — 13-day green streak.',                              impact: 'pos' },
];

function ScreenOverview({ nav }) {
  const { BOTS, TRADES, PORTFOLIO, ACTIVITY, CALENDAR, fmt } = window;

  const activeBots = BOTS.filter(b => b.status === 'live' || b.status === 'paper').length;
  const recentTrades = TRADES.slice(0, 6);
  const todayCal = CALENDAR.slice(-7);
  const [selectedCoin, setSelectedCoin] = React.useState('HYPE');
  const coin = HOT_COINS.find(c => c.sym === selectedCoin) || HOT_COINS[0];

  return (
    <div className="screen overview">
      {/* HERO BAND */}
      <section className="panel" style={{ borderRadius: 0, borderLeft: 0, borderRight: 0, borderTop: 0 }}>
        <div style={{ padding: '28px 24px 24px', display: 'grid', gridTemplateColumns: '1.1fr 2fr', gap: 32, alignItems: 'end' }}>
          <div className="col gap-8">
            <div className="label">PORTFOLIO · PAPER + LIVE</div>
            <div className="h-display mono" style={{ fontFamily: 'var(--ff-mono)', fontSize: 'var(--fs-64)', fontWeight: 400 }}>
              {fmt.usd(PORTFOLIO.equity)}
            </div>
            <div className="row gap-12 wrap" style={{ marginTop: 4 }}>
              <div className="row gap-4">
                <span className="label">24H</span>
                <span className={`mono ${PORTFOLIO.equity24h >= 0 ? 'pos' : 'neg'}`} style={{ fontSize: 'var(--fs-14)' }}>
                  {fmt.usdSigned(PORTFOLIO.equity24h)}
                </span>
              </div>
              <div className="vr" style={{ height: 14 }} />
              <div className="row gap-4">
                <span className="label">7D</span>
                <span className={`mono ${PORTFOLIO.equity7d >= 0 ? 'pos' : 'neg'}`} style={{ fontSize: 'var(--fs-14)' }}>
                  {fmt.usdSigned(PORTFOLIO.equity7d)}
                </span>
              </div>
              <div className="vr" style={{ height: 14 }} />
              <div className="row gap-4">
                <span className="label">ALL TIME</span>
                <span className={`mono ${PORTFOLIO.equityAll >= 0 ? 'pos' : 'neg'}`} style={{ fontSize: 'var(--fs-14)' }}>
                  {fmt.usdSigned(PORTFOLIO.equityAll)} · {fmt.pct(PORTFOLIO.equityAll / PORTFOLIO.startCapital)}
                </span>
              </div>
            </div>
            <div className="serif" style={{ fontSize: 'var(--fs-18)', fontStyle: 'italic', color: 'var(--ink-2)', marginTop: 12, maxWidth: 420, lineHeight: 1.4 }}>
              "The market is a device for transferring money from the impatient to the patient." — <span style={{ fontFamily: 'var(--ff-mono)', fontStyle: 'normal', fontSize: 'var(--fs-11)', color: 'var(--ink-3)' }}>Buffett</span>
            </div>
          </div>
          <div style={{ height: 180 }}>
            <EquityCurve data={PORTFOLIO.equityCurve} height={180} />
          </div>
        </div>
      </section>

      {/* KPI STRIP */}
      <section className="panel" style={{ borderRadius: 0, borderLeft: 0, borderRight: 0, borderTop: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)' }}>
          {[
            { label: 'BOTS ACTIVE', value: `${activeBots}/${BOTS.length}`, sub: `${BOTS.filter(b=>b.mode==='live').length} LIVE · ${BOTS.filter(b=>b.mode==='paper').length} PAPER` },
            { label: 'WIN RATE', value: fmt.pctSimple(PORTFOLIO.winRateAll), sub: `${PORTFOLIO.totalTrades} trades` },
            { label: 'AVG R', value: fmt.R(PORTFOLIO.avgR), sub: 'per closed trade' },
            { label: 'SHARPE', value: PORTFOLIO.sharpe.toFixed(2), sub: 'annualized' },
            { label: 'MAX DD', value: fmt.pct(PORTFOLIO.maxDD), sub: 'all-time', tone: 'neg' },
            { label: 'OPEN POSITIONS', value: PORTFOLIO.openTrades, sub: 'across books' },
          ].map((k, i) => (
            <div key={i} style={{ padding: '16px 20px', borderRight: i < 5 ? '1px solid var(--line-1)' : 'none' }}>
              <div className="label">{k.label}</div>
              <div className="mono" style={{ fontSize: 'var(--fs-24)', color: k.tone === 'neg' ? 'var(--neg)' : 'var(--ink-0)', letterSpacing: '-0.01em', marginTop: 4 }}>{k.value}</div>
              <div className="mono" style={{ fontSize: 'var(--fs-10)', color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 }}>{k.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOT COINS + CHART + NEWS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr 1.1fr', gap: 1, background: 'var(--line-1)', borderBottom: '1px solid var(--line-1)' }}>
        {/* LEFT: Hot coins traded by top profitable HL traders */}
        <section style={{ background: 'var(--bg-0)', padding: 20 }}>
          <SectionHead
            eyebrow="HYPERLIQUID · TOP-PROFIT COHORT"
            title="Hot coins"
            action={<Pill tone="pos" live>LIVE</Pill>}
          />
          <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
            aggregated from 30d profitable traders
          </div>
          <div className="col" style={{ gap: 0 }}>
            {HOT_COINS.map((c, i) => {
              const active = c.sym === selectedCoin;
              const maxVol = Math.max(...HOT_COINS.map(x => x.volUsd));
              return (
                <div key={c.sym} onClick={() => setSelectedCoin(c.sym)} style={{
                  padding: '10px 8px',
                  cursor: 'pointer',
                  borderBottom: i < HOT_COINS.length - 1 ? '1px dashed var(--line-1)' : 'none',
                  background: active ? 'var(--bg-2)' : 'transparent',
                  borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
                  transition: 'all 120ms',
                }}>
                  <div className="row between" style={{ marginBottom: 4 }}>
                    <div className="row gap-6">
                      <span className="mono ink-0" style={{ fontSize: 12, fontWeight: 600, letterSpacing: '-0.01em' }}>{c.sym}</span>
                      <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{c.price >= 100 ? c.price.toFixed(2) : c.price.toFixed(4)}</span>
                    </div>
                    <span className={`mono ${c.chg >= 0 ? 'pos' : 'neg'}`} style={{ fontSize: 11, fontWeight: 500 }}>{(c.chg >= 0 ? '+' : '') + (c.chg * 100).toFixed(2)}%</span>
                  </div>
                  <div className="row between" style={{ marginBottom: 6 }}>
                    <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{c.traders} traders · {fmt.usdCompact(c.volUsd)}</span>
                    <span className="mono" style={{ fontSize: 10, color: c.longShort >= 0.5 ? 'var(--pos)' : 'var(--neg)' }}>
                      {c.longShort >= 0.5 ? 'L ' : 'S '}{Math.round(c.longShort * 100)}%
                    </span>
                  </div>
                  {/* L/S ratio bar */}
                  <div style={{ height: 3, background: 'var(--neg)', borderRadius: 1, overflow: 'hidden', display: 'flex' }}>
                    <div style={{ height: '100%', width: (c.longShort * 100) + '%', background: 'var(--pos)' }}/>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* MIDDLE: Candle chart */}
        <section style={{ background: 'var(--bg-0)', padding: 20, display: 'flex', flexDirection: 'column' }}>
          <div className="row between" style={{ marginBottom: 12 }}>
            <div className="col gap-3">
              <div className="row gap-8" style={{ alignItems: 'baseline' }}>
                <span className="h-display" style={{ fontSize: 28 }}>{coin.sym}-USD</span>
                <span className="mono ink-0" style={{ fontSize: 16 }}>{coin.price >= 100 ? coin.price.toFixed(2) : coin.price.toFixed(4)}</span>
                <span className={`mono ${coin.chg >= 0 ? 'pos' : 'neg'}`} style={{ fontSize: 13, fontWeight: 500 }}>{(coin.chg >= 0 ? '+' : '') + (coin.chg * 100).toFixed(2)}%</span>
              </div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                hyperliquid perp · {coin.traders} traders active · top: <span style={{ color: 'var(--info)' }}>{coin.topAddr}</span>
              </div>
            </div>
            <div className="seg">
              {['15m', '1H', '4H', '1D'].map((p, i) => <button key={p} className={i === 2 ? 'active' : ''}>{p}</button>)}
            </div>
          </div>
          <div style={{ flex: 1, border: '1px solid var(--line-1)', background: 'var(--bg-1)', position: 'relative', minHeight: 280 }} className="grid-bg">
            <CandleChart w={800} h={260} seed={coin.sym.length * 13 + coin.sym.charCodeAt(0)}/>
            {/* cohort entry line */}
            <div style={{ position: 'absolute', top: '42%', left: 0, right: 0, borderTop: '1px dashed var(--info)', opacity: 0.6 }}>
              <span className="mono" style={{ position: 'absolute', right: 8, top: -18, fontSize: 9, color: 'var(--info)', background: 'var(--bg-0)', padding: '2px 6px', border: '1px solid var(--info)', letterSpacing: '0.06em' }}>
                COHORT AVG ENTRY
              </span>
            </div>
            {/* volume bars footer */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 28, display: 'flex', alignItems: 'flex-end', gap: 1, padding: '0 2px', opacity: 0.4 }}>
              {Array.from({ length: 40 }).map((_, i) => {
                const h = 4 + hashFloat(coin.sym.length * 3 + i * 7.1) * 22;
                const up = hashFloat(coin.sym.length + i) > 0.45;
                return <div key={i} style={{ flex: 1, height: h, background: up ? 'var(--pos)' : 'var(--neg)', opacity: 0.6 }}/>;
              })}
            </div>
          </div>
          <div className="row gap-12" style={{ marginTop: 10, fontSize: 11, color: 'var(--ink-2)' }}>
            <div><span style={{ color: 'var(--ink-3)' }}>24H H </span><span className="mono ink-0">{(coin.price * 1.034).toFixed(2)}</span></div>
            <div><span style={{ color: 'var(--ink-3)' }}>24H L </span><span className="mono ink-0">{(coin.price * 0.962).toFixed(2)}</span></div>
            <div><span style={{ color: 'var(--ink-3)' }}>OI </span><span className="mono ink-0">{fmt.usdCompact(coin.volUsd * 2.8)}</span></div>
            <div><span style={{ color: 'var(--ink-3)' }}>FND 1H </span><span className={`mono ${coin.chg >= 0 ? 'pos' : 'neg'}`}>{(coin.chg * 0.015 * 100).toFixed(4)}%</span></div>
            <div className="grow end row gap-4">
              <button className="btn btn-sm"><Icon name="zap" size={10}/> Pulse check</button>
              <button className="btn btn-sm btn-primary"><Icon name="plus" size={10}/> Log trade</button>
            </div>
          </div>
        </section>

        {/* RIGHT: News & insights */}
        <aside style={{ background: 'var(--bg-0)', padding: 20 }}>
          <SectionHead
            eyebrow="FEED"
            title="News & insights"
            action={<button className="btn btn-sm btn-ghost"><Icon name="filter" size={11}/></button>}
          />
          <div className="col" style={{ gap: 0 }}>
            {NEWS_INSIGHTS.map((n, i) => {
              const tone = n.impact === 'pos' ? 'var(--pos)' : n.impact === 'neg' ? 'var(--neg)' : n.impact === 'warn' ? 'var(--warn)' : 'var(--info)';
              return (
                <div key={i} style={{
                  padding: '12px 0',
                  borderBottom: i < NEWS_INSIGHTS.length - 1 ? '1px solid var(--line-1)' : 'none',
                  cursor: 'pointer',
                }}>
                  <div className="row between gap-6" style={{ marginBottom: 6 }}>
                    <div className="row gap-6">
                      <span className="mono" style={{ fontSize: 9, padding: '2px 6px', color: tone, border: `1px solid ${tone}`, letterSpacing: '0.08em', borderRadius: 1 }}>
                        {n.tag}
                      </span>
                    </div>
                    <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{n.t}</span>
                  </div>
                  <div className="serif" style={{ fontSize: 15, color: 'var(--ink-0)', lineHeight: 1.3, marginBottom: 4 }}>
                    {n.headline}
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-2)', lineHeight: 1.45 }}>{n.body}</div>
                </div>
              );
            })}
          </div>
        </aside>
      </div>

      {/* MAIN GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 1, background: 'var(--line-1)' }}>
        {/* Bot fleet quick view */}
        <section style={{ background: 'var(--bg-0)', padding: 24 }}>
          <SectionHead
            eyebrow="FLEET"
            title="Bot monitoring"
            sub="Live + paper agents across 4 venues"
            action={<button className="btn" onClick={() => nav('bots')}>Open fleet <Icon name="arrowRight" size={12}/></button>}
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {BOTS.slice(0, 9).map(b => (
              <BotQuickCard key={b.id} bot={b} onClick={() => nav('bot:' + b.id)} />
            ))}
          </div>
        </section>

        {/* Activity feed */}
        <aside style={{ background: 'var(--bg-0)', padding: 24, borderLeft: '1px solid var(--line-1)' }}>
          <SectionHead eyebrow="LIVE" title="Signal tape" action={<Pill tone="pos" live>STREAMING</Pill>}/>
          <div className="col" style={{ gap: 0 }}>
            {ACTIVITY.map((a, i) => {
              const toneColor = a.kind === 'pos' ? 'var(--pos)' : a.kind === 'neg' ? 'var(--neg)' : a.kind === 'warn' ? 'var(--warn)' : 'var(--info)';
              return (
                <div key={i} style={{ padding: '10px 0', borderBottom: i < ACTIVITY.length - 1 ? '1px dashed var(--line-1)' : 'none' }}>
                  <div className="row between gap-6" style={{ marginBottom: 3 }}>
                    <span className="mono" style={{ fontSize: 'var(--fs-10)', color: toneColor, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                      {a.bot}
                    </span>
                    <span className="mono" style={{ fontSize: 'var(--fs-10)', color: 'var(--ink-3)' }}>{a.t}</span>
                  </div>
                  <div style={{ fontSize: 'var(--fs-12)', color: 'var(--ink-1)', lineHeight: 1.4 }}>{a.msg}</div>
                </div>
              );
            })}
          </div>
        </aside>
      </div>

      {/* BOTTOM ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 1, background: 'var(--line-1)', borderTop: '1px solid var(--line-1)' }}>
        {/* Recent trades */}
        <section style={{ background: 'var(--bg-0)', padding: 24 }}>
          <SectionHead
            eyebrow="MANUAL JOURNAL"
            title="Recent trades"
            action={
              <div className="row gap-6">
                <button className="btn" onClick={() => nav('journal')}><Icon name="book" size={12}/> Journal</button>
                <button className="btn btn-primary" onClick={() => nav('new')}><Icon name="plus" size={12}/> New entry</button>
              </div>
            }
          />
          <table className="tbl">
            <thead><tr>
              <th>ID</th><th>Date</th><th>Pair</th><th>Setup</th><th>Dir</th>
              <th className="num">R</th><th className="num">P&L</th><th>Status</th>
            </tr></thead>
            <tbody>
              {recentTrades.map(t => (
                <tr key={t.id} onClick={() => nav('trade:' + t.id)}>
                  <td className="mono ink-3">{t.id}</td>
                  <td className="mono">{fmt.date(t.date)}</td>
                  <td className="mono ink-0">{t.pair}</td>
                  <td>{t.setup}</td>
                  <td><span className={t.dir === 'LONG' ? 'pos mono' : 'neg mono'} style={{ fontSize: 11, letterSpacing: '0.06em' }}>{t.dir}</span></td>
                  <td className={`num ${t.rMultiple == null ? 'ink-3' : t.rMultiple >= 0 ? 'pos' : 'neg'}`}>{t.rMultiple != null ? fmt.R(t.rMultiple) : '—'}</td>
                  <td className={`num ${t.pnl == null ? 'ink-3' : t.pnl >= 0 ? 'pos' : 'neg'}`}>{fmt.usdSigned(t.pnl)}</td>
                  <td>
                    {t.status === 'OPEN' ? <Pill tone="warn" live>OPEN</Pill> : t.status === 'WIN' ? <Pill tone="pos">WIN</Pill> : <Pill tone="neg">LOSS</Pill>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Mini calendar */}
        <aside style={{ background: 'var(--bg-0)', padding: 24, borderLeft: '1px solid var(--line-1)' }}>
          <SectionHead eyebrow="THIS WEEK" title="Daily P&L" action={<button className="btn btn-ghost" onClick={() => nav('calendar')}>Full calendar →</button>}/>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginTop: 8 }}>
            {todayCal.map((d, i) => {
              const tone = d.pnl === 0 ? null : d.pnl > 0 ? 'pos' : 'neg';
              const intensity = Math.min(1, Math.abs(d.pnl) / 500);
              const bg = tone === 'pos' ? `rgba(0, 213, 99, ${0.1 + intensity * 0.4})` :
                          tone === 'neg' ? `rgba(255, 59, 75, ${0.1 + intensity * 0.4})` :
                          'var(--bg-2)';
              return (
                <div key={i} style={{ background: bg, border: '1px solid var(--line-1)', borderRadius: 2, padding: 10, aspectRatio: '1 / 1.1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {d.date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div>
                    <div className="mono" style={{ fontSize: 20, fontWeight: 500, color: 'var(--ink-0)' }}>{d.date.getDate()}</div>
                    <div className={`mono ${tone || 'ink-3'}`} style={{ fontSize: 10 }}>
                      {d.trades === 0 ? 'no trades' : fmt.usdSigned(d.pnl, 0)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="hr" style={{ margin: '20px 0' }}/>
          <div className="col gap-6">
            <div className="label">WEEK BREAKDOWN</div>
            <div className="row between">
              <span style={{ color: 'var(--ink-2)' }}>Total P&L</span>
              <span className={`mono ${todayCal.reduce((a,b)=>a+b.pnl,0) >= 0 ? 'pos' : 'neg'}`} style={{ fontSize: 14 }}>
                {fmt.usdSigned(todayCal.reduce((a,b)=>a+b.pnl,0))}
              </span>
            </div>
            <div className="row between">
              <span style={{ color: 'var(--ink-2)' }}>Trades</span>
              <span className="mono ink-0">{todayCal.reduce((a,b)=>a+b.trades,0)}</span>
            </div>
            <div className="row between">
              <span style={{ color: 'var(--ink-2)' }}>Green days</span>
              <span className="mono ink-0">{todayCal.filter(d => d.pnl > 0).length}/{todayCal.length}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function BotQuickCard({ bot, onClick }) {
  const { fmt } = window;
  const isMonitor = bot.pnl24h == null;
  return (
    <div onClick={onClick} style={{
      background: 'var(--bg-1)',
      border: '1px solid var(--line-1)',
      borderRadius: 'var(--r-2)',
      padding: 14,
      cursor: 'pointer',
      transition: 'all 120ms',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--line-3)'; e.currentTarget.style.background = 'var(--bg-2)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line-1)'; e.currentTarget.style.background = 'var(--bg-1)'; }}
    >
      <div className="row between gap-6">
        <div className="row gap-6">
          <StatusDot status={bot.status} />
          <div>
            <div className="mono ink-0" style={{ fontSize: 13, fontWeight: 500, letterSpacing: '-0.01em' }}>{bot.name}</div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>{bot.platform}</div>
          </div>
        </div>
        <Pill tone={bot.mode === 'live' ? 'pos' : bot.mode === 'paper' ? 'info' : 'warn'}>{bot.mode}</Pill>
      </div>

      <div style={{ fontSize: 11, color: 'var(--ink-2)', lineHeight: 1.4, minHeight: 28 }}>{bot.strategy}</div>

      <div className="row between" style={{ alignItems: 'flex-end' }}>
        {isMonitor ? (
          <div>
            <div className="label-sm label">SIGNALS 24H</div>
            <div className="mono ink-0" style={{ fontSize: 18 }}>{bot.trades24h}</div>
          </div>
        ) : (
          <div>
            <div className="label-sm label">24H</div>
            <div className={`mono ${bot.pnl24h >= 0 ? 'pos' : 'neg'}`} style={{ fontSize: 16, fontWeight: 500 }}>
              {fmt.usdSigned(bot.pnl24h)}
            </div>
          </div>
        )}
        <div style={{ width: 80, height: 28 }}>
          {bot.equityCurve ? <Sparkline data={bot.equityCurve} w={80} h={28} /> : <div style={{ fontSize: 10, color: 'var(--ink-3)', fontFamily: 'var(--ff-mono)', textAlign: 'right' }}>{bot.lastSignal}</div>}
        </div>
      </div>
    </div>
  );
}

window.ScreenOverview = ScreenOverview;
window.BotQuickCard = BotQuickCard;
