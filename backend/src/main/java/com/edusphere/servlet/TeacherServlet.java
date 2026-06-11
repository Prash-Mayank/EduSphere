package com.edusphere.servlet;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.sql.ResultSet;

@WebServlet("/api/teachers")
public class TeacherServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
        res.setContentType("application/json");
        try {
            Conn conn = new Conn();
            ResultSet rs = conn.s.executeQuery("SELECT * FROM teacher");
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
                  .append("\"course\":").append(json(rs.getString("course"))).append(",")
                  .append("\"emp_id\":").append(json(rs.getString("emp_id"))).append(",")
                  .append("\"dept\":").append(json(rs.getString("dept")))
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
        try {
            Conn conn = new Conn();
            String sql = "INSERT INTO teacher VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)";
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
            ps.setString(12, req.getParameter("emp_id"));
            ps.setString(13, req.getParameter("dept"));
            ps.executeUpdate();
            conn.c.close();
            res.getWriter().write("{\"success\":true,\"message\":\"Teacher added\"}");
        } catch (Exception e) {
            res.setStatus(500);
            res.getWriter().write("{\"success\":false,\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse res) throws IOException {
        res.setContentType("application/json");
        try {
            Conn conn = new Conn();
            String sql = "UPDATE teacher SET name=?,fathers_name=?,age=?,dob=?,address=?," +
                         "phone=?,email=?,class_x=?,class_xii=?,aadhar=?,course=?,dept=? WHERE emp_id=?";
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
            ps.setString(12, req.getParameter("dept"));
            ps.setString(13, req.getParameter("emp_id"));
            ps.executeUpdate();
            conn.c.close();
            res.getWriter().write("{\"success\":true,\"message\":\"Teacher updated\"}");
        } catch (Exception e) {
            res.setStatus(500);
            res.getWriter().write("{\"success\":false,\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse res) throws IOException {
        res.setContentType("application/json");
        try {
            Conn conn = new Conn();
            var ps = conn.c.prepareStatement("DELETE FROM teacher WHERE emp_id=?");
            ps.setString(1, req.getParameter("emp_id"));
            ps.executeUpdate();
            conn.c.close();
            res.getWriter().write("{\"success\":true,\"message\":\"Teacher deleted\"}");
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
