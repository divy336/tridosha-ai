-- =====================================
-- DATABASE: ayurveda
-- =====================================


create TABLE ayurveda;
-- =====================================
-- USERS TABLE
-- =====================================

CREATE TABLE users (

    id SERIAL PRIMARY KEY,

    full_name VARCHAR(100) NOT NULL,

    email VARCHAR(150) UNIQUE NOT NULL,

    password VARCHAR(255) NOT NULL,

    is_verified BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);



-- =====================================
-- OTP CODES TABLE
-- =====================================

CREATE TABLE otp_codes (

    id SERIAL PRIMARY KEY,

    email VARCHAR(150) NOT NULL,

    otp_code VARCHAR(10) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);



-- =====================================
-- PASSWORD RESET TOKENS TABLE
-- =====================================

CREATE TABLE password_reset_tokens (

    id SERIAL PRIMARY KEY,

    email VARCHAR(150) NOT NULL,

    token VARCHAR(255) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    is_used BOOLEAN DEFAULT FALSE

);