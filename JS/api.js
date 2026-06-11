
const API_BASE = window.EDUSPHERE_API_URL || 'https://edusphere-api.onrender.com/api';

const api = {

    /** Login */
    login: (username, password) =>
        post(`${API_BASE}/login`, { username, password }),

    /** Students */
    getStudents: () => get(`${API_BASE}/students`),
    addStudent:  (data) => post(`${API_BASE}/students`, data),
    updateStudent: (data) => put(`${API_BASE}/students?rollno=${encodeURIComponent(data.rollno)}`, data),
    deleteStudent: (rollno) => del(`${API_BASE}/students?rollno=${encodeURIComponent(rollno)}`),

    /** Teachers */
    getTeachers: () => get(`${API_BASE}/teachers`),
    addTeacher:  (data) => post(`${API_BASE}/teachers`, data),
    updateTeacher: (data) => put(`${API_BASE}/teachers?emp_id=${encodeURIComponent(data.emp_id)}`, data),
    deleteTeacher: (emp_id) => del(`${API_BASE}/teachers?emp_id=${encodeURIComponent(emp_id)}`),

    /** Attendance */
    getAttendance: (type) => get(`${API_BASE}/attendance?type=${type}`),
    markAttendance: (type, id, first, second) =>
        post(`${API_BASE}/attendance`, { type, id, first, second }),

    /** Marks */
    getMarks: (rollno) => get(`${API_BASE}/marks?rollno=${encodeURIComponent(rollno)}`),
    saveMarks: (data)  => post(`${API_BASE}/marks`, data),

    /** Fees */
    getFees:    (rollno) => rollno
        ? get(`${API_BASE}/fees?rollno=${encodeURIComponent(rollno)}`)
        : get(`${API_BASE}/fees`),
    recordFee:  (data) => post(`${API_BASE}/fees`, data),

    /** Dashboard stats */
    getStats: () => get(`${API_BASE}/stats`),
};

/* ── HTTP helpers ─────────────────────────────────────────────────────────── */

async function get(url) {
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    return res.json();
}

async function post(url, data) {
    const body = new URLSearchParams(data);
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
    });
    return res.json();
}

async function put(url, data) {
    const body = new URLSearchParams(data);
    const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
    });
    return res.json();
}

async function del(url) {
    const res = await fetch(url, { method: 'DELETE' });
    return res.json();
}
