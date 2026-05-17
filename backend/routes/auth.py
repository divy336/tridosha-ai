from flask import Blueprint, request, jsonify
from db import conn, cur
import uuid
import bcrypt
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
from utils.send_reset_email import send_reset_email

from utils.send_otp import send_otp

auth = Blueprint("auth", __name__)




# SIGNUP
@auth.route("/api/signup", methods=["POST"])
def signup():

    try:

        data = request.get_json()

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

            return jsonify({

                "message": "New OTP Sent"

            })

   
        hashed_password = bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt()
        )

        # INSERT USER
        cur.execute(

            """
            INSERT INTO users
            (full_name, email, password)

            VALUES (%s, %s, %s)
            """,

            (
                full_name,
                email,
                hashed_password.decode("utf-8")
            )

        )

        conn.commit()

      
        send_otp(email)

        return jsonify({

            "message": "Signup Successful"

        })

    except Exception as e:

        conn.rollback()

        print(e)

        return jsonify({
            "message": "Server Error"
        }), 500
    
@auth.route("/api/verify-otp", methods=["POST"])
def verify_otp():

    data = request.get_json()

    email = data["email"]
    otp = data["otp"]

    # FIND OTP
    cur.execute(

        """
        SELECT * FROM otp_codes
        WHERE email=%s AND otp_code=%s
        """,

        (email, otp)

    )

    otp_data = cur.fetchone()

    # INVALID OTP
    if otp_data is None:

        return jsonify({
            "message": "Invalid OTP"
        }), 400

    # UPDATE USER VERIFIED
    cur.execute(

        """
        UPDATE users
        SET is_verified = TRUE
        WHERE email=%s
        """,

        (email,)

    )

    conn.commit()

    return jsonify({

        "message": "OTP Verified Successfully"

    })
    
    
@auth.route("/api/login", methods=["POST"])
def login():

    try:

        data = request.get_json()

        email = data["email"]
        password = data["password"]

        # FIND USER
        cur.execute(

            """
            SELECT * FROM users
            WHERE email=%s
            """,

            (email,)

        )

        user = cur.fetchone()

        # USER NOT FOUND
        if user is None:

            return jsonify({
                "message": "User Not Found"
            }), 404

        # CHECK VERIFIED
        if user[4] == False:

            return jsonify({
                "message": "Please Verify OTP First"
            }), 401

        stored_password = user[3]

        # CHECK PASSWORD
        if bcrypt.checkpw(

            password.encode("utf-8"),

            stored_password.encode("utf-8")

        ):

            return jsonify({

                "message": "Login Successful"

            })

        return jsonify({

            "message": "Invalid Password"

        }), 401

    except Exception as e:

        conn.rollback()

        print(e)

        return jsonify({
            "message": "Server Error"
        }), 500    
    
@auth.route("/api/forgot-password", methods=["POST"])
def forgot_password():

    try:

        data = request.get_json()

        email = data["email"]

        cur.execute(
            "SELECT * FROM users WHERE email=%s",
            (email,)
        )

        user = cur.fetchone()

        if user is None:

            return jsonify({
                "message": "User not found"
            }), 404

        token = str(uuid.uuid4())

        cur.execute(

            """
            INSERT INTO password_reset_tokens
            (email, token)

            VALUES (%s, %s)
            """,

            (email, token)

        )

        conn.commit()

        reset_link = f"http://localhost:5173/reset-password?token={token}&email={email}"

        # SEND EMAIL
        send_reset_email(
            email,
            reset_link
        )

        return jsonify({

            "message": "Reset link sent"

        })

    except Exception as e:

        conn.rollback()

        print(e)

        return jsonify({
            "message": "Server error"
        }), 500 
        
@auth.route("/api/reset-password", methods=["POST"])
def reset_password():
    try:
        data = request.get_json()
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
            return jsonify({"message": "Invalid or expired token"}), 400

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

        return jsonify({"message": "Password updated successfully"}), 200

    except Exception as e:
        conn.rollback()
        print(e)
        return jsonify({"message": "Server error"}), 500        