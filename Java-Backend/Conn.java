
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

public class Conn {

    Connection c;
    Statement s;

    public Conn() {
        try {
            Properties props = new Properties();

            // Load from classpath (src/db.properties)
            InputStream in = Conn.class.getClassLoader().getResourceAsStream("db.properties");

            if (in == null) {
                throw new IOException("db.properties not found in classpath. "
                        + "Copy db.properties.example → db.properties and fill in your credentials.");
            }

            props.load(in);
            in.close();

            String url = props.getProperty("db.url");
            String user = props.getProperty("db.user");
            String password = props.getProperty("db.password");

            Class.forName("com.mysql.cj.jdbc.Driver");
            c = DriverManager.getConnection(url, user, password);
            s = c.createStatement();

        } catch (IOException e) {
            System.err.println("[EduSphere] Config error: " + e.getMessage());
        } catch (SQLException e) {
            System.err.println("[EduSphere] Connection error: " + e.getMessage());
        } catch (ClassNotFoundException e) {
            Logger.getLogger(Conn.class.getName()).log(Level.SEVERE,
                    "MySQL JDBC Driver not found. Add mysql-connector-j.jar to classpath.", e);
        }
    }
}
