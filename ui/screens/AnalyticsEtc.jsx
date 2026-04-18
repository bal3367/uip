// ============================================
// SCREENS: ANALYTICS, CALENDAR, SETTINGS
// ============================================

function ScreenAnalytics() {
  const { TRADES, PORTFOLIO, SETUPS, PAIRS, fmt } = window;
  const closed = TRADES.filter(t => t.status !== 'OPEN');

  // by setup
  const bySetup = SETUPS.map(s => {
    const trs = closed.filter(t => t.setup === s);
    const wins = trs.filter(t => t.pnl > 0).length;
    const total = trs.length;
    const pnl = trs.reduce((a, t) => a + t.pnl, 0);
    const avgR = total ? trs.reduce((a, t) => a + t.rMultiple, 0) / total : 0;
    return { name: s, total, wins, wr: total ? wins / total : 0, pnl, avgR };
  }).filter(s => s.total > 0).sort((a, b) => b.pnl - a.pnl);

  const byPair = PAIRS.map(p => {
    const trs = closed.filter(t => t.pair === p);
    const pnl = trs.reduce((a, t) => a + t.pnl, 0);
    return { name: p, total: trs.length, pnl };
  }).filter(p => p.total > 0).sort((a, b) => b.pnl - a.pnl);

  const maxPairPnl = Math.max(...byPair.map(p => Math.abs(p.pnl)));

  // by hour of day
  const byHour = Array.from({ length: 24 }, (_, h) => {
    const trs = closed.filter(t => t.date.getHours() === h);
    return { h, pnl: trs.reduce((a, t) => a + t.pnl, 0), count: trs.length };
  });
  const maxHourPnl = Math.max(...byHour.map(b => Math.abs(b.pnl)), 1);

  return (
    <div className="screen">
      <div style={{ padding: 24, borderBottom: '1px solid var(--line-1)' }}>
        <div className="row between" style={{ alignItems: 'flex-end' }}>
          <div className="col gap-4">
            <div className="label">PERFORMANCE ANALYTICS</div>
            <div className="h-display" style={{ fontSize: 40 }}>Edge, <em>dissected</em></div>
          </div>
          <div className="seg">
            {['7D', '30D', '90D', 'YTD', 'ALL'].map((p, i) => <button key={p} className={i === 2 ? 'active' : ''}>{p}</button>)}
          </div>
        </div>
      </div>

      {/* Top KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {[
          { l: 'NET P&L', v: fmt.usdSigned(closed.reduce((a,t)=>a+t.pnl,0)), tone: 'pos' },
          { l: 'EXPECTANCY / TRADE', v: fmt.usd(closed.reduce((a,t)=>a+t.pnl,0)/closed.length), tone: 'pos' },
          { l: 'PROFIT FACTOR', v: (closed.filter(t=>t.pnl>0).reduce((a,t)=>a+t.pnl,0) / Math.abs(closed.filter(t=>t.pnl<0).reduce((a,t)=>a+t.pnl,0) || 1)).toFixed(2) },
          { l: 'AVG WIN / AVG LOSS', v: (closed.filter(t=>t.pnl>0).reduce((a,t)=>a+t.pnl,0)/closed.filter(t=>t.pnl>0).length / (Math.abs(closed.filter(t=>t.pnl<0).reduce((a,t)=>a+t.pnl,0))/closed.filter(t=>t.pnl<0).length)).toFixed(2) + 'x' },
        ].map((k, i) => (
          <div key={i} style={{ padding: '20px 24px', borderRight: i < 3 ? '1px solid var(--line-1)' : 'none', borderBottom: '1px solid var(--line-1)' }}>
            <div className="label">{k.l}</div>
            <div className="mono" style={{ fontSize: 28, color: k.tone === 'pos' ? 'var(--pos)' : 'var(--ink-0)', marginTop: 6 }}>{k.v}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 1, background: 'var(--line-1)' }}>
        <section style={{ background: 'var(--bg-0)', padding: 24 }}>
          <SectionHead eyebrow="EQUITY CURVE" title="Account growth"/>
          <div style={{ height: 280 }}><EquityCurve data={PORTFOLIO.equityCurve} height={280}/></div>

          <div style={{ marginTop: 32 }}>
            <SectionHead eyebrow="BY SETUP" title="Which strategies are paying"/>
            <table className="tbl">
              <thead><tr>
                <th>Setup</th>
                <th className="num">Trades</th>
                <th className="num">Win %</th>
                <th className="num">Avg R</th>
                <th className="num">P&L</th>
                <th style={{ width: '25%' }}>Distribution</th>
              </tr></thead>
              <tbody>
                {bySetup.map(s => (
                  <tr key={s.name}>
                    <td style={{ color: 'var(--ink-0)', fontWeight: 500 }}>{s.name}</td>
                    <td className="num">{s.total}</td>
                    <td className="num">{fmt.pctSimple(s.wr)}</td>
                    <td className={`num ${s.avgR >= 0 ? 'pos' : 'neg'}`}>{fmt.R(s.avgR)}</td>
                    <td className={`num ${s.pnl >= 0 ? 'pos' : 'neg'}`} style={{ fontWeight: 500 }}>{fmt.usdSigned(s.pnl)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 1, height: 6, background: 'var(--bg-3)', borderRadius: 1 }}>
                        <div style={{ background: 'var(--pos)', width: `${s.wr * 100}%` }}/>
                        <div style={{ background: 'var(--neg)', width: `${(1 - s.wr) * 100}%` }}/>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 32 }}>
            <SectionHead eyebrow="BY HOUR OF DAY" title="When I trade well"/>
            <div style={{ display: 'flex', alignItems: 'flex-end', height: 140, gap: 2, paddingTop: 20, borderBottom: '1px solid var(--line-1)' }}>
              {byHour.map(b => {
                const h = Math.abs(b.pnl) / maxHourPnl * 100;
                return (
                  <div key={b.h} style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', position: 'relative' }}>
                    <div style={{ width: '100%', height: h + '%', background: b.pnl >= 0 ? 'var(--pos)' : 'var(--neg)', opacity: 0.85, borderRadius: '1px 1px 0 0' }} title={`${b.h}h · ${fmt.usdSigned(b.pnl)}`}/>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 2, marginTop: 4 }}>
              {byHour.map(b => <div key={b.h} className="mono" style={{ flex: 1, textAlign: 'center', fontSize: 9, color: 'var(--ink-3)' }}>{b.h.toString().padStart(2,'0')}</div>)}
            </div>
          </div>
        </section>

        <aside style={{ background: 'var(--bg-0)', padding: 24 }}>
          <SectionHead eyebrow="BY PAIR" title="Top instruments"/>
          <div className="col gap-10">
            {byPair.slice(0, 8).map(p => (
              <div key={p.name} className="col gap-3">
                <div className="row between">
                  <span className="mono ink-0" style={{ fontSize: 12 }}>{p.name}</span>
                  <div className="row gap-8">
                    <span className="mono" style={{ color: 'var(--ink-3)', fontSize: 10 }}>{p.total} trades</span>
                    <span className={`mono ${p.pnl >= 0 ? 'pos' : 'neg'}`} style={{ fontSize: 12, minWidth: 70, textAlign: 'right' }}>{fmt.usdSigned(p.pnl)}</span>
                  </div>
                </div>
                <div style={{ height: 3, background: 'var(--bg-3)', borderRadius: 1, overflow: 'hidden', position: 'relative' }}>
                  <div style={{ height: '100%', width: Math.abs(p.pnl) / maxPairPnl * 100 + '%', background: p.pnl >= 0 ? 'var(--pos)' : 'var(--neg)' }}/>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 28 }}>
            <SectionHead eyebrow="EMOTION VS P&L" title={null}/>
            <table className="tbl">
              <tbody>
                {window.EMOTIONS.map(em => {
                  const trs = closed.filter(t => t.emotion === em);
                  const pnl = trs.reduce((a,t)=>a+t.pnl, 0);
                  return trs.length > 0 && (
                    <tr key={em}>
                      <td style={{ color: 'var(--ink-1)' }}>{em}</td>
                      <td className="num" style={{ color: 'var(--ink-3)' }}>{trs.length}</td>
                      <td className={`num ${pnl >= 0 ? 'pos' : 'neg'}`}>{fmt.usdSigned(pnl)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 28 }}>
            <SectionHead eyebrow="HEATMAP" title="Setup × Emotion"/>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2, fontSize: 9, fontFamily: 'var(--ff-mono)' }}>
              {SETUPS.slice(0, 5).flatMap(s =>
                window.EMOTIONS.slice(0, 5).map(em => {
                  const trs = closed.filter(t => t.setup === s && t.emotion === em);
                  const pnl = trs.reduce((a,t)=>a+t.pnl, 0);
                  const intensity = Math.min(1, Math.abs(pnl) / 500);
                  const bg = trs.length === 0 ? 'var(--bg-2)' : pnl >= 0 ? `rgba(0, 213, 99, ${0.15 + intensity * 0.55})` : `rgba(255, 59, 75, ${0.15 + intensity * 0.55})`;
                  return <div key={s+em} style={{ background: bg, aspectRatio: 1, border: '1px solid var(--line-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: trs.length === 0 ? 'var(--ink-4)' : 'var(--ink-0)' }}>{trs.length || '·'}</div>;
                })
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ---------- Calendar ----------
function ScreenCalendar() {
  const { CALENDAR, fmt } = window;
  // build month grid with empty cells
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dataByDate = {};
  CALENDAR.forEach(d => { dataByDate[d.date.toDateString()] = d; });

  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    cells.push({ date, data: dataByDate[date.toDateString()] });
  }

  const weeksPnl = [];
  for (let w = 0; w < cells.length; w += 7) {
    const week = cells.slice(w, w + 7);
    const pnl = week.reduce((a, c) => a + (c?.data?.pnl || 0), 0);
    const trades = week.reduce((a, c) => a + (c?.data?.trades || 0), 0);
    weeksPnl.push({ pnl, trades });
  }

  const monthPnl = CALENDAR.reduce((a, d) => a + d.pnl, 0);
  const monthTrades = CALENDAR.reduce((a, d) => a + d.trades, 0);
  const greenDays = CALENDAR.filter(d => d.pnl > 0).length;
  const redDays = CALENDAR.filter(d => d.pnl < 0).length;

  return (
    <div className="screen">
      <div style={{ padding: 24, borderBottom: '1px solid var(--line-1)' }}>
        <div className="row between" style={{ alignItems: 'flex-end' }}>
          <div className="col gap-4">
            <div className="label">P&L CALENDAR</div>
            <div className="h-display" style={{ fontSize: 40 }}>{today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
          </div>
          <div className="row gap-6">
            <button className="btn btn-icon"><Icon name="arrowLeft" size={12}/></button>
            <button className="btn">Today</button>
            <button className="btn btn-icon"><Icon name="arrowRight" size={12}/></button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: '1px solid var(--line-1)' }}>
        {[
          { l: 'MONTH P&L', v: fmt.usdSigned(monthPnl), tone: monthPnl >= 0 ? 'pos' : 'neg' },
          { l: 'TRADES', v: monthTrades },
          { l: 'GREEN DAYS', v: `${greenDays}/${CALENDAR.filter(d => d.trades > 0).length}`, tone: 'pos' },
          { l: 'RED DAYS', v: redDays, tone: 'neg' },
        ].map((k, i) => (
          <div key={i} style={{ padding: '16px 24px', borderRight: i < 3 ? '1px solid var(--line-1)' : 'none' }}>
            <div className="label">{k.l}</div>
            <div className="mono" style={{ fontSize: 24, color: k.tone === 'pos' ? 'var(--pos)' : k.tone === 'neg' ? 'var(--neg)' : 'var(--ink-0)', marginTop: 4 }}>{k.v}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', padding: 24, gap: 0 }}>
        <div>
          {/* Day labels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--line-1)', paddingBottom: 8, marginBottom: 8 }}>
            {['SUN','MON','TUE','WED','THU','FRI','SAT'].map(d => (
              <div key={d} className="label" style={{ textAlign: 'left', paddingLeft: 8 }}>{d}</div>
            ))}
          </div>

          {/* Month grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, background: 'var(--line-1)', border: '1px solid var(--line-1)' }}>
            {cells.map((c, i) => {
              if (!c) return <div key={i} style={{ background: 'var(--bg-2)', minHeight: 96, opacity: 0.4 }}/>;
              const d = c.data;
              const tone = !d || d.trades === 0 ? null : d.pnl > 0 ? 'pos' : d.pnl < 0 ? 'neg' : null;
              const intensity = d ? Math.min(1, Math.abs(d.pnl) / 500) : 0;
              const bg = tone === 'pos' ? `rgba(0, 213, 99, ${0.08 + intensity * 0.4})` :
                          tone === 'neg' ? `rgba(255, 59, 75, ${0.08 + intensity * 0.4})` :
                          'var(--bg-1)';
              const isToday = c.date.toDateString() === today.toDateString();
              return (
                <div key={i} style={{ background: bg, minHeight: 96, padding: 10, cursor: d && d.trades ? 'pointer' : 'default', position: 'relative' }}>
                  <div className="row between" style={{ marginBottom: 8 }}>
                    <span className="mono" style={{ fontSize: 13, fontWeight: isToday ? 600 : 400, color: isToday ? 'var(--accent)' : 'var(--ink-1)' }}>{c.date.getDate()}</span>
                    {isToday && <span className="mono" style={{ fontSize: 9, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>today</span>}
                  </div>
                  {d && d.trades > 0 && (
                    <div className="col gap-2">
                      <div className={`mono ${tone}`} style={{ fontSize: 15, fontWeight: 500 }}>{fmt.usdSigned(d.pnl, 0)}</div>
                      <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{d.trades} trade{d.trades > 1 ? 's' : ''}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Week totals column */}
        <div style={{ paddingLeft: 12 }}>
          <div className="label" style={{ paddingBottom: 8, borderBottom: '1px solid var(--line-1)', marginBottom: 9 }}>WEEK</div>
          <div className="col" style={{ gap: 1 }}>
            {weeksPnl.map((w, i) => (
              <div key={i} style={{ minHeight: 96, padding: '10px 12px', background: 'var(--bg-1)', border: '1px solid var(--line-1)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div className="label label-sm">W{i+1}</div>
                <div className={`mono ${w.pnl >= 0 ? 'pos' : w.pnl < 0 ? 'neg' : 'ink-3'}`} style={{ fontSize: 15, marginTop: 2 }}>{fmt.usdSigned(w.pnl, 0)}</div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', textTransform: 'uppercase', marginTop: 2 }}>{w.trades} trd</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Settings ----------
function ScreenSettings({ theme, setTheme, density, setDensity }) {
  const { BOTS } = window;
  return (
    <div className="screen">
      <div style={{ padding: 24, borderBottom: '1px solid var(--line-1)' }}>
        <div className="label">CONFIGURATION</div>
        <div className="h-display" style={{ fontSize: 40 }}>Settings</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 1, background: 'var(--line-1)', minHeight: 400 }}>
        <aside style={{ background: 'var(--bg-0)', padding: '16px 0' }}>
          {['Appearance', 'Bots', 'Telegram', 'Data & Backup', 'Risk rules', 'Keyboard', 'Account'].map((x, i) => (
            <div key={x} className="mono" style={{ padding: '10px 24px', fontSize: 12, color: i === 0 ? 'var(--ink-0)' : 'var(--ink-2)', borderLeft: i === 0 ? '2px solid var(--accent)' : '2px solid transparent', cursor: 'pointer', background: i === 0 ? 'var(--bg-1)' : 'transparent' }}>
              {x}
            </div>
          ))}
        </aside>

        <section style={{ background: 'var(--bg-0)', padding: 32 }}>
          <SectionHead eyebrow="APPEARANCE" title="Theme & density" sub="Changes apply immediately."/>

          <div className="col gap-16" style={{ maxWidth: 640 }}>
            <div>
              <div className="label">COLOR MODE</div>
              <div className="row gap-6" style={{ marginTop: 8 }}>
                <button className={`btn btn-lg ${theme === 'dark' ? 'btn-primary' : ''}`} onClick={() => setTheme('dark')}><Icon name="moon" size={14}/> Dark</button>
                <button className={`btn btn-lg ${theme === 'light' ? 'btn-primary' : ''}`} onClick={() => setTheme('light')}><Icon name="sun" size={14}/> Light</button>
              </div>
            </div>

            <div>
              <div className="label">DENSITY</div>
              <div className="seg" style={{ marginTop: 8 }}>
                {['compact', 'default', 'comfortable'].map(d => (
                  <button key={d} className={density === d ? 'active' : ''} onClick={() => setDensity(d)}>{d}</button>
                ))}
              </div>
            </div>

            <div className="hr"/>

            <SectionHead eyebrow="BOTS" title="Registered agents"/>
            <table className="tbl">
              <thead><tr><th>Bot</th><th>Platform</th><th>Mode</th><th>VPS screen</th><th></th></tr></thead>
              <tbody>
                {BOTS.slice(0, 6).map(b => (
                  <tr key={b.id}>
                    <td><div className="row gap-6"><StatusDot status={b.status}/><span className="mono ink-0">{b.name}</span></div></td>
                    <td className="mono">{b.platform}</td>
                    <td><Pill tone={b.mode === 'live' ? 'pos' : 'info'}>{b.mode}</Pill></td>
                    <td className="mono" style={{ color: 'var(--ink-3)' }}>screen -r {b.id}</td>
                    <td><button className="btn btn-sm btn-ghost"><Icon name="more" size={12}/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

window.ScreenAnalytics = ScreenAnalytics;
window.ScreenCalendar = ScreenCalendar;
window.ScreenSettings = ScreenSettings;
