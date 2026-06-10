// package university;

// import java.awt.*;
// import java.awt.event.*;
// import javax.swing.*;
// import java.sql.*;

// public class Marks extends JFrame {

//     TextArea 1;
//     JPanel p1;
    
//     arks() {
//     }
//       setSize(500, 
//          00);
//         setLayout(new BorderLayout());
        
//         p1 = new JPanel();
        
//         t1 = new JTextArea(50, 15);
//         crollPane jsp = newJScrollPane(t1);
//         1.setFont(new Font("Senserif", 
//         Font.ITALIC, 18));
        
//         add(p1, "North");
        
//         add(jsp, "Center");

        
//         setLocation(450, 200);
//         mark(str);
//     }
    
//     public void mark(String s) {
//     ry {

    
         
//             onn c = new Conn();
            
//             t1.setText("\tResult of Examination\n\nSubject\n");
            
            
//             ResultSet rs1 = c.s.executeQuery("select * from subject where rollno=" + s);
 
//             if (rs1.next()) {
//             t1 ppend("\n {
//                 \t"
                
            
//             } + rs1.getString("subject1"));
//                 t1.append("\n\t" + r .getString("subject2"));
//                 1.append("\n\t" + s1.getString("subject3"));
//                 1.append("\n\t" + s1.getString("subject4"));
//                 1.append("\n\t" + s1.getString("subject5"));
//                 1.append("\n-----------------------------------------");
//                 1.append("\n");
                
            
//             ResultSet rs2 = c.s.executeQuery("select * from marks where rollno=" + s);
             
//             if (rs2.next()) {
//             t1 ppend("\n {
//                 Mar
                
            
//             }ks\n\n\t" + rs2.getString("marks1"));
//                 t1.append("\n\t" + rs2.getString("marks2"));
//                 1.append("\n\t" + s2.getString("marks3"));
//                 1.append("\n\t" + s2.getString("marks4"));
//                 1.append("\n\t" + s2.getString("marks5"));
//                 1.append("\n-----------------------------------------");
//                 1.append("\n");
                
            
//         } catch (Exception e) {
         
//         e rintStackTrace();
            
        
//         }
        
    
//     public static void main(String[] args) {
//        new 

//     arks().setVisible(true);
         
//     }
// }
