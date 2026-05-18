from flask import Blueprint, request, jsonify

from utils.send_admin_otp import send_admin_otp

from db import conn, cur

import bcrypt
from utils.send_admin_reset_otp import send_admin_reset_otp


admin = Blueprint("admin", __name__)


@admin.route("/api/admin/signup", methods=["POST"])
def admin_signup():

    try:

        data = request.get_json()

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

                return jsonify({

                    "message": "Already Admin"

                }), 400

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

            return jsonify({

                "message": "tara boss the OG divy ne ke otp ape"

            })

      

        hashed_password = bcrypt.hashpw(

            password.encode("utf-8"),

            bcrypt.gensalt()

        )

        # INSERT ADMIN
        cur.execute(

            """
            INSERT INTO users
            (
                full_name,
                email,
                password,
                is_admin
            )

            VALUES (%s, %s, %s, %s)
            """,

            (
                full_name,
                email,
                hashed_password.decode("utf-8"),
                True
            )

        )

        conn.commit()

        # SEND OTP
        send_admin_otp(email)

        return jsonify({

            "message": "tara boss the OG divy ne ke otp ape"

        })

    except Exception as e:

        conn.rollback()

        print(e)

        return jsonify({

            "message": "Server Error"

        }), 500
        
@admin.route(
    "/api/admin/verify-otp",
    methods=["POST"]
)
def admin_verify_otp():

    try:

        data = request.get_json()

        email = data["email"]

        otp = data["otp"]

        # CHECK OTP
        cur.execute(

            """
            SELECT * FROM otp_codes
            WHERE email=%s
            AND otp_code=%s
            """,

            (email, otp)

        )

        otp_data = cur.fetchone()

        # INVALID OTP
        if otp_data is None:

            return jsonify({

                "message": "Invalid OTP"

            }), 400

        # VERIFY ADMIN
        cur.execute(

            """
            UPDATE users
            SET is_verified=TRUE
            WHERE email=%s
            """,

            (email,)

        )

        conn.commit()

        # DELETE USED OTP
        cur.execute(

            """
            DELETE FROM otp_codes
            WHERE email=%s
            """,

            (email,)

        )

        conn.commit()

        return jsonify({

            "message": "Admin Verified mc"

        })

    except Exception as e:

        conn.rollback()

        print(e)

        return jsonify({

            "message": "Server Error"

        }), 500        
        
        
@admin.route(
    "/api/admin/login",
    methods=["POST"]
)
def admin_login():

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

                "message": "Admin Not Found"

            }), 404

        # CHECK ADMIN
        if user[5] == False:

            return jsonify({

                "message": "Not Admin Account"

            }), 403

        # CHECK VERIFIED
        if user[4] == False:

            return jsonify({

                "message": "Admin Not Verified"

            }), 403

        # CHECK PASSWORD
        valid_password = bcrypt.checkpw(

            password.encode("utf-8"),

            user[3].encode("utf-8")

        )

        if not valid_password:

            return jsonify({

                "message": "Invalid Password"

            }), 401

        return jsonify({

            "message": "jaooo jovo admin na data "

        })

    except Exception as e:

        print(e)

        return jsonify({

            "message": "Server Error"

        }), 500        
     
     
@admin.route(
    "/api/admin/forgot-password",
    methods=["POST"]
)
def admin_forgot_password():

    try:

        data = request.get_json()

        email = data["email"]

        # CHECK ADMIN
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

            return jsonify({

                "message": "Admin Not Found"

            }), 404

        # SEND RESET OTP
        send_admin_reset_otp(email)

        return jsonify({

            "message": "loda email ma jo madaram chodaram "

        })

    except Exception as e:

        print(e)

        return jsonify({

            "message": "Server Error"

        }), 500        
      
      
@admin.route(
    "/api/admin/forgot-password/verify-otp",
    methods=["POST"]
)
def admin_forgot_verify_otp():

    try:

        data = request.get_json()

        email = data["email"]

        otp = data["otp"]

        # CHECK OTP
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

            return jsonify({

                "message": "Invalid OTP"

            }), 400

        return jsonify({

            "message": "OTP Verified thai gayu yeeeee 😉"

        })

    except Exception as e:

        print(e)

        return jsonify({

            "message": "Server Error"

        }), 500
        
@admin.route(
    "/api/admin/reset-password",
    methods=["POST"]
)
def admin_reset_password():

    try:

        data = request.get_json()

        email = data["email"]

        new_password = data["new_password"]

        # HASH PASSWORD
        hashed_password = bcrypt.hashpw(

            new_password.encode("utf-8"),

            bcrypt.gensalt()

        )

        # UPDATE PASSWORD
        cur.execute(

            """
            UPDATE users
            SET password=%s
            WHERE email=%s
            """,

            (
                hashed_password.decode("utf-8"),
                email
            )

        )

        conn.commit()

        # DELETE OTP
        cur.execute(

            """
            DELETE FROM otp_codes
            WHERE email=%s
            """,

            (email,)

        )

        conn.commit()

        return jsonify({

            "message": "le benco password reset"

        })

    except Exception as e:

        conn.rollback()

        print(e)

        return jsonify({

            "message": "Server Error"

        }), 500