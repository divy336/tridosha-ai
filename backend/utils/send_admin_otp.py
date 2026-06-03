import random

from db import conn, cur

from dotenv import load_dotenv

import os

import sib_api_v3_sdk

from sib_api_v3_sdk.rest import ApiException
    

load_dotenv()

BREVO_API_KEY = os.getenv("BREVO_API_KEY")

configuration = sib_api_v3_sdk.Configuration()

configuration.api_key['api-key'] = BREVO_API_KEY


api_instance = sib_api_v3_sdk.TransactionalEmailsApi(

    sib_api_v3_sdk.ApiClient(configuration)

)


def send_admin_otp(admin_email):

    OWNER_EMAIL = "nagardivya73@gmail.com"

    # DELETE OLD OTP
    cur.execute(

        """
        DELETE FROM otp_codes
        WHERE email=%s
        """,

        (admin_email,)

    )

    conn.commit()

    # GENERATE OTP
    otp = str(random.randint(1000, 9999))

    # STORE OTP
    cur.execute(

        """
        INSERT INTO otp_codes
        (email, otp_code)

        VALUES (%s, %s)
        """,

        (admin_email, otp)

    )

    conn.commit()

    # SEND EMAIL TO OWNER
    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(

        to=[{
            "email": OWNER_EMAIL
        }],

        sender={
            "name": "Tridosha AI",
            "email": OWNER_EMAIL
        },

        subject="New Admin Verification OTP",

        html_content=f"""

        <h1>New Admin Request</h1>

        <p>Admin Email:</p>

        <h3>{admin_email}</h3>

        <p>OTP Code:</p>

        <h2>{otp}</h2>

        """

    )

    try:

        api_instance.send_transac_email(
            send_smtp_email
        )

        print("ADMIN OTP SENT TO OWNER")

    except ApiException as e:

        print(e)