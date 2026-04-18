// ============================================
// TWEAKS PANEL
// ============================================

function TweaksPanel({ tweaks, setTweaks, onClose, onReset }) {
  const u = (k, v) => setTweaks(t => ({ ...t, [k]: v }));

  return (
    <div style={{
      position: 'fixed',
      top: 60,
      right: 16,
      width: 320,
      maxHeight: 'calc(100vh - 80px)',
      overflowY: 'auto',
      background: 'var(--bg-1)',
      border: '1px solid var(--line-2)',
      borderRadius: 'var(--r-2)',
      boxShadow: 'var(--sh-2)',
      zIndex: 100,
      fontSize: 12,
    }}>
      <div className="panel-head" style={{ position: 'sticky', top: 0, background: 'var(--bg-1)', zIndex: 1 }}>
        <span className="title">TWEAKS</span>
        <div className="row gap-3">
          <button className="btn btn-sm btn-ghost" onClick={onReset}>Reset</button>
          <button className="btn btn-sm btn-ghost btn-icon" onClick={onClose}><Icon name="x" size={12}/></button>
        </div>
      </div>
      <div className="col gap-16" style={{ padding: 16 }}>

        <TweakGroup label="ACCENT COLOR">
          <div className="row gap-4 wrap">
            {[
              ['#00E5FF', 'cyan'],
              ['#00D563', 'green'],
              ['#B388FF', 'violet'],
              ['#FFB020', 'amber'],
              ['#FF5C8A', 'pink'],
              ['#FFFFFF', 'mono'],
            ].map(([color, name]) => (
              <button key={color} onClick={() => u('accent', color)} title={name}
                style={{
                  width: 28, height: 28, border: tweaks.accent === color ? '2px solid var(--ink-0)' : '1px solid var(--line-2)',
                  background: color, borderRadius: 3, cursor: 'pointer',
                }}/>
            ))}
          </div>
        </TweakGroup>

        <TweakGroup label="TYPOGRAPHY">
          <div className="seg" style={{ width: '100%' }}>
            {[
              ['sans', 'Sans'],
              ['mono', 'Mono'],
              ['serif', 'Editorial'],
            ].map(([k, l]) => <button key={k} className={tweaks.typeMode === k ? 'active' : ''} onClick={() => u('typeMode', k)} style={{ flex: 1 }}>{l}</button>)}
          </div>
        </TweakGroup>

        <TweakGroup label="DENSITY">
          <div className="seg" style={{ width: '100%' }}>
            {['compact', 'default', 'comfortable'].map(d => (
              <button key={d} className={tweaks.density === d ? 'active' : ''} onClick={() => u('density', d)} style={{ flex: 1 }}>{d[0].toUpperCase()+d.slice(1)}</button>
            ))}
          </div>
        </TweakGroup>

        <TweakGroup label="BOT FLEET LAYOUT">
          <div className="seg" style={{ width: '100%' }}>
            {[['detailed','Cards'], ['terminal', 'Terminal'], ['minimal','Minimal']].map(([k,l]) => (
              <button key={k} className={tweaks.botCardVariant === k ? 'active' : ''} onClick={() => u('botCardVariant', k)} style={{ flex: 1 }}>{l}</button>
            ))}
          </div>
        </TweakGroup>

        <TweakGroup label="SPARKLINE STYLE">
          <div className="seg" style={{ width: '100%' }}>
            {[['line','Line'], ['bars','Bars']].map(([k,l]) => (
              <button key={k} className={tweaks.sparkVariant === k ? 'active' : ''} onClick={() => u('sparkVariant', k)} style={{ flex: 1 }}>{l}</button>
            ))}
          </div>
        </TweakGroup>

        <TweakGroup label="JOURNAL FORM">
          <div className="seg" style={{ width: '100%' }}>
            {[['structured','Structured'], ['journal','Editorial']].map(([k,l]) => (
              <button key={k} className={tweaks.formVariant === k ? 'active' : ''} onClick={() => u('formVariant', k)} style={{ flex: 1 }}>{l}</button>
            ))}
          </div>
        </TweakGroup>

        <TweakGroup label="TICKER">
          <label className="row gap-6" style={{ cursor: 'pointer' }}>
            <input type="checkbox" checked={tweaks.showTicker} onChange={e => u('showTicker', e.target.checked)} style={{ accentColor: 'var(--accent)' }}/>
            <span>Show price ticker</span>
          </label>
        </TweakGroup>

        <TweakGroup label="GAIN / LOSS COLORS">
          <div className="seg" style={{ width: '100%' }}>
            {[['classic', 'Green / Red'], ['colorblind', 'Blue / Orange']].map(([k, l]) => (
              <button key={k} className={tweaks.posNegMode === k ? 'active' : ''} onClick={() => u('posNegMode', k)} style={{ flex: 1 }}>{l}</button>
            ))}
          </div>
        </TweakGroup>
      </div>
    </div>
  );
}

function TweakGroup({ label, children }) {
  return (
    <div className="col gap-6">
      <div className="label">{label}</div>
      {children}
    </div>
  );
}

window.TweaksPanel = TweaksPanel;
