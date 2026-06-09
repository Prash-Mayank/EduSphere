# EduSphere

## Smart University Management System

EduSphere is a desktop-based University Management System developed using Java Swing and MySQL. It provides a centralized platform for managing academic and administrative activities including student records, faculty management, attendance tracking, examinations, and fee management.

---

## Features

### Student Management

- Add New Students
- Update Student Information
- View Student Details
- Delete Student Records

### Faculty Management

- Add New Faculty Members
- Update Faculty Information
- View Faculty Details
- Delete Faculty Records

### Attendance Management

- Student Attendance Tracking
- Faculty Attendance Tracking
- Attendance Reports

### Examination Management

- Enter Student Marks
- View Examination Details
- Generate Results

### Fee Management

- View Fee Structure
- Record Student Fee Payments
- Semester-wise Fee Tracking

### Dashboard

- Centralized University Control Panel
- Easy Navigation Across Modules
- User-Friendly Interface

---

## Technology Stack

| Category              | Technology |
| --------------------- | ---------- |
| Language              | Java       |
| GUI Framework         | Java Swing |
| Database              | MySQL      |
| Database Connectivity | JDBC       |
| IDE                   | NetBeans   |

---

## Database Tables

- login
- student
- teacher
- attendance_student
- attendance_teacher
- fee
- subject
- marks

---

## Project Modules

### Authentication Module

Secure login system for administrators.

### Student Management Module

Manage student admissions, records, and academic information.

### Faculty Management Module

Maintain faculty profiles and information.

### Attendance Module

Track and manage attendance for students and faculty.

### Examination Module

Manage subjects, marks, and examination results.

### Fee Management Module

Handle fee structures and payment records.

---

## Installation Guide

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/EduSphere.git
```

### 2. Create Database

```sql
CREATE DATABASE ums;
```

### 3. Import Database Tables

Execute all SQL commands available in:

```text
src/university/mysql_commands.txt
```

### 4. Configure Database Connection

Update database credentials in:

```java
Conn.java
```

Example:

```java
jdbc:mysql://localhost:3306/ums
Username: root
Password: your_password
```

### 5. Run Application

Run:

```text
Login.java
```

## System Modules Overview

| Module      | Description                     |
| ----------- | ------------------------------- |
| Login       | Secure User Authentication      |
| Students    | Student Registration & Records  |
| Faculty     | Faculty Registration & Records  |
| Attendance  | Attendance Tracking             |
| Examination | Marks & Results Management      |
| Fees        | Fee Collection & Tracking       |
| Reports     | Academic Information Management |

---

## Future Enhancements

- Web-Based Version
- Online Fee Payment Gateway
- Student Portal
- Faculty Portal
- Placement Management Module
- Analytics Dashboard
- Notification System
- Cloud Database Integration

---

## Screenshots

- Login Screen
- Dashboard
- Student Management
- Faculty Management
- Attendance Management
- Examination Management
- Fee Management

---

## Developer

**Mayank Prashar**

B.Tech Computer Science & Engineering  
Galgotias University

---

## Project Vision

EduSphere aims to simplify university operations through digital transformation by providing a unified platform for academic and administrative management.

---

### EduSphere

**Smart University Management System**
