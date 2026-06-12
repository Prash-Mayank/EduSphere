/**
 * teachers.js — EduSphere Faculty Management
 * Add <script src="../JS/api.js"></script> in <head>
 * Replace the <script> block in teachers.html with:
 *   <script src="../JS/teachers.js"></script>
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

let teachers = [];
let currentPage = 1;
const pageSize = 10;
let editingEmpId = null;

async function loadTeachers() {
    try {
        teachers = await api.getTeachers();
        renderTable();
        const card = document.querySelector('.stat-card__value');
        if (card) card.textContent = teachers.length;
    } catch (e) {
        toast('Failed to load faculty from server.', 'error');
    }
}

function getFiltered() {
    const q = (document.getElementById('searchInput').value || '').toLowerCase();
    const d = document.getElementById('filterDept').value;
    return teachers.filter(t =>
        (!q || (t.name||'').toLowerCase().includes(q) ||
                (t.emp_id||'').includes(q) ||
                (t.email||'').toLowerCase().includes(q)) &&
        (!d || t.dept === d)
    );
}

function renderTable() {
    const data = getFiltered();
    const start = (currentPage - 1) * pageSize;
    const page = data.slice(start, start + pageSize);

    document.getElementById('tableBody').innerHTML = page.length === 0
        ? `<tr><td colspan="7" style="text-align:center;color:var(--clr-muted);padding:40px;">No faculty found.</td></tr>`
        : page.map((t, i) => `
      <tr>
        <td style="color:var(--clr-muted)">${start + i + 1}</td>
        <td>
          <div style="display:flex;align-items:center;gap:10px;">
            <div class="avatar-sm">${(t.name||'?').replace(/Dr\. |Prof\. /,'').charAt(0)}</div>
            <div>
              <div style="font-weight:600;color:var(--clr-white)">${t.name||''}</div>
              <div style="font-size:0.75rem;color:var(--clr-muted)">${t.email||''}</div>
            </div>
          </div>
        </td>
        <td><code style="color:var(--clr-teal);font-size:0.82rem">${t.emp_id||''}</code></td>
        <td><span class="badge badge-blue">${t.course||''}</span></td>
        <td><span style="color:var(--clr-muted);font-size:0.85rem">${t.dept||''}</span></td>
        <td>${t.phone||''}</td>
        <td>
          <div class="action-cell">
            <button class="tbl-btn tbl-btn--edit" onclick="openModal('edit','${t.emp_id}')"><i class="fa-solid fa-pen"></i> Edit</button>
            <button class="tbl-btn tbl-btn--del"  onclick="deleteTeacher('${t.emp_id}')"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>`).join('');

    document.getElementById('tableInfo').textContent =
        `Showing ${Math.min(start+1, data.length)}–${Math.min(start+pageSize, data.length)} of ${data.length}`;
    document.getElementById('pageNum').textContent = currentPage;
}

function filterTable() { currentPage = 1; renderTable(); }
function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('filterDept').value = '';
    filterTable();
}
function changePage(d) {
    const total = Math.ceil(getFiltered().length / pageSize);
    currentPage = Math.max(1, Math.min(total, currentPage + d));
    renderTable();
}

function genEmpId() { return '101' + String(Math.floor(1000 + Math.random() * 9000)); }

function openModal(mode, emp_id) {
    document.getElementById('teacherModal').classList.add('open');
    if (mode === 'add') {
        editingEmpId = null;
        document.getElementById('modalTitle').innerHTML =
            '<i class="fa-solid fa-user-tie" style="color:var(--clr-teal)"></i> Add New Faculty';
        ['f_name','f_father','f_age','f_dob','f_address','f_phone',
         'f_email','f_aadhar','f_x','f_xii','f_edu','f_dept'].forEach(id => {
            const el = document.getElementById(id); if (el) el.value = '';
        });
        document.getElementById('f_empid').value = genEmpId();
    } else {
        editingEmpId = emp_id;
        const t = teachers.find(x => x.emp_id === emp_id);
        document.getElementById('modalTitle').innerHTML =
            '<i class="fa-solid fa-pen" style="color:var(--clr-teal)"></i> Edit Faculty';
        document.getElementById('f_name').value    = t.name || '';
        document.getElementById('f_father').value  = t.fathers_name || '';
        document.getElementById('f_age').value     = t.age || '';
        document.getElementById('f_dob').value     = t.dob || '';
        document.getElementById('f_address').value = t.address || '';
        document.getElementById('f_phone').value   = t.phone || '';
        document.getElementById('f_email').value   = t.email || '';
        document.getElementById('f_aadhar').value  = t.aadhar || '';
        document.getElementById('f_x').value       = t.class_x || '';
        document.getElementById('f_xii').value     = t.class_xii || '';
        document.getElementById('f_edu').value     = t.course || '';
        document.getElementById('f_dept').value    = t.dept || '';
        document.getElementById('f_empid').value   = t.emp_id || '';
    }
}

function closeModal() { document.getElementById('teacherModal').classList.remove('open'); }

async function saveFaculty() {
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
        course:       document.getElementById('f_edu').value,
        dept:         document.getElementById('f_dept').value,
        emp_id:       document.getElementById('f_empid').value,
    };
    if (!data.name) { toast('Please enter a name.', 'error'); return; }

    try {
        const result = editingEmpId
            ? await api.updateTeacher(data)
            : await api.addTeacher(data);

        if (result.success) {
            toast(editingEmpId ? 'Faculty updated!' : 'Faculty added!', 'success');
            closeModal();
            await loadTeachers();
        } else {
            toast(result.error || 'Error saving faculty.', 'error');
        }
    } catch (e) {
        toast('Server error. Please try again.', 'error');
    }
}

async function deleteTeacher(emp_id) {
    if (!confirm('Delete this faculty record?')) return;
    try {
        const result = await api.deleteTeacher(emp_id);
        if (result.success) {
            toast('Faculty record deleted.', 'warn');
            await loadTeachers();
        }
    } catch (e) {
        toast('Error deleting faculty.', 'error');
    }
}

function exportTable() {
    const rows = [['Name','Emp ID','Qualification','Department','Phone','Email']];
    teachers.forEach(t => rows.push([t.name, t.emp_id, t.course, t.dept, t.phone, t.email]));
    const csv = rows.map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv,' + encodeURIComponent(csv);
    a.download = 'faculty.csv'; a.click();
}

function toast(msg, type = 'success') {
    const c = document.getElementById('toastContainer');
    const t = document.createElement('div');
    const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', warn: 'fa-triangle-exclamation' };
    t.className = `toast toast--${type}`;
    t.innerHTML = `<i class="fa-solid ${icons[type]} toast__icon" style="color:${type==='success'?'var(--clr-lime)':type==='error'?'#ff6b6b':'var(--clr-gold)'}"></i><span class="toast__msg">${msg}</span>`;
    c.appendChild(t); setTimeout(() => t.remove(), 3500);
}

loadTeachers();
if (location.hash === '#add') openModal('add');