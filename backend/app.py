from flask import Flask
from flask_cors import CORS

# IMPORT BLUEPRINT
from routes.auth import auth

app = Flask(__name__)

CORS(app)

# REGISTER BLUEPRINT
app.register_blueprint(auth)


@app.route("/")
def home():

    return "Backend Running"


if __name__ == "__main__":
    app.run(debug=True)