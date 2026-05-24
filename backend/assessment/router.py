from flask import Blueprint, request, jsonify
from assessment.controller import handle_submit_assessment

assessment = Blueprint('assessment', __name__)


@assessment.route('/api/submit-assessment', methods=['POST'])
def submit_assessment():
    data = request.get_json()
    response, status = handle_submit_assessment(data)
    return jsonify(response), status