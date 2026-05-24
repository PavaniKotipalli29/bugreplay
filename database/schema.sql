/*
========================================
CREATE DATABASE
========================================
*/

CREATE DATABASE IF NOT EXISTS bugreplay;

USE bugreplay;

/*
========================================
USERS TABLE
========================================
*/

CREATE TABLE IF NOT EXISTS users (

    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(150)
    UNIQUE NOT NULL,

    password VARCHAR(255) NOT NULL,

    role ENUM(
        'user',
        'admin'
    ) DEFAULT 'user',

    created_at TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP

);

/*
========================================
BUGS TABLE
========================================
*/

CREATE TABLE IF NOT EXISTS bugs (

    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    assigned_to INT NULL,

    title VARCHAR(255) NOT NULL,

    description TEXT,

    expected_result TEXT,

    actual_result TEXT,

    severity ENUM(
        'Low',
        'Medium',
        'High'
    ) DEFAULT 'Low',

    priority ENUM(
        'Low',
        'Medium',
        'High',
        'Critical'
    ) DEFAULT 'Medium',

    status ENUM(
        'Open',
        'In Progress',
        'Resolved'
    ) DEFAULT 'Open',

    created_at TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

    FOREIGN KEY (assigned_to)
    REFERENCES users(id)
    ON DELETE SET NULL

);

/*
========================================
STEPS TABLE
========================================
*/

CREATE TABLE IF NOT EXISTS steps (

    id INT AUTO_INCREMENT PRIMARY KEY,

    bug_id INT NOT NULL,

    step_number INT NOT NULL,

    content TEXT NOT NULL,

    FOREIGN KEY (bug_id)
    REFERENCES bugs(id)
    ON DELETE CASCADE,

    UNIQUE (
        bug_id,
        step_number
    )

);

/*
========================================
SCREENSHOTS TABLE
========================================
*/

CREATE TABLE IF NOT EXISTS screenshots (

    id INT AUTO_INCREMENT PRIMARY KEY,

    bug_id INT NOT NULL,

    file_path VARCHAR(255) NOT NULL,

    created_at TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (bug_id)
    REFERENCES bugs(id)
    ON DELETE CASCADE

);

/*
========================================
COMMENTS TABLE
========================================
*/

CREATE TABLE IF NOT EXISTS comments (

    id INT AUTO_INCREMENT PRIMARY KEY,

    bug_id INT NOT NULL,

    user_id INT NOT NULL,

    comment TEXT NOT NULL,

    created_at TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (bug_id)
    REFERENCES bugs(id)
    ON DELETE CASCADE,

    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE

);

/*
========================================
ACTIVITY LOGS TABLE
========================================
*/

CREATE TABLE IF NOT EXISTS activity_logs (

    id INT AUTO_INCREMENT PRIMARY KEY,

    bug_id INT NOT NULL,

    user_id INT NOT NULL,

    action TEXT NOT NULL,

    created_at TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (bug_id)
    REFERENCES bugs(id)
    ON DELETE CASCADE,

    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE

);

/*
========================================
INDEXES
========================================
*/

CREATE INDEX idx_bug_user
ON bugs(user_id);

CREATE INDEX idx_bug_assigned
ON bugs(assigned_to);

CREATE INDEX idx_bug_status
ON bugs(status);

CREATE INDEX idx_bug_priority
ON bugs(priority);

CREATE INDEX idx_bug_severity
ON bugs(severity);

CREATE INDEX idx_bug_updated
ON bugs(updated_at);

CREATE INDEX idx_comment_bug
ON comments(bug_id);

CREATE INDEX idx_step_bug
ON steps(bug_id);

/*
========================================
MAKE USER ADMIN
========================================
*/

UPDATE users
SET role = 'admin'
WHERE email = 'kpavani2k5@gmail.com';

/*
========================================
TEST QUERIES
========================================
*/

SELECT * FROM users;

SELECT
    id,
    name,
    email,
    role
FROM users;

SELECT
    id,
    expected_result,
    actual_result
FROM bugs;