// ============================================
// APP SHELL + ROUTER
// ============================================

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: 'home', jp: 'ホーム' },
  { id: 'bots', label: 'Bot Fleet', icon: 'bots', badge: '11', jp: '機体' },
  { id: 'journal', label: 'Journal', icon: 'journal', jp: '記録' },
  { id: 'new', label: 'New Trade', icon: 'plus', jp: '新規' },
  { id: 'analytics', label: 'Analytics', icon: 'chart', jp: '分析' },
  { id: 'calendar', label: 'Calendar', icon: 'calendar', jp: '暦' },
  { id: 'settings', label: 'Settings', icon: 'settings', jp: '設定' },
];

function TopNav({ route, nav, theme, setTheme, showTicker }) {
  const { TICKER } = window;
  const primaryId = route.split(':')[0];

  return (
    <header style={{ borderBottom: '1px solid var(--line-1)', background: 'var(--bg-1)', flexShrink: 0 }}>
      {/* Top row: brand + nav tabs + utilities */}
      <div style={{ height: 56, padding: '0 16px', display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Brand */}
        <div className="row gap-10" style={{ flexShrink: 0 }}>
          <div style={{
            width: 30, height: 30,
            background: 'linear-gradient(135deg, var(--magenta), var(--accent))',
            color: 'var(--bg-0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--ff-display)', fontWeight: 700, fontSize: 16,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 15% 100%, 0 85%)',
          }}>Z</div>
          <div className="col" style={{ gap: 0 }}>
            <div className="display-cond glitch" data-text="ZEROPARA" style={{ fontSize: 16, color: 'var(--ink-0)', letterSpacing: '0.06em' }}>ZEROPARA</div>
            <div className="row gap-4" style={{ alignItems: 'baseline' }}>
              <span className="jp" style={{ fontSize: 9, color: 'var(--magenta)', letterSpacing: '0.06em' }}>ゼロ・パラ</span>
              <span className="mono" style={{ fontSize: 8, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>// trading journal</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 28, background: 'var(--line-1)' }}/>

        {/* Nav tabs */}
        <nav className="row" style={{ gap: 2, flex: 1, overflowX: 'auto' }}>
          {NAV_ITEMS.map(n => {
            const active = primaryId === n.id
              || (n.id === 'bots' && primaryId === 'bot')
              || (n.id === 'journal' && primaryId === 'trade');
            return (
              <div key={n.id} onClick={() => nav(n.id)} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 10px',
                cursor: 'pointer',
                background: active ? 'var(--bg-3)' : 'transparent',
                color: active ? 'var(--ink-0)' : 'var(--ink-2)',
                fontSize: 12,
                transition: 'all 120ms',
                position: 'relative',
                whiteSpace: 'nowrap',
                borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
                marginBottom: -1,
                fontFamily: 'var(--ff-display)',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--bg-2)'; e.currentTarget.style.color = 'var(--ink-0)'; }}}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ink-2)'; }}}
              >
                <Icon name={n.icon} size={13}/>
                <span style={{ lineHeight: 1 }}>{n.label}</span>
                <span className="jp" style={{ fontSize: 9, color: active ? 'var(--magenta)' : 'var(--ink-4)', letterSpacing: '0.06em', textTransform: 'none', marginLeft: 2 }}>{n.jp}</span>
                {n.badge && (
                  <span className="mono" style={{
                    fontSize: 9, padding: '2px 5px', background: active ? 'var(--magenta-bg)' : 'var(--bg-4)', color: active ? 'var(--magenta)' : 'var(--ink-2)',
                    borderRadius: 2, letterSpacing: '0.04em',
                  }}>{n.badge}</span>
                )}
              </div>
            );
          })}
        </nav>

        {/* Utilities */}
        <div className="row gap-6" style={{ flexShrink: 0 }}>
          <div style={{ position: 'relative' }}>
            <Icon name="search" size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-3)' }}/>
            <input className="input" placeholder="Search…" style={{ paddingLeft: 32, width: 140, height: 30 }}/>
            <kbd style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}>⌘K</kbd>
          </div>
          <button className="btn btn-icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title="Toggle theme">
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={14}/>
          </button>
          <button className="btn btn-icon"><Icon name="bell" size={14}/></button>
          <div className="row gap-4" style={{ padding: '0 10px', height: 28, border: '1px solid var(--line-2)', borderRadius: 2, background: 'var(--bg-2)' }}>
            <span className="pos mono" style={{ fontSize: 10, letterSpacing: '0.08em' }}>● LIVE</span>
            <span className="mono" style={{ fontSize: 11, color: 'var(--ink-2)' }}>VPS 14d</span>
          </div>
        </div>
      </div>
      {showTicker && <Ticker items={TICKER}/>}
    </header>
  );
}

// ---------- Root App ----------
function App() {
  const [route, setRoute] = useState(() => localStorage.getItem('tj_route') || 'overview');
  const [theme, setTheme] = useState(() => localStorage.getItem('tj_theme') || 'dark');
  const [tweaks, setTweaks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tj_tweaks')) || DEFAULT_TWEAKS; } catch { return DEFAULT_TWEAKS; }
  });
  const [tweaksOpen, setTweaksOpen] = useState(false);

  useEffect(() => { localStorage.setItem('tj_route', route); }, [route]);
  useEffect(() => { localStorage.setItem('tj_theme', theme); document.documentElement.dataset.theme = theme; }, [theme]);
  useEffect(() => {
    localStorage.setItem('tj_tweaks', JSON.stringify(tweaks));
    document.documentElement.dataset.density = tweaks.density;

    // Apply accent / typography / color tweaks
    const root = document.documentElement;
    root.style.setProperty('--accent', tweaks.accent);
    root.style.setProperty('--info', tweaks.accent);
    if (tweaks.accent === '#FFFFFF') root.style.setProperty('--accent-ink', '#000000');
    else root.style.setProperty('--accent-ink', '#00121A');

    if (tweaks.posNegMode === 'colorblind') {
      root.style.setProperty('--pos', '#00AEEF');
      root.style.setProperty('--pos-bg', 'rgba(0, 174, 239, 0.10)');
      root.style.setProperty('--neg', '#FF8A00');
      root.style.setProperty('--neg-bg', 'rgba(255, 138, 0, 0.10)');
    } else {
      // reset
      if (theme === 'dark') {
        root.style.setProperty('--pos', '#00D563');
        root.style.setProperty('--pos-bg', 'rgba(0, 213, 99, 0.10)');
        root.style.setProperty('--neg', '#FF3B4B');
        root.style.setProperty('--neg-bg', 'rgba(255, 59, 75, 0.10)');
      } else {
        root.style.setProperty('--pos', '#008A3E');
        root.style.setProperty('--pos-bg', 'rgba(0, 138, 62, 0.10)');
        root.style.setProperty('--neg', '#D4001B');
        root.style.setProperty('--neg-bg', 'rgba(212, 0, 27, 0.08)');
      }
    }

    // Typography mode
    if (tweaks.typeMode === 'mono') {
      root.style.setProperty('--ff-sans', "'JetBrains Mono', ui-monospace, monospace");
    } else if (tweaks.typeMode === 'serif') {
      root.style.setProperty('--ff-sans', "'Instrument Serif', 'Iowan Old Style', Georgia, serif");
    } else {
      root.style.setProperty('--ff-sans', "'Inter Tight', 'Inter', system-ui, -apple-system, sans-serif");
    }
  }, [tweaks, theme]);

  // ---- Tweaks protocol ----
  useEffect(() => {
    function handler(e) {
      if (e.data?.type === '__activate_edit_mode') setTweaksOpen(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaksOpen(false);
    }
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  const nav = useCallback((r) => setRoute(r), []);
  const parts = route.split(':');
  const primary = parts[0];

  let screen;
  if (primary === 'overview') screen = <ScreenOverview nav={nav}/>;
  else if (primary === 'bots') screen = <ScreenBots nav={nav} botCardVariant={tweaks.botCardVariant}/>;
  else if (primary === 'bot') screen = <ScreenBotDetail botId={parts[1]} nav={nav}/>;
  else if (primary === 'journal') screen = <ScreenJournal nav={nav}/>;
  else if (primary === 'trade') screen = <ScreenTradeDetail tradeId={parts[1]} nav={nav}/>;
  else if (primary === 'new') screen = <ScreenNewTrade nav={nav} formVariant={tweaks.formVariant}/>;
  else if (primary === 'analytics') screen = <ScreenAnalytics/>;
  else if (primary === 'calendar') screen = <ScreenCalendar/>;
  else if (primary === 'settings') screen = <ScreenSettings theme={theme} setTheme={setTheme} density={tweaks.density} setDensity={(d) => setTweaks(t => ({...t, density: d}))}/>;
  else screen = <div style={{ padding: 40 }}>404</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
      <TopNav route={route} nav={nav} theme={theme} setTheme={setTheme} showTicker={tweaks.showTicker}/>
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {screen}
      </main>
      {tweaksOpen && <TweaksPanel tweaks={tweaks} setTweaks={setTweaks} onClose={() => setTweaksOpen(false)} onReset={() => setTweaks(DEFAULT_TWEAKS)}/>}
    </div>
  );
}

const DEFAULT_TWEAKS = /*EDITMODE-BEGIN*/{
  "accent": "#00E5FF",
  "typeMode": "sans",
  "density": "default",
  "botCardVariant": "detailed",
  "sparkVariant": "line",
  "formVariant": "structured",
  "showTicker": true,
  "posNegMode": "classic"
}/*EDITMODE-END*/;

window.App = App;
window.DEFAULT_TWEAKS = DEFAULT_TWEAKS;

ReactDOM.createRoot(document.getElementById('app')).render(<App/>);
