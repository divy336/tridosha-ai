from flask import Flask
from flask_cors import CORS

# IMPORT BLUEPRINT
from routes.auth import auth
from routes.admin import admin
from routes.assessment import assessment

app = Flask(__name__)

CORS(app)

# REGISTER BLUEPRINT
app.register_blueprint(auth)
app.register_blueprint(admin)
app.register_blueprint(assessment)
                       

@app.route("/")
def home():

    return "Backend Running"


if __name__ == "__main__":
    app.run(debug=True)