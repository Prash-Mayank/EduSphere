/**
 * attendance.js — EduSphere Attendance
 * Requires: <script src="../JS/api.js"></script> in <head>
 */

if (!sessionStorage.getItem('es_user') && !localStorage.getItem('es_user')) {
    window.location.href = '../Pages/login.html';
}

document.getElementById('sidebarToggle').addEventListener('click', () => {
    document.getElementById('appShell').classList.toggle('collapsed');
});

function logout() {
    sessionStorage.removeItem('es_user');
    localStorage.removeItem('es_user');
    window.location.href = '../Pages/login.html';
}

// ── Set today's date ────────────────────────────────────────────────────────
const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
document.getElementById('markDate').value   = today;
document.getElementById('markTDate').value  = today;

let studentAtt = [];
let teacherAtt = [];

// ── Parse the Java date string to YYYY-MM-DD ────────────────────────────────
// Java's new Date().toString() → "Fri Jun 12 10:30:00 IST 2026"
function javaDateToISO(javaDateStr) {
    if (!javaDateStr) return '';
    try {
        // Try parsing directly first (works for many formats)
        const d = new Date(javaDateStr);
        if (!isNaN(d)) {
            return d.toISOString().split('T')[0]; // "YYYY-MM-DD"
        }
    } catch (e) {}
    return javaDateStr; // fallback: return as-is
}

// ── Populate dropdowns from API ─────────────────────────────────────────────
async function populateDropdowns() {
    try {
        const students = await api.getStudents();
        const sel = document.getElementById('markRoll');
        students.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.rollno;
            opt.textContent = `${s.rollno} — ${s.name}`;
            sel.appendChild(opt);
        });
    } catch (e) {
        toast('Could not load student list.', 'error');
    }

    try {
        const teachers = await api.getTeachers();
        const tsel = document.getElementById('markEmpId');
        teachers.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.emp_id;
            opt.textContent = `${t.emp_id} — ${t.name}`;
            tsel.appendChild(opt);
        });
    } catch (e) {
        toast('Could not load faculty list.', 'error');
    }
}

// ── Load existing attendance records ────────────────────────────────────────
async function loadAttendance() {
    try {
        const rawStudent = await api.getAttendance('student');
        const rawTeacher = await api.getAttendance('teacher');

        // Normalise: convert Java date string → ISO date, keep original too
        studentAtt = rawStudent.map(r => ({
            ...r,
            dateISO: javaDateToISO(r.date),
        }));
        teacherAtt = rawTeacher.map(r => ({
            ...r,
            dateISO: javaDateToISO(r.date),
        }));

        updateSummary();
        renderAttendance();
        renderTeacherAtt();
    } catch (e) {
        toast('Could not load attendance records.', 'error');
    }
}

// ── Mark attendance ─────────────────────────────────────────────────────────
async function markAttendance(type) {
    if (type === 'student') {
        const id = document.getElementById('markRoll').value;
        if (!id) { toast('Select a student first.', 'error'); return; }
        const first  = document.getElementById('markFirst').value;
        const second = document.getElementById('markSecond').value;
        try {
            const result = await api.markAttendance('student', id, first, second);
            if (result.success) {
                toast('Student attendance marked!', 'success');
                await loadAttendance();
            } else {
                toast(result.error || 'Error saving attendance.', 'error');
            }
        } catch (e) {
            toast('Server error. Please try again.', 'error');
        }
    } else {
        const id = document.getElementById('markEmpId').value;
        if (!id) { toast('Select a faculty member first.', 'error'); return; }
        const first  = document.getElementById('markTFirst').value;
        const second = document.getElementById('markTSecond').value;
        try {
            const result = await api.markAttendance('teacher', id, first, second);
            if (result.success) {
                toast('Faculty attendance marked!', 'success');
                await loadAttendance();
            } else {
                toast(result.error || 'Error saving attendance.', 'error');
            }
        } catch (e) {
            toast('Server error. Please try again.', 'error');
        }
    }
}

// ── Update summary boxes (today's counts) ──────────────────────────────────
function updateSummary() {
    const todays = studentAtt.filter(r => r.dateISO === today);
    document.getElementById('presentCount').textContent = todays.filter(r => r.first === 'Present').length;
    document.getElementById('absentCount').textContent  = todays.filter(r => r.first === 'Absent').length;
    document.getElementById('leaveCount').textContent   = todays.filter(r => r.first === 'Leave').length;
}

// ── Status badge ─────────────────────────────────────────────────────────────
function statusBadge(s) {
    const map = { Present: 'present', Absent: 'absent', Leave: 'leave' };
    return `<span class="status-badge status-${map[s] || 'present'}">${s || ''}</span>`;
}

// ── Render student attendance table ─────────────────────────────────────────
function renderAttendance() {
    const q = (document.getElementById('viewSearch').value || '').toLowerCase();
    const d = document.getElementById('viewDate').value; // YYYY-MM-DD or ''
    const data = studentAtt.filter(r =>
        (!q || (r.id || '').toLowerCase().includes(q)) &&
        (!d || r.dateISO === d)
    );
    document.getElementById('attendanceBody').innerHTML = data.length
        ? data.map((r, i) => `
          <tr>
            <td style="color:var(--clr-muted)">${i + 1}</td>
            <td><code style="color:var(--clr-teal)">${r.id || ''}</code></td>
            <td style="color:var(--clr-muted);font-size:0.82rem">${r.date || ''}</td>
            <td>${statusBadge(r.first)}</td>
            <td>${statusBadge(r.second)}</td>
          </tr>`).join('')
        : `<tr><td colspan="5" style="text-align:center;padding:32px;color:var(--clr-muted);">No records found</td></tr>`;
}

// ── Render teacher attendance table ─────────────────────────────────────────
function renderTeacherAtt() {
    document.getElementById('teacherAttBody').innerHTML = teacherAtt.length
        ? teacherAtt.slice(0, 20).map((r, i) => `
          <tr>
            <td style="color:var(--clr-muted)">${i + 1}</td>
            <td><code style="color:var(--clr-teal)">${r.id || ''}</code></td>
            <td style="color:var(--clr-muted);font-size:0.82rem">${r.date || ''}</td>
            <td>${statusBadge(r.first)}</td>
            <td>${statusBadge(r.second)}</td>
          </tr>`).join('')
        : `<tr><td colspan="5" style="text-align:center;padding:32px;color:var(--clr-muted);">No records yet</td></tr>`;
}

// ── Tab switching ─────────────────────────────────────────────────────────────
function switchTab(tab) {
    const tabNames = ['mark', 'view', 'teacher'];
    document.querySelectorAll('.tab-btn').forEach((b, i) => {
        b.classList.toggle('active', tabNames[i] === tab);
    });
    document.querySelectorAll('.pane').forEach(p => p.classList.remove('active'));
    document.getElementById('pane-' + tab).classList.add('active');

    // Re-render when switching to view tabs to pick up any filter changes
    if (tab === 'view')    renderAttendance();
    if (tab === 'teacher') renderTeacherAtt();
}

// ── Export CSV ────────────────────────────────────────────────────────────────
function exportAttendance() {
    const rows = [['Roll No', 'Date', 'First Half', 'Second Half']];
    studentAtt.forEach(r => rows.push([r.id, r.date, r.first, r.second]));
    const csv = rows.map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv,' + encodeURIComponent(csv);
    a.download = 'attendance.csv';
    a.click();
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function toast(msg, type = 'success') {
    const c = document.getElementById('toastContainer');
    const t = document.createElement('div');
    const icons = {
        success: 'fa-circle-check',
        error:   'fa-circle-xmark',
        warn:    'fa-triangle-exclamation',
    };
    t.className = `toast toast--${type}`;
    t.innerHTML = `<i class="fa-solid ${icons[type]} toast__icon" style="color:${
        type === 'success' ? 'var(--clr-lime)' : type === 'error' ? '#ff6b6b' : 'var(--clr-gold)'
    }"></i><span class="toast__msg">${msg}</span>`;
    c.appendChild(t);
    setTimeout(() => t.remove(), 3500);
}

// ── Boot ──────────────────────────────────────────────────────────────────────
populateDropdowns();
loadAttendance();