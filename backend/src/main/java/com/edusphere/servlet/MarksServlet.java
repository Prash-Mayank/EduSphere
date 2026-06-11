package com.edusphere.servlet;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.sql.ResultSet;

/**
 * POST /api/marks          — insert subjects + marks
 * GET  /api/marks?rollno=  — get result for a student
 */
@WebServlet("/api/marks")
public class MarksServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
        res.setContentType("application/json");
        String rollno = req.getParameter("rollno");
        if (rollno == null) { res.setStatus(400); res.getWriter().write("{\"error\":\"rollno required\"}"); return; }

        try {
            Conn conn = new Conn();
            var ps1 = conn.c.prepareStatement("SELECT * FROM subject WHERE rollno=?");
            ps1.setString(1, rollno);
            ResultSet rs1 = ps1.executeQuery();

            var ps2 = conn.c.prepareStatement("SELECT * FROM marks WHERE rollno=?");
            ps2.setString(1, rollno);
            ResultSet rs2 = ps2.executeQuery();

            String subjects = "null", marks = "null";
            if (rs1.next()) {
                subjects = "{\"s1\":" + json(rs1.getString("subject1")) +
                           ",\"s2\":" + json(rs1.getString("subject2")) +
                           ",\"s3\":" + json(rs1.getString("subject3")) +
                           ",\"s4\":" + json(rs1.getString("subject4")) +
                           ",\"s5\":" + json(rs1.getString("subject5")) + "}";
            }
            if (rs2.next()) {
                marks = "{\"m1\":" + json(rs2.getString("marks1")) +
                        ",\"m2\":" + json(rs2.getString("marks2")) +
                        ",\"m3\":" + json(rs2.getString("marks3")) +
                        ",\"m4\":" + json(rs2.getString("marks4")) +
                        ",\"m5\":" + json(rs2.getString("marks5")) + "}";
            }
            conn.c.close();
            res.getWriter().write("{\"rollno\":" + json(rollno) + ",\"subjects\":" + subjects + ",\"marks\":" + marks + "}");
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
            String rollno = req.getParameter("rollno");

            // Upsert subjects
            var ps1 = conn.c.prepareStatement(
                "INSERT INTO subject VALUES(?,?,?,?,?,?) ON DUPLICATE KEY UPDATE " +
                "subject1=?,subject2=?,subject3=?,subject4=?,subject5=?");
            String s1=req.getParameter("s1"), s2=req.getParameter("s2"), s3=req.getParameter("s3"),
                   s4=req.getParameter("s4"), s5=req.getParameter("s5");
            ps1.setString(1, rollno); ps1.setString(2,s1); ps1.setString(3,s2);
            ps1.setString(4,s3); ps1.setString(5,s4); ps1.setString(6,s5);
            ps1.setString(7,s1); ps1.setString(8,s2); ps1.setString(9,s3);
            ps1.setString(10,s4); ps1.setString(11,s5);
            ps1.executeUpdate();

            // Upsert marks
            var ps2 = conn.c.prepareStatement(
                "INSERT INTO marks VALUES(?,?,?,?,?,?) ON DUPLICATE KEY UPDATE " +
                "marks1=?,marks2=?,marks3=?,marks4=?,marks5=?");
            String m1=req.getParameter("m1"), m2=req.getParameter("m2"), m3=req.getParameter("m3"),
                   m4=req.getParameter("m4"), m5=req.getParameter("m5");
            ps2.setString(1, rollno); ps2.setString(2,m1); ps2.setString(3,m2);
            ps2.setString(4,m3); ps2.setString(5,m4); ps2.setString(6,m5);
            ps2.setString(7,m1); ps2.setString(8,m2); ps2.setString(9,m3);
            ps2.setString(10,m4); ps2.setString(11,m5);
            ps2.executeUpdate();

            conn.c.close();
            res.getWriter().write("{\"success\":true,\"message\":\"Marks saved\"}");
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
