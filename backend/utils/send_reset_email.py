import sib_api_v3_sdk
import os
from dotenv import load_dotenv
from sib_api_v3_sdk.rest import ApiException

# BREVO CONFIG
load_dotenv()
BREVO_API_KEY = os.getenv("BREVO_API_KEY")
configuration = sib_api_v3_sdk.Configuration()
configuration.api_key['api-key'] = BREVO_API_KEY

# BREVO CONFIG
api_instance = sib_api_v3_sdk.TransactionalEmailsApi(
    sib_api_v3_sdk.ApiClient(configuration)
)

def send_reset_email(email, reset_link):
    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
        to=[{
            "email": email
        }],
        sender={
            "name": "Tridosha AI",
            "email": "aadharbrahmbhatt21@gmail.com"
        },
        subject="Reset Your Password",
        html_content=f"""
        <h2>Reset Password</h2>
        <p>
            Click button below
        </p>
        <a
            href="{reset_link}"

            style="
                padding:15px 15px;
                background:green;
                color:white;
                text-decoration:none;
                border-radius:5px;
            "
        >
            Reset Password
        </a>
        """
    )
    try:
        api_instance.send_transac_email(
            send_smtp_email
        )
        print("RESET EMAIL SENT")
    except ApiException as e:
        print(e)