/**
 * examination.js — EduSphere Examination & Marks
 * Requires: <script src="../JS/api.js"></script> in <head>
 * Replace the <script> block in examination.html with:
 *   <script src="../JS/examination.js"></script>
 */

if (!sessionStorage.getItem('es_user') && !localStorage.getItem('es_user')) {
    window.location.href = '../Pages/login.html';
}

document.getElementById('sidebarToggle').addEventListener('click', () => {
    document.getElementById('appShell').classList.toggle('collapsed');
});

function logout() {
    sessionStorage.removeItem('es_user'); localStorage.removeItem('es_user');
    window.location.href = '../Pages/login.html';
}

// ── Subject rows ──────────────────────────────────────────────────────────
let subjectCount = 0;

function addSubjectRow(subDefault = '', marksDefault = '') {
    if (subjectCount >= 8) { toast('Maximum 8 subjects allowed.', 'warn'); return; }
    subjectCount++;
    const idx = subjectCount;
    const div = document.createElement('div');
    div.id = 'subRow' + idx;
    div.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:0 16px;margin-bottom:10px;';
    div.innerHTML = `
      <input type="text" class="sub-name" placeholder="Subject ${idx} name" value="${subDefault}"
        style="background:rgba(255,255,255,0.04);border:1px solid var(--clr-border-lg);border-radius:8px;padding:9px 12px;color:var(--clr-text);font-size:0.875rem;outline:none;width:100%;" />
      <input type="number" class="sub-marks" placeholder="0–100" min="0" max="100" value="${marksDefault}"
        style="background:rgba(255,255,255,0.04);border:1px solid var(--clr-border-lg);border-radius:8px;padding:9px 12px;color:var(--clr-text);font-size:0.875rem;outline:none;width:100%;" />
    `;
    document.getElementById('subjectRows').appendChild(div);
}

// Init with 5 rows
for (let i = 0; i < 5; i++) addSubjectRow();

// ── Save Marks (API) ──────────────────────────────────────────────────────
async function saveMarks() {
    const roll = document.getElementById('e_roll').value.trim();
    if (!roll) { toast('Enter a roll number.', 'error'); return; }

    const subs  = [...document.querySelectorAll('.sub-name')].map(el => el.value.trim());
    const marks = [...document.querySelectorAll('.sub-marks')].map(el => el.value);

    if (!subs[0]) { toast('Enter at least one subject name.', 'error'); return; }

    // API supports exactly 5 subjects — pad or trim to 5
    const pad = (arr) => [...arr, '', '', '', '', ''].slice(0, 5);
    const s = pad(subs);
    const m = pad(marks);

    try {
        const result = await api.saveMarks({
            rollno: roll,
            s1: s[0], s2: s[1], s3: s[2], s4: s[3], s5: s[4],
            m1: m[0], m2: m[1], m3: m[2], m4: m[3], m5: m[4],
        });
        if (result.success) {
            toast('Marks saved for Roll No ' + roll + '!', 'success');
            document.getElementById('totalMarked').textContent =
                parseInt(document.getElementById('totalMarked').textContent || 0) + 1;
            await loadAllRecords();
        } else {
            toast(result.error || 'Error saving marks.', 'error');
        }
    } catch (e) {
        toast('Server error. Please try again.', 'error');
    }
}

// ── Search Result (API) ───────────────────────────────────────────────────
async function searchResult() {
    const roll = document.getElementById('resultRoll').value.trim();
    if (!roll) { toast('Enter a roll number.', 'error'); return; }

    const area = document.getElementById('resultArea');
    area.innerHTML = `<div style="color:var(--clr-muted);padding:16px;">Loading…</div>`;

    try {
        const rec = await api.getMarks(roll);
        if (!rec || !rec.subjects || !rec.marks) {
            area.innerHTML = `<div class="empty-state"><i class="fa-solid fa-circle-exclamation"></i>
              <div class="empty-state__title">No results found</div>
              <div class="empty-state__sub">No marks entry for Roll No ${roll}. Please enter marks first.</div></div>`;
            return;
        }

        const subs  = [rec.subjects.s1, rec.subjects.s2, rec.subjects.s3, rec.subjects.s4, rec.subjects.s5];
        const mks   = [rec.marks.m1,    rec.marks.m2,    rec.marks.m3,    rec.marks.m4,    rec.marks.m5];
        const total = mks.reduce((a, b) => a + (parseInt(b) || 0), 0);
        const count = mks.filter(m => m && m !== '').length;
        const max   = count * 100;
        const pct   = max ? Math.round(total / max * 100) : 0;

        const rows = subs.map((s, i) => s ? `
          <div class="result-row">
            <span class="result-sub">${s}</span>
            <span class="result-marks ${gradeColor(mks[i])}">${mks[i] || '—'}</span>
          </div>` : '').join('');

        area.innerHTML = `
          <div class="result-card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
              <div>
                <div style="font-size:0.75rem;color:var(--clr-muted);text-transform:uppercase;letter-spacing:1px;">Examination Result</div>
                <div style="font-size:1.2rem;font-weight:800;color:var(--clr-white);margin-top:4px;">Roll No: <span style="color:var(--clr-teal)">${roll}</span></div>
              </div>
              <div style="text-align:right;">
                <div style="font-size:2rem;font-weight:800;color:${pct >= 60 ? 'var(--clr-lime)' : pct >= 40 ? 'var(--clr-gold)' : '#ff8080'}">${pct}%</div>
                <span class="badge ${pct >= 60 ? 'badge-green' : pct >= 40 ? 'badge-gold' : 'badge-red'}">${pct >= 60 ? 'PASS' : pct >= 40 ? 'AVERAGE' : 'FAIL'}</span>
              </div>
            </div>
            ${rows}
            <div class="total-row"><span>Total Marks</span><span>${total} / ${max}</span></div>
          </div>`;
    } catch (e) {
        area.innerHTML = `<div class="empty-state"><i class="fa-solid fa-circle-xmark"></i>
          <div class="empty-state__title">Error fetching result</div>
          <div class="empty-state__sub">${e.message}</div></div>`;
    }
}

// ── All Records (API) ─────────────────────────────────────────────────────
let allMarksCache = [];

async function loadAllRecords() {
    // Called after saveMarks() — silently refreshes the cache in the background
    // so "All Records" tab is up-to-date when the user switches to it.
    try {
        const students = await api.getStudents();
        const results = await Promise.all(
            students.map(s => api.getMarks(s.rollno).catch(() => null))
        );
        allMarksCache = results
            .filter(r => r && r.subjects && r.marks)
            .map(r => ({
                rollno:   r.rollno,
                subjects: [r.subjects.s1, r.subjects.s2, r.subjects.s3, r.subjects.s4, r.subjects.s5],
                marks:    [r.marks.m1,    r.marks.m2,    r.marks.m3,    r.marks.m4,    r.marks.m5],
            }));
        document.getElementById('totalMarked').textContent = allMarksCache.length;
        renderAllRecords();
    } catch (e) {
        // Non-fatal — just re-render whatever we have
        renderAllRecords();
    }
}

function renderAllRecords() {
    const q = (document.getElementById('allSearch').value || '').toLowerCase();
    const data = allMarksCache.filter(r => !q || r.rollno.toLowerCase().includes(q));
    document.getElementById('allRecordsBody').innerHTML = data.length
        ? data.map((r, i) => `
          <tr>
            <td style="color:var(--clr-muted)">${i + 1}</td>
            <td><code style="color:var(--clr-teal)">${r.rollno}</code></td>
            ${[0,1,2,3,4].map(j => `<td>
              <span style="color:var(--clr-text);font-size:0.82rem">${r.subjects[j] || '—'}</span><br>
              <strong class="${gradeColor(r.marks[j])}">${r.marks[j] || '—'}</strong>
            </td>`).join('')}
            <td><strong style="color:var(--clr-white)">${r.marks.reduce((a,b) => a+(parseInt(b)||0), 0)}</strong></td>
          </tr>`).join('')
        : `<tr><td colspan="8" style="text-align:center;padding:32px;color:var(--clr-muted);">No records found</td></tr>`;
}

// ── Tab: "All Records" — load from students list then fetch each result ───
async function loadAllMarksTab() {
    document.getElementById('allRecordsBody').innerHTML =
        `<tr><td colspan="8" style="text-align:center;padding:24px;color:var(--clr-muted);">Loading…</td></tr>`;
    try {
        const students = await api.getStudents();
        const results = await Promise.all(
            students.map(s => api.getMarks(s.rollno).catch(() => null))
        );
        allMarksCache = results
            .filter(r => r && r.subjects && r.marks)
            .map(r => ({
                rollno:   r.rollno,
                subjects: [r.subjects.s1, r.subjects.s2, r.subjects.s3, r.subjects.s4, r.subjects.s5],
                marks:    [r.marks.m1,    r.marks.m2,    r.marks.m3,    r.marks.m4,    r.marks.m5],
            }));
        document.getElementById('totalMarked').textContent = allMarksCache.length;
        renderAllRecords();
    } catch (e) {
        document.getElementById('allRecordsBody').innerHTML =
            `<tr><td colspan="8" style="text-align:center;padding:24px;color:#ff8080;">Failed to load records.</td></tr>`;
    }
}

// ── Helpers ───────────────────────────────────────────────────────────────
function gradeColor(m) {
    const n = parseInt(m);
    if (n >= 75) return 'grade-a';
    if (n >= 60) return 'grade-b';
    if (n >= 40) return 'grade-c';
    return 'grade-f';
}

function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach((b, i) => {
        const tabs = ['enter', 'result', 'all'];
        b.classList.toggle('active', tabs[i] === tab);
    });
    document.querySelectorAll('.pane').forEach(p => p.classList.remove('active'));
    document.getElementById('pane-' + tab).classList.add('active');
    if (tab === 'all') loadAllMarksTab();
}

function toast(msg, type = 'success') {
    const c = document.getElementById('toastContainer');
    const t = document.createElement('div');
    const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', warn: 'fa-triangle-exclamation' };
    t.className = `toast toast--${type}`;
    t.innerHTML = `<i class="fa-solid ${icons[type]} toast__icon" style="color:${type === 'success' ? 'var(--clr-lime)' : type === 'error' ? '#ff6b6b' : 'var(--clr-gold)'}"></i><span class="toast__msg">${msg}</span>`;
    c.appendChild(t); setTimeout(() => t.remove(), 3500);
}


if (location.hash === '#result') switchTab('result');
if (location.hash === '#marks')  switchTab('enter');