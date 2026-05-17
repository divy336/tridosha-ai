import psycopg2

conn = psycopg2.connect(

    host="localhost",
    database="ayurveda",
    user="postgres",
    password="nagar@73"

)

cur = conn.cursor()

print("Database Connected Successfully")