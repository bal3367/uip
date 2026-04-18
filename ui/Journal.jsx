// ============================================
// SCREEN: JOURNAL + TRADE DETAIL + NEW TRADE
// ============================================

function ScreenJournal({ nav, formVariant }) {
  const { TRADES, SETUPS, PAIRS, fmt } = window;
  const [filter, setFilter] = useState({ pair: 'ALL', setup: 'ALL', status: 'ALL' });
  const [q, setQ] = useState('');

  const filtered = TRADES.filter(t => {
    if (filter.pair !== 'ALL' && t.pair !== filter.pair) return false;
    if (filter.setup !== 'ALL' && t.setup !== filter.setup) return false;
    if (filter.status !== 'ALL' && t.status !== filter.status) return false;
    if (q && !(t.pair.toLowerCase().includes(q.toLowerCase()) || t.setup.toLowerCase().includes(q.toLowerCase()) || t.id.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  });

  const stats = {
    count: filtered.length,
    wins: filtered.filter(t => t.status === 'WIN').length,
    losses: filtered.filter(t => t.status === 'LOSS').length,
    open: filtered.filter(t => t.status === 'OPEN').length,
    pnl: filtered.reduce((a, t) => a + (t.pnl || 0), 0),
    avgR: filtered.filter(t => t.rMultiple != null).reduce((a, t, _, arr) => a + t.rMultiple / arr.length, 0),
  };

  return (
    <div className="screen">
      <div style={{ padding: '24px 24px 0' }}>
        <div className="row between" style={{ alignItems: 'flex-end' }}>
          <div className="col gap-4">
            <div className="label">MANUAL JOURNAL</div>
            <div className="h-display" style={{ fontSize: 40 }}>Trade log</div>
            <div style={{ color: 'var(--ink-2)', fontSize: 13 }}>{TRADES.length} entries · honest reflection, no editing the past.</div>
          </div>
          <div className="row gap-6">
            <button className="btn"><Icon name="download" size={12}/> Export CSV</button>
            <button className="btn btn-primary" onClick={() => nav('new')}><Icon name="plus" size={12}/> New trade</button>
          </div>
        </div>

        {/* Filter strip */}
        <div className="row gap-6 wrap" style={{ marginTop: 20 }}>
          <div style={{ position: 'relative', minWidth: 260 }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-3)' }}><Icon name="search" size={14}/></span>
            <input className="input" placeholder="Search by pair, setup, id…" value={q} onChange={e => setQ(e.target.value)} style={{ paddingLeft: 32 }}/>
          </div>
          <select className="select" value={filter.pair} onChange={e => setFilter({...filter, pair: e.target.value})} style={{ width: 130 }}>
            <option>ALL</option>
            {PAIRS.map(p => <option key={p}>{p}</option>)}
          </select>
          <select className="select" value={filter.setup} onChange={e => setFilter({...filter, setup: e.target.value})} style={{ width: 160 }}>
            <option>ALL</option>
            {SETUPS.map(s => <option key={s}>{s}</option>)}
          </select>
          <div className="seg">
            {['ALL', 'WIN', 'LOSS', 'OPEN'].map(s => <button key={s} className={filter.status === s ? 'active' : ''} onClick={() => setFilter({...filter, status: s})}>{s}</button>)}
          </div>
          <div className="grow"/>
          <div className="row gap-12" style={{ fontFamily: 'var(--ff-mono)', fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <span>{stats.count} <span style={{ color: 'var(--ink-3)' }}>results</span></span>
            <span className="pos">{stats.wins}W</span>
            <span className="neg">{stats.losses}L</span>
            <span className="warn">{stats.open}O</span>
            <span>AVG {fmt.R(stats.avgR)}</span>
            <span className={stats.pnl >= 0 ? 'pos' : 'neg'}>{fmt.usdSigned(stats.pnl)}</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ padding: '20px 24px' }}>
        <div className="panel" style={{ padding: 0 }}>
          <table className="tbl">
            <thead><tr>
              <th>ID</th>
              <th>Date</th>
              <th>Pair</th>
              <th>Dir</th>
              <th>Setup</th>
              <th className="num">Entry</th>
              <th className="num">Exit</th>
              <th className="num">Size</th>
              <th className="num">R</th>
              <th className="num">P&L</th>
              <th>Conf</th>
              <th>Emotion</th>
              <th>Flags</th>
              <th></th>
            </tr></thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} onClick={() => nav('trade:' + t.id)}>
                  <td className="mono ink-3">{t.id}</td>
                  <td className="mono">{fmt.date(t.date)}</td>
                  <td className="mono ink-0">{t.pair}</td>
                  <td><span className={t.dir === 'LONG' ? 'pos mono' : 'neg mono'} style={{ fontSize: 11, letterSpacing: '0.06em', fontWeight: 600 }}>{t.dir}</span></td>
                  <td style={{ fontSize: 12 }}>{t.setup}</td>
                  <td className="num">{fmt.num(t.entry, 2)}</td>
                  <td className="num">{t.exit != null ? fmt.num(t.exit, 2) : '—'}</td>
                  <td className="num ink-2">{t.size.toFixed(3)}</td>
                  <td className={`num ${t.rMultiple == null ? 'ink-3' : t.rMultiple >= 0 ? 'pos' : 'neg'}`}>{t.rMultiple != null ? fmt.R(t.rMultiple) : '—'}</td>
                  <td className={`num ${t.pnl == null ? 'ink-3' : t.pnl >= 0 ? 'pos' : 'neg'}`} style={{ fontWeight: 500 }}>{fmt.usdSigned(t.pnl)}</td>
                  <td><Rating value={t.confidence}/></td>
                  <td style={{ fontSize: 11, color: 'var(--ink-2)' }}>{t.emotion}</td>
                  <td>
                    {t.mistake && <Pill tone="warn">{t.mistake}</Pill>}
                  </td>
                  <td><Icon name="arrowRight" size={12} style={{ color: 'var(--ink-3)' }}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ---------- Trade detail ----------
function ScreenTradeDetail({ tradeId, nav }) {
  const { TRADES, fmt, hashFloat } = window;
  const t = TRADES.find(x => x.id === tradeId);
  if (!t) return <div style={{ padding: 40 }}>Trade not found.</div>;

  return (
    <div className="screen">
      <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid var(--line-1)' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => nav('journal')} style={{ marginBottom: 14 }}>
          <Icon name="arrowLeft" size={12}/> Journal
        </button>
        <div className="row between">
          <div className="col gap-6">
            <div className="row gap-8">
              <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.08em' }}>{t.id}</span>
              <span className={t.status === 'WIN' ? 'pos mono' : t.status === 'LOSS' ? 'neg mono' : 'warn mono'} style={{ fontSize: 11, letterSpacing: '0.1em' }}>{t.status}</span>
            </div>
            <div className="row gap-8" style={{ alignItems: 'baseline' }}>
              <div className="h-display" style={{ fontSize: 44 }}>{t.pair}</div>
              <span className={`mono ${t.dir === 'LONG' ? 'pos' : 'neg'}`} style={{ fontSize: 18, letterSpacing: '0.1em', fontWeight: 600 }}>{t.dir}</span>
              <span className="serif" style={{ fontSize: 24, fontStyle: 'italic', color: 'var(--ink-2)' }}>· {t.setup}</span>
            </div>
            <div className="row gap-12 mono" style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>
              <span>{fmt.dateTime(t.date)}</span>
              <span>·</span>
              <span>size {t.size.toFixed(3)}</span>
              <span>·</span>
              <span>confidence {t.confidence}/5</span>
            </div>
          </div>
          <div className="row gap-6">
            <button className="btn"><Icon name="copy" size={12}/> Duplicate</button>
            <button className="btn"><Icon name="edit" size={12}/> Edit</button>
            <button className="btn btn-danger"><Icon name="x" size={12}/></button>
          </div>
        </div>
      </div>

      {/* Big P&L bar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr 1fr', borderBottom: '1px solid var(--line-1)' }}>
        <div style={{ padding: 24, borderRight: '1px solid var(--line-1)' }}>
          <div className="label">P&L</div>
          <div className={`big-num ${t.pnl == null ? '' : t.pnl >= 0 ? 'pos' : 'neg'}`} style={{ fontSize: 48 }}>{fmt.usdSigned(t.pnl)}</div>
          <div className={`mono ${t.rMultiple == null ? 'ink-3' : t.rMultiple >= 0 ? 'pos' : 'neg'}`} style={{ fontSize: 14, marginTop: 4 }}>{fmt.R(t.rMultiple)}</div>
        </div>
        <div style={{ padding: 24, borderRight: '1px solid var(--line-1)' }}>
          <div className="label">ENTRY</div>
          <div className="mono" style={{ fontSize: 22, color: 'var(--ink-0)', marginTop: 4 }}>{fmt.num(t.entry)}</div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>market</div>
        </div>
        <div style={{ padding: 24, borderRight: '1px solid var(--line-1)' }}>
          <div className="label">EXIT</div>
          <div className="mono" style={{ fontSize: 22, color: 'var(--ink-0)', marginTop: 4 }}>{t.exit ? fmt.num(t.exit) : '—'}</div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>{t.exit ? 'TP / manual' : 'still open'}</div>
        </div>
        <div style={{ padding: 24 }}>
          <div className="label">DURATION</div>
          <div className="mono" style={{ fontSize: 22, color: 'var(--ink-0)', marginTop: 4 }}>{(hashFloat(tradeId.length + 3) * 24).toFixed(1)}h</div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>entry → exit</div>
        </div>
      </div>

      {/* Main 2-col */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 1, background: 'var(--line-1)' }}>
        <section style={{ background: 'var(--bg-0)', padding: 24 }}>
          {/* Chart placeholder */}
          <SectionHead eyebrow="CHART SCREENSHOT" title={null} action={<button className="btn btn-sm"><Icon name="upload" size={11}/> Replace</button>}/>
          <div style={{
            border: '1px solid var(--line-1)',
            background: 'var(--bg-1)',
            borderRadius: 2,
            height: 320,
            position: 'relative',
            overflow: 'hidden',
          }} className="grid-bg">
            <CandleChart w={1200} h={320} seed={tradeId.length * 17 + 1}/>
            {/* Entry/exit lines */}
            <div style={{ position: 'absolute', top: '35%', left: 0, right: 0, borderTop: '1px dashed var(--info)', opacity: 0.7 }}>
              <span className="mono" style={{ position: 'absolute', right: 8, top: -18, fontSize: 10, color: 'var(--info)', background: 'var(--bg-0)', padding: '2px 6px', border: '1px solid var(--info)', letterSpacing: '0.06em' }}>ENTRY {fmt.num(t.entry)}</span>
            </div>
            {t.exit && <div style={{ position: 'absolute', top: t.pnl >= 0 ? '15%' : '60%', left: 0, right: 0, borderTop: `1px dashed ${t.pnl >= 0 ? 'var(--pos)' : 'var(--neg)'}`, opacity: 0.7 }}>
              <span className="mono" style={{ position: 'absolute', right: 8, top: -18, fontSize: 10, color: t.pnl >= 0 ? 'var(--pos)' : 'var(--neg)', background: 'var(--bg-0)', padding: '2px 6px', border: `1px solid ${t.pnl >= 0 ? 'var(--pos)' : 'var(--neg)'}`, letterSpacing: '0.06em' }}>EXIT {fmt.num(t.exit)}</span>
            </div>}
          </div>

          {/* Thesis */}
          <div style={{ marginTop: 28 }}>
            <SectionHead eyebrow="PRE-TRADE THESIS" title="What I saw going in"/>
            <div className="serif" style={{ fontSize: 19, lineHeight: 1.55, color: 'var(--ink-1)', maxWidth: 740, fontStyle: 'italic' }}>
              "{t.thesis}"
            </div>
          </div>

          {/* Reflection */}
          {t.reflection && (
            <div style={{ marginTop: 32, paddingTop: 28, borderTop: '1px solid var(--line-1)' }}>
              <SectionHead eyebrow="POST-TRADE REFLECTION" title="What actually happened"/>
              <div style={{ background: 'var(--bg-1)', border: '1px solid var(--line-1)', borderLeft: '3px solid var(--accent)', padding: 18, borderRadius: 2 }}>
                <div className="serif" style={{ fontSize: 16, lineHeight: 1.55, color: 'var(--ink-1)' }}>{t.reflection}</div>
              </div>
            </div>
          )}

          {/* Checklist */}
          <div style={{ marginTop: 32 }}>
            <SectionHead eyebrow="MISTAKES CHECKLIST" title={null}/>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {window.MISTAKES.map(m => {
                const checked = t.mistake === m;
                return (
                  <div key={m} className="row gap-6" style={{ padding: 10, border: `1px solid ${checked ? 'var(--warn)' : 'var(--line-1)'}`, background: checked ? 'var(--warn-bg)' : 'var(--bg-1)', borderRadius: 2 }}>
                    <div style={{
                      width: 14, height: 14, border: `1px solid ${checked ? 'var(--warn)' : 'var(--line-3)'}`, borderRadius: 2,
                      background: checked ? 'var(--warn)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000'
                    }}>{checked && <Icon name="check" size={10}/>}</div>
                    <span style={{ fontSize: 12, color: checked ? 'var(--warn)' : 'var(--ink-2)' }}>{m}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <aside style={{ background: 'var(--bg-0)', padding: 24 }}>
          <SectionHead eyebrow="MARKET CONTEXT" title={null}/>
          <div className="col gap-10" style={{ fontSize: 12 }}>
            {[
              ['HTF bias', 'Bullish'],
              ['Session', 'NY'],
              ['Volatility', 'Medium'],
              ['News', 'FOMC -2d'],
              ['BTC D', '56.2%'],
              ['DXY', '104.81'],
            ].map(([k, v]) => (
              <div key={k} className="row between" style={{ paddingBottom: 8, borderBottom: '1px dashed var(--line-1)' }}>
                <span style={{ color: 'var(--ink-3)' }}>{k}</span>
                <span className="mono ink-0">{v}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24 }}>
            <SectionHead eyebrow="PSYCHOLOGY" title={null}/>
            <div className="col gap-10">
              <div className="row between"><span style={{ color: 'var(--ink-3)' }}>Emotion</span><Pill tone="info">{t.emotion}</Pill></div>
              <div className="row between"><span style={{ color: 'var(--ink-3)' }}>Confidence</span><Rating value={t.confidence}/></div>
              <div className="row between"><span style={{ color: 'var(--ink-3)' }}>Plan adherence</span>
                <span className="mono pos">{t.mistake ? '—' : 'YES'}</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <SectionHead eyebrow="TAGS" title={null}/>
            <div className="row gap-4 wrap">
              <Pill>manual</Pill>
              <Pill>{t.pair.split('-')[0]}</Pill>
              <Pill>{t.setup.toLowerCase().replace(' ', '-')}</Pill>
              <Pill>{t.dir.toLowerCase()}</Pill>
              <button className="btn btn-sm btn-ghost"><Icon name="plus" size={10}/> add tag</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ---------- New Trade Form ----------
function ScreenNewTrade({ nav, formVariant = 'structured' }) {
  const { SETUPS, PAIRS, EMOTIONS, MISTAKES } = window;
  const [form, setForm] = useState({
    pair: 'BTC-USD', dir: 'LONG', setup: 'Divergence', entry: '', exit: '', stop: '', size: '',
    confidence: 3, emotion: 'Calm', thesis: '', reflection: '', mistakes: [],
  });
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleMistake = m => setForm(f => ({ ...f, mistakes: f.mistakes.includes(m) ? f.mistakes.filter(x => x !== m) : [...f.mistakes, m] }));

  const rr = useMemo(() => {
    const e = parseFloat(form.entry), ex = parseFloat(form.exit), s = parseFloat(form.stop);
    if (!e || !s || !ex) return null;
    const risk = Math.abs(e - s);
    const reward = Math.abs(ex - e);
    return reward / risk;
  }, [form.entry, form.exit, form.stop]);

  // Two form variants: structured (default) and journal (serif, editorial)
  if (formVariant === 'journal') {
    return (
      <div className="screen" style={{ maxWidth: 880, margin: '0 auto', padding: '48px 32px' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => nav('journal')} style={{ marginBottom: 32 }}>
          <Icon name="arrowLeft" size={12}/> Back to journal
        </button>
        <div className="label" style={{ marginBottom: 8 }}>NEW ENTRY · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
        <div className="h-display" style={{ fontSize: 56, marginBottom: 32 }}>Today I traded…</div>

        <div className="serif" style={{ fontSize: 22, lineHeight: 1.6, color: 'var(--ink-1)' }}>
          <div className="row gap-8 wrap" style={{ alignItems: 'baseline', marginBottom: 24 }}>
            <span>I took a</span>
            <select className="select" style={{ width: 120, fontSize: 20, fontFamily: 'var(--ff-serif)', fontStyle: 'italic', height: 40 }} value={form.dir} onChange={e=>u('dir', e.target.value)}>
              <option>LONG</option><option>SHORT</option>
            </select>
            <span>on</span>
            <select className="select" style={{ width: 160, fontSize: 20, fontFamily: 'var(--ff-serif)', fontStyle: 'italic', height: 40 }} value={form.pair} onChange={e=>u('pair', e.target.value)}>
              {PAIRS.map(p => <option key={p}>{p}</option>)}
            </select>
            <span>using a</span>
            <select className="select" style={{ width: 200, fontSize: 20, fontFamily: 'var(--ff-serif)', fontStyle: 'italic', height: 40 }} value={form.setup} onChange={e=>u('setup', e.target.value)}>
              {SETUPS.map(s => <option key={s}>{s}</option>)}
            </select>
            <span>setup.</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            ['Entry', 'entry'], ['Stop', 'stop'], ['Target', 'exit'], ['Size', 'size'],
          ].map(([label, key]) => (
            <div key={key}>
              <div className="label">{label}</div>
              <input className="input mono" style={{ fontSize: 18, height: 44, marginTop: 4 }} placeholder="0.00" value={form[key]} onChange={e=>u(key, e.target.value)}/>
            </div>
          ))}
        </div>

        {rr && <div className="row gap-8" style={{ marginBottom: 32, padding: 14, background: 'var(--bg-1)', border: '1px solid var(--line-1)', borderLeft: '3px solid var(--info)' }}>
          <div className="label">R:R</div>
          <div className="mono" style={{ fontSize: 18, color: rr >= 2 ? 'var(--pos)' : 'var(--warn)' }}>{rr.toFixed(2)}</div>
          <div style={{ color: 'var(--ink-2)', fontSize: 12 }}>{rr >= 2.5 ? 'meets live-bot criteria' : rr >= 1.5 ? 'acceptable' : 'below standard'}</div>
        </div>}

        <div style={{ marginBottom: 32 }}>
          <div className="label">THE PLAN · what are you seeing?</div>
          <textarea className="textarea" style={{ minHeight: 140, marginTop: 8, fontFamily: 'var(--ff-serif)', fontSize: 17, lineHeight: 1.5 }} placeholder="Write your thesis before you press the button. Be specific about invalidation." value={form.thesis} onChange={e=>u('thesis', e.target.value)}/>
        </div>

        <div className="row gap-12" style={{ marginBottom: 32 }}>
          <div className="grow">
            <div className="label">HOW DO YOU FEEL?</div>
            <div className="row gap-4 wrap" style={{ marginTop: 8 }}>
              {EMOTIONS.map(em => (
                <button key={em} className={`btn btn-sm ${form.emotion === em ? 'btn-primary' : ''}`} onClick={() => u('emotion', em)}>{em}</button>
              ))}
            </div>
          </div>
          <div style={{ width: 200 }}>
            <div className="label">CONFIDENCE · 1–5</div>
            <div className="row gap-4" style={{ marginTop: 8 }}>
              {[1,2,3,4,5].map(n => (
                <button key={n} className={`btn btn-sm ${form.confidence === n ? 'btn-primary' : ''}`} onClick={() => u('confidence', n)} style={{ width: 32, justifyContent: 'center' }}>{n}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="row gap-6 end">
          <button className="btn btn-lg" onClick={() => nav('journal')}>Cancel</button>
          <button className="btn btn-lg btn-primary" onClick={() => nav('journal')}><Icon name="check" size={14}/> Save trade</button>
        </div>
      </div>
    );
  }

  // STRUCTURED variant (default)
  return (
    <div className="screen">
      <div style={{ padding: '24px', borderBottom: '1px solid var(--line-1)' }}>
        <div className="row between">
          <div>
            <button className="btn btn-ghost btn-sm" onClick={() => nav('journal')} style={{ marginBottom: 8 }}>
              <Icon name="arrowLeft" size={12}/> Back
            </button>
            <div className="h-display" style={{ fontSize: 36 }}>New trade entry</div>
          </div>
          <div className="row gap-6">
            <button className="btn" onClick={() => nav('journal')}>Cancel</button>
            <button className="btn btn-primary btn-lg" onClick={() => nav('journal')}><Icon name="check" size={14}/> Save trade</button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 1, background: 'var(--line-1)' }}>
        <section style={{ background: 'var(--bg-0)', padding: 24 }}>
          {/* SETUP */}
          <SectionHead eyebrow="01 · EXECUTION" title="Setup & numbers"/>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
            <Field label="PAIR"><select className="select" value={form.pair} onChange={e=>u('pair', e.target.value)}>{PAIRS.map(p => <option key={p}>{p}</option>)}</select></Field>
            <Field label="DIRECTION">
              <div className="seg" style={{ width: '100%' }}>
                <button className={form.dir === 'LONG' ? 'active' : ''} onClick={()=>u('dir','LONG')} style={{ flex: 1, color: form.dir === 'LONG' ? 'var(--pos)' : undefined }}>LONG</button>
                <button className={form.dir === 'SHORT' ? 'active' : ''} onClick={()=>u('dir','SHORT')} style={{ flex: 1, color: form.dir === 'SHORT' ? 'var(--neg)' : undefined }}>SHORT</button>
              </div>
            </Field>
            <Field label="SETUP"><select className="select" value={form.setup} onChange={e=>u('setup', e.target.value)}>{SETUPS.map(s => <option key={s}>{s}</option>)}</select></Field>
            <Field label="ENTRY"><input className="input mono" placeholder="0.00" value={form.entry} onChange={e=>u('entry', e.target.value)}/></Field>
            <Field label="STOP"><input className="input mono" placeholder="0.00" value={form.stop} onChange={e=>u('stop', e.target.value)}/></Field>
            <Field label="TARGET"><input className="input mono" placeholder="0.00" value={form.exit} onChange={e=>u('exit', e.target.value)}/></Field>
            <Field label="SIZE"><input className="input mono" placeholder="0.00" value={form.size} onChange={e=>u('size', e.target.value)}/></Field>
            <Field label="R:R">
              <div className="input mono" style={{ display: 'flex', alignItems: 'center', color: rr ? (rr >= 2 ? 'var(--pos)' : 'var(--warn)') : 'var(--ink-3)' }}>
                {rr ? rr.toFixed(2) : 'auto'}
              </div>
            </Field>
            <Field label="TIMEFRAME">
              <div className="seg" style={{ width: '100%' }}>
                {['5m','15m','1h','4h','1d'].map(tf => <button key={tf} style={{ flex: 1 }}>{tf}</button>)}
              </div>
            </Field>
          </div>

          {/* THESIS */}
          <SectionHead eyebrow="02 · THESIS" title="Pre-trade plan" sub="Write before you click. Be specific about invalidation."/>
          <textarea className="textarea" placeholder="Higher-timeframe trend is… entry is valid if… I'm wrong if…" value={form.thesis} onChange={e=>u('thesis', e.target.value)} style={{ minHeight: 120 }}/>

          {/* SCREENSHOT */}
          <div style={{ marginTop: 28 }}>
            <SectionHead eyebrow="03 · CHART" title="Screenshot"/>
            <div style={{ border: '1px dashed var(--line-3)', borderRadius: 2, padding: 40, textAlign: 'center', color: 'var(--ink-3)', cursor: 'pointer' }}
                 onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                 onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--line-3)'}>
              <Icon name="image" size={28} style={{ color: 'var(--ink-3)', marginBottom: 8 }}/>
              <div style={{ fontSize: 13, color: 'var(--ink-2)' }}>Drop chart screenshot · or paste with <kbd>⌘V</kbd></div>
            </div>
          </div>

          {/* REFLECTION */}
          <div style={{ marginTop: 28 }}>
            <SectionHead eyebrow="04 · REFLECTION (post-close)" title="What actually happened"/>
            <textarea className="textarea" placeholder="Leave blank until closed. Then: honest post-mortem." value={form.reflection} onChange={e=>u('reflection', e.target.value)} style={{ minHeight: 100, borderStyle: 'dashed' }}/>
          </div>
        </section>

        {/* Sidebar */}
        <aside style={{ background: 'var(--bg-0)', padding: 24 }}>
          <SectionHead eyebrow="PSYCHOLOGY" title="State check"/>
          <Field label="EMOTION">
            <div className="row gap-4 wrap">
              {EMOTIONS.map(em => (
                <button key={em} className={`btn btn-sm ${form.emotion === em ? 'btn-primary' : ''}`} onClick={() => u('emotion', em)}>{em}</button>
              ))}
            </div>
          </Field>
          <div style={{ marginTop: 16 }}/>
          <Field label={`CONFIDENCE · ${form.confidence}/5`}>
            <input type="range" min="1" max="5" value={form.confidence} onChange={e=>u('confidence', parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent)' }}/>
          </Field>

          <div style={{ marginTop: 24 }}>
            <SectionHead eyebrow="MISTAKES (if any)" title={null}/>
            <div className="col gap-6">
              {MISTAKES.map(m => {
                const checked = form.mistakes.includes(m);
                return (
                  <label key={m} className="row gap-6" style={{ cursor: 'pointer', padding: '6px 8px', border: `1px solid ${checked ? 'var(--warn)' : 'var(--line-1)'}`, background: checked ? 'var(--warn-bg)' : 'transparent', borderRadius: 2 }}>
                    <input type="checkbox" checked={checked} onChange={() => toggleMistake(m)} style={{ accentColor: 'var(--warn)' }}/>
                    <span style={{ fontSize: 12 }}>{m}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <SectionHead eyebrow="CONTEXT" title={null}/>
            <Field label="HTF BIAS"><div className="seg" style={{ width: '100%' }}><button className="active" style={{ flex: 1 }}>BULL</button><button style={{ flex: 1 }}>NEUTRAL</button><button style={{ flex: 1 }}>BEAR</button></div></Field>
            <div style={{ marginTop: 10 }}/>
            <Field label="SESSION"><div className="seg" style={{ width: '100%' }}>{['ASIA','LDN','NY'].map(s => <button key={s} style={{ flex: 1 }} className={s === 'NY' ? 'active' : ''}>{s}</button>)}</div></Field>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return <div><div className="label" style={{ marginBottom: 6 }}>{label}</div>{children}</div>;
}

window.ScreenJournal = ScreenJournal;
window.ScreenTradeDetail = ScreenTradeDetail;
window.ScreenNewTrade = ScreenNewTrade;
