import psycopg2

from dotenv import load_dotenv

import os


# LOAD ENV FILE
load_dotenv()


# GET ENV VALUES
DB_HOST = os.getenv("DB_HOST")

DB_NAME = os.getenv("DB_NAME")

DB_USER = os.getenv("DB_USER")

DB_PASSWORD = os.getenv("DB_PASSWORD")

DB_PORT = os.getenv("DB_PORT")


# CONNECT DATABASE
conn = psycopg2.connect(

    host=DB_HOST,

    database=DB_NAME,

    user=DB_USER,

    password=DB_PASSWORD,

    port=DB_PORT

)


cur = conn.cursor()

print("Database Connected Successfully")