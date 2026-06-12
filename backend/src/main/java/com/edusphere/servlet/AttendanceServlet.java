package com.edusphere.servlet;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.sql.ResultSet;

@WebServlet("/api/attendance")
public class AttendanceServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
        res.setContentType("application/json");
        String type = req.getParameter("type");
        String table = "teacher".equals(type) ? "attendance_teacher" : "attendance_student";
        String idCol = "teacher".equals(type) ? "emp_id" : "rollno";

        try {
            Conn conn = new Conn();
            ResultSet rs = conn.s.executeQuery("SELECT * FROM " + table);
            StringBuilder sb = new StringBuilder("[");
            boolean first = true;
            while (rs.next()) {
                if (!first) {
                    sb.append(",");
                }
                first = false;
                sb.append("{")
                        .append("\"id\":").append(json(rs.getString(idCol))).append(",")
                        .append("\"date\":").append(json(rs.getString("Date"))).append(",")
                        .append("\"first\":").append(json(rs.getString("first"))).append(",")
                        .append("\"second\":").append(json(rs.getString("second")))
                        .append("}");
            }
            sb.append("]");
            conn.c.close();
            res.getWriter().write(sb.toString());
        } catch (Exception e) {
            res.setStatus(500);
            res.getWriter().write("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException {
        res.setContentType("application/json");
        String type = req.getParameter("type");
        boolean isTeacher = "teacher".equals(type);
        String table = isTeacher ? "attendance_teacher" : "attendance_student";
        String idCol = isTeacher ? "emp_id" : "rollno";
        String id = req.getParameter("id");
        String first = req.getParameter("first");
        String second = req.getParameter("second");
        String date = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date());

        try {
            Conn conn = new Conn();
            String sql = "INSERT INTO " + table + " VALUES(?,?,?,?)";
            var ps = conn.c.prepareStatement(sql);
            ps.setString(1, id);
            ps.setString(2, date);
            ps.setString(3, first);
            ps.setString(4, second);
            ps.executeUpdate();
            conn.c.close();
            res.getWriter().write("{\"success\":true,\"message\":\"Attendance recorded\"}");
        } catch (Exception e) {
            res.setStatus(500);
            res.getWriter().write("{\"success\":false,\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse res) {
        res.setStatus(200);
    }

    private String json(String val) {
        if (val == null) {
            return "null";
        }
        return "\"" + val.replace("\\", "\\\\").replace("\"", "\\\"") + "\"";
    }
}
