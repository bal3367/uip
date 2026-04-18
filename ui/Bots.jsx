// ============================================
// SCREEN: BOTS FLEET + BOT DETAIL
// ============================================

function ScreenBots({ nav, botCardVariant = 'detailed' }) {
  const { BOTS, fmt } = window;
  const [filter, setFilter] = useState('ALL');
  const [view, setView] = useState('grid');

  const platforms = ['ALL', ...Array.from(new Set(BOTS.map(b => b.platform)))];
  const filtered = filter === 'ALL' ? BOTS : BOTS.filter(b => b.platform === filter);

  return (
    <div className="screen">
      <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid var(--line-1)' }}>
        <div className="row between" style={{ alignItems: 'flex-end' }}>
          <div className="col gap-4">
            <div className="label">FLEET MONITORING</div>
            <div className="h-display" style={{ fontSize: 'var(--fs-48)' }}><em>11</em> agents · 4 venues</div>
          </div>
          <div className="row gap-6">
            <div className="seg">
              <button className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')}><Icon name="grid" size={12}/></button>
              <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}><Icon name="list" size={12}/></button>
            </div>
            <button className="btn"><Icon name="plus" size={12}/> Add bot</button>
          </div>
        </div>
        <div className="row gap-4" style={{ marginTop: 16 }}>
          {platforms.map(p => (
            <button key={p} className={`btn btn-sm ${filter === p ? 'btn-primary' : ''}`} onClick={() => setFilter(p)}>{p}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: 24 }}>
        {view === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
            {filtered.map(b => <BotDetailedCard key={b.id} bot={b} onClick={() => nav('bot:' + b.id)} variant={botCardVariant}/>)}
          </div>
        ) : (
          <div className="panel" style={{ padding: 0 }}>
            <table className="tbl">
              <thead><tr>
                <th style={{ width: 40 }}></th>
                <th>Bot</th>
                <th>Platform</th>
                <th>Strategy</th>
                <th>Mode</th>
                <th className="num">Equity</th>
                <th className="num">24H</th>
                <th className="num">7D</th>
                <th className="num">All-time</th>
                <th className="num">Win</th>
                <th className="num">Sharpe</th>
                <th>Last</th>
              </tr></thead>
              <tbody>
                {filtered.map(b => (
                  <tr key={b.id} onClick={() => nav('bot:' + b.id)}>
                    <td><StatusDot status={b.status}/></td>
                    <td className="mono ink-0" style={{ fontWeight: 500 }}>{b.name}</td>
                    <td className="mono" style={{ color: 'var(--ink-2)' }}>{b.platform}</td>
                    <td style={{ color: 'var(--ink-1)', fontSize: 12 }}>{b.strategy}</td>
                    <td><Pill tone={b.mode === 'live' ? 'pos' : b.mode === 'paper' ? 'info' : 'warn'}>{b.mode}</Pill></td>
                    <td className="num ink-0">{fmt.usdCompact(b.equity)}</td>
                    <td className={`num ${b.pnl24h == null ? 'ink-3' : b.pnl24h >= 0 ? 'pos' : 'neg'}`}>{fmt.usdSigned(b.pnl24h)}</td>
                    <td className={`num ${b.pnl7d == null ? 'ink-3' : b.pnl7d >= 0 ? 'pos' : 'neg'}`}>{fmt.usdSigned(b.pnl7d)}</td>
                    <td className={`num ${b.pnlAll == null ? 'ink-3' : b.pnlAll >= 0 ? 'pos' : 'neg'}`}>{fmt.usdSigned(b.pnlAll)}</td>
                    <td className="num">{b.winRate != null ? fmt.pctSimple(b.winRate) : '—'}</td>
                    <td className="num">{b.sharpe != null ? b.sharpe.toFixed(2) : '—'}</td>
                    <td className="mono" style={{ color: 'var(--ink-3)', fontSize: 11 }}>{b.lastSignal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function BotDetailedCard({ bot, onClick, variant = 'detailed' }) {
  const { fmt } = window;
  const hasEquity = bot.equity != null;

  if (variant === 'minimal') {
    return (
      <div onClick={onClick} className="bot-card-min" style={{
        background: 'var(--bg-1)', border: '1px solid var(--line-1)', borderRadius: 4,
        padding: 16, cursor: 'pointer', display: 'grid', gridTemplateColumns: '1fr auto', gap: 12,
      }}>
        <div className="col gap-3">
          <div className="row gap-6"><StatusDot status={bot.status}/><span className="mono ink-0" style={{ fontWeight: 500 }}>{bot.name}</span></div>
          <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{bot.platform}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className={`mono ${bot.pnl24h >= 0 ? 'pos' : 'neg'}`} style={{ fontSize: 15 }}>{hasEquity ? fmt.usdSigned(bot.pnl24h) : bot.trades24h + ' sig'}</div>
          <div style={{ width: 60, height: 16, marginLeft: 'auto', marginTop: 4 }}>{bot.equityCurve && <Sparkline data={bot.equityCurve} w={60} h={16} fill={false}/>}</div>
        </div>
      </div>
    );
  }

  if (variant === 'terminal') {
    return (
      <div onClick={onClick} style={{
        background: 'var(--bg-1)', border: '1px solid var(--line-2)', borderRadius: 0,
        padding: 0, cursor: 'pointer', fontFamily: 'var(--ff-mono)', fontSize: 11,
      }}>
        <div style={{ padding: '6px 10px', borderBottom: '1px solid var(--line-1)', background: 'var(--bg-2)', display: 'flex', justifyContent: 'space-between' }}>
          <span className="row gap-4"><StatusDot status={bot.status}/>{bot.name.toUpperCase()}</span>
          <span style={{ color: 'var(--ink-3)' }}>[{bot.platform}]</span>
        </div>
        <div style={{ padding: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, fontSize: 10 }}>
          <div><span style={{ color: 'var(--ink-3)' }}>EQ&nbsp;</span><span className="ink-0">{fmt.usdCompact(bot.equity)}</span></div>
          <div><span style={{ color: 'var(--ink-3)' }}>PNL&nbsp;</span><span className={bot.pnlAll >= 0 ? 'pos' : 'neg'}>{fmt.pct((bot.pnlAll||0)/(bot.startEquity||1))}</span></div>
          <div><span style={{ color: 'var(--ink-3)' }}>WR&nbsp;</span><span className="ink-0">{bot.winRate != null ? fmt.pctSimple(bot.winRate) : '—'}</span></div>
          <div><span style={{ color: 'var(--ink-3)' }}>SR&nbsp;</span><span className="ink-0">{bot.sharpe != null ? bot.sharpe.toFixed(2) : '—'}</span></div>
        </div>
        <div style={{ height: 40, padding: '0 10px 8px' }}>
          {bot.equityCurve && <Sparkline data={bot.equityCurve} w={280} h={32} />}
        </div>
      </div>
    );
  }

  // default: detailed
  return (
    <div onClick={onClick} style={{
      background: 'var(--bg-1)',
      border: '1px solid var(--line-1)',
      borderRadius: 'var(--r-2)',
      padding: 16,
      cursor: 'pointer',
      transition: 'all 120ms',
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      minHeight: 220,
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--line-3)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line-1)'; }}
    >
      {/* Header */}
      <div className="row between" style={{ alignItems: 'flex-start' }}>
        <div className="row gap-10" style={{ alignItems: 'flex-start' }}>
          <BotAvatar bot={bot} size={44}/>
          <div className="col gap-3">
            <div className="row gap-6">
              <StatusDot status={bot.status}/>
              <span className="display-cond" style={{ fontSize: 16, letterSpacing: '0.04em', color: 'var(--ink-0)' }}>{bot.name.toUpperCase()}</span>
            </div>
            <div className="row gap-4" style={{ alignItems: 'baseline' }}>
              <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{bot.platform}</span>
              <span className="jp" style={{ fontSize: 9, color: 'var(--magenta)', letterSpacing: '0.06em' }}>ユニット</span>
              <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.04em' }}>·</span>
              <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.04em' }}>{bot.id}</span>
            </div>
          </div>
        </div>
        <div className="row gap-4">
          <Pill tone={bot.mode === 'live' ? 'pos' : bot.mode === 'paper' ? 'info' : 'warn'}>{bot.mode}</Pill>
        </div>
      </div>

      <div style={{ fontSize: 11.5, color: 'var(--ink-2)', lineHeight: 1.45, minHeight: 32 }}>{bot.description}</div>

      {/* Sparkline */}
      {bot.equityCurve ? (
        <div style={{ height: 44 }}><Sparkline data={bot.equityCurve} w={320} h={44} /></div>
      ) : (
        <div style={{ height: 44, border: '1px dashed var(--line-2)', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-3)', fontSize: 10, fontFamily: 'var(--ff-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          SIGNAL-ONLY · NO BOOK
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, paddingTop: 10, borderTop: '1px solid var(--line-1)' }}>
        {hasEquity ? (
          <>
            <div><div className="label label-sm">24H</div><div className={`mono ${bot.pnl24h >= 0 ? 'pos' : 'neg'}`} style={{ fontSize: 13, marginTop: 2 }}>{fmt.usdSigned(bot.pnl24h)}</div></div>
            <div><div className="label label-sm">WIN</div><div className="mono ink-0" style={{ fontSize: 13, marginTop: 2 }}>{fmt.pctSimple(bot.winRate)}</div></div>
            <div><div className="label label-sm">SHARPE</div><div className="mono ink-0" style={{ fontSize: 13, marginTop: 2 }}>{bot.sharpe.toFixed(2)}</div></div>
          </>
        ) : (
          <>
            <div><div className="label label-sm">SIGNALS</div><div className="mono ink-0" style={{ fontSize: 13, marginTop: 2 }}>{bot.trades24h}</div></div>
            <div><div className="label label-sm">LAST</div><div className="mono ink-0" style={{ fontSize: 11, marginTop: 2 }}>{bot.lastSignal}</div></div>
            <div><div className="label label-sm">CH</div><div className="mono" style={{ fontSize: 11, marginTop: 2, color: 'var(--info)' }}>{bot.tgBot || '—'}</div></div>
          </>
        )}
      </div>
    </div>
  );
}

// ---------- BOT DETAIL ----------
function ScreenBotDetail({ botId, nav }) {
  const { BOTS, TRADES, fmt, hashFloat } = window;
  const bot = BOTS.find(b => b.id === botId);
  if (!bot) return <div style={{ padding: 40 }}>Bot not found.</div>;

  const hasEquity = bot.equity != null;
  const tradesLen = 30;
  // Simulate bot-specific trade history
  const botTrades = Array.from({ length: tradesLen }, (_, i) => {
    const h = (k) => hashFloat(botId.length * 7 + i * 13 + k);
    const win = h(1) > (1 - (bot.winRate || 0.5));
    const r = win ? 0.5 + h(2) * 3 : -(0.5 + h(3) * 1.2);
    const size = (bot.startEquity || 1000) * (0.02 + h(4) * 0.08);
    const pnl = size * r * 0.01;
    return { pnl, r, win, ts: new Date(Date.now() - i * 3.6e6 * (1 + h(5) * 8)) };
  });

  return (
    <div className="screen">
      {/* Header */}
      <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid var(--line-1)' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => nav('bots')} style={{ marginBottom: 14 }}>
          <Icon name="arrowLeft" size={12}/> All bots
        </button>
        <div className="row between">
          <div className="col gap-6">
            <div className="row gap-8">
              <StatusDot status={bot.status}/>
              <div className="h-display" style={{ fontSize: 40 }}>{bot.name}</div>
              <Pill tone={bot.mode === 'live' ? 'pos' : bot.mode === 'paper' ? 'info' : 'warn'} live={bot.status !== 'off'}>{bot.mode}</Pill>
            </div>
            <div className="row gap-12" style={{ color: 'var(--ink-2)' }}>
              <span className="mono" style={{ fontSize: 12 }}>{bot.platform} · {bot.strategy}</span>
              {bot.tgBot && <span className="row gap-3" style={{ color: 'var(--info)' }}><Icon name="telegram" size={12}/> {bot.tgBot}</span>}
            </div>
          </div>
          <div className="row gap-6">
            <button className="btn"><Icon name="pause" size={12}/> Pause</button>
            <button className="btn"><Icon name="settings" size={12}/> Config</button>
            <button className="btn btn-primary"><Icon name="activity" size={12}/> Open logs</button>
          </div>
        </div>
      </div>

      {/* Stat strip */}
      <div style={{ display: 'grid', gridTemplateColumns: hasEquity ? 'repeat(6, 1fr)' : 'repeat(4, 1fr)', borderBottom: '1px solid var(--line-1)' }}>
        {hasEquity ? [
          { label: 'EQUITY', value: fmt.usd(bot.equity) },
          { label: 'ALL-TIME', value: fmt.usdSigned(bot.pnlAll), tone: bot.pnlAll >= 0 ? 'pos' : 'neg' },
          { label: '7D', value: fmt.usdSigned(bot.pnl7d), tone: bot.pnl7d >= 0 ? 'pos' : 'neg' },
          { label: 'WIN RATE', value: fmt.pctSimple(bot.winRate) },
          { label: 'SHARPE', value: bot.sharpe.toFixed(2) },
          { label: 'MAX DD', value: fmt.pct(bot.drawdown), tone: 'neg' },
        ].map((k, i) => (
          <div key={i} style={{ padding: '16px 20px', borderRight: i < 5 ? '1px solid var(--line-1)' : 'none' }}>
            <div className="label">{k.label}</div>
            <div className="mono" style={{ fontSize: 22, color: k.tone === 'pos' ? 'var(--pos)' : k.tone === 'neg' ? 'var(--neg)' : 'var(--ink-0)', marginTop: 4 }}>{k.value}</div>
          </div>
        )) : [
          { label: 'SIGNALS 24H', value: bot.trades24h },
          { label: 'LAST FIRED', value: bot.lastSignal },
          { label: 'CHANNEL', value: bot.tgBot || '—' },
          { label: 'STATUS', value: bot.status.toUpperCase(), tone: 'pos' },
        ].map((k, i) => (
          <div key={i} style={{ padding: '16px 20px', borderRight: i < 3 ? '1px solid var(--line-1)' : 'none' }}>
            <div className="label">{k.label}</div>
            <div className="mono" style={{ fontSize: 18, color: k.tone === 'pos' ? 'var(--pos)' : 'var(--ink-0)', marginTop: 4 }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Main */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 1, background: 'var(--line-1)' }}>
        <section style={{ background: 'var(--bg-0)', padding: 24 }}>
          <SectionHead eyebrow="EQUITY CURVE" title="Performance over time" action={
            <div className="seg">
              {['24H', '7D', '30D', 'ALL'].map((p, i) => <button key={p} className={i === 2 ? 'active' : ''}>{p}</button>)}
            </div>
          }/>
          {bot.equityCurve ? (
            <div style={{ height: 260 }}><EquityCurve data={bot.equityCurve} height={260}/></div>
          ) : (
            <div style={{ height: 260, border: '1px dashed var(--line-2)', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
              <div className="label">SIGNAL-ONLY · NO TRADING BOOK</div>
              <div style={{ color: 'var(--ink-3)', fontSize: 12 }}>This bot emits alerts. No equity to chart.</div>
            </div>
          )}

          <SectionHead eyebrow="RECENT TRADES" title={null} sub={null}/>
          <table className="tbl">
            <thead><tr>
              <th>Time</th><th>Outcome</th><th className="num">R</th><th className="num">P&L</th><th>Notes</th>
            </tr></thead>
            <tbody>
              {botTrades.slice(0, 10).map((t, i) => (
                <tr key={i}>
                  <td className="mono" style={{ color: 'var(--ink-2)' }}>{fmt.dateTime(t.ts)}</td>
                  <td><Pill tone={t.win ? 'pos' : 'neg'}>{t.win ? 'WIN' : 'LOSS'}</Pill></td>
                  <td className={`num ${t.r >= 0 ? 'pos' : 'neg'}`}>{fmt.R(t.r)}</td>
                  <td className={`num ${t.pnl >= 0 ? 'pos' : 'neg'}`}>{fmt.usdSigned(t.pnl)}</td>
                  <td style={{ color: 'var(--ink-3)', fontSize: 11 }}>auto-logged · {bot.platform}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <aside style={{ background: 'var(--bg-0)', padding: 24 }}>
          <SectionHead eyebrow="CONFIG" title="Parameters"/>
          <div className="col gap-0" style={{ fontFamily: 'var(--ff-mono)', fontSize: 11 }}>
            {[
              ['engine', bot.id],
              ['timeframe', bot.strategy.includes('4h') ? '4h' : bot.strategy.includes('15m') ? '15m' : '—'],
              ['venue', bot.platform],
              ['mode', bot.mode],
              ['tg_bot', bot.tgBot || 'none'],
              ['chat_id', '5051864490'],
              ['backup', 'upstash_redis'],
              ['vps_screen', `screen -r ${bot.id}`],
              ['env', `${bot.id}/.env`],
            ].map(([k, v], i) => (
              <div key={i} className="row between" style={{ padding: '8px 0', borderBottom: '1px dashed var(--line-1)' }}>
                <span style={{ color: 'var(--ink-3)' }}>{k}</span>
                <span className="ink-0">{v}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24 }}>
            <SectionHead eyebrow="HEALTH" title={null}/>
            <div className="col gap-10">
              {[
                { k: 'Process', v: 'screen running · uptime 14d', tone: 'pos' },
                { k: 'Redis backup', v: 'last: 2m ago', tone: 'pos' },
                { k: 'TG delivery', v: '100% 24h', tone: 'pos' },
                { k: 'API errors', v: bot.id === 'zero_two' ? '2 rate-limits 1h' : 'none', tone: bot.id === 'zero_two' ? 'warn' : 'pos' },
              ].map((h, i) => (
                <div key={i} className="row between">
                  <span style={{ color: 'var(--ink-2)', fontSize: 12 }}>{h.k}</span>
                  <span className={`mono ${h.tone === 'pos' ? 'pos' : h.tone === 'warn' ? 'warn' : 'neg'}`} style={{ fontSize: 11 }}>{h.v}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <SectionHead eyebrow="RULES" title={null}/>
            <div className="col gap-6" style={{ fontSize: 12, color: 'var(--ink-1)', lineHeight: 1.55 }}>
              {bot.id === 'live_bot' ? [
                '• R:R ≥ 2.5', '• HIGH confidence only', '• 3 signals/day max', '• Min 3 aligned traders', '• HL-copy-ready TG alert format'
              ].map((r, i) => <div key={i}>{r}</div>) : [
                '• ' + bot.strategy,
                '• Backup to Redis every 60s',
                '• TG alerts on state transitions',
                '• Paper phase: no live execution',
              ].map((r, i) => <div key={i}>{r}</div>)}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

window.ScreenBots = ScreenBots;
window.ScreenBotDetail = ScreenBotDetail;
