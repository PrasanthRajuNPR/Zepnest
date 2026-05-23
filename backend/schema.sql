-- Zepnest Service Request Application
-- Database Schema
-- Run this file to initialize your MySQL database

CREATE DATABASE IF NOT EXISTS zepnest;
USE zepnest;

-- ─────────────────────────────────────────
-- USERS TABLE
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          INT          NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────
-- ADMINS TABLE
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admins (
  id          INT          NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_admins_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────
-- REQUESTS TABLE
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS requests (
  id             INT          NOT NULL AUTO_INCREMENT,
  user_id        INT          NOT NULL,
  title          VARCHAR(200) NOT NULL,
  description    TEXT         NOT NULL,
  category       VARCHAR(100) NOT NULL,
  address        TEXT         NOT NULL,
  preferred_time DATETIME     NOT NULL,
  status         ENUM('Pending','In Progress','Completed','Cancelled') NOT NULL DEFAULT 'Pending',
  image_url      VARCHAR(500) NULL,
  created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_requests_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_requests_user_id (user_id),
  INDEX idx_requests_status  (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────
-- SEED: Default Admin Account
-- Password: Admin@123  (hashed with bcryptjs, saltRounds=10)
-- ─────────────────────────────────────────
INSERT INTO admins (name, email, password) VALUES
  ('Super Admin', 'admin@zepnest.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON DUPLICATE KEY UPDATE id = id;

-- Note: The hashed password above corresponds to "Admin@123"
-- Change this immediately after first login in production!
