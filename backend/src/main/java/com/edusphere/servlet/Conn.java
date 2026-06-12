package com.edusphere.servlet;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.logging.Level;
import java.util.logging.Logger;

public class Conn {

    public Connection c;
    public Statement s;

    public Conn() {
        try {
            String url = System.getenv().getOrDefault("DB_URL", "jdbc:mysql://localhost:3306/ums?useSSL=false&serverTimezone=UTC");
            String user = System.getenv().getOrDefault("DB_USER", "root");
            String pass = System.getenv().getOrDefault("DB_PASS", "");

            Class.forName("com.mysql.cj.jdbc.Driver");
            c = DriverManager.getConnection(url, user, pass);
            s = c.createStatement();

        } catch (ClassNotFoundException e) {
            Logger.getLogger(Conn.class.getName()).log(Level.SEVERE,
                    "MySQL JDBC Driver not found.", e);
        } catch (SQLException e) {
            Logger.getLogger(Conn.class.getName()).log(Level.SEVERE,
                    "DB connection failed: " + e.getMessage(), e);
        }
    }
}
