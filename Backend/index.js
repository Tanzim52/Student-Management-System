require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'student_management',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Database initialization with triggers
async function initializeDatabase() {
    try {
        const connection = await pool.getConnection();

        // Create triggers
        await connection.query(`
      CREATE TRIGGER IF NOT EXISTS before_enrollment_insert
      BEFORE INSERT ON enrollments
      FOR EACH ROW
      BEGIN
        IF NEW.enrollment_date IS NULL THEN
          SET NEW.enrollment_date = CURDATE();
        END IF;
      END;
    `);

        await connection.query(`
      CREATE TRIGGER IF NOT EXISTS after_grade_update
      AFTER UPDATE ON enrollments
      FOR EACH ROW
      BEGIN
        DECLARE course_count INT;
        DECLARE completed_count INT;
        
        SELECT COUNT(*) INTO course_count
        FROM enrollments
        WHERE student_id = NEW.student_id;
        
        SELECT COUNT(*) INTO completed_count
        FROM enrollments
        WHERE student_id = NEW.student_id AND status = 'Completed';
        
        IF course_count = completed_count THEN
          UPDATE students
          SET status = 'Graduated'
          WHERE student_id = NEW.student_id;
        END IF;
      END;
    `);

        await connection.query(`
      CREATE TRIGGER IF NOT EXISTS prevent_duplicate_enrollment
      BEFORE INSERT ON enrollments
      FOR EACH ROW
      BEGIN
        DECLARE existing_count INT;
        
        SELECT COUNT(*) INTO existing_count
        FROM enrollments
        WHERE student_id = NEW.student_id AND course_id = NEW.course_id;
        
        IF existing_count > 0 THEN
          SIGNAL SQLSTATE '45000'
          SET MESSAGE_TEXT = 'Student is already enrolled in this course';
        END IF;
      END;
    `);

        // Create grade points table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS grade_points (
        grade VARCHAR(2) PRIMARY KEY,
        point_value DECIMAL(3,2) NOT NULL
      );
    `);

        // Insert standard grade values if table is empty
        await connection.query(`
      INSERT IGNORE INTO grade_points (grade, point_value) VALUES
      ('A', 4.00), ('A-', 3.70), ('B+', 3.30), ('B', 3.00),
      ('B-', 2.70), ('C+', 2.30), ('C', 2.00), ('C-', 1.70),
      ('D+', 1.30), ('D', 1.00), ('F', 0.00);
    `);

        connection.release();
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization error:', error.message);
    }
}

// Initialize database on startup
initializeDatabase();

// Utility functions
const generateToken = (student) => {
    return jwt.sign(
        { id: student.student_id, email: student.email },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
};

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.studentId = decoded.id;
        req.studentEmail = decoded.email;
        next();
    });
};


// Routes

// Student Registration
app.post('/api/students/signup', async (req, res) => {
    try {
        const { department_id, email, password, firstName, lastName, registrationNumber, ...optionalFields } = req.body;

        // Validate required fields
        if (!department_id || !email || !password || !firstName || !lastName || !registrationNumber) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Convert department_id to number
        const deptId = Number(department_id);
        if (isNaN(deptId)) {
            return res.status(400).json({ error: 'Invalid department ID' });
        }

        // Check department exists
        const [department] = await pool.query(
            'SELECT 1 FROM departments WHERE department_id = ?',
            [deptId]
        );

        if (department.length === 0) {
            return res.status(400).json({ error: 'Selected department does not exist' });
        }

        // Check email exists
        const [existing] = await pool.query(
            'SELECT 1 FROM students WHERE email = ?',
            [email]
        );
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Prepare student data
        const studentData = {
            first_name: firstName,
            last_name: lastName,
            email,
            password: hashedPassword,
            department_id: deptId,
            registration_number: registrationNumber,
            phone: optionalFields.phone,
            address: optionalFields.address,
            city: optionalFields.city,
            state: optionalFields.state,
            zip_code: optionalFields.zip_code,
            country: optionalFields.country,
            dob: optionalFields.dob,
            gender: optionalFields.gender,
            profile_image_url: optionalFields.profileImageUrl, // Changed to match DB column
            enrollment_date: new Date().toISOString().split('T')[0]
        };

        // Insert student
        const [result] = await pool.query('INSERT INTO students SET ?', studentData);

        // Return student data (excluding password)
        const [student] = await pool.query(
            `SELECT 
        student_id, first_name, last_name, email, 
        phone, department_id, status, enrollment_date
       FROM students WHERE student_id = ?`,
            [result.insertId]
        );

        // Generate token
        const token = generateToken(student[0]);

        res.status(201).json({
            student: student[0],
            token
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            error: 'Registration failed',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Student Login
app.post('/api/students/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find student
        const [students] = await pool.query(
            'SELECT * FROM students WHERE email = ?',
            [email]
        );

        if (students.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const student = students[0];

        // Check password
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(student);

        // Return student data (without password)
        const { password: _, ...studentData } = student;
        res.json({ student: studentData, token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get student profile
app.get('/api/students/profile', verifyToken, async (req, res) => {
    try {
        const [students] = await pool.query(
            `SELECT 
        s.student_id, s.first_name, s.last_name, s.email, s.phone, 
        s.address, s.city, s.state, s.zip_code, s.country, s.dob, 
        s.gender, s.enrollment_date, s.status, s.profile_image_url,
        s.registration_number,
        d.name AS department_name
      FROM students s
      JOIN departments d ON s.department_id = d.department_id
      WHERE s.student_id = ?`,
            [req.studentId]
        );

        if (students.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json(students[0]);
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update student profile
app.put('/api/students/profile', verifyToken, async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            phone,
            address,
            city,
            state,
            zip_code,
            country,
            dob,
            gender,
            department_id,
            profileImageUrl
        } = req.body;

        await pool.query(
            `UPDATE students SET
        first_name = ?,
        last_name = ?,
        phone = ?,
        address = ?,
        city = ?,
        state = ?,
        zip_code = ?,
        country = ?,
        dob = ?,
        gender = ?,
        department_id = ?,
        profile_image_url = ?
      WHERE student_id = ?`,
            [
                firstName,
                lastName,
                phone,
                address,
                city,
                state,
                zip_code,
                country,
                dob,
                gender,
                department_id,
                profileImageUrl,
                req.studentId
            ]
        );

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all departments
app.get('/api/departments', async (req, res) => {
    try {
        const [departments] = await pool.query('SELECT * FROM departments');
        res.json(departments);
    } catch (error) {
        console.error('Departments error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get student courses (both enrolled and available)
// Get student courses (both enrolled and available)
// Get student courses (both enrolled and available)
app.get('/api/students/courses', verifyToken, async (req, res) => {
  try {
    // Get enrolled courses
    const [enrolled] = await pool.query(
      `SELECT 
        c.course_id, c.code, c.title, c.credits, 
        CONCAT(i.first_name, ' ', i.last_name) AS instructor,
        e.enrollment_date, e.status, e.grade,
        c.semester_offered
      FROM enrollments e
      JOIN courses c ON e.course_id = c.course_id
      LEFT JOIN instructors i ON c.instructor_id = i.instructor_id
      WHERE e.student_id = ?`,
      [req.studentId]
    );

    // Get available courses (not enrolled or completed)
    const [available] = await pool.query(
      `SELECT 
        c.course_id, c.code, c.title, c.credits, 
        CONCAT(i.first_name, ' ', i.last_name) AS instructor,
        c.semester_offered
      FROM courses c
      LEFT JOIN instructors i ON c.instructor_id = i.instructor_id
      WHERE c.course_id NOT IN (
        SELECT course_id FROM enrollments 
        WHERE student_id = ?
      )`,
      [req.studentId]
    );

    res.json({ 
      success: true,
      enrolled: enrolled || [], 
      available: available || [] 
    });
  } catch (error) {
    console.error('Courses error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch courses',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Enroll in a course
app.post('/api/students/enroll', verifyToken, async (req, res) => {
    try {
        const { courseId } = req.body;

        // Check if course exists
        const [courses] = await pool.query(
            'SELECT * FROM courses WHERE course_id = ?',
            [courseId]
        );

        if (courses.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Enroll student
        await pool.query(
            'INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)',
            [req.studentId, courseId]
        );

        res.json({ message: 'Enrolled successfully' });
    } catch (error) {
        console.error('Enrollment error:', error);
        if (error.code === 'ER_SIGNAL_EXCEPTION') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get student assignments
// Get student assignments
// Get student assignments
app.get('/api/students/assignments', verifyToken, async (req, res) => {
  try {
    const [assignments] = await pool.query(`
      SELECT 
        sa.student_assignment_id,
        a.assignment_id,
        a.title,
        a.description,
        a.due_date,
        c.code AS course_code,
        c.title AS course_title,
        sa.submission_link AS file_path, 
        sa.submission_date,
        sa.score,
        sa.feedback,
        sa.status
      FROM student_assignments sa
      JOIN assignments a ON sa.assignment_id = a.assignment_id
      JOIN courses c ON a.course_id = c.course_id
      WHERE sa.student_id = ?
      ORDER BY a.due_date ASC
    `, [req.studentId]);

    res.json(assignments);
  } catch (error) {
    console.error('Assignments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit assignment
// Submit assignment
app.put('/api/students/assignments/:id/submit', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { submissionLink } = req.body;

    await pool.query(`
      UPDATE student_assignments SET 
        submission_link = ?,  
        submission_date = NOW(),
        status = 'Submitted'
      WHERE student_assignment_id = ? AND student_id = ?
    `, [submissionLink, id, req.studentId]);

    res.json({ message: 'Assignment submitted successfully' });
  } catch (error) {
    console.error('Submit assignment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get student attendance records
// Get attendance summary by course
// Get attendance summary by course
app.get('/api/students/attendance/summary', verifyToken, async (req, res) => {
  try {
    // Get raw attendance counts by course
    const [courseAttendance] = await pool.query(`
      SELECT 
        c.code AS course_code,
        c.title AS course_title,
        COUNT(*) AS total_classes,
        SUM(a.status = 'Present') AS present_count,
        SUM(a.status = 'Late') AS late_count,
        SUM(a.status = 'Absent') AS absent_count
      FROM attendance a
      JOIN enrollments e ON a.enrollment_id = e.enrollment_id
      JOIN courses c ON e.course_id = c.course_id
      WHERE e.student_id = ?
      GROUP BY c.code, c.title
    `, [req.studentId]);

    // Calculate overall totals
    let overallPresent = 0;
    let overallLate = 0;
    let overallAbsent = 0;
    let overallTotal = 0;

    // Format course-wise data and calculate totals
    const byCourse = courseAttendance.map(course => {
      const present = parseInt(course.present_count) || 0;
      const late = parseInt(course.late_count) || 0;
      const absent = parseInt(course.absent_count) || 0;
      const total = parseInt(course.total_classes) || 1; // Avoid division by zero
      
      const attended = present + late;
      const percentage = Math.round((attended / total) * 100);

      // Update overall totals
      overallPresent += present;
      overallLate += late;
      overallAbsent += absent;
      overallTotal += total;

      return {
        course: course.course_code,
        title: course.course_title,
        present,
        late,
        absent,
        percentage: `${Math.min(100, percentage)}%`, // Cap at 100%
        total,
        attended
      };
    });

    // Calculate overall percentage (capped at 100%)
    const overallPercentage = overallTotal > 0 
      ? Math.min(100, Math.round(((overallPresent + overallLate) / overallTotal) * 100))
      : 0;

    res.json({
      overall: `${overallPercentage}%`,
      byCourse,
      totals: {
        present: overallPresent,
        late: overallLate,
        absent: overallAbsent,
        total: overallTotal
      }
    });
  } catch (error) {
    console.error('Attendance summary error:', error);
    res.status(500).json({ 
      error: 'Failed to calculate attendance',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});
// Get attendance records
// Get attendance records
app.get('/api/students/attendance/records', verifyToken, async (req, res) => {
  try {
    const [records] = await pool.query(`
      SELECT 
        a.attendance_id AS id,
        a.date,
        c.code AS course,
        c.title AS course_title,
        a.status,
        a.remarks,
        TIME(a.created_at) AS time
      FROM attendance a
      JOIN enrollments e ON a.enrollment_id = e.enrollment_id
      JOIN courses c ON e.course_id = c.course_id
      WHERE e.student_id = ?
      ORDER BY a.date DESC
      LIMIT 50
    `, [req.studentId]);

    res.json(records || []);
  } catch (error) {
    console.error('Attendance records error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.get('/api/students/gpa', verifyToken, async (req, res) => {
    try {
        const [gpa] = await pool.query(
            `SELECT 
        COUNT(*) AS total_courses,
        SUM(c.credits) AS total_credits,
        ROUND(SUM(
          CASE 
            WHEN e.grade = 'A' THEN 4.0 * c.credits
            WHEN e.grade = 'A-' THEN 3.7 * c.credits
            WHEN e.grade = 'B+' THEN 3.3 * c.credits
            WHEN e.grade = 'B' THEN 3.0 * c.credits
            WHEN e.grade = 'B-' THEN 2.7 * c.credits
            WHEN e.grade = 'C+' THEN 2.3 * c.credits
            WHEN e.grade = 'C' THEN 2.0 * c.credits
            WHEN e.grade = 'D' THEN 1.0 * c.credits
            ELSE 0
          END
        ) / SUM(c.credits), 2) AS gpa
      FROM enrollments e
      JOIN courses c ON e.course_id = c.course_id
      WHERE e.student_id = ? AND e.status = 'Completed' AND e.grade IS NOT NULL`,
            [req.studentId]
        );

        res.json(gpa[0]);
    } catch (error) {
        console.error('GPA error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get announcements
// Get announcements
app.get('/api/announcements', verifyToken, async (req, res) => {
  try {
    // Get student's department
    const [students] = await pool.query(
      'SELECT department_id FROM students WHERE student_id = ?',
      [req.studentId]
    );

    if (students.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const departmentId = students[0].department_id;

    // Get announcements for student's department or general announcements
    const [announcements] = await pool.query(
      `SELECT 
        a.*,
        d.name AS department_name
      FROM announcements a
      LEFT JOIN departments d ON a.target_department = d.department_id
      WHERE 
        (a.target_department IS NULL OR a.target_department = ?)
        AND (a.category IS NOT NULL)
      ORDER BY 
        a.important DESC, 
        a.publish_date DESC`,
      [departmentId]
    );

    res.json(announcements);
  } catch (error) {
    console.error('Announcements error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get student enrollments
// Get student enrollments with grades
// In your index.js backend file

// Get student enrollments
// In your backend routes:

// Enrollment endpoint
app.get('/api/students/enrollments', verifyToken, async (req, res) => {
  try {
    const [enrollments] = await pool.query(`
      SELECT 
        e.enrollment_id,
        c.code,
        c.title,
        c.credits,
        e.grade,
        e.status
      FROM enrollments e
      JOIN courses c ON e.course_id = c.course_id
      WHERE e.student_id = ?
    `, [req.studentId]);

    // Ensure we always return an array
    res.json(Array.isArray(enrollments) ? enrollments : []);

  } catch (error) {
    console.error('Enrollments error:', error);
    res.status(500).json([]); // Return empty array on error
  }
});

// GPA endpoint
app.get('/api/students/gpa', verifyToken, async (req, res) => {
  try {
    const [result] = await pool.query(`
      SELECT 
        ROUND(SUM(gp.point_value * c.credits) / SUM(c.credits), 2) AS gpa,
        SUM(c.credits) AS total_credits
      FROM enrollments e
      JOIN courses c ON e.course_id = c.course_id
      JOIN grade_points gp ON e.grade = gp.grade
      WHERE e.student_id = ? AND e.status = 'Completed'
    `, [req.studentId]);

    // Ensure consistent response structure
    res.json({
      gpa: result[0]?.gpa?.toString() || "0.00",
      total_credits: parseInt(result[0]?.total_credits) || 0
    });

  } catch (error) {
    console.error('GPA error:', error);
    res.status(500).json({ gpa: "0.00", total_credits: 0 });
  }
});
// New endpoint that returns everything needed
app.get('/api/students/grades-summary', verifyToken, async (req, res) => {
  try {
    // 1. Get all enrollments
    const [enrollments] = await pool.query(`
      SELECT 
        e.enrollment_id,
        c.code,
        c.title,
        c.credits,
        e.grade,
        e.status
      FROM enrollments e
      JOIN courses c ON e.course_id = c.course_id
      WHERE e.student_id = ?
      ORDER BY e.status DESC
    `, [req.studentId]);

    // 2. Calculate GPA
    const [gpaResult] = await pool.query(`
      SELECT 
        ROUND(SUM(gp.point_value * c.credits) / SUM(c.credits), 2) AS gpa,
        SUM(c.credits) AS total_credits
      FROM enrollments e
      JOIN courses c ON e.course_id = c.course_id
      JOIN grade_points gp ON e.grade = gp.grade
      WHERE e.student_id = ? AND e.status = 'Completed'
    `, [req.studentId]);

    // 3. Calculate credits in progress
    const [creditsInProgress] = await pool.query(`
      SELECT SUM(c.credits) AS credits
      FROM enrollments e
      JOIN courses c ON e.course_id = c.course_id
      WHERE e.student_id = ? AND e.status = 'Registered'
    `, [req.studentId]);

    // 4. Format response
    const response = {
      currentGrades: enrollments.filter(e => e.status === 'Registered'),
      completedGrades: enrollments.filter(e => e.status === 'Completed'),
      gpaSummary: {
        current: gpaResult[0]?.gpa?.toString() || "0.00",
        cumulative: gpaResult[0]?.gpa?.toString() || "0.00",
        creditsCompleted: parseInt(gpaResult[0]?.total_credits) || 0,
        creditsInProgress: parseInt(creditsInProgress[0]?.credits) || 0
      }
    };

    res.json(response);

  } catch (error) {
    console.error('Grades summary error:', error);
    res.status(500).json({
      currentGrades: [],
      completedGrades: [],
      gpaSummary: {
        current: "0.00",
        cumulative: "0.00",
        creditsCompleted: 0,
        creditsInProgress: 0
      }
    });
  }
});
// Test DB connection endpoint
app.get('/test-db', async (req, res) => {
    try {
        const [rows] = await pool.query('SHOW TABLES');
        res.json({ tables: rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Health check
app.get('/', (req, res) => {
    res.send('Student Management System API is running');
});

// Token verification endpoint
app.get('/api/students/verify', verifyToken, async (req, res) => {
  try {
    const [students] = await pool.query(
      `SELECT 
        s.student_id, s.first_name, s.last_name, s.email, s.phone,
        s.address, s.city, s.state, s.zip_code, s.country, s.dob,
        s.gender, s.enrollment_date, s.status, s.profile_image_url,
        s.registration_number,
        d.name AS department_name
      FROM students s
      JOIN departments d ON s.department_id = d.department_id
      WHERE s.student_id = ?`,
      [req.studentId]
    );

    if (students.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Return the same structure as login
    const student = students[0];
    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// Logout endpoint
app.post('/api/students/logout', verifyToken, async (req, res) => {
  try {
    // In a real app, you might want to add the token to a blacklist
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});