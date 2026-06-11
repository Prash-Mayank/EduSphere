package com.edusphere.servlet;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.sql.ResultSet;

@WebServlet("/api/login")
public class LoginServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res)
            throws IOException {

        res.setContentType("application/json");
        String username = req.getParameter("username");
        String password = req.getParameter("password");

        if (username == null || password == null) {
            res.setStatus(400);
            res.getWriter().write("{\"success\":false,\"message\":\"Missing credentials\"}");
            return;
        }

        try {
            Conn conn = new Conn();
            // Use PreparedStatement to prevent SQL injection
            String sql = "SELECT * FROM login WHERE username=? AND password=?";
            var ps = conn.c.prepareStatement(sql);
            ps.setString(1, username);
            ps.setString(2, password);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                res.getWriter().write("{\"success\":true,\"message\":\"Login successful\",\"user\":\"" + username + "\"}");
            } else {
                res.setStatus(401);
                res.getWriter().write("{\"success\":false,\"message\":\"Invalid username or password\"}");
            }
            conn.c.close();
        } catch (Exception e) {
            res.setStatus(500);
            res.getWriter().write("{\"success\":false,\"message\":\"Server error: " + e.getMessage() + "\"}");
        }
    }

    // Handle OPTIONS preflight
    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse res) {
        res.setStatus(200);
    }
}
