from db import conn, cur
import bcrypt
from utils.send_admin_otp import send_admin_otp
from utils.send_admin_reset_otp import send_admin_reset_otp


def handle_admin_signup(data):
    try:
        full_name = data["full_name"]
        email = data["email"]
        password = data["password"]

        cur.execute(
            """
            SELECT * FROM users
            WHERE email=%s
            """,
            (email,)
        )
        existing_user = cur.fetchone()

        if existing_user:
            if existing_user[5] == True:
                return {"message": "Already Admin"}, 400

            cur.execute(
                """
                UPDATE users
                SET is_admin=TRUE
                WHERE email=%s
                """,
                (email,)
            )
            conn.commit()
            send_admin_otp(email)
            return {"message": "tara boss the OG divy ne ke otp ape"}, 200

        hashed_password = bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt()
        )

        cur.execute(
            """
            INSERT INTO users (full_name, email, password, is_admin)
            VALUES (%s, %s, %s, %s)
            """,
            (full_name, email, hashed_password.decode("utf-8"), True)
        )
        conn.commit()
        send_admin_otp(email)

        return {"message": "tara boss the OG divy ne ke otp ape"}, 200

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
            SELECT * FROM otp_codes
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
            SET is_verified=TRUE
            WHERE email=%s
            """,
            (email,)
        )
        conn.commit()

        cur.execute(
            """
            DELETE FROM otp_codes
            WHERE email=%s
            """,
            (email,)
        )
        conn.commit()

        return {"message": "Admin Verified mc"}, 200

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
            SELECT * FROM users
            WHERE email=%s
            """,
            (email,)
        )
        user = cur.fetchone()

        if user is None:
            return {"message": "Admin Not Found"}, 404

        if user[5] == False:
            return {"message": "Not Admin Account"}, 403

        if user[4] == False:
            return {"message": "Admin Not Verified"}, 403

        valid_password = bcrypt.checkpw(
            password.encode("utf-8"),
            user[3].encode("utf-8")
        )

        if not valid_password:
            return {"message": "Invalid Password"}, 401

        return {"message": "jaooo jovo admin na data "}, 200

    except Exception as e:
        print(e)
        return {"message": "Server Error"}, 500


def handle_admin_forgot_password(data):
    try:
        email = data["email"]

        cur.execute(
            """
            SELECT * FROM users
            WHERE email=%s
            AND is_admin=TRUE
            """,
            (email,)
        )
        admin_user = cur.fetchone()

        if admin_user is None:
            return {"message": "Admin Not Found"}, 404

        send_admin_reset_otp(email)

        return {"message": "loda email ma jo madaram chodaram "}, 200

    except Exception as e:
        print(e)
        return {"message": "Server Error"}, 500


def handle_admin_forgot_verify_otp(data):
    try:
        email = data["email"]
        otp = data["otp"]

        cur.execute(
            """
            SELECT * FROM otp_codes
            WHERE email=%s
            AND otp_code=%s
            """,
            (email, otp)
        )
        otp_data = cur.fetchone()

        if otp_data is None:
            return {"message": "Invalid OTP"}, 400

        return {"message": "OTP Verified thai gayu yeeeee 😉"}, 200

    except Exception as e:
        print(e)
        return {"message": "Server Error"}, 500


def handle_admin_reset_password(data):
    try:
        email = data["email"]
        new_password = data["new_password"]

        hashed_password = bcrypt.hashpw(
            new_password.encode("utf-8"),
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
        conn.commit()

        cur.execute(
            """
            DELETE FROM otp_codes
            WHERE email=%s
            """,
            (email,)
        )
        conn.commit()

        return {"message": "le benco password reset"}, 200

    except Exception as e:
        conn.rollback()
        print(e)
        return {"message": "Server Error"}, 500