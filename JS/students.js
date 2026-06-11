

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

let students = [];
let currentPage = 1;
const pageSize = 10;
let editingRoll = null;

// ── Load from API ──────────────────────────────────────────────────────────
async function loadStudents() {
    try {
        students = await api.getStudents();
        renderTable();
        updateStatCards();
    } catch (e) {
        toast('Failed to load students from server.', 'error');
    }
}

function updateStatCards() {
    // Update "Total Enrolled" stat card
    const valueEl = document.querySelector('.stat-card__value');
    if (valueEl) valueEl.textContent = students.length;
}

function getFiltered() {
    const q = (document.getElementById('searchInput').value || '').toLowerCase();
    const c = document.getElementById('filterCourse').value;
    const b = document.getElementById('filterBranch').value;
    return students.filter(s =>
        (!q || (s.name||'').toLowerCase().includes(q) || (s.rollno||'').includes(q) || (s.email||'').toLowerCase().includes(q)) &&
        (!c || s.course === c) &&
        (!b || s.branch === b)
    );
}

function renderTable() {
    const data = getFiltered();
    const start = (currentPage - 1) * pageSize;
    const page = data.slice(start, start + pageSize);
    const tbody = document.getElementById('tableBody');
    if (page.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:var(--clr-muted);padding:40px;">No students found.</td></tr>`;
    } else {
        tbody.innerHTML = page.map((s, i) => `
          <tr>
            <td style="color:var(--clr-muted)">${start + i + 1}</td>
            <td>
              <div style="display:flex;align-items:center;gap:10px;">
                <div class="avatar-sm">${(s.name||'?').charAt(0)}</div>
                <div>
                  <div style="font-weight:600;color:var(--clr-white)">${s.name||''}</div>
                  <div style="font-size:0.75rem;color:var(--clr-muted)">${s.email||''}</div>
                </div>
              </div>
            </td>
            <td><code style="color:var(--clr-teal);font-size:0.82rem">${s.rollno||''}</code></td>
            <td><span class="badge badge-teal">${s.course||''}</span></td>
            <td><span style="color:var(--clr-muted);font-size:0.85rem">${s.branch||''}</span></td>
            <td>${s.phone||''}</td>
            <td>${s.email||''}</td>
            <td>
              <div class="action-cell">
                <button class="tbl-btn tbl-btn--edit" onclick="openModal('edit','${s.rollno}')"><i class="fa-solid fa-pen"></i> Edit</button>
                <button class="tbl-btn tbl-btn--del"  onclick="deleteStudent('${s.rollno}')"><i class="fa-solid fa-trash"></i></button>
              </div>
            </td>
          </tr>
        `).join('');
    }
    document.getElementById('tableInfo').textContent =
        `Showing ${Math.min(start + 1, data.length)}–${Math.min(start + pageSize, data.length)} of ${data.length}`;
    document.getElementById('pageNum').textContent = currentPage;
}

function filterTable() { currentPage = 1; renderTable(); }
function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('filterCourse').value = '';
    document.getElementById('filterBranch').value = '';
    filterTable();
}
function changePage(d) {
    const total = Math.ceil(getFiltered().length / pageSize);
    currentPage = Math.max(1, Math.min(total, currentPage + d));
    renderTable();
}

function genRoll() {
    return '1533' + String(Math.floor(Math.random() * 900) + 100);
}

function openModal(mode, rollno) {
    document.getElementById('studentModal').classList.add('open');
    if (mode === 'add') {
        editingRoll = null;
        document.getElementById('modalTitle').innerHTML =
            '<i class="fa-solid fa-user-plus" style="color:var(--clr-teal)"></i> Add New Student';
        ['f_name','f_father','f_age','f_dob','f_address','f_phone','f_email',
         'f_aadhar','f_x','f_xii','f_course','f_branch'].forEach(id => {
            const el = document.getElementById(id); if (el) el.value = '';
        });
        document.getElementById('f_roll').value = genRoll();
    } else {
        editingRoll = rollno;
        const s = students.find(x => x.rollno === rollno);
        document.getElementById('modalTitle').innerHTML =
            '<i class="fa-solid fa-pen" style="color:var(--clr-teal)"></i> Edit Student';
        document.getElementById('f_name').value    = s.name || '';
        document.getElementById('f_father').value  = s.fathers_name || '';
        document.getElementById('f_age').value     = s.age || '';
        document.getElementById('f_dob').value     = s.dob || '';
        document.getElementById('f_address').value = s.address || '';
        document.getElementById('f_phone').value   = s.phone || '';
        document.getElementById('f_email').value   = s.email || '';
        document.getElementById('f_aadhar').value  = s.aadhar || '';
        document.getElementById('f_x').value       = s.class_x || '';
        document.getElementById('f_xii').value     = s.class_xii || '';
        document.getElementById('f_course').value  = s.course || '';
        document.getElementById('f_branch').value  = s.branch || '';
        document.getElementById('f_roll').value    = s.rollno || '';
    }
}

function closeModal() { document.getElementById('studentModal').classList.remove('open'); }

async function saveStudent() {
    const data = {
        name:         document.getElementById('f_name').value.trim(),
        fathers_name: document.getElementById('f_father').value.trim(),
        age:          document.getElementById('f_age').value,
        dob:          document.getElementById('f_dob').value,
        address:      document.getElementById('f_address').value,
        phone:        document.getElementById('f_phone').value,
        email:        document.getElementById('f_email').value,
        aadhar:       document.getElementById('f_aadhar').value,
        class_x:      document.getElementById('f_x').value,
        class_xii:    document.getElementById('f_xii').value,
        course:       document.getElementById('f_course').value,
        branch:       document.getElementById('f_branch').value,
        rollno:       document.getElementById('f_roll').value,
    };
    if (!data.name) { toast('Please enter a name.', 'error'); return; }

    try {
        let result;
        if (editingRoll) {
            result = await api.updateStudent(data);
        } else {
            result = await api.addStudent(data);
        }
        if (result.success) {
            toast(editingRoll ? 'Student updated!' : 'Student added!', 'success');
            closeModal();
            await loadStudents();
        } else {
            toast(result.error || 'Error saving student.', 'error');
        }
    } catch (e) {
        toast('Server error. Please try again.', 'error');
    }
}

async function deleteStudent(rollno) {
    if (!confirm('Delete this student record?')) return;
    try {
        const result = await api.deleteStudent(rollno);
        if (result.success) {
            toast('Student deleted.', 'warn');
            await loadStudents();
        }
    } catch (e) {
        toast('Error deleting student.', 'error');
    }
}

function exportTable() {
    const rows = [['Name','Roll No','Course','Branch','Phone','Email']];
    students.forEach(s => rows.push([s.name, s.rollno, s.course, s.branch, s.phone, s.email]));
    const csv = rows.map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv,' + encodeURIComponent(csv);
    a.download = 'students.csv'; a.click();
}

function toast(msg, type = 'success') {
    const c = document.getElementById('toastContainer');
    const t = document.createElement('div');
    const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', warn: 'fa-triangle-exclamation' };
    t.className = `toast toast--${type}`;
    t.innerHTML = `<i class="fa-solid ${icons[type]} toast__icon" style="color:${type === 'success' ? 'var(--clr-lime)' : type === 'error' ? '#ff6b6b' : 'var(--clr-gold)'}"></i><span class="toast__msg">${msg}</span>`;
    c.appendChild(t); setTimeout(() => t.remove(), 3500);
}

// Boot
loadStudents();
if (location.hash === '#add') openModal('add');
