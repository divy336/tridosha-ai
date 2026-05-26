from flask import Blueprint, request, jsonify
from reportQuestion.controller import handle_submit_assessment

question = Blueprint('question', __name__)


@question.route("/test")
def test():
    return "question Route Working"


@question.route("/api/submit-assessment", methods=['POST', 'OPTIONS'])
def submit_question():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response

    data = request.get_json()
    response_data, status = handle_submit_assessment(data)
    response = jsonify(response_data)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response, status