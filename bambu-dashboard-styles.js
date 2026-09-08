export const styles = `
  :host {
    --bd-bg: #050907;
    --bd-panel: #0c1210;
    --bd-panel-2: #111a16;
    --bd-border: #1d2923;
    --bd-accent: #50d926;
    --bd-accent-2: #22e681;
    --bd-text: #f4f7f5;
    --bd-muted: #a8b0ac;
    --bd-danger: #ff5f62;
    --bd-warn: #f4c95d;
    --bd-radius: 20px;
    display: block;
    color: var(--bd-text);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }
  * { box-sizing: border-box; }
  button, select, input { font: inherit; }
  button { color: inherit; }
  .shell {
    position: relative;
    overflow: hidden;
    border-radius: 26px;
    padding: 22px;
    background:
      radial-gradient(circle at 18% 0%, rgba(80,217,38,.11), transparent 28%),
      radial-gradient(circle at 92% 10%, rgba(34,230,129,.08), transparent 30%),
      linear-gradient(180deg, #07100c 0%, var(--bd-bg) 38%, #030605 100%);
    border: 1px solid rgba(80,217,38,.14);
    box-shadow: 0 20px 60px rgba(0,0,0,.34), inset 0 1px 0 rgba(255,255,255,.03);
  }
  .shell::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: .22;
    background-image: linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
    background-size: 32px 32px;
    mask-image: linear-gradient(to bottom, black, transparent 72%);
  }
  .header { position: relative; z-index: 1; display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 16px; }
  .brand { display:flex; align-items:center; gap:12px; min-width:0; }
  .brand-mark { width: 42px; height: 42px; border-radius: 13px; display:grid; place-items:center; background: linear-gradient(145deg, rgba(80,217,38,.23), rgba(80,217,38,.05)); border:1px solid rgba(80,217,38,.38); box-shadow: 0 0 28px rgba(80,217,38,.10); }
  .brand-mark ha-icon { color: var(--bd-accent); --mdc-icon-size: 25px; }
  .brand h1 { margin:0; font-size: clamp(18px, 2.2vw, 28px); line-height:1.05; letter-spacing:.02em; font-weight:800; }
  .brand small { display:block; color:var(--bd-muted); margin-top:4px; font-size:11px; letter-spacing:.14em; text-transform:uppercase; }
  .header-meta { display:flex; align-items:center; gap:8px; flex-wrap:wrap; justify-content:flex-end; }
  .pill { display:inline-flex; align-items:center; gap:7px; min-height:34px; padding:7px 10px; border-radius:999px; border:1px solid var(--bd-border); background:rgba(255,255,255,.025); color:var(--bd-muted); font-size:12px; }
  .pill.ok { color:#b9ffac; border-color:rgba(80,217,38,.28); background:rgba(80,217,38,.08); }
  .dot { width:7px; height:7px; border-radius:50%; background:currentColor; box-shadow:0 0 10px currentColor; }
  .tabs { position:relative; z-index:1; display:flex; gap:8px; overflow:auto; padding:3px 1px 14px; scrollbar-width:none; }
  .tabs::-webkit-scrollbar { display:none; }
  .tab { flex:0 0 auto; cursor:pointer; border:1px solid var(--bd-border); background:rgba(255,255,255,.02); border-radius:13px; padding:9px 13px; display:flex; align-items:center; gap:8px; transition:.18s ease; }
  .tab:hover { border-color:rgba(80,217,38,.32); transform:translateY(-1px); }
  .tab.active { background:linear-gradient(180deg, rgba(80,217,38,.15), rgba(80,217,38,.05)); border-color:rgba(80,217,38,.5); box-shadow:0 0 24px rgba(80,217,38,.08); }
  .tab ha-icon { --mdc-icon-size:19px; color:var(--bd-accent); }
  .tab span { font-size:13px; font-weight:700; white-space:nowrap; }
  .layout { position:relative; z-index:1; display:grid; grid-template-columns:minmax(0,1.38fr) minmax(290px,.82fr); gap:14px; }
  .left, .right { display:grid; gap:14px; align-content:start; }
  .grid-2 { display:grid; grid-template-columns:repeat(2, minmax(0,1fr)); gap:14px; }
  .panel { position:relative; overflow:hidden; border-radius:var(--bd-radius); background:linear-gradient(180deg, rgba(17,26,22,.96), rgba(9,15,12,.96)); border:1px solid var(--bd-border); box-shadow:inset 0 1px 0 rgba(255,255,255,.025), 0 14px 36px rgba(0,0,0,.18); }
  .panel.glow { border-color:rgba(80,217,38,.27); }
  .panel.glow::after { content:""; position:absolute; right:-80px; top:-80px; width:180px; height:180px; border-radius:50%; background:rgba(80,217,38,.08); filter:blur(20px); pointer-events:none; }
  .panel-head { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; padding:16px 17px 0; }
  .eyebrow { color:var(--bd-muted); font-size:10px; letter-spacing:.15em; text-transform:uppercase; font-weight:800; }
  .panel-title { margin:4px 0 0; font-size:15px; font-weight:800; }
  .muted { color:var(--bd-muted); }
  .hero-body { display:grid; grid-template-columns:minmax(170px,.82fr) minmax(230px,1.18fr); gap:18px; padding:17px; align-items:center; }
  .progress-wrap { display:grid; place-items:center; min-height:220px; }
  .progress-ring { --p:0; width:min(210px, 70vw); aspect-ratio:1; border-radius:50%; display:grid; place-items:center; background:conic-gradient(var(--bd-accent) calc(var(--p) * 1%), #1b2821 0); position:relative; box-shadow:0 0 34px rgba(80,217,38,.11); }
  .progress-ring::before { content:""; position:absolute; inset:12px; border-radius:50%; background:radial-gradient(circle at 50% 35%, #111c16, #080d0a 72%); border:1px solid rgba(255,255,255,.04); }
  .progress-inner { position:relative; text-align:center; padding:20px; }
  .progress-number { font-size:clamp(40px, 6vw, 66px); line-height:.9; font-weight:900; letter-spacing:-.05em; }
  .progress-number span { font-size:.37em; color:var(--bd-muted); margin-left:3px; }
  .status-badge { margin-top:13px; display:inline-flex; align-items:center; gap:7px; padding:6px 9px; border-radius:999px; font-size:11px; font-weight:800; letter-spacing:.08em; text-transform:uppercase; border:1px solid var(--bd-border); }
  .status-badge.ok { color:#bcffad; background:rgba(80,217,38,.09); border-color:rgba(80,217,38,.34); }
  .status-badge.warn { color:#ffe6a1; background:rgba(244,201,93,.08); border-color:rgba(244,201,93,.28); }
  .status-badge.bad { color:#ffc0c1; background:rgba(255,95,98,.08); border-color:rgba(255,95,98,.3); }
  .status-badge.muted, .status-badge.idle { color:var(--bd-muted); }
  .task { min-width:0; }
  .task-name { font-size:clamp(19px, 2.6vw, 30px); line-height:1.08; font-weight:850; overflow:hidden; text-overflow:ellipsis; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; }
  .task-meta { margin-top:8px; color:var(--bd-muted); font-size:12px; display:flex; flex-wrap:wrap; gap:8px 14px; }
  .metric-grid { margin-top:18px; display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:9px; }
  .metric { padding:11px; border-radius:14px; background:rgba(255,255,255,.025); border:1px solid rgba(255,255,255,.045); min-width:0; }
  .metric .label { color:var(--bd-muted); font-size:10px; letter-spacing:.08em; text-transform:uppercase; }
  .metric .value { margin-top:5px; font-size:17px; font-weight:800; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .temperature-list, .info-list { padding:13px 17px 17px; display:grid; gap:9px; }
  .temp-row, .info-row { display:grid; grid-template-columns:1fr auto; gap:10px; align-items:center; padding:10px 0; border-bottom:1px solid rgba(255,255,255,.045); }
  .temp-row:last-child, .info-row:last-child { border-bottom:0; }
  .row-label { display:flex; align-items:center; gap:9px; min-width:0; color:var(--bd-muted); font-size:12px; }
  .row-label ha-icon { color:var(--bd-accent); --mdc-icon-size:18px; }
  .row-value { font-size:13px; font-weight:800; text-align:right; }
  .camera-wrap { position:relative; aspect-ratio:16/9; margin:14px 17px 17px; border-radius:15px; overflow:hidden; background:#030504; border:1px solid rgba(255,255,255,.05); display:grid; place-items:center; }
  .camera-wrap img { width:100%; height:100%; object-fit:cover; display:block; }
  .camera-empty { text-align:center; color:var(--bd-muted); padding:20px; font-size:12px; }
  .camera-empty ha-icon { display:block; margin:0 auto 10px; --mdc-icon-size:34px; color:#637068; }
  .camera-actions { position:absolute; right:9px; bottom:9px; display:flex; gap:7px; }
  .icon-btn { cursor:pointer; border:1px solid rgba(255,255,255,.1); background:rgba(4,9,7,.75); backdrop-filter:blur(10px); border-radius:10px; width:34px; height:34px; display:grid; place-items:center; }
  .icon-btn:hover { border-color:rgba(80,217,38,.45); }
  .icon-btn ha-icon { --mdc-icon-size:18px; }
  .ams-list { padding:14px 17px 17px; display:grid; gap:14px; }
  .ams-unit { border:1px solid rgba(255,255,255,.05); border-radius:15px; padding:12px; background:rgba(255,255,255,.018); }
  .ams-unit-head { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:11px; }
  .ams-name { font-size:12px; font-weight:800; }
  .spools { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:9px; }
  .spool { min-width:0; text-align:center; border-radius:14px; padding:10px 6px 8px; background:rgba(255,255,255,.02); border:1px solid rgba(255,255,255,.045); }
  .spool-disc { --filament:#8e9a92; width:50px; max-width:100%; aspect-ratio:1; margin:0 auto 8px; border-radius:50%; background:radial-gradient(circle, #0b110e 0 26%, var(--filament) 27% 56%, #19211c 58% 67%, rgba(255,255,255,.04) 69%); box-shadow:0 0 18px color-mix(in srgb, var(--filament) 24%, transparent); border:1px solid rgba(255,255,255,.08); }
  .spool.active { border-color:rgba(80,217,38,.42); box-shadow:0 0 18px rgba(80,217,38,.06); }
  .spool-title { font-size:10px; font-weight:800; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .spool-meta { margin-top:3px; color:var(--bd-muted); font-size:9px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .controls { padding:14px 17px 17px; display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:9px; }
  .control-btn { cursor:pointer; border-radius:13px; padding:11px 10px; border:1px solid var(--bd-border); background:rgba(255,255,255,.022); display:flex; align-items:center; justify-content:center; gap:8px; font-size:12px; font-weight:800; transition:.18s ease; }
  .control-btn:hover:not(:disabled) { transform:translateY(-1px); border-color:rgba(80,217,38,.42); background:rgba(80,217,38,.06); }
  .control-btn:disabled { opacity:.35; cursor:not-allowed; }
  .control-btn.danger:hover:not(:disabled) { border-color:rgba(255,95,98,.45); background:rgba(255,95,98,.06); }
  .control-btn ha-icon { --mdc-icon-size:18px; }
  .select-wrap { padding:0 17px 17px; }
  .select-wrap select { width:100%; min-height:42px; border-radius:12px; color:var(--bd-text); background:#0b120e; border:1px solid var(--bd-border); padding:0 10px; }
  .energy-body { padding:14px 17px 17px; }
  .energy-stats { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:9px; }
  .energy-stat { padding:11px; border-radius:13px; border:1px solid rgba(255,255,255,.045); background:rgba(255,255,255,.02); }
  .energy-stat small { color:var(--bd-muted); display:block; font-size:9px; letter-spacing:.07em; text-transform:uppercase; }
  .energy-stat strong { display:block; margin-top:5px; font-size:14px; }
  .spark { width:100%; height:76px; margin-top:12px; display:block; overflow:visible; }
  .spark polyline { fill:none; stroke:var(--bd-accent); stroke-width:2.25; vector-effect:non-scaling-stroke; filter:drop-shadow(0 0 5px rgba(80,217,38,.25)); }
  .spark line { stroke:rgba(255,255,255,.055); stroke-width:1; }
  .maintenance { padding:14px 17px 17px; display:grid; gap:9px; }
  .maint-item { padding:10px 11px; border-radius:13px; border:1px solid rgba(255,255,255,.045); background:rgba(255,255,255,.02); }
  .maint-top { display:flex; justify-content:space-between; gap:10px; font-size:11px; }
  .maint-top strong { font-size:12px; }
  .bar { height:5px; border-radius:999px; background:#1b2821; overflow:hidden; margin-top:8px; }
  .bar > span { display:block; height:100%; background:linear-gradient(90deg,var(--bd-accent),var(--bd-accent-2)); border-radius:inherit; }
  .empty { padding:20px 17px; color:var(--bd-muted); font-size:12px; text-align:center; }
  .empty ha-icon { display:block; margin:0 auto 9px; --mdc-icon-size:30px; color:#647067; }
  .error-panel { padding:18px; border-radius:16px; background:rgba(255,95,98,.07); border:1px solid rgba(255,95,98,.22); color:#ffd2d3; }
  .notice { padding:12px 14px; border-radius:14px; background:rgba(80,217,38,.055); border:1px solid rgba(80,217,38,.15); color:#c9d4ce; font-size:11px; line-height:1.5; }
  .editor { padding:16px; color:var(--primary-text-color); }
  .editor h3 { margin:0 0 12px; }
  .editor-section { margin:14px 0; padding:13px; border:1px solid var(--divider-color); border-radius:12px; }
  .editor-row { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:10px; }
  .editor label { display:block; font-size:12px; margin-bottom:5px; color:var(--secondary-text-color); }
  .editor select, .editor input { width:100%; min-height:38px; border-radius:8px; border:1px solid var(--divider-color); background:var(--card-background-color); color:var(--primary-text-color); padding:0 8px; }
  .editor .help { font-size:12px; color:var(--secondary-text-color); line-height:1.45; }
  @media (max-width: 980px) { .layout { grid-template-columns:1fr; } .right { grid-template-columns:repeat(2,minmax(0,1fr)); } .right .panel.camera-panel { grid-column:span 2; } }
  @media (max-width: 720px) { .shell { padding:14px; border-radius:20px; } .header { align-items:flex-start; } .header-meta { display:none; } .hero-body { grid-template-columns:1fr; } .progress-wrap { min-height:190px; } .progress-ring { width:185px; } .grid-2, .right { grid-template-columns:1fr; } .right .panel.camera-panel { grid-column:auto; } .spools { grid-template-columns:repeat(2,minmax(0,1fr)); } .energy-stats { grid-template-columns:1fr 1fr; } .energy-stat:last-child { grid-column:span 2; } .editor-row { grid-template-columns:1fr; } }
  @media (max-width: 420px) { .metric-grid { grid-template-columns:1fr 1fr; } .controls { grid-template-columns:1fr; } }
`;
