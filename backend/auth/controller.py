from db import conn, cur
import uuid
import bcrypt
from utils.send_otp import send_otp
from utils.send_reset_email import send_reset_email


def handle_signup(data):
    try:
        full_name = data["full_name"]
        email = data["email"]
        password = data["password"]

        cur.execute(
            "SELECT * FROM users WHERE email=%s",
            (email,)
        )
        existing_user = cur.fetchone()

        if existing_user:
            send_otp(email)
            return {"message": "New OTP Sent"}, 200

        hashed_password = bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt()
        )

        cur.execute(
            """
            INSERT INTO users (full_name, email, password)
            VALUES (%s, %s, %s)
            """,
            (full_name, email, hashed_password.decode("utf-8"))
        )
        conn.commit()
        send_otp(email)

        return {"message": "Signup Successful"}, 200

    except Exception as e:
        conn.rollback()
        print(e)
        return {"message": "Server Error"}, 500


def handle_verify_otp(data):
    try:
        email = data["email"]
        otp = data["otp"]

        cur.execute(
            """
            SELECT * FROM otp_codes
            WHERE email=%s AND otp_code=%s
            """,
            (email, otp)
        )
        otp_data = cur.fetchone()

        if otp_data is None:
            return {"message": "Invalid OTP"}, 400

        cur.execute(
            """
            UPDATE users
            SET is_verified = TRUE
            WHERE email=%s
            """,
            (email,)
        )
        conn.commit()

        return {"message": "OTP Verified Successfully"}, 200

    except Exception as e:
        conn.rollback()
        print(e)
        return {"message": "Server Error"}, 500


def handle_login(data):
    try:
        email = data["email"]
        password = data["password"]

        cur.execute(
            """
            SELECT * FROM users
            WHERE email=%s
            """,
            (email,)
        )
        user = cur.fetchone()

        if user is None:
            return {"message": "User Not Found"}, 404

        if user[4] == False:
            return {"message": "Please Verify OTP First"}, 401

        if bcrypt.checkpw(password.encode("utf-8"), user[3].encode("utf-8")):
            return {"message": "Login Successful"}, 200

        return {"message": "Invalid Password"}, 401

    except Exception as e:
        print(e)
        return {"message": "Server Error"}, 500


def handle_forgot_password(data):
    try:
        email = data["email"]

        cur.execute(
            "SELECT * FROM users WHERE email=%s",
            (email,)
        )
        user = cur.fetchone()

        if user is None:
            return {"message": "User not found"}, 404

        token = str(uuid.uuid4())
        cur.execute(
            """
            INSERT INTO password_reset_tokens (email, token)
            VALUES (%s, %s)
            """,
            (email, token)
        )
        conn.commit()

        reset_link = f"http://localhost:5173/reset-password?token={token}&email={email}"
        send_reset_email(email, reset_link)

        return {"message": "Reset link sent"}, 200

    except Exception as e:
        conn.rollback()
        print(e)
        return {"message": "Server error"}, 500


def handle_reset_password(data):
    try:
        email = data["email"]
        token = data["token"]
        password = data["password"]

        cur.execute(
            """
            SELECT * FROM password_reset_tokens
            WHERE email=%s AND token=%s AND is_used=FALSE
            """,
            (email, token)
        )
        token_row = cur.fetchone()

        if token_row is None:
            return {"message": "Invalid or expired token"}, 400

        hashed_password = bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt()
        )

        cur.execute(
            """
            UPDATE users
            SET password=%s
            WHERE email=%s
            """,
            (hashed_password.decode("utf-8"), email)
        )

        cur.execute(
            """
            UPDATE password_reset_tokens
            SET is_used=TRUE
            WHERE email=%s AND token=%s
            """,
            (email, token)
        )
        conn.commit()

        return {"message": "Password updated successfully"}, 200

    except Exception as e:
        conn.rollback()
        print(e)
        return {"message": "Server error"}, 500