-- Create the database
CREATE DATABASE TOTLE_API;
USE TOTLE_API;

-- Drop the database if needed
DROP DATABASE IF EXISTS TOTLE_API;

-- Recreate the database
CREATE DATABASE TOTLE_API;
USE TOTLE_API;

-- Create the tables
CREATE TABLE Categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) DEFAULT NULL
);

CREATE TABLE Educations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) DEFAULT NULL,
    categoryId INT NOT NULL,
    FOREIGN KEY (categoryId) REFERENCES Categories(id) ON DELETE CASCADE
);

CREATE TABLE Boards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) DEFAULT NULL,
    educationId INT NOT NULL,
    FOREIGN KEY (educationId) REFERENCES Educations(id) ON DELETE CASCADE
);

CREATE TABLE Grades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) DEFAULT NULL,
    boardId INT NOT NULL,
    FOREIGN KEY (boardId) REFERENCES Boards(id) ON DELETE CASCADE
);

CREATE TABLE Subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) DEFAULT NULL,
    gradeId INT NOT NULL,
    FOREIGN KEY (gradeId) REFERENCES Grades(id) ON DELETE CASCADE
);

CREATE TABLE Topics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) DEFAULT NULL,
    subjectId INT NOT NULL,
    FOREIGN KEY (subjectId) REFERENCES Subjects(id) ON DELETE CASCADE
);

-- Insert data into tables
INSERT INTO Categories (name, description) VALUES
('Academics', 'Academic-related education.'),
('Skills', 'Skill-building programs.'),
('Arts', 'Creative and artistic education.'),
('Exam Prep', 'Preparation for competitive exams.');

INSERT INTO Education (name, description, categoryId) VALUES
('School', 'Primary and secondary education.', 1),
('College', 'Higher education after school.', 1);

INSERT INTO Boards (name, description, educationId) VALUES
('CBSE', 'Central Board of Secondary Education.', 1),
('ICSE', 'Indian Certificate of Secondary Education.', 1);

INSERT INTO Grades (name, description, boardId) VALUES
('Grade 6', 'Sixth grade education.', 1),
('Grade 7', 'Seventh grade education.', 1),
('Grade 9', 'Ninth grade education.', 2),
('Grade 10', 'Tenth grade education.', 2);

INSERT INTO Subjects (name, description, gradeId) VALUES
('Mathematics', 'The study of numbers and shapes.', 1),
('Science', 'Exploration of the natural world.', 1),
('History', 'Study of past events.', 3),
('Geography', 'Study of Earth and its features.', 3);

INSERT INTO Topics (name, description, subjectId) VALUES
('Ratios', 'Understanding the concept of ratios.', 1),
('Proportions', 'Learning about proportional relationships.', 1),
('Human Anatomy', 'The study of human body parts.', 2),
('World Wars', 'Detailed study of World Wars.', 3),
('Maps and Navigation', 'Using maps for navigation.', 4);

-- Verify table creation
SHOW TABLES;

-- Describe the tables to verify schema
DESC Categories;
DESC Educations;
DESC Boards;
DESC Grades;
DESC Subjects;
DESC Topics;
