-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 09, 2025 at 07:24 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `student_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `announcement_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `content` text NOT NULL,
  `publish_date` datetime DEFAULT current_timestamp(),
  `target_department` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `category` enum('General','Department','Registration','Events') NOT NULL DEFAULT 'General',
  `important` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `announcements`
--

INSERT INTO `announcements` (`announcement_id`, `title`, `content`, `publish_date`, `target_department`, `created_at`, `updated_at`, `category`, `important`) VALUES
(1, 'Welcome Fall 2023!', 'Classes begin on September 1st.', '2025-07-08 07:07:50', NULL, '2025-07-08 01:07:50', '2025-07-08 01:07:50', 'General', 0),
(2, 'CS Lab Closure', 'CS labs will be closed for maintenance on Friday.', '2025-07-08 07:07:50', 1, '2025-07-08 01:07:50', '2025-07-08 01:07:50', 'General', 0),
(3, 'Welcome Fall 2023!', 'Classes begin on September 1st. Please check your schedules.', '2025-07-08 07:07:50', NULL, '2025-07-09 04:59:40', '2025-07-09 04:59:40', 'General', 1),
(4, 'CS Lab Closure', 'CS labs will be closed for maintenance this Friday from 2-5pm.', '2025-07-08 07:07:50', 1, '2025-07-09 04:59:40', '2025-07-09 04:59:40', 'Department', 0),
(5, 'Registration Deadline', 'Fall semester registration closes August 25th. Late registrations will incur a fee.', '2025-07-07 09:00:00', NULL, '2025-07-09 04:59:40', '2025-07-09 04:59:40', 'Registration', 1),
(6, 'Career Fair', 'Annual career fair on September 15th in the Student Center. Over 50 companies attending!', '2025-07-06 10:30:00', NULL, '2025-07-09 04:59:40', '2025-07-09 04:59:40', 'Events', 0),
(7, 'Math Department Meeting', 'All math students: Mandatory department meeting on July 20th at 3pm in room 204.', '2025-07-05 14:15:00', 2, '2025-07-09 04:59:40', '2025-07-09 04:59:40', 'Department', 1),
(8, 'Scholarship Applications', 'Applications for fall scholarships now open. Deadline is July 30th.', '2025-07-04 11:00:00', NULL, '2025-07-09 04:59:40', '2025-07-09 04:59:40', 'Registration', 0),
(9, 'Campus Cleanup Day', 'Volunteer for campus cleanup day on July 25th. Sign up at the student center.', '2025-07-03 13:45:00', NULL, '2025-07-09 04:59:40', '2025-07-09 04:59:40', 'Events', 0),
(10, 'EE Lab Safety Training', 'All EE students must complete lab safety training by July 15th.', '2025-07-02 16:20:00', 3, '2025-07-09 04:59:40', '2025-07-09 04:59:40', 'Department', 1),
(11, 'Grade Appeal Deadline', 'Last day to appeal spring semester grades is July 10th.', '2025-07-01 09:30:00', NULL, '2025-07-09 04:59:40', '2025-07-09 04:59:40', 'Registration', 0),
(12, 'Hackathon Announcement', 'Annual coding hackathon scheduled for August 5-6. Register at csdept.edu/hackathon', '2025-06-30 10:00:00', 1, '2025-07-09 04:59:40', '2025-07-09 04:59:40', 'Events', 0);

-- --------------------------------------------------------

--
-- Table structure for table `assignments`
--

CREATE TABLE `assignments` (
  `assignment_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `due_date` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assignments`
--

INSERT INTO `assignments` (`assignment_id`, `course_id`, `title`, `description`, `due_date`, `created_at`, `updated_at`) VALUES
(1, 1, 'Python Basics', 'Complete exercises 1-10 from chapter 1', '2025-07-15 23:59:00', '2025-07-09 04:42:40', '2025-07-09 04:42:40'),
(2, 1, 'Functions Assignment', 'Create 5 different functions with documentation', '2025-07-22 23:59:00', '2025-07-09 04:42:40', '2025-07-09 04:42:40'),
(3, 1, 'Final Project', 'Build a console-based calculator', '2025-08-10 23:59:00', '2025-07-09 04:42:40', '2025-07-09 04:42:40'),
(4, 2, 'Linked Lists', 'Implement singly and doubly linked lists', '2025-07-18 23:59:00', '2025-07-09 04:42:40', '2025-07-09 04:42:40'),
(5, 2, 'Sorting Algorithms', 'Compare performance of 3 sorting algorithms', '2025-07-25 23:59:00', '2025-07-09 04:42:40', '2025-07-09 04:42:40'),
(6, 3, 'Integration Problems', 'Solve problems 1-20 from chapter 3', '2025-07-16 23:59:00', '2025-07-09 04:42:40', '2025-07-09 04:42:40'),
(7, 3, 'Series Convergence', 'Prove convergence of given series', '2025-07-30 23:59:00', '2025-07-09 04:42:40', '2025-07-09 04:42:40'),
(8, 4, 'Circuit Analysis', 'Analyze given circuit diagrams', '2025-07-20 23:59:00', '2025-07-09 04:42:40', '2025-07-09 04:42:40'),
(9, 5, 'Case Study', 'Write analysis of provided business case', '2025-07-17 23:59:00', '2025-07-09 04:42:40', '2025-07-09 04:42:40');

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `attendance_id` int(11) NOT NULL,
  `enrollment_id` int(11) DEFAULT NULL,
  `date` date NOT NULL,
  `status` enum('Present','Absent','Late','Excused') DEFAULT 'Present',
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`attendance_id`, `enrollment_id`, `date`, `status`, `remarks`, `created_at`, `updated_at`) VALUES
(1, 1, '2025-07-01', 'Present', 'On time', '2025-07-09 04:47:13', '2025-07-09 04:47:13'),
(2, 1, '2025-07-03', 'Present', 'Participated actively', '2025-07-09 04:47:13', '2025-07-09 04:47:13'),
(3, 1, '2025-07-05', 'Absent', 'Medical leave', '2025-07-09 04:47:13', '2025-07-09 04:47:13'),
(4, 1, '2025-07-08', 'Present', '', '2025-07-09 04:47:13', '2025-07-09 04:47:13'),
(5, 1, '2025-07-10', 'Late', 'Arrived 15 minutes late', '2025-07-09 04:47:13', '2025-07-09 04:47:13'),
(6, 2, '2025-07-02', 'Present', '', '2025-07-09 04:47:13', '2025-07-09 04:47:13'),
(7, 2, '2025-07-04', 'Present', 'Asked good questions', '2025-07-09 04:47:13', '2025-07-09 04:47:13'),
(8, 2, '2025-07-06', 'Present', '', '2025-07-09 04:47:13', '2025-07-09 04:47:13'),
(9, 2, '2025-07-09', 'Present', '', '2025-07-09 04:47:13', '2025-07-09 04:47:13'),
(10, 4, '2025-07-01', 'Present', '', '2025-07-09 04:47:13', '2025-07-09 04:47:13'),
(11, 4, '2025-07-03', 'Absent', 'Family emergency', '2025-07-09 04:47:13', '2025-07-09 04:47:13'),
(12, 4, '2025-07-05', 'Present', '', '2025-07-09 04:47:13', '2025-07-09 04:47:13'),
(13, 4, '2025-07-08', 'Present', '', '2025-07-09 04:47:13', '2025-07-09 04:47:13'),
(14, 5, '2025-07-02', 'Present', '', '2025-07-09 04:47:13', '2025-07-09 04:47:13'),
(15, 5, '2025-07-04', 'Present', '', '2025-07-09 04:47:13', '2025-07-09 04:47:13'),
(16, 5, '2025-07-06', 'Present', '', '2025-07-09 04:47:13', '2025-07-09 04:47:13'),
(17, 5, '2025-07-09', 'Late', 'Technical issues', '2025-07-09 04:47:13', '2025-07-09 04:47:13');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `course_id` int(11) NOT NULL,
  `code` varchar(20) NOT NULL,
  `title` varchar(100) NOT NULL,
  `credits` int(11) NOT NULL,
  `semester_offered` varchar(50) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL,
  `instructor_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`course_id`, `code`, `title`, `credits`, `semester_offered`, `department_id`, `instructor_id`, `created_at`, `updated_at`) VALUES
(1, 'CS101', 'Introduction to Programming', 3, NULL, 1, 1, '2025-07-08 01:04:13', '2025-07-08 01:04:13'),
(2, 'CS202', 'Data Structures', 4, NULL, 1, 1, '2025-07-08 01:04:13', '2025-07-08 01:04:13'),
(3, 'MATH201', 'Calculus II', 4, NULL, 2, 2, '2025-07-08 01:04:13', '2025-07-08 01:04:13'),
(4, 'EE301', 'Circuit Theory', 3, NULL, 3, 3, '2025-07-08 01:04:13', '2025-07-08 01:04:13'),
(5, 'BUS101', 'Principles of Management', 3, NULL, 4, 4, '2025-07-08 01:04:13', '2025-07-08 01:04:13');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `department_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`department_id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Computer Science', '2025-07-08 01:04:12', '2025-07-08 01:04:12'),
(2, 'Mathematics', '2025-07-08 01:04:12', '2025-07-08 01:04:12'),
(3, 'Electrical Engineering', '2025-07-08 01:04:12', '2025-07-08 01:04:12'),
(4, 'Business Administration', '2025-07-08 01:04:12', '2025-07-08 01:04:12');

-- --------------------------------------------------------

--
-- Table structure for table `enrollments`
--

CREATE TABLE `enrollments` (
  `enrollment_id` int(11) NOT NULL,
  `student_id` int(11) DEFAULT NULL,
  `course_id` int(11) DEFAULT NULL,
  `enrollment_date` date DEFAULT curdate(),
  `grade` varchar(2) DEFAULT NULL,
  `status` enum('Registered','Completed') DEFAULT 'Registered',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `enrollments`
--

INSERT INTO `enrollments` (`enrollment_id`, `student_id`, `course_id`, `enrollment_date`, `grade`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2025-07-09', 'A', 'Completed', '2025-07-09 00:02:16', '2025-07-09 03:09:05'),
(2, 1, 3, '2025-07-09', 'A-', 'Completed', '2025-07-09 00:02:16', '2025-07-09 03:09:05'),
(3, 2, 5, '2025-07-09', 'A', 'Completed', '2025-07-09 00:02:16', '2025-07-09 00:02:16'),
(4, 1, 4, '2025-07-09', 'B', 'Completed', '2025-07-09 03:09:05', '2025-07-09 03:09:05'),
(5, 1, 2, '2025-07-09', NULL, 'Registered', '2025-07-09 04:23:13', '2025-07-09 04:23:13'),
(6, 2, 4, '2025-07-09', NULL, 'Registered', '2025-07-09 05:07:24', '2025-07-09 05:07:24'),
(7, 2, 2, '2025-07-09', NULL, 'Registered', '2025-07-09 05:07:26', '2025-07-09 05:07:26'),
(8, 2, 1, '2025-07-09', NULL, 'Registered', '2025-07-09 05:07:26', '2025-07-09 05:07:26'),
(9, 2, 3, '2025-07-09', NULL, 'Registered', '2025-07-09 05:07:27', '2025-07-09 05:07:27');

--
-- Triggers `enrollments`
--
DELIMITER $$
CREATE TRIGGER `after_grade_update` AFTER UPDATE ON `enrollments` FOR EACH ROW BEGIN
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
      END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `before_enrollment_insert` BEFORE INSERT ON `enrollments` FOR EACH ROW BEGIN
        IF NEW.enrollment_date IS NULL THEN
          SET NEW.enrollment_date = CURDATE();
        END IF;
      END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `prevent_duplicate_enrollment` BEFORE INSERT ON `enrollments` FOR EACH ROW BEGIN
        DECLARE existing_count INT;
        
        SELECT COUNT(*) INTO existing_count
        FROM enrollments
        WHERE student_id = NEW.student_id AND course_id = NEW.course_id;
        
        IF existing_count > 0 THEN
          SIGNAL SQLSTATE '45000'
          SET MESSAGE_TEXT = 'Student is already enrolled in this course';
        END IF;
      END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `grade_points`
--

CREATE TABLE `grade_points` (
  `grade` varchar(2) NOT NULL,
  `point_value` decimal(3,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `grade_points`
--

INSERT INTO `grade_points` (`grade`, `point_value`) VALUES
('A', 4.00),
('A-', 3.70),
('B', 3.00),
('B+', 3.30),
('B-', 2.70),
('C', 2.00),
('C+', 2.30),
('C-', 1.70),
('D', 1.00),
('D+', 1.30),
('F', 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `instructors`
--

CREATE TABLE `instructors` (
  `instructor_id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `department_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `instructors`
--

INSERT INTO `instructors` (`instructor_id`, `first_name`, `last_name`, `email`, `department_id`, `created_at`, `updated_at`) VALUES
(1, 'John', 'Smith', 'john.smith@university.edu', 1, '2025-07-08 01:04:13', '2025-07-08 01:04:13'),
(2, 'Emily', 'Johnson', 'emily.johnson@university.edu', 2, '2025-07-08 01:04:13', '2025-07-08 01:04:13'),
(3, 'Michael', 'Brown', 'michael.brown@university.edu', 3, '2025-07-08 01:04:13', '2025-07-08 01:04:13'),
(4, 'Sarah', 'Lee', 'sarah.lee@university.edu', 4, '2025-07-08 01:04:13', '2025-07-08 01:04:13');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `student_id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `zip_code` varchar(20) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `enrollment_date` date DEFAULT curdate(),
  `department_id` int(11) DEFAULT NULL,
  `status` enum('Active','Inactive','Graduated') DEFAULT 'Active',
  `profile_image_url` varchar(255) DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiry` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `registration_number` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`student_id`, `first_name`, `last_name`, `email`, `password`, `phone`, `address`, `city`, `state`, `zip_code`, `country`, `dob`, `gender`, `enrollment_date`, `department_id`, `status`, `profile_image_url`, `reset_token`, `reset_token_expiry`, `created_at`, `updated_at`, `registration_number`) VALUES
(1, 'Mahin', 'Jawad', 'mahin1575@gmail.com', '$2b$10$8Pd.5/VSS.Igs8oSgJDhcOegwPyDjOOkCazRovZwfzTxGjRz8Y76i', '01744842814', 'Depz, Ashulia,Savar, Dhaka', 'Savar', 'Bolivodro', 'Dhamshona-1349', 'Bangladesh', '2004-06-15', 'Male', '2025-07-08', 1, 'Graduated', 'https://i.ibb.co/6cfsKn5x/less-prof-less.jpg', NULL, NULL, '2025-07-08 02:42:47', '2025-07-09 03:09:05', '202104023'),
(2, 'Mahin', 'Tanzim', 'mtanzim229@gmail.com', '$2b$10$2UqIo1mByuBIIViU7apnbuDpYf/Vv.JfXk8ole6EUBYorhyJaHr7y', '01744842814', 'Depz, Ashulia,Savar, Dhaka', 'Savar', 'Bolivodro', 'Dhamshona-1349', 'Bangladesh', '2003-06-10', 'Male', '2025-07-08', 1, 'Active', 'https://i.ibb.co/6cfsKn5x/less-prof-less.jpg', NULL, NULL, '2025-07-08 23:15:56', '2025-07-08 23:15:56', '202205023');

-- --------------------------------------------------------

--
-- Table structure for table `student_assignments`
--

CREATE TABLE `student_assignments` (
  `student_assignment_id` int(11) NOT NULL,
  `assignment_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `submission_link` varchar(255) DEFAULT NULL,
  `submission_date` datetime DEFAULT NULL,
  `score` decimal(5,2) DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  `status` enum('Pending','Submitted','Graded') DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_assignments`
--

INSERT INTO `student_assignments` (`student_assignment_id`, `assignment_id`, `student_id`, `submission_link`, `submission_date`, `score`, `feedback`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 1, NULL, NULL, NULL, NULL, 'Pending', '2025-07-09 04:43:29', '2025-07-09 04:43:29'),
(2, 2, 1, 'https://drive.google.com/file/d/cs101-python-basics-mtanzim', '2025-07-10 14:30:00', NULL, NULL, 'Submitted', '2025-07-09 04:43:29', '2025-07-09 04:43:29'),
(3, 4, 1, 'https://drive.google.com/file/d/cs101-functions-mtanzim', '2025-07-05 10:15:00', 92.50, 'Excellent implementation, just missing docstrings for 2 functions', 'Graded', '2025-07-09 04:43:29', '2025-07-09 04:43:29'),
(4, 6, 1, NULL, NULL, NULL, NULL, 'Pending', '2025-07-09 04:43:29', '2025-07-09 04:43:29'),
(5, 8, 1, NULL, NULL, NULL, NULL, 'Pending', '2025-07-09 04:43:29', '2025-07-09 04:43:29'),
(6, 1, 2, NULL, NULL, NULL, NULL, 'Submitted', '2025-07-09 04:43:29', '2025-07-09 04:43:29'),
(7, 2, 2, NULL, NULL, NULL, NULL, 'Graded', '2025-07-09 04:43:29', '2025-07-09 04:43:29'),
(8, 9, 2, NULL, NULL, NULL, NULL, 'Pending', '2025-07-09 04:43:29', '2025-07-09 04:43:29');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`announcement_id`),
  ADD KEY `idx_announcement_department` (`target_department`);

--
-- Indexes for table `assignments`
--
ALTER TABLE `assignments`
  ADD PRIMARY KEY (`assignment_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`attendance_id`),
  ADD KEY `idx_attendance_enrollment` (`enrollment_id`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`course_id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `idx_course_department` (`department_id`),
  ADD KEY `idx_course_instructor` (`instructor_id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`department_id`);

--
-- Indexes for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`enrollment_id`),
  ADD UNIQUE KEY `student_id` (`student_id`,`course_id`),
  ADD KEY `idx_enrollment_student` (`student_id`),
  ADD KEY `idx_enrollment_course` (`course_id`);

--
-- Indexes for table `grade_points`
--
ALTER TABLE `grade_points`
  ADD PRIMARY KEY (`grade`);

--
-- Indexes for table `instructors`
--
ALTER TABLE `instructors`
  ADD PRIMARY KEY (`instructor_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `department_id` (`department_id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`student_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `registration_number` (`registration_number`),
  ADD KEY `idx_student_email` (`email`),
  ADD KEY `idx_student_department` (`department_id`);

--
-- Indexes for table `student_assignments`
--
ALTER TABLE `student_assignments`
  ADD PRIMARY KEY (`student_assignment_id`),
  ADD KEY `assignment_id` (`assignment_id`),
  ADD KEY `student_id` (`student_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `announcement_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `assignments`
--
ALTER TABLE `assignments`
  MODIFY `assignment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `attendance_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `course_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `department_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `enrollments`
--
ALTER TABLE `enrollments`
  MODIFY `enrollment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `instructors`
--
ALTER TABLE `instructors`
  MODIFY `instructor_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `student_assignments`
--
ALTER TABLE `student_assignments`
  MODIFY `student_assignment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `announcements`
--
ALTER TABLE `announcements`
  ADD CONSTRAINT `announcements_ibfk_1` FOREIGN KEY (`target_department`) REFERENCES `departments` (`department_id`);

--
-- Constraints for table `assignments`
--
ALTER TABLE `assignments`
  ADD CONSTRAINT `assignments_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`);

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollments` (`enrollment_id`) ON DELETE CASCADE;

--
-- Constraints for table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`),
  ADD CONSTRAINT `courses_ibfk_2` FOREIGN KEY (`instructor_id`) REFERENCES `instructors` (`instructor_id`);

--
-- Constraints for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE;

--
-- Constraints for table `instructors`
--
ALTER TABLE `instructors`
  ADD CONSTRAINT `instructors_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`);

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`);

--
-- Constraints for table `student_assignments`
--
ALTER TABLE `student_assignments`
  ADD CONSTRAINT `student_assignments_ibfk_1` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`assignment_id`),
  ADD CONSTRAINT `student_assignments_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
