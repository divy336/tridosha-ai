from flask import Flask
from flask_cors import CORS

# IMPORT BLUEPRINT
from auth.router import auth
from admin.router import admin
from report.router import report
from reportQuestion.router import question

app = Flask(__name__)

CORS(app)

# REGISTER BLUEPRINT
app.register_blueprint(auth)
app.register_blueprint(admin)
app.register_blueprint(report)
app.register_blueprint(question)
                       

@app.route("/")
def home():
    return "Backend Running"


if __name__ == "__main__":
    app.run(debug=True)