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

# BREVO CONFIG


api_instance = sib_api_v3_sdk.TransactionalEmailsApi(
    sib_api_v3_sdk.ApiClient(configuration)
)


def send_otp(email):

    # DELETE OLD OTP
    cur.execute(

        """
        DELETE FROM otp_codes
        WHERE email=%s
        """,

        (email,)

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

        (email, otp)

    )

    conn.commit()

 

    # SEND EMAIL
    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(

        to=[{
            "email": email
        }],

        sender={
            "name": "Tridosha AI",
            "email": "nagardivya73@gmail.com"
        },

        subject="OTP Verification",

        html_content=f"""

        <h1>Your OTP Code</h1>

        <h2>{otp}</h2>

        """

    )

    try:

        api_instance.send_transac_email(
            send_smtp_email
        )

        print("EMAIL SENT")

    except ApiException as e:

        print(e)