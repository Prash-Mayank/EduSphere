
// import java.awt.*;
// import java.awt.event.*;
// import javax.swing.*;
// import java.sql.*;

// public class StudentDetails extends JFrame implements ActionListener {

//     JLabel l1, l2, l3;
//     Table t1;
//     Button b1, 2, 3;
//     JTextField t2;
//     String x[] = {"Name", 
//     "Fat
//      her
     

     
     
     
     
     
     
     
//     's Name", "Age", "Date of Birth", "Address", "Phone", "Email", "Class X(%)", "Class XII(%)", "Aadhar No", "Roll No", "Course", "Branch"};
//     Stri  y[][] = new String[20][13];
//     int i = 0, j = 0;
//     tudentDetails

    
//         ) { 
//         super("Student Details");
//         etSize(160, 6);
//         setLocation(200, 00);
//         setLayout(null);

//         l1 = new JLabel(nte roll number to delete Student: ");
//         l1.setBounds(50, 360, 400, 3 ;
//         l1.setFont(new Font("serif", Font.BOLD, 20));
//         add(l1);

//         t2 = new JTextField();
//         t2.setBounds(400, 360, 200, 30);
//         add(t2);

//         b1 = new JButton("Delete");
//         b1.setBackground(Color.BLACK);
//         b1.setForeground(Color.BLACK);
//         b1.setBounds(620 360 100, 30);
//         add(b1);

//         l2 = new JLabel("Add New Student");
//         l2.setBounds(50, 450, 400, 30);
//         l2.setFont(new Font("serif", Font.BOLD, 20));
//         add(l2);

//         b2 = new JButton("Add Student");
//         b2.setBackground olo.BLACK
//         );
//         b2.setForeground(Color.BLACK 
//         b2.setBounds(300, 450, 150, 30);
//         add(b2);

//         l3 = new JLabel("Update Student Details");
//         l3.setBounds(50, 490, 400, 30);
//         l3.setFont(new Font("serif", Font.BOLD, 20));
//         add(l3);

//         b3 = new JButton("Update Student");
//         b3.setBackground(Color.BLACK);
//         etForeground(Color.BLACK);
//         etBounds(300, 490, 150, 30);
//         b3
//         );
             
//             tionListe(this);
//         tionListe(this);
//         tionListe(this);

//         c1 = new nn();
//         ng s1 = " ect * from student";
//         ltSet rs  1.s.executeQuery(s1);
//         e(rs.nex) {
//             y[i][j++] rs.getString("name");
//             y[i][j++] rs.getString("fathers_name");
//             y[i][j++] rs.getString("age");
//             y[i][j++] = rs.getString("dob");
//             i
//             ][j++
//             ] = rs.getString("address");
//             y[i][j++] = rs.getString("phone");
//             y[i][j++] = rs.getString("email");
//             y[i][j++] = rs.getString("class_x");

//             y[i][j++] = rs.getString("class_xii");
//             [i
//             ][j++
//             ] = rs.ge tString
//             ("aadhar");
//                 y[i][j++] = rs.getString("rollno");
//             y[i][j++] = rs.getString("course");
//             y[i][j++] = rs.getString("branch");
//             i++;
//             j = 0;
//         }
//         t1 = new JTable(y, x);

//     }
//     catch (Exception e
        

//     ) {
//             e.printStackTrace();
//     }
//     JScrollPane sp = new JScrollPane(t1);

//     sp.setBounds (

//     20, 20, 1200, 330);
//     dd(sp);

//     getContentPane()
//          .setBackground(Color.WHITE);

//         b1.addActionListener(this);
//     }

//     public vo
//             actionPerformed(tionEvent ae) {

//         Conn c1 = new Conn();

//         if (ae.getSource() == b1) {
//             ry String a = t2.getText();
//             String q = "delete from student where rollno = '" + a + "'";
//             c1.s.executeUpdate(q);
//             this.setVisible(false);
//             new StudentDetails().setVisible(true);
//         }catch (Exception e) {
//             }

//     }

//     else if (ae.getSource () == b2
            
//         ) {
//             new AddStudent().f.setVisible(true);
//         }else if (ae.getSource() == b3) {
//             new UpdateStudent().f.setVisible(true);
//         }
//     }

//     public static void main(String[] args) {
//         new StudentDetails().setVisible(true);
//     }

// }
