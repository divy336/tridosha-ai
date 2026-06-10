from db import conn, cur
import bcrypt
from utils.send_admin_otp import send_admin_otp
from utils.send_admin_reset_otp import send_admin_reset_otp


def _get_user_by_email(email):
    cur.execute(
        """
        SELECT id, full_name, email, password, is_verified, role
        FROM users
        WHERE email=%s
        """,
        (email,)
    )
    return cur.fetchone()


def handle_admin_signup(data):
    try:
        full_name = data["full_name"]
        email = data["email"]
        password = data["password"]

        cur.execute(
            """
            SELECT id, full_name, email, password, is_verified, role
            FROM users
            WHERE email=%s
            """,
            (email,)
        )
        existing_user = cur.fetchone()

        hashed_password = bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        if existing_user:
            existing_role = existing_user[5]

            if existing_role in ("admin", "owner"):
                return {"message": "Already Admin"}, 400

            cur.execute(
                """
                UPDATE users
                SET role=%s
                WHERE email=%s
                """,
                ("pending_admin", email)
            )
            conn.commit()

            send_admin_otp(email)
            return {"message": "Admin approval OTP sent"}, 200

        cur.execute(
            """
            INSERT INTO users (full_name, email, password, is_verified, role)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (full_name, email, hashed_password, False, "pending_admin")
        )
        conn.commit()

        send_admin_otp(email)
        return {"message": "Admin approval OTP sent"}, 200

    except Exception as e:
        conn.rollback()
        print(e)
        return {"message": "Server Error"}, 500


def handle_admin_verify_otp(data):
    try:
        email = data["email"]
        otp = data["otp"]

        cur.execute(
            """
            SELECT id
            FROM otp_codes
            WHERE email=%s
            AND otp_code=%s
            """,
            (email, otp)
        )
        otp_data = cur.fetchone()

        if otp_data is None:
            return {"message": "Invalid OTP"}, 400

        cur.execute(
            """
            UPDATE users
            SET is_verified=TRUE,
                role='admin'
            WHERE email=%s
            AND role='pending_admin'
            """,
            (email,)
        )

        if cur.rowcount == 0:
            conn.rollback()
            return {"message": "No pending admin request found"}, 400

        cur.execute(
            """
            DELETE FROM otp_codes
            WHERE email=%s
            """,
            (email,)
        )

        conn.commit()
        return {"message": "Admin Verified"}, 200

    except Exception as e:
        conn.rollback()
        print(e)
        return {"message": "Server Error"}, 500


def handle_admin_login(data):
    try:
        email = data["email"]
        password = data["password"]

        cur.execute(
            """
            SELECT id, full_name, email, password, is_verified, role
            FROM users
            WHERE email=%s
            """,
            (email,)
        )
        user = cur.fetchone()

        if user is None:
            return {"message": "Admin Not Found"}, 404

        user_password = user[3]
        is_verified = user[4]
        role = user[5]

        if role not in ("admin", "owner"):
            return {"message": "Not Admin Account"}, 403

        if not is_verified:
            return {"message": "Admin Not Verified"}, 403

        valid_password = bcrypt.checkpw(
            password.encode("utf-8"),
            user_password.encode("utf-8")
        )

        if not valid_password:
            return {"message": "Invalid Password"}, 401

        return {
            "message": "login",
            "role": role
        }, 200

    except Exception as e:
        print(e)
        return {"message": "Server Error"}, 500


def handle_admin_forgot_password(data):
    try:
        email = data["email"]

        cur.execute(
            """
            SELECT id, full_name, email, password, is_verified, role
            FROM users
            WHERE email=%s
            """,
            (email,)
        )
        admin_user = cur.fetchone()

        if admin_user is None:
            return {"message": "Admin Not Found"}, 404

        role = admin_user[5]

        if role not in ("admin", "owner"):
            return {"message": "Not Admin Account"}, 403

        send_admin_reset_otp(email)
        return {"message": "check your gmail"}, 200

    except Exception as e:
        print(e)
        return {"message": "Server Error"}, 500


def handle_admin_forgot_verify_otp(data):
    try:
        email = data["email"]
        otp = data["otp"]

        cur.execute(
            """
            SELECT id
            FROM otp_codes
            WHERE email=%s
            AND otp_code=%s
            """,
            (email, otp)
        )
        otp_data = cur.fetchone()

        if otp_data is None:
            return {"message": "Invalid OTP"}, 400

        cur.execute(
            """
            SELECT role
            FROM users
            WHERE email=%s
            """,
            (email,)
        )
        user = cur.fetchone()

        if user is None:
            return {"message": "Admin Not Found"}, 404

        role = user[0]
        if role not in ("admin", "owner"):
            return {"message": "Not Admin Account"}, 403

        return {"message": "OTP Verified"}, 200

    except Exception as e:
        print(e)
        return {"message": "Server Error"}, 500


def handle_admin_reset_password(data):
    try:
        email = data["email"]
        new_password = data["new_password"]

        cur.execute(
            """
            SELECT role
            FROM users
            WHERE email=%s
            """,
            (email,)
        )
        user = cur.fetchone()

        if user is None:
            return {"message": "Admin Not Found"}, 404

        role = user[0]
        if role not in ("admin", "owner"):
            return {"message": "Not Admin Account"}, 403

        hashed_password = bcrypt.hashpw(
            new_password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        cur.execute(
            """
            UPDATE users
            SET password=%s
            WHERE email=%s
            """,
            (hashed_password, email)
        )

        cur.execute(
            """
            DELETE FROM otp_codes
            WHERE email=%s
            """,
            (email,)
        )

        conn.commit()
        return {"message": "password reset"}, 200

    except Exception as e:
        conn.rollback()
        print(e)
        return {"message": "Server Error"}, 500