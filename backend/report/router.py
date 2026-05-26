from flask import Blueprint, request, jsonify
from report.controller import handle_submit_assessment

report = Blueprint('report', __name__)


@report.route('/api/submit-assessment', methods=['POST'])
def submit_assessment():
    data = request.get_json()
    response, status = handle_submit_assessment(data)
    return jsonify(response), status    