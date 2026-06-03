from flask import Flask
from flask_cors import CORS

from db import check_db_connection

# Blueprints
from auth.router import auth
from admin.router import admin
from report.assessment import assessment as submit_assessment_bp
from assessment.router import assessment as assessment_api_bp
from report.history import history

app = Flask(__name__)
app.secret_key = "my-secret-key"
CORS(app)

if not check_db_connection():
    raise RuntimeError(
        "Database unreachable. Check your .env file and database settings."
    )

# Register blueprints
app.register_blueprint(auth)
app.register_blueprint(admin)
app.register_blueprint(submit_assessment_bp)
app.register_blueprint(assessment_api_bp)
app.register_blueprint(history)

@app.route("/")
def home():
    return "Backend Running Successfully"

if __name__ == "__main__":
   
    app.run(host="0.0.0.0", port=5000, debug=True)