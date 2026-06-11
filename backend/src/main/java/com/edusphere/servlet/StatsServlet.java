package com.edusphere.servlet;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.sql.ResultSet;

/** GET /api/stats — returns counts for dashboard cards */
@WebServlet("/api/stats")
public class StatsServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
        res.setContentType("application/json");
        try {
            Conn conn = new Conn();

            ResultSet rs1 = conn.s.executeQuery("SELECT COUNT(*) AS cnt FROM student");
            int students = rs1.next() ? rs1.getInt("cnt") : 0;

            ResultSet rs2 = conn.s.executeQuery("SELECT COUNT(*) AS cnt FROM teacher");
            int teachers = rs2.next() ? rs2.getInt("cnt") : 0;

            ResultSet rs3 = conn.s.executeQuery("SELECT COUNT(*) AS cnt FROM fee");
            int feeRecords = rs3.next() ? rs3.getInt("cnt") : 0;

            conn.c.close();

            res.getWriter().write(
                "{\"students\":" + students +
                ",\"teachers\":" + teachers +
                ",\"feeRecords\":" + feeRecords + "}"
            );
        } catch (Exception e) {
            res.setStatus(500);
            res.getWriter().write("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @Override protected void doOptions(HttpServletRequest req, HttpServletResponse res) { res.setStatus(200); }
}
