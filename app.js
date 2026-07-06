/* ============================================================
   SMART PREDICTIVE MAINTENANCE SYSTEM — Core JavaScript
   ============================================================ */

/* ── Navigation ─────────────────────────────────────────── */
function navigate(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const page = document.getElementById(pageId);
  if (page) { page.classList.add('active'); }
  document.querySelectorAll(`[data-page="${pageId}"]`).forEach(n => n.classList.add('active'));
  const titles = {
    'page-home':       'Home',
    'page-dashboard':  'Dashboard',
    'page-history':    'Prediction History',
    'page-analytics':  'Analytics & Insights',
    'page-about':      'About Project',
    'page-contact':    'Contact Us'
  };
  const el = document.getElementById('topbar-title');
  if (el) el.textContent = titles[pageId] || '';
  closeSidebar();
  window.scrollTo(0, 0);
}

/* ── Sidebar toggle ─────────────────────────────────────── */
function toggleSidebar() {
  document.querySelector('.sidebar').classList.toggle('open');
  document.querySelector('.overlay').classList.toggle('show');
}
function closeSidebar() {
  document.querySelector('.sidebar').classList.remove('open');
  document.querySelector('.overlay').classList.remove('show');
}

/* ── Tabs ────────────────────────────────────────────────── */
function switchTab(btn, groupId) {
  const group = document.getElementById(groupId);
  group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  group.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const panel = document.getElementById(btn.dataset.tab);
  if (panel) panel.classList.add('active');
}

/* ── Prediction form ─────────────────────────────────────── */
function runPrediction() {
  const temp   = parseFloat(document.getElementById('inp-temp')?.value)   || 75;
  const press  = parseFloat(document.getElementById('inp-press')?.value)  || 50;
  const speed  = parseFloat(document.getElementById('inp-speed')?.value)  || 1450;
  const noise  = parseFloat(document.getElementById('inp-noise')?.value)  || 65;
  const hours  = parseFloat(document.getElementById('inp-hours')?.value)  || 800;

  const score = 100
    - Math.max(0, (temp  - 70) * 0.6)
    - Math.max(0, (press - 55) * 0.4)
    - Math.max(0, (noise - 60) * 0.5)
    - Math.max(0, (hours - 1000) * 0.01);

  const clamped = Math.max(0, Math.min(100, score));
  const status = clamped >= 75 ? 'Healthy' : clamped >= 45 ? 'At Risk' : 'Failure Predicted';
  const cls    = clamped >= 75 ? 'health-healthy' : clamped >= 45 ? 'health-at-risk' : 'health-failure';
  const msg    = clamped >= 75
    ? 'Machine is operating within normal parameters.'
    : clamped >= 45
    ? 'Early signs of wear detected. Schedule maintenance soon.'
    : 'Critical failure likely. Immediate shutdown recommended.';

  const out = document.getElementById('prediction-output');
  if (!out) return;
  out.innerHTML = `
    <div class="card" style="border-color:${clamped>=75?'var(--accent3)':clamped>=45?'var(--warning)':'var(--danger)'}">
      <div style="display:flex;align-items:center;gap:16px;">
        <div style="font-size:48px;">${clamped>=75?'✅':clamped>=45?'⚠️':'🚨'}</div>
        <div>
          <span class="health-badge ${cls}" style="font-size:14px;padding:6px 16px;">${status}</span>
          <div style="font-size:32px;font-weight:900;margin-top:8px;">${clamped.toFixed(1)}%</div>
          <div style="color:var(--muted);font-size:13px;">Health Score</div>
        </div>
      </div>
      <p style="margin-top:16px;color:var(--muted);font-size:14px;">${msg}</p>
      <div class="progress-bar-wrap" style="margin-top:12px;">
        <div class="progress-bar-track">
          <div class="progress-bar-fill" style="width:${clamped}%;--bar-color:${clamped>=75?'var(--accent3)':clamped>=45?'var(--warning)':'var(--danger)'}"></div>
        </div>
      </div>
    </div>`;
}

/* ── Chart: Line chart (Canvas API) ─────────────────────── */
function drawLineChart(canvasId, datasets, labels, opts = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width = canvas.offsetWidth || 400;
  const H = canvas.height = opts.height || 200;
  ctx.clearRect(0, 0, W, H);

  const PAD = { top: 20, right: 20, bottom: 36, left: 44 };
  const cW = W - PAD.left - PAD.right;
  const cH = H - PAD.top  - PAD.bottom;

  // background grid
  ctx.strokeStyle = 'rgba(26,48,80,0.6)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = PAD.top + (cH / 4) * i;
    ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(W - PAD.right, y); ctx.stroke();
  }

  // x labels
  ctx.fillStyle = '#64748b'; ctx.font = '10px Inter'; ctx.textAlign = 'center';
  labels.forEach((lbl, i) => {
    const x = PAD.left + (i / (labels.length - 1)) * cW;
    ctx.fillText(lbl, x, H - 6);
  });

  // find global min/max
  let allVals = datasets.flatMap(d => d.data);
  let min = opts.min !== undefined ? opts.min : Math.floor(Math.min(...allVals) * 0.9);
  let max = opts.max !== undefined ? opts.max : Math.ceil(Math.max(...allVals) * 1.05);
  const range = max - min || 1;

  // y labels
  ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const val = max - (range / 4) * i;
    ctx.fillText(Math.round(val), PAD.left - 6, PAD.top + (cH / 4) * i + 4);
  }

  // draw each dataset
  datasets.forEach(ds => {
    const points = ds.data.map((v, i) => ({
      x: PAD.left + (i / (ds.data.length - 1)) * cW,
      y: PAD.top + cH - ((v - min) / range) * cH
    }));

    // fill area
    ctx.beginPath();
    ctx.moveTo(points[0].x, PAD.top + cH);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length-1].x, PAD.top + cH);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, PAD.top, 0, PAD.top + cH);
    grad.addColorStop(0, ds.color + '33');
    grad.addColorStop(1, ds.color + '00');
    ctx.fillStyle = grad;
    ctx.fill();

    // line
    ctx.beginPath();
    ctx.strokeStyle = ds.color;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.stroke();

    // dots
    points.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = ds.color;
      ctx.fill();
    });
  });
}

/* ── Chart: Bar chart ────────────────────────────────────── */
function drawBarChart(canvasId, data, labels, colors, opts = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width = canvas.offsetWidth || 400;
  const H = canvas.height = opts.height || 200;
  ctx.clearRect(0, 0, W, H);

  const PAD = { top: 20, right: 20, bottom: 36, left: 44 };
  const cW = W - PAD.left - PAD.right;
  const cH = H - PAD.top - PAD.bottom;
  const max = opts.max || Math.ceil(Math.max(...data) * 1.1);
  const barW = (cW / data.length) * 0.55;
  const gap  = cW / data.length;

  ctx.strokeStyle = 'rgba(26,48,80,0.6)'; ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = PAD.top + (cH / 4) * i;
    ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(W - PAD.right, y); ctx.stroke();
  }

  ctx.fillStyle = '#64748b'; ctx.font = '10px Inter';
  data.forEach((v, i) => {
    const x = PAD.left + i * gap + gap / 2 - barW / 2;
    const h = (v / max) * cH;
    const y = PAD.top + cH - h;
    const grad = ctx.createLinearGradient(0, y, 0, y + h);
    grad.addColorStop(0, colors[i % colors.length]);
    grad.addColorStop(1, colors[i % colors.length] + '55');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y, barW, h, 4) : ctx.rect(x, y, barW, h);
    ctx.fill();
    ctx.fillStyle = '#64748b'; ctx.textAlign = 'center';
    ctx.fillText(labels[i], x + barW / 2, H - 6);
  });
}

/* ── Donut chart ─────────────────────────────────────────── */
function drawDonut(canvasId, segments) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = 160;
  canvas.width = size; canvas.height = size;
  const cx = size/2, cy = size/2, r = 60, inner = 38;
  let angle = -Math.PI / 2;
  segments.forEach(seg => {
    const slice = (seg.pct / 100) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, angle, angle + slice);
    ctx.closePath();
    ctx.fillStyle = seg.color; ctx.fill();
    angle += slice;
  });
  ctx.beginPath();
  ctx.arc(cx, cy, inner, 0, Math.PI * 2);
  ctx.fillStyle = '#0a1628'; ctx.fill();
  const total = segments.reduce((a, s) => a + s.pct, 0);
  ctx.fillStyle = '#e2e8f0'; ctx.font = 'bold 18px Inter'; ctx.textAlign = 'center';
  ctx.fillText(total.toFixed(0) + '%', cx, cy + 6);
}

/* ── Contact form submit ─────────────────────────────────── */
function submitContact(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type=submit]');
  const orig = btn.textContent;
  btn.textContent = '✅ Message Sent!';
  btn.disabled = true;
  setTimeout(() => { btn.textContent = orig; btn.disabled = false; e.target.reset(); }, 3000);
}

/* ── Notification bell ───────────────────────────────────── */
function showNotif() {
  const el = document.getElementById('notif-panel');
  if (el) el.classList.toggle('show');
}

/* ── Init ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  navigate('page-home');

  // wire nav clicks
  document.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', () => navigate(el.dataset.page));
  });

  // hamburger
  document.querySelector('.hamburger')?.addEventListener('click', toggleSidebar);
  document.querySelector('.overlay')?.addEventListener('click', closeSidebar);

  // draw initial charts
  setTimeout(() => {
    drawDashboardCharts();
    drawAnalyticsCharts();
  }, 100);
});

function drawDashboardCharts() {
  drawLineChart('chart-predictions', [
    { data: [82, 85, 79, 88, 91, 87, 93, 89, 95, 92, 88, 96], color: '#10b981' },
    { data: [12, 10, 15, 8,  6,  9,  5,  8,  3,  5,  9,  4],  color: '#f59e0b' },
    { data: [6,  5,  6,  4,  3,  4,  2,  3,  2,  3,  3,  1],  color: '#ef4444' }
  ], ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], { height: 220 });

  drawDonut('chart-donut-dash', [
    { pct: 88.2, color: '#10b981' },
    { pct: 7.9,  color: '#f59e0b' },
    { pct: 3.9,  color: '#ef4444' }
  ]);
}

function drawAnalyticsCharts() {
  drawLineChart('chart-accuracy', [
    { data: [93, 94.5, 95, 96.2, 96.8, 97.1, 97.4, 97.8], color: '#00d4ff' }
  ], ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'], { min: 90, max: 100, height: 200 });

  drawBarChart('chart-failures', [18,14,22,10,8,16,12,6], ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'],
    ['#7c3aed','#6d28d9','#7c3aed','#5b21b6','#4c1d95','#7c3aed','#6d28d9','#4c1d95'], { height: 200 });

  drawDonut('chart-donut-analytics', [
    { pct: 74, color: '#10b981' },
    { pct: 18, color: '#f59e0b' },
    { pct: 8,  color: '#ef4444' }
  ]);

  drawBarChart('chart-downtime', [48,32,61,24,18,40,30,15], ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'],
    ['#00d4ff','#0099cc','#00d4ff','#006699','#004d80','#00d4ff','#0099cc','#004d80'], { height: 200 });
}
