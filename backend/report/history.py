# routes/history.py
from flask import Blueprint, request, jsonify
from db import conn, cur
import json

history = Blueprint('history', __name__)

@history.route("/api/get-user-assessments", methods=['POST', 'OPTIONS'])
def get_user_assessments():
    """Get all assessments for a specific user"""
    
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response
    
    try:
        data = request.get_json()
        email = data.get("email")
        
        if not email:
            return jsonify({"error": "Email is required"}), 400
        
        # Get user ID
        cur.execute("SELECT id FROM users WHERE email=%s", (email,))
        user = cur.fetchone()
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        user_id = user[0]
        
        # Get all assessments for this user
        cur.execute("""
            SELECT 
                id,
                body_frame,
                skin_type,
                hair_type,
                weight_pattern,
                appetite,
                digestion,
                thirst,
                mind_state,
                sleep_pattern,
                climate_preference,
                symptoms,
                dominant_dosha,
                constitution_type,
                vata_percentage,
                pitta_percentage,
                kapha_percentage,
                wellness_score,
                recommendations,
                created_at
            FROM assessments
            WHERE user_id = %s
            ORDER BY created_at DESC
        """, (user_id,))
        
        assessments = cur.fetchall()
        
        # Format assessments
        assessment_list = []
        for assessment in assessments:
            assessment_data = {
                'id': assessment[0],
                'bodyFrame': assessment[1],
                'skinType': assessment[2],
                'hairType': assessment[3],
                'weightPattern': assessment[4],
                'appetite': assessment[5],
                'digestion': assessment[6],
                'thirst': assessment[7],
                'mindState': assessment[8],
                'sleepPattern': assessment[9],
                'climatePreference': assessment[10],
                'symptoms': assessment[11].split(',') if assessment[11] else [],
                'dominantDosha': assessment[12],
                'constitutionType': assessment[13],
                'percentages': {
                    'vata': assessment[14],
                    'pitta': assessment[15],
                    'kapha': assessment[16]
                },
                'wellnessScore': assessment[17],
                'recommendations': json.loads(assessment[18]) if assessment[18] else {},
                'timestamp': assessment[19].isoformat()
            }
            assessment_list.append(assessment_data)
        
        response = jsonify({
            'success': True,
            'assessments': assessment_list
        })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
        
    except Exception as e:
        print(f"Error in get_user_assessments: {e}")
        error_response = jsonify({"error": str(e)})
        error_response.headers.add('Access-Control-Allow-Origin', '*')
        return error_response, 500


@history.route("/api/get-assessment/<int:assessment_id>", methods=['GET', 'OPTIONS'])
def get_single_assessment(assessment_id):
    """Get a single assessment by ID"""
    
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'GET')
        return response
    
    try:
        cur.execute("""
            SELECT 
                id,
                dominant_dosha,
                constitution_type,
                vata_percentage,
                pitta_percentage,
                kapha_percentage,
                wellness_score,
                recommendations,
                created_at
            FROM assessments
            WHERE id = %s
        """, (assessment_id,))
        
        assessment = cur.fetchone()
        
        if not assessment:
            return jsonify({"error": "Assessment not found"}), 404
        
        # Parse recommendations JSON
        recommendations = json.loads(assessment[7]) if assessment[7] else {}
        
        assessment_data = {
            'id': assessment[0],
            'dominantDosha': assessment[1],
            'constitutionType': assessment[2],
            'percentages': {
                'vata': assessment[3],
                'pitta': assessment[4],
                'kapha': assessment[5]
            },
            'wellnessScore': assessment[6],
            'physicalAnalysis': recommendations.get('physical_analysis', ''),
            'emotionalAnalysis': recommendations.get('emotional_analysis', ''),
            'digestiveAnalysis': recommendations.get('digestive_analysis', ''),
            'sleepAnalysis': recommendations.get('sleep_analysis', ''),
            'foodsToPrefer': recommendations.get('foods_prefer', []),
            'foodsToAvoid': recommendations.get('foods_avoid', []),
            'herbs': recommendations.get('herbs', []),
            'drinks': recommendations.get('drinks', []),
            'yoga': recommendations.get('yoga', []),
            'lifestyleTips': recommendations.get('lifestyle_tips', []),
            'morningRoutine': recommendations.get('morning_routine', []),
            'nightRoutine': recommendations.get('night_routine', []),
            'stressManagement': recommendations.get('stress_management', []),
            'timestamp': assessment[8].isoformat()
        }
        
        response = jsonify(assessment_data)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
        
    except Exception as e:
        print(f"Error in get_single_assessment: {e}")
        error_response = jsonify({"error": str(e)})
        error_response.headers.add('Access-Control-Allow-Origin', '*')
        return error_response, 500


@history.route("/api/delete-assessment/<int:assessment_id>", methods=['DELETE', 'OPTIONS'])
def delete_assessment(assessment_id):
    """Delete an assessment"""
    
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'DELETE')
        return response
    
    try:
        cur.execute("DELETE FROM assessments WHERE id = %s RETURNING id", (assessment_id,))
        deleted = cur.fetchone()
        
        if not deleted:
            return jsonify({"error": "Assessment not found"}), 404
        
        conn.commit()
        
        response = jsonify({'success': True, 'message': 'Assessment deleted'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
        
    except Exception as e:
        print(f"Error in delete_assessment: {e}")
        conn.rollback()
        error_response = jsonify({"error": str(e)})
        error_response.headers.add('Access-Control-Allow-Origin', '*')
        return error_response, 500