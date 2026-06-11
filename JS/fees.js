
// ── Auth Guard ──────────────────────────────────────────────────────────
if (!sessionStorage.getItem('es_user') && !localStorage.getItem('es_user')) {
    window.location.href = 'login.html';
}

// ── Sidebar ──────────────────────────────────────────────────────────────
const shell = document.getElementById('appShell');
document.getElementById('sidebarToggle').addEventListener('click', () => {
    shell.classList.toggle('collapsed');
});

function logout() {
    sessionStorage.removeItem('es_user');
    localStorage.removeItem('es_user');
    window.location.href = 'login.html';
}

// ── State ─────────────────────────────────────────────────────────────────
let allPayments   = [];   // raw from API
let filteredPay   = [];
let filteredDef   = [];
let payPage = 1, defPage = 1;
const PER_PAGE = 8;

// ── Boot ──────────────────────────────────────────────────────────────────
async function init() {
    await loadFees();
    renderPayments();
    renderDefaulters();
}

async function loadFees() {
    try {
        allPayments = await api.getFees();
        filteredPay = [...allPayments];
        // Defaulters = students whose fee_paid is 0 or missing
        filteredDef = allPayments.filter(r => !r.fee_paid || parseInt(r.fee_paid) === 0);
        updateSummaryCards();
    } catch (e) {
        showToast('Could not load fee records from server.', 'error');
    }
}

function updateSummaryCards() {
    // Update "Payments This Month" count with actual record count
    const countCards = document.querySelectorAll('.fee-summary-card__value');
    if (countCards[3]) countCards[3].textContent = allPayments.length;
}

// ── Render Payments ───────────────────────────────────────────────────────
function renderPayments() {
    const start = (payPage - 1) * PER_PAGE;
    const slice = filteredPay.slice(start, start + PER_PAGE);

    document.getElementById('payCount').textContent =
        `Showing ${filteredPay.length} record${filteredPay.length !== 1 ? 's' : ''}`;

    document.getElementById('payTableBody').innerHTML = slice.length === 0
        ? `<tr><td colspan="8" style="text-align:center;padding:32px;color:var(--clr-muted)">
             <i class="fa-solid fa-circle-xmark"></i> No records found</td></tr>`
        : slice.map((r, i) => `
          <tr>
            <td>
              <div style="display:flex;align-items:center;gap:10px">
                <div class="avatar-sm">${initials(r.name || r.rollno)}</div>
                <span>${r.name || '—'}</span>
              </div>
            </td>
            <td style="color:var(--clr-teal);font-family:monospace">${r.rollno}</td>
            <td><span class="badge badge-teal">${r.course || '—'}</span></td>
            <td style="color:var(--clr-muted);font-size:0.82rem">${r.branch || '—'}</td>
            <td>${r.semester || '—'}</td>
            <td style="color:var(--clr-lime);font-weight:700">
              ₹${parseInt(r.fee_paid || 0).toLocaleString('en-IN')}
            </td>
            <td>
              <span class="badge ${parseInt(r.fee_paid) > 0 ? 'badge-green' : 'badge-gold'}">
                ${parseInt(r.fee_paid) > 0 ? 'Paid' : 'Pending'}
              </span>
            </td>
            <td>
              <div class="action-cell">
                <button class="tbl-btn tbl-btn--view" onclick="viewReceipt(${start + i})">
                  <i class="fa-solid fa-receipt"></i> Receipt
                </button>
              </div>
            </td>
          </tr>`).join('');

    renderPagination('payPagination', filteredPay.length, payPage, pg => { payPage = pg; renderPayments(); });
}

// ── Render Defaulters ─────────────────────────────────────────────────────
function renderDefaulters() {
    const start = (defPage - 1) * PER_PAGE;
    const slice = filteredDef.slice(start, start + PER_PAGE);

    document.getElementById('defTableBody').innerHTML = slice.length === 0
        ? `<tr><td colspan="8" style="text-align:center;padding:32px;color:var(--clr-muted)">
             <i class="fa-solid fa-circle-check"></i> No defaulters found</td></tr>`
        : slice.map((r, i) => `
          <tr>
            <td>
              <div style="display:flex;align-items:center;gap:10px">
                <div class="avatar-sm" style="background:linear-gradient(135deg,#ff6b6b,#ffa500)">
                  ${initials(r.name || r.rollno)}
                </div>
                <span>${r.name || '—'}</span>
              </div>
            </td>
            <td style="color:var(--clr-teal);font-family:monospace">${r.rollno}</td>
            <td><span class="badge badge-teal">${r.course || '—'}</span></td>
            <td>${r.semester || '—'}</td>
            <td style="color:#ff8080;font-weight:700">₹0</td>
            <td style="color:var(--clr-muted);font-size:0.82rem">—</td>
            <td><span class="badge badge-gold">Pending</span></td>
            <td>
              <div class="action-cell">
                <button class="tbl-btn tbl-btn--view" onclick="sendReminder('${r.name || r.rollno}')">
                  <i class="fa-solid fa-paper-plane"></i> Remind
                </button>
              </div>
            </td>
          </tr>`).join('');

    renderPagination('defPagination', filteredDef.length, defPage, pg => { defPage = pg; renderDefaulters(); });
}

// ── Pagination ────────────────────────────────────────────────────────────
function renderPagination(containerId, total, currentPage, callback) {
    const pages = Math.ceil(total / PER_PAGE);
    const el = document.getElementById(containerId);
    if (pages <= 1) { el.innerHTML = ''; return; }
    let html = `<button class="page-btn" ${currentPage === 1 ? 'disabled' : ''}
        onclick="(${callback.toString()})(${currentPage - 1})">
        <i class="fa-solid fa-chevron-left"></i></button>`;
    for (let p = 1; p <= pages; p++) {
        html += `<button class="page-btn ${p === currentPage ? 'active' : ''}"
            onclick="(${callback.toString()})(${p})">${p}</button>`;
    }
    html += `<button class="page-btn" ${currentPage === pages ? 'disabled' : ''}
        onclick="(${callback.toString()})(${currentPage + 1})">
        <i class="fa-solid fa-chevron-right"></i></button>`;
    el.innerHTML = html;
}

// ── Filter Payments ───────────────────────────────────────────────────────
function filterPayments() {
    const q      = document.getElementById('paySearch').value.toLowerCase();
    const course = document.getElementById('payFilterCourse').value;
    const sem    = document.getElementById('payFilterSem').value;
    filteredPay = allPayments.filter(r =>
        (!q || (r.name||'').toLowerCase().includes(q) || (r.rollno||'').includes(q)) &&
        (!course || r.course === course) &&
        (!sem || r.semester === sem)
    );
    payPage = 1;
    renderPayments();
}

// ── Filter Defaulters ─────────────────────────────────────────────────────
function filterDefaulters() {
    const q      = document.getElementById('defSearch').value.toLowerCase();
    const course = document.getElementById('defCourse').value;
    const base   = allPayments.filter(r => !r.fee_paid || parseInt(r.fee_paid) === 0);
    filteredDef = base.filter(r =>
        (!q || (r.name||'').toLowerCase().includes(q) || (r.rollno||'').includes(q)) &&
        (!course || r.course === course)
    );
    defPage = 1;
    renderDefaulters();
}

// ── View Receipt ──────────────────────────────────────────────────────────
function viewReceipt(idx) {
    const r = filteredPay[idx];
    const receiptNo = 'ESR-' + r.rollno + '-' + (r.semester || '').replace(/\D/g, '');
    document.getElementById('receiptContent').innerHTML = `
      <div style="text-align:center;margin-bottom:16px">
        <div style="font-size:0.75rem;letter-spacing:1.5px;text-transform:uppercase;color:var(--clr-muted);margin-bottom:4px">
          EduSphere — Fee Receipt</div>
        <div style="font-size:0.82rem;color:var(--clr-teal)">Receipt No: <strong>${receiptNo}</strong></div>
      </div>
      <div class="receipt-row"><span>Student Name</span><span>${r.name || '—'}</span></div>
      <div class="receipt-row"><span>Father's Name</span><span>${r.fathers_name || '—'}</span></div>
      <div class="receipt-row"><span>Roll Number</span><span>${r.rollno}</span></div>
      <div class="receipt-row"><span>Course</span><span>${r.course || '—'}</span></div>
      <div class="receipt-row"><span>Branch</span><span>${r.branch || '—'}</span></div>
      <div class="receipt-row"><span>Semester</span><span>${r.semester || '—'}</span></div>
      <div class="receipt-total"><span>Amount Paid</span>
        <span>₹${parseInt(r.fee_paid || 0).toLocaleString('en-IN')}</span></div>`;
    openModal('receiptModal');
}

// ── Submit Payment (API) ──────────────────────────────────────────────────
async function submitPayment() {
    const rollno  = document.getElementById('f_rollno').value.trim();
    const name    = document.getElementById('f_name').value.trim();
    const father  = document.getElementById('f_father').value.trim();
    const course  = document.getElementById('f_course').value;
    const branch  = document.getElementById('f_branch').value;
    const sem     = document.getElementById('f_sem').value;
    const amount  = document.getElementById('f_amount').value;

    const alertEl = document.getElementById('modalAlert');
    if (!rollno || !name || !course || !sem || !amount) {
        alertEl.style.display = 'flex';
        alertEl.className = 'toast toast--error';
        alertEl.innerHTML = '<i class="fa-solid fa-circle-xmark toast__icon"></i><span class="toast__msg">Please fill all required fields (*)</span>';
        return;
    }

    try {
        const result = await api.recordFee({
            rollno,
            name,
            fathers_name: father,
            course,
            branch: branch || 'Other',
            semester: sem,
            fee_paid: amount,
        });

        if (result.success) {
            alertEl.style.display = 'none';
            ['f_rollno','f_name','f_father','f_amount'].forEach(id => document.getElementById(id).value = '');
            document.getElementById('f_course').value = '';
            document.getElementById('f_branch').value = '';
            document.getElementById('f_sem').value    = '';
            closeModal('payModal');
            showToast(`Payment of ₹${parseInt(amount).toLocaleString('en-IN')} recorded for ${name}`, 'success');
            await loadFees();
            renderPayments();
            renderDefaulters();
        } else {
            alertEl.style.display = 'flex';
            alertEl.className = 'toast toast--error';
            alertEl.innerHTML = `<i class="fa-solid fa-circle-xmark toast__icon"></i><span class="toast__msg">${result.error || 'Error saving payment.'}</span>`;
        }
    } catch (e) {
        showToast('Server error. Please try again.', 'error');
    }
}

// ── Send Reminder ─────────────────────────────────────────────────────────
function sendReminder(name) {
    showToast(`Reminder sent to ${name}`, 'warn');
}

// ── Export CSV ────────────────────────────────────────────────────────────
function exportCSV() {
    const headers = ['Name','Roll No','Father\'s Name','Course','Branch','Semester','Fee Paid'];
    const rows = allPayments.map(r =>
        [r.name, r.rollno, r.fathers_name, r.course, r.branch, r.semester, r.fee_paid]
    );
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'edusphere_fees.csv';
    a.click();
    showToast('CSV exported successfully', 'success');
}

// ── Modal helpers ─────────────────────────────────────────────────────────
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.getElementById('openPayModal').addEventListener('click', () => openModal('payModal'));

// ── Tabs ──────────────────────────────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
        btn.classList.add('active');
        document.getElementById('tab-' + btn.dataset.tab).style.display = 'block';
    });
});

// ── Helpers ───────────────────────────────────────────────────────────────
function initials(name) {
    return (name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function showToast(msg, type = 'success') {
    const icons = { success: 'fa-circle-check text-lime', error: 'fa-circle-xmark', warn: 'fa-triangle-exclamation text-gold' };
    const tc = document.getElementById('toastContainer');
    const t  = document.createElement('div');
    t.className = `toast toast--${type}`;
    t.innerHTML = `<i class="fa-solid ${icons[type]} toast__icon"></i><span class="toast__msg">${msg}</span>`;
    tc.appendChild(t);
    setTimeout(() => t.remove(), 3500);
}

// ── Deep-links ────────────────────────────────────────────────────────────
if (location.hash === '#pay')       { openModal('payModal'); }
if (location.hash === '#structure') { document.querySelector('[data-tab="structure"]').click(); }

// ── Init ──────────────────────────────────────────────────────────────────
init();