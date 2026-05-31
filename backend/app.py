from flask import Flask
from flask_cors import CORS
from db import check_db_connection
# IMPORT BLUEPRINT
from auth.router import auth
from admin.router import admin
from report.router import report
from reportQuestion.router import question
from Assessment.router import assessment

app = Flask(__name__)
CORS(app)

if not check_db_connection:
    raise RuntimeError("Database unreachable. check your .env files")
# REGISTER BLUEPRINT
app.register_blueprint(auth)
app.register_blueprint(admin)
app.register_blueprint(report)
app.register_blueprint(question)
app.register_blueprint(assessment)
                       

@app.route("/") 
def home():
    return "Backend Running"


if __name__ == "__main__":
    app.run(debug=True)