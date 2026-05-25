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


CREATE TABLE assessments (

    id SERIAL PRIMARY KEY,

    user_id INTEGER REFERENCES users(id)
    ON DELETE CASCADE,

    body_frame VARCHAR(10),

    skin_type VARCHAR(10),

    hair_type VARCHAR(10),

    weight_pattern VARCHAR(10),

    appetite VARCHAR(10),

    digestion VARCHAR(10),

    thirst VARCHAR(10),

    mind_state VARCHAR(10),

    sleep_pattern VARCHAR(10),

    climate_preference VARCHAR(10),

    symptoms TEXT,

    dominant_dosha VARCHAR(50),

    constitution_type VARCHAR(50),

    vata_percentage FLOAT,

    pitta_percentage FLOAT,

    kapha_percentage FLOAT,

    wellness_score FLOAT,

    created_at TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP

);