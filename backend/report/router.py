from flask import Blueprint, request, jsonify
from report.controller import handle_submit_assessment

report = Blueprint('report', __name__)


@report.route("/api/submit-assessment", methods=['POST', 'OPTIONS'], strict_slashes=False)
def submit_assessment():
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
