<div align="center">

<img src="Assets/logo.png" alt="EduSphere Logo" width="110" />

# EduSphere — Smart University Management System

[![Status](https://img.shields.io/badge/Status-Active-00c8c8?style=flat-square)](https://github.com)
[![Frontend](https://img.shields.io/badge/Frontend-HTML%20%7C%20CSS%20%7C%20JS-1a6bff?style=flat-square)](https://github.com)
[![Backend](https://img.shields.io/badge/Backend-Java%20%7C%20Swing-7fff4f?style=flat-square)](https://github.com)
[![Database](https://img.shields.io/badge/Database-MySQL-f0c040?style=flat-square)](https://github.com)
[![License](https://img.shields.io/badge/License-MIT-white?style=flat-square)](LICENSE)

A full-stack university management platform with a modern dark-themed web frontend and a Java Swing backend connected to MySQL — covering every core academic operation from admissions to fee collection.

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Database Setup](#1-database-setup)
  - [Backend (Java)](#2-backend-java)
  - [Frontend](#3-frontend)
- [Module Screenshots](#module-screenshots)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [Author](#author)
- [License](#license)

---

## Overview

EduSphere is a Smart University Management System built to streamline academic administration. It combines a responsive, dark-themed web dashboard (HTML/CSS/JavaScript) with a Java Swing desktop backend connected to a MySQL database — giving administrators a unified platform to manage students, faculty, attendance, examinations, and fee collection.

---

## Features

| Module                     | Capabilities                                                                     |
| -------------------------- | -------------------------------------------------------------------------------- |
| 🎓 **Student Management**  | Add, view, update, delete students — with roll number auto-generation            |
| 👨‍🏫 **Faculty Management**  | Add, view, update, delete faculty — with employee ID auto-generation             |
| 📅 **Attendance Tracking** | Mark student & teacher attendance (Present / Absent / Leave), view logs          |
| 📝 **Examination**         | Enter subject-wise marks, view results per student by roll number                |
| 💰 **Fee Management**      | Fee structure display, payment recording, defaulter tracking, receipt generation |
| 🔐 **Authentication**      | Login with username/password validated against MySQL `login` table               |
| 📊 **Dashboard**           | Live stats, module quick-access, activity feed, attendance ring, notice board    |

---

## Project Structure

```
EduSphere/
│
├── index.html                  # Main dashboard
├── README.md
├── .gitignore
│
├── Assets/
│   └── logo.png                # EduSphere brand logo
│
├── CSS/
│   └── style.css               # Global dark-theme stylesheet
│
├── JS/
│   └── (shared scripts — future)
│
├── Pages/
│   ├── login.html              # Login page
│   ├── students.html           # Student management
│   ├── teachers.html           # Faculty management
│   ├── attendance.html         # Attendance tracking
│   ├── examination.html        # Marks & results
│   └── fees.html               # Fee management
│
└── Java-Backend/
    ├── Conn.java               # MySQL connection helper
    ├── Login.java              # Authentication window
    ├── Project.java            # Main menu / entry point
    ├── AddStudent.java         # Add student form
    ├── UpdateStudent.java      # Update student form
    ├── StudentDetails.java     # Student records table
    ├── AddTeacher.java         # Add faculty form
    ├── UpdateTeacher.java      # Update faculty form
    ├── TeacherDetails.java     # Faculty records table
    ├── StudentAttendance.java      # Mark student attendance
    ├── StudentAttendanceDetail.java # View student attendance
    ├── TeacherAttendance.java      # Mark teacher attendance
    ├── TeacherAttendanceDetail.java # View teacher attendance
    ├── EnterMarks.java         # Enter subject marks
    ├── ExaminationDetails.java # View student list for results
    ├── Marks.java              # Display result by roll number
    ├── FeeStructure.java       # Fee structure display
    ├── StudentFeeForm.java     # Record fee payment
    └── mysql_commands.txt      # All SQL setup commands
```

---

## Tech Stack

**Frontend**

- HTML5, CSS3, Vanilla JavaScript (ES6+)
- [Font Awesome 6](https://fontawesome.com/) — icons
- [Google Fonts](https://fonts.google.com/) — Inter + Space Grotesk
- Responsive design, CSS custom properties, dark theme

**Backend**

- Java (Swing / AWT) — desktop GUI
- JDBC — database connectivity
- `rs2xml` / `DbUtils` — ResultSet → JTable rendering

**Database**

- MySQL 8.x
- Tables: `login`, `student`, `teacher`, `attendance_student`, `attendance_teacher`, `subject`, `marks`, `fee`

---

## Getting Started

### 1. Database Setup

Open your MySQL CLI and run the commands from `Java-Backend/mysql_commands.txt`, or paste these directly:

```sql
CREATE DATABASE ums;
USE ums;

CREATE TABLE login (
  username VARCHAR(255),
  password VARCHAR(255)
);
INSERT INTO login VALUES ('admin', 'admin');

CREATE TABLE student (
  name VARCHAR(255), fathers_name VARCHAR(255), age VARCHAR(255),
  dob VARCHAR(255), address VARCHAR(255), phone VARCHAR(255),
  email VARCHAR(255), class_x VARCHAR(255), class_xii VARCHAR(255),
  aadhar VARCHAR(255), rollno VARCHAR(255), course VARCHAR(255), branch VARCHAR(255)
);

CREATE TABLE teacher (
  name VARCHAR(255), fathers_name VARCHAR(255), age VARCHAR(255),
  dob VARCHAR(255), address VARCHAR(255), phone VARCHAR(255),
  email VARCHAR(255), class_x VARCHAR(255), class_xii VARCHAR(255),
  aadhar VARCHAR(255), course VARCHAR(255), emp_id VARCHAR(255), dept VARCHAR(255)
);

CREATE TABLE fee (
  rollno VARCHAR(255), name VARCHAR(255), fathers_name VARCHAR(255),
  course VARCHAR(255), branch VARCHAR(255), semester VARCHAR(255), fee_paid VARCHAR(255)
);

CREATE TABLE attendance_student (
  rollno VARCHAR(255), Date VARCHAR(255), first VARCHAR(255), second VARCHAR(255)
);

CREATE TABLE attendance_teacher (
  emp_id VARCHAR(255), Date VARCHAR(255), first VARCHAR(255), second VARCHAR(255)
);

CREATE TABLE subject (
  rollno VARCHAR(255), subject1 VARCHAR(255), subject2 VARCHAR(255),
  subject3 VARCHAR(255), subject4 VARCHAR(255), subject5 VARCHAR(255)
);

CREATE TABLE marks (
  rollno VARCHAR(255), marks1 VARCHAR(255), marks2 VARCHAR(255),
  marks3 VARCHAR(255), marks4 VARCHAR(255), marks5 VARCHAR(255)
);
```

### 2. Backend (Java)

**Prerequisites:** JDK 11+, NetBeans or IntelliJ IDEA, MySQL Connector/J JAR, `rs2xml.jar`

1. Open the `Java-Backend/` folder as a Java project in your IDE.
2. Add `mysql-connector-j-x.x.x.jar` and `rs2xml.jar` to your project's classpath.
3. Open `Conn.java` and update your credentials if needed:
   ```java
   c = DriverManager.getConnection("jdbc:mysql://localhost:3306/ums", "root", "your_password");
   ```
4. Run `Login.java` or `Project.java` as the entry point.

> **Default credentials:** username `admin` / password `admin`

### 3. Frontend

The frontend is a static multi-page site — no build step needed.

```bash
# Clone the repo
git clone https://github.com/your-username/EduSphere.git
cd EduSphere

# Open directly in browser
open index.html
# or use Live Server in VS Code
```

> **Demo login:** username `admin` / password `admin`  
> Authentication is handled via `sessionStorage` in the frontend demo. Connect to a backend API for production use.

---

## Database Schema

```
login               student              teacher
──────────          ──────────────────   ──────────────────
username            name                 name
password            fathers_name         fathers_name
                    age                  age
                    dob                  dob
attendance_student  address              address
──────────────────  phone                phone
rollno              email                email
Date                class_x              class_x
first               class_xii            class_xii
second              aadhar               aadhar
                    rollno               emp_id
attendance_teacher  course               course
──────────────────  branch               dept
emp_id
Date                subject              marks              fee
first               ──────────────────   ──────────────────  ──────────────────
second              rollno               rollno              rollno
                    subject1–5           marks1–5            name
                                                             fathers_name
                                                             course / branch
                                                             semester / fee_paid
```

---

## Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add: your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## Author

**Mayank Prashar**  
Full-Stack Web Developer · Java · Spring Boot  
📧 mayank.prash@gmail.com  
🔗 [LinkedIn](https://linkedin.com) · [GitHub](https://github.com) · [Portfolio](https://portfolio.com)

---

## License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Built with ☕ Java + 🌐 HTML/CSS/JS · EduSphere © 2026</sub>
</div>
