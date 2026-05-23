-- ============================================
-- Zepnest Service Request Application
-- Database Schema
-- Run this on your Railway MySQL instance
-- ============================================

CREATE DATABASE IF NOT EXISTS railway;
USE railway;

-- --------------------------------------------
-- Users Table
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  name        VARCHAR(100)  NOT NULL,
  email       VARCHAR(150)  UNIQUE NOT NULL,
  password    VARCHAR(255)  NOT NULL,         -- bcrypt hashed
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------
-- Admins Table
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS admins (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  name        VARCHAR(100)  NOT NULL,
  email       VARCHAR(150)  UNIQUE NOT NULL,
  password    VARCHAR(255)  NOT NULL,         -- bcrypt hashed
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------
-- Requests Table
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS requests (
  id             INT PRIMARY KEY AUTO_INCREMENT,
  user_id        INT          NOT NULL,
  title          VARCHAR(200) NOT NULL,
  description    TEXT         NOT NULL,
  category       VARCHAR(100) NOT NULL,
  address        VARCHAR(300) NOT NULL,
  preferred_time DATETIME     NOT NULL,
  status         ENUM('Pending', 'In Progress', 'Completed', 'Cancelled')
                              NOT NULL DEFAULT 'Pending',
  image_url      VARCHAR(500) DEFAULT NULL,   -- Cloudinary URL
  created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

  INDEX idx_user_id (user_id),
  INDEX idx_status  (status)
);
