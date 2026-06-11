package com.edusphere.servlet;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.sql.ResultSet;

@WebServlet("/api/students")
public class StudentServlet extends HttpServlet {

    // GET /api/students  — list all students
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
        res.setContentType("application/json");
        try {
            Conn conn = new Conn();
            ResultSet rs = conn.s.executeQuery("SELECT * FROM student");
            StringBuilder sb = new StringBuilder("[");
            boolean first = true;
            while (rs.next()) {
                if (!first) sb.append(",");
                first = false;
                sb.append("{")
                  .append("\"name\":").append(json(rs.getString("name"))).append(",")
                  .append("\"fathers_name\":").append(json(rs.getString("fathers_name"))).append(",")
                  .append("\"age\":").append(json(rs.getString("age"))).append(",")
                  .append("\"dob\":").append(json(rs.getString("dob"))).append(",")
                  .append("\"address\":").append(json(rs.getString("address"))).append(",")
                  .append("\"phone\":").append(json(rs.getString("phone"))).append(",")
                  .append("\"email\":").append(json(rs.getString("email"))).append(",")
                  .append("\"class_x\":").append(json(rs.getString("class_x"))).append(",")
                  .append("\"class_xii\":").append(json(rs.getString("class_xii"))).append(",")
                  .append("\"aadhar\":").append(json(rs.getString("aadhar"))).append(",")
                  .append("\"rollno\":").append(json(rs.getString("rollno"))).append(",")
                  .append("\"course\":").append(json(rs.getString("course"))).append(",")
                  .append("\"branch\":").append(json(rs.getString("branch")))
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

    // POST /api/students  — add a new student
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException {
        res.setContentType("application/json");
        try {
            Conn conn = new Conn();
            String sql = "INSERT INTO student VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)";
            var ps = conn.c.prepareStatement(sql);
            ps.setString(1,  req.getParameter("name"));
            ps.setString(2,  req.getParameter("fathers_name"));
            ps.setString(3,  req.getParameter("age"));
            ps.setString(4,  req.getParameter("dob"));
            ps.setString(5,  req.getParameter("address"));
            ps.setString(6,  req.getParameter("phone"));
            ps.setString(7,  req.getParameter("email"));
            ps.setString(8,  req.getParameter("class_x"));
            ps.setString(9,  req.getParameter("class_xii"));
            ps.setString(10, req.getParameter("aadhar"));
            ps.setString(11, req.getParameter("rollno"));
            ps.setString(12, req.getParameter("course"));
            ps.setString(13, req.getParameter("branch"));
            ps.executeUpdate();
            conn.c.close();
            res.getWriter().write("{\"success\":true,\"message\":\"Student added\"}");
        } catch (Exception e) {
            res.setStatus(500);
            res.getWriter().write("{\"success\":false,\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    // PUT /api/students?rollno=xxx  — update a student
    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse res) throws IOException {
        res.setContentType("application/json");
        try {
            Conn conn = new Conn();
            String rollno = req.getParameter("rollno");
            String sql = "UPDATE student SET name=?,fathers_name=?,age=?,dob=?,address=?," +
                         "phone=?,email=?,class_x=?,class_xii=?,aadhar=?,course=?,branch=? WHERE rollno=?";
            var ps = conn.c.prepareStatement(sql);
            ps.setString(1,  req.getParameter("name"));
            ps.setString(2,  req.getParameter("fathers_name"));
            ps.setString(3,  req.getParameter("age"));
            ps.setString(4,  req.getParameter("dob"));
            ps.setString(5,  req.getParameter("address"));
            ps.setString(6,  req.getParameter("phone"));
            ps.setString(7,  req.getParameter("email"));
            ps.setString(8,  req.getParameter("class_x"));
            ps.setString(9,  req.getParameter("class_xii"));
            ps.setString(10, req.getParameter("aadhar"));
            ps.setString(11, req.getParameter("course"));
            ps.setString(12, req.getParameter("branch"));
            ps.setString(13, rollno);
            ps.executeUpdate();
            conn.c.close();
            res.getWriter().write("{\"success\":true,\"message\":\"Student updated\"}");
        } catch (Exception e) {
            res.setStatus(500);
            res.getWriter().write("{\"success\":false,\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    // DELETE /api/students?rollno=xxx
    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse res) throws IOException {
        res.setContentType("application/json");
        try {
            Conn conn = new Conn();
            String rollno = req.getParameter("rollno");
            var ps = conn.c.prepareStatement("DELETE FROM student WHERE rollno=?");
            ps.setString(1, rollno);
            ps.executeUpdate();
            conn.c.close();
            res.getWriter().write("{\"success\":true,\"message\":\"Student deleted\"}");
        } catch (Exception e) {
            res.setStatus(500);
            res.getWriter().write("{\"success\":false,\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @Override protected void doOptions(HttpServletRequest req, HttpServletResponse res) { res.setStatus(200); }

    private String json(String val) {
        if (val == null) return "null";
        return "\"" + val.replace("\\", "\\\\").replace("\"", "\\\"") + "\"";
    }
}
