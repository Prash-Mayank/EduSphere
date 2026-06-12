package com.edusphere.servlet;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.sql.ResultSet;

@WebServlet("/api/fees")
public class FeeServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
        res.setContentType("application/json");
        String rollno = req.getParameter("rollno");
        try {
            Conn conn = new Conn();
            ResultSet rs;
            if (rollno != null) {
                var ps = conn.c.prepareStatement("SELECT * FROM fee WHERE rollno=?");
                ps.setString(1, rollno);
                rs = ps.executeQuery();
            } else {
                rs = conn.s.executeQuery("SELECT * FROM fee");
            }
            StringBuilder sb = new StringBuilder("[");
            boolean first = true;
            while (rs.next()) {
                if (!first) {
                    sb.append(",");
                }
                first = false;
                sb.append("{")
                        .append("\"rollno\":").append(json(rs.getString("rollno"))).append(",")
                        .append("\"name\":").append(json(rs.getString("name"))).append(",")
                        .append("\"fathers_name\":").append(json(rs.getString("fathers_name"))).append(",")
                        .append("\"course\":").append(json(rs.getString("course"))).append(",")
                        .append("\"branch\":").append(json(rs.getString("branch"))).append(",")
                        .append("\"semester\":").append(json(rs.getString("semester"))).append(",")
                        .append("\"fee_paid\":").append(json(rs.getString("fee_paid")))
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
            String sql = "INSERT INTO fee(rollno,name,fathers_name,course,branch,semester,fee_paid) VALUES(?,?,?,?,?,?,?)";
            var ps = conn.c.prepareStatement(sql);
            ps.setString(1, req.getParameter("rollno"));
            ps.setString(2, req.getParameter("name"));
            ps.setString(3, req.getParameter("fathers_name"));
            ps.setString(4, req.getParameter("course"));
            ps.setString(5, req.getParameter("branch"));
            ps.setString(6, req.getParameter("semester"));
            ps.setString(7, req.getParameter("fee_paid"));
            ps.executeUpdate();
            conn.c.close();
            res.getWriter().write("{\"success\":true,\"message\":\"Fee recorded\"}");
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
