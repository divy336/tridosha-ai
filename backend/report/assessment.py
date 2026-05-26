# routes/assessment.py - UPGRADED VERSION

from flask import Blueprint, request, jsonify
from datetime import datetime
from db import conn, cur
import json

assessment = Blueprint('assessment', __name__)

@assessment.route("/api/submit-assessment", methods=['POST', 'OPTIONS'])
def submit_assessment():
    """Advanced Ayurvedic Assessment with Hybrid Dosha Intelligence"""
    
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response
    
    try:
        data = request.get_json()
        
        # Get user
        email = data.get("email")
        cur.execute("SELECT id FROM users WHERE email=%s", (email,))
        user = cur.fetchone()
        if user is None:
            return jsonify({"error": "User not found"}), 404
        user_id = user[0]
        
        # Extract answers
        answers = {
            'bodyFrame': data.get('bodyFrame'),
            'skinType': data.get('skinType'),
            'hairType': data.get('hairType'),
            'weightPattern': data.get('weightPattern'),
            'appetite': data.get('appetite'),
            'digestion': data.get('digestion'),
            'thirst': data.get('thirst'),
            'mindState': data.get('mindState'),
            'sleepPattern': data.get('sleepPattern'),
            'climatePreference': data.get('climatePreference')
        }
        
        symptoms = data.get('symptoms', [])
        
        # HYBRID DOSHA CALCULATION
        dosha_scores = calculate_hybrid_dosha_scores(answers, symptoms)
        
        # Calculate percentages
        total_score = sum(dosha_scores.values())
        percentages = {
            'vata': round((dosha_scores['vata'] / total_score) * 100, 1),
            'pitta': round((dosha_scores['pitta'] / total_score) * 100, 1),
            'kapha': round((dosha_scores['kapha'] / total_score) * 100, 1)
        }
        
        # Constitution analysis
        constitution_analysis = analyze_constitution_advanced(percentages)
        
        # HYBRID RECOMMENDATION ENGINE
        recommendations = generate_hybrid_recommendations(
            percentages, 
            constitution_analysis, 
            symptoms,
            answers
        )
        
        # Wellness score
        wellness_score = calculate_wellness_score(percentages, symptoms)
        
        # Build response
        response_data = {
            'dominantDosha': constitution_analysis['dominant'],
            'secondaryDosha': constitution_analysis['secondary'],
            'constitutionType': constitution_analysis['type'],
            'scores': dosha_scores,
            'percentages': percentages,
            'wellnessScore': wellness_score,
            'physicalAnalysis': recommendations['physical_analysis'],
            'emotionalAnalysis': recommendations['emotional_analysis'],
            'digestiveAnalysis': recommendations['digestive_analysis'],
            'sleepAnalysis': recommendations['sleep_analysis'],
            'foodsToPrefer': recommendations['foods_prefer'],
            'foodsToAvoid': recommendations['foods_avoid'],
            'herbs': recommendations['herbs'],
            'drinks': recommendations['drinks'],
            'yoga': recommendations['yoga'],
            'lifestyleTips': recommendations['lifestyle_tips'],
            'morningRoutine': recommendations['morning_routine'],
            'nightRoutine': recommendations['night_routine'],
            'stressManagement': recommendations['stress_management'],
            'timestamp': datetime.now().isoformat()
        }
        
        # Store in database
        cur.execute("""
            INSERT INTO assessments (
                user_id, body_frame, skin_type, hair_type, weight_pattern,
                appetite, digestion, thirst, mind_state, sleep_pattern,
                climate_preference, symptoms, dominant_dosha, constitution_type,
                vata_percentage, pitta_percentage, kapha_percentage, wellness_score,
                recommendations, created_at
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """, (
            user_id, answers["bodyFrame"], answers["skinType"], answers["hairType"],
            answers["weightPattern"], answers["appetite"], answers["digestion"],
            answers["thirst"], answers["mindState"], answers["sleepPattern"],
            answers["climatePreference"], ",".join(symptoms),
            constitution_analysis["dominant"], constitution_analysis["type"],
            percentages["vata"], percentages["pitta"], percentages["kapha"],
            wellness_score, json.dumps(recommendations), datetime.now()
        ))
        
        assessment_id = cur.fetchone()[0]
        conn.commit()
        
        response_data['assessmentId'] = assessment_id
        
        response = jsonify(response_data)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
        
    except Exception as e:
        print(f"Error in submit_assessment: {e}")
        conn.rollback()
        error_response = jsonify({"error": str(e)})
        error_response.headers.add('Access-Control-Allow-Origin', '*')
        return error_response, 500


# ============================================
# HYBRID DOSHA CALCULATION ENGINE
# ============================================

def calculate_hybrid_dosha_scores(answers, symptoms):
    """
    Advanced weighted scoring with symptom intelligence
    """
    scores = {'vata': 0.0, 'pitta': 0.0, 'kapha': 0.0}
    
    # Question weights
    question_weights = {
        'bodyFrame': 1.5,
        'skinType': 1.3,
        'hairType': 1.0,
        'weightPattern': 1.4,
        'appetite': 1.2,
        'digestion': 1.5,
        'thirst': 1.0,
        'mindState': 1.4,
        'sleepPattern': 1.3,
        'climatePreference': 1.1
    }
    
    # Process answers
    for question, answer in answers.items():
        weight = question_weights.get(question, 1.0)
        if answer == 'A':
            scores['vata'] += weight
        elif answer == 'B':
            scores['pitta'] += weight
        elif answer == 'C':
            scores['kapha'] += weight
    
    # SYMPTOM INTELLIGENCE
    symptom_influences = {
        'Anxiety': {'vata': 2.0, 'pitta': 0.3},
        'Fatigue': {'kapha': 1.8, 'vata': 0.4},
        'Headache': {'pitta': 1.5, 'vata': 0.5},
        'Acidity': {'pitta': 2.0, 'kapha': 0.2},
        'Bloating': {'vata': 1.8, 'kapha': 0.4},
        'Congestion': {'kapha': 2.0, 'pitta': 0.2},
        'Insomnia': {'vata': 2.0, 'pitta': 0.5},
        'Irritability': {'pitta': 1.8, 'vata': 0.4},
        'Joint Pain': {'vata': 1.8, 'kapha': 0.3},
        'Brain Fog': {'kapha': 1.8, 'vata': 0.3}
    }
    
    for symptom in symptoms:
        if symptom in symptom_influences:
            for dosha, impact in symptom_influences[symptom].items():
                scores[dosha] += impact
    
    return scores


def analyze_constitution_advanced(percentages):
    """Enhanced constitution analysis"""
    sorted_doshas = sorted(percentages.items(), key=lambda x: x[1], reverse=True)
    dominant = sorted_doshas[0][0].capitalize()
    secondary = sorted_doshas[1][0].capitalize()
    
    max_diff = sorted_doshas[0][1] - sorted_doshas[1][1]
    second_diff = sorted_doshas[1][1] - sorted_doshas[2][1]
    
    # Tridoshic
    if max_diff <= 15 and second_diff <= 15:
        constitution_type = "Balanced Tridoshic"
    # Dual dosha
    elif max_diff <= 10:
        constitution_type = f"{dominant}-{secondary}"
    # Single dominant
    else:
        constitution_type = f"{dominant} Dominant"
    
    return {
        'dominant': dominant,
        'secondary': secondary,
        'type': constitution_type,
        'percentages': percentages
    }


# ============================================
# HYBRID RECOMMENDATION ENGINE
# ============================================

def generate_hybrid_recommendations(percentages, constitution, symptoms, answers):
    """
    PROFESSIONAL HYBRID DOSHA RECOMMENDATION SYSTEM
    Uses percentage-based weighting, not just dominant dosha
    """
    vata_pct = percentages['vata']
    pitta_pct = percentages['pitta']
    kapha_pct = percentages['kapha']
    
    # Initialize
    recommendations = {
        'physical_analysis': '',
        'emotional_analysis': '',
        'digestive_analysis': '',
        'sleep_analysis': '',
        'foods_prefer': [],
        'foods_avoid': [],
        'herbs': [],
        'drinks': [],
        'yoga': [],
        'lifestyle_tips': [],
        'morning_routine': [],
        'night_routine': [],
        'stress_management': []
    }
    
    # Identify active doshas (>= 30%)
    active_doshas = []
    if vata_pct >= 30:
        active_doshas.append(('vata', vata_pct))
    if pitta_pct >= 30:
        active_doshas.append(('pitta', pitta_pct))
    if kapha_pct >= 30:
        active_doshas.append(('kapha', kapha_pct))
    
    # Sort by percentage (highest first)
    active_doshas.sort(key=lambda x: x[1], reverse=True)
    
    # ANALYSIS GENERATION
    recommendations['physical_analysis'] = generate_physical_analysis_hybrid(
        vata_pct, pitta_pct, kapha_pct, active_doshas, symptoms
    )
    
    recommendations['emotional_analysis'] = generate_emotional_analysis_hybrid(
        vata_pct, pitta_pct, kapha_pct, active_doshas, symptoms
    )
    
    recommendations['digestive_analysis'] = generate_digestive_analysis_hybrid(
        vata_pct, pitta_pct, kapha_pct, active_doshas, symptoms
    )
    
    recommendations['sleep_analysis'] = generate_sleep_analysis_hybrid(
        vata_pct, pitta_pct, kapha_pct, active_doshas, symptoms
    )
    
    # WEIGHTED RECOMMENDATIONS
    recommendations['foods_prefer'] = generate_weighted_foods_prefer(
        active_doshas, symptoms
    )
    
    recommendations['foods_avoid'] = generate_weighted_foods_avoid(
        active_doshas, symptoms
    )
    
    recommendations['herbs'] = generate_weighted_herbs(
        active_doshas, symptoms
    )
    
    recommendations['drinks'] = generate_weighted_drinks(
        active_doshas, symptoms
    )
    
    recommendations['yoga'] = generate_weighted_yoga(
        active_doshas, symptoms
    )
    
    recommendations['lifestyle_tips'] = generate_weighted_lifestyle(
        active_doshas, symptoms
    )
    
    recommendations['morning_routine'] = generate_weighted_morning(
        active_doshas, symptoms
    )
    
    recommendations['night_routine'] = generate_weighted_night(
        active_doshas, symptoms
    )
    
    recommendations['stress_management'] = generate_weighted_stress(
        active_doshas, symptoms
    )
    
    return recommendations


# ============================================
# ANALYSIS GENERATORS
# ============================================

def generate_physical_analysis_hybrid(vata, pitta, kapha, active_doshas, symptoms):
    """Generate physical analysis based on ALL active doshas"""
    analysis_parts = []
    
    for dosha, pct in active_doshas:
        if dosha == 'vata' and pct >= 60:
            analysis_parts.append(f"Extreme Vata dominance ({pct}%) creates significant dryness, coldness, and nervous system sensitivity")
        elif dosha == 'vata' and pct >= 40:
            analysis_parts.append(f"High Vata ({pct}%) contributes to variable energy, dryness, and cold sensitivity")
        elif dosha == 'vata' and pct >= 30:
            analysis_parts.append(f"Moderate Vata ({pct}%) adds movement and variability to your constitution")
        
        if dosha == 'pitta' and pct >= 60:
            analysis_parts.append(f"Extreme Pitta dominance ({pct}%) generates intense internal heat and inflammatory tendencies")
        elif dosha == 'pitta' and pct >= 40:
            analysis_parts.append(f"High Pitta ({pct}%) creates strong metabolism, heat, and sharp appetite")
        elif dosha == 'pitta' and pct >= 30:
            analysis_parts.append(f"Moderate Pitta ({pct}%) adds warmth and metabolic fire")
        
        if dosha == 'kapha' and pct >= 60:
            analysis_parts.append(f"Extreme Kapha dominance ({pct}%) leads to heaviness, congestion, and slow metabolism")
        elif dosha == 'kapha' and pct >= 40:
            analysis_parts.append(f"High Kapha ({pct}%) provides stability but can create sluggishness and weight gain tendency")
        elif dosha == 'kapha' and pct >= 30:
            analysis_parts.append(f"Moderate Kapha ({pct}%) gives you grounding and endurance")
    
    # Symptom overrides
    if 'Joint Pain' in symptoms:
        analysis_parts.append("Joint pain indicates Vata aggravation requiring warming, grounding therapies")
    if 'Congestion' in symptoms:
        analysis_parts.append("Congestion shows Kapha excess needing stimulation and drying")
    if 'Acidity' in symptoms:
        analysis_parts.append("Acidity reveals Pitta imbalance requiring cooling interventions")
    
    return ". ".join(analysis_parts) + "."


def generate_emotional_analysis_hybrid(vata, pitta, kapha, active_doshas, symptoms):
    """Generate emotional analysis"""
    analysis_parts = []
    
    for dosha, pct in active_doshas:
        if dosha == 'vata' and pct >= 40:
            analysis_parts.append(f"Vata ({pct}%) creates mental activity, creativity, but also anxiety and restlessness")
        if dosha == 'pitta' and pct >= 40:
            analysis_parts.append(f"Pitta ({pct}%) brings sharp intellect and drive, but also irritability and perfectionism")
        if dosha == 'kapha' and pct >= 40:
            analysis_parts.append(f"Kapha ({pct}%) provides emotional stability, but can lead to attachment and resistance to change")
    
    # Symptom overrides
    if 'Anxiety' in symptoms:
        analysis_parts.append("Anxiety indicates need for Vata-calming practices")
    if 'Irritability' in symptoms:
        analysis_parts.append("Irritability shows Pitta excess requiring cooling compassion practices")
    if 'Fatigue' in symptoms:
        analysis_parts.append("Fatigue suggests Kapha heaviness needing energizing interventions")
    
    return ". ".join(analysis_parts) + "."


def generate_digestive_analysis_hybrid(vata, pitta, kapha, active_doshas, symptoms):
    """Generate digestive analysis"""
    analysis_parts = []
    
    for dosha, pct in active_doshas:
        if dosha == 'vata' and pct >= 40:
            analysis_parts.append("Vata creates irregular appetite with gas and bloating tendency")
        if dosha == 'pitta' and pct >= 40:
            analysis_parts.append("Pitta generates strong appetite with acidic and inflammatory tendencies")
        if dosha == 'kapha' and pct >= 40:
            analysis_parts.append("Kapha slows digestion with heaviness and sluggish metabolism")
    
    # Symptom overrides
    if 'Acidity' in symptoms:
        analysis_parts.append("Acidity requires cooling foods and avoiding spicy/sour items")
    if 'Bloating' in symptoms:
        analysis_parts.append("Bloating indicates need for warm, well-cooked foods at regular times")
    if 'Congestion' in symptoms:
        analysis_parts.append("Digestive congestion needs light, stimulating foods")
    
    return ". ".join(analysis_parts) + "."


def generate_sleep_analysis_hybrid(vata, pitta, kapha, active_doshas, symptoms):
    """Generate sleep analysis"""
    analysis_parts = []
    
    for dosha, pct in active_doshas:
        if dosha == 'vata' and pct >= 40:
            analysis_parts.append("Vata creates light, interrupted sleep with difficulty falling asleep")
        if dosha == 'pitta' and pct >= 40:
            analysis_parts.append("Pitta may cause vivid dreams and waking due to mental intensity")
        if dosha == 'kapha' and pct >= 40:
            analysis_parts.append("Kapha brings heavy sleep with tendency to oversleep")
    
    # Symptom override
    if 'Insomnia' in symptoms:
        analysis_parts.append("Insomnia requires calming bedtime routine and nervous system support")
    
    return ". ".join(analysis_parts) + "."


# ============================================
# WEIGHTED RECOMMENDATION GENERATORS
# ============================================

def generate_weighted_foods_prefer(active_doshas, symptoms):
    """Generate food preferences weighted by dosha percentages"""
    foods = []
    seen = set()
    
    # Vata foods
    vata_foods = [
        'Warm soups and stews',
        'Cooked root vegetables',
        'Ghee and healthy oils',
        'Warm milk with spices',
        'Oatmeal with cinnamon',
        'Rice and quinoa',
        'Soaked nuts'
    ]
    
    # Pitta foods
    pitta_foods = [
        'Cooling cucumbers and melons',
        'Sweet fruits (grapes, pears)',
        'Coconut products',
        'Leafy greens',
        'Mint and cilantro',
        'Basmati rice',
        'Cooling spices (coriander, fennel)'
    ]
    
    # Kapha foods
    kapha_foods = [
        'Light, warm foods',
        'Stimulating spices (ginger, pepper)',
        'Bitter greens',
        'Beans and lentils',
        'Apples and pears',
        'Light grains (barley, millet)'
    ]
    
    # Add foods based on active doshas
    for dosha, pct in active_doshas:
        if dosha == 'vata':
            count = 7 if pct >= 60 else 5 if pct >= 40 else 3
            for food in vata_foods[:count]:
                if food not in seen:
                    foods.append(food)
                    seen.add(food)
        
        elif dosha == 'pitta':
            count = 7 if pct >= 60 else 5 if pct >= 40 else 3
            for food in pitta_foods[:count]:
                if food not in seen:
                    foods.append(food)
                    seen.add(food)
        
        elif dosha == 'kapha':
            count = 7 if pct >= 60 else 5 if pct >= 40 else 3
            for food in kapha_foods[:count]:
                if food not in seen:
                    foods.append(food)
                    seen.add(food)
    
    # Symptom additions
    if 'Acidity' in symptoms and 'Cooling cucumbers and melons' not in seen:
        foods.insert(0, 'Cooling cucumbers and melons')
    if 'Congestion' in symptoms and 'Stimulating spices (ginger, pepper)' not in seen:
        foods.insert(0, 'Stimulating spices (ginger, pepper)')
    if 'Anxiety' in symptoms and 'Warm milk with spices' not in seen:
        foods.insert(0, 'Warm milk with spices')
    
    return remove_contradictions_foods(foods)


def generate_weighted_foods_avoid(active_doshas, symptoms):
    """Generate foods to avoid"""
    foods = []
    seen = set()
    
    vata_avoid = ['Cold foods', 'Raw vegetables', 'Dry snacks', 'Carbonated drinks']
    pitta_avoid = ['Spicy foods', 'Sour foods', 'Alcohol', 'Fried foods']
    kapha_avoid = ['Heavy oily foods', 'Dairy products', 'Sweets', 'Cold drinks']
    
    for dosha, pct in active_doshas:
        if dosha == 'vata' and pct >= 40:
            for food in vata_avoid:
                if food not in seen:
                    foods.append(food)
                    seen.add(food)
        elif dosha == 'pitta' and pct >= 40:
            for food in pitta_avoid:
                if food not in seen:
                    foods.append(food)
                    seen.add(food)
        elif dosha == 'kapha' and pct >= 40:
            for food in kapha_avoid:
                if food not in seen:
                    foods.append(food)
                    seen.add(food)
    
    # Symptom overrides
    if 'Acidity' in symptoms and 'Spicy foods' not in seen:
        foods.insert(0, 'Spicy foods')
    if 'Congestion' in symptoms and 'Dairy products' not in seen:
        foods.insert(0, 'Dairy products')
    
    return foods


def generate_weighted_herbs(active_doshas, symptoms):
    """Generate herb recommendations"""
    herbs = []
    seen = set()
    
    vata_herbs = [
        'Ashwagandha - nervous system support',
        'Ginger - warming digestion',
        'Brahmi - calms mind'
    ]
    
    pitta_herbs = [
        'Brahmi - cooling clarity',
        'Shatavari - cooling support',
        'Coriander - digestive cooling'
    ]
    
    kapha_herbs = [
        'Trikatu - digestive fire',
        'Tulsi - energizing',
        'Ginger - warming stimulation'
    ]
    
    for dosha, pct in active_doshas:
        if dosha == 'vata' and pct >= 40:
            for herb in vata_herbs:
                if herb not in seen:
                    herbs.append(herb)
                    seen.add(herb)
        elif dosha == 'pitta' and pct >= 40:
            for herb in pitta_herbs:
                if herb not in seen:
                    herbs.append(herb)
                    seen.add(herb)
        elif dosha == 'kapha' and pct >= 40:
            for herb in kapha_herbs:
                if herb not in seen:
                    herbs.append(herb)
                    seen.add(herb)
    
    # Symptom additions
    if 'Anxiety' in symptoms:
        herbs.insert(0, 'Ashwagandha - anxiety relief')
    if 'Insomnia' in symptoms:
        herbs.insert(0, 'Brahmi - sleep support')
    
    return herbs


def generate_weighted_drinks(active_doshas, symptoms):
    """Generate drink recommendations"""
    drinks = []
    seen = set()
    
    vata_drinks = ['Warm ginger tea', 'Warm milk with nutmeg', 'Chamomile tea']
    pitta_drinks = ['Coconut water', 'Mint tea', 'Coriander tea']
    kapha_drinks = ['Ginger tea', 'Warm water with lemon', 'Tulsi tea']
    
    for dosha, pct in active_doshas:
        if dosha == 'vata' and pct >= 40:
            for drink in vata_drinks:
                if drink not in seen:
                    drinks.append(drink)
                    seen.add(drink)
        elif dosha == 'pitta' and pct >= 40:
            for drink in pitta_drinks:
                if drink not in seen:
                    drinks.append(drink)
                    seen.add(drink)
        elif dosha == 'kapha' and pct >= 40:
            for drink in kapha_drinks:
                if drink not in seen:
                    drinks.append(drink)
                    seen.add(drink)
    
    return drinks


def generate_weighted_yoga(active_doshas, symptoms):
    """Generate yoga recommendations"""
    primary_dosha = active_doshas[0][0] if active_doshas else 'vata'
    
    if primary_dosha == 'vata':
        return get_vata_yoga_sequence()
    elif primary_dosha == 'pitta':
        return get_pitta_yoga_sequence()
    else:
        return get_kapha_yoga_sequence()


def generate_weighted_lifestyle(active_doshas, symptoms):
    """Generate lifestyle tips"""
    tips = []
    seen = set()
    
    vata_tips = [
        'Maintain regular daily routine',
        'Practice oil massage regularly',
        'Create warm, cozy environment',
        'Avoid excessive stimulation'
    ]
    
    pitta_tips = [
        'Practice moderation in all activities',
        'Avoid excessive heat',
        'Take regular breaks',
        'Practice patience and compassion'
    ]
    
    kapha_tips = [
        'Exercise daily - vigorous intensity',
        'Wake early consistently',
        'Seek variety and new experiences',
        'Stay active throughout day'
    ]
    
    for dosha, pct in active_doshas:
        if dosha == 'vata' and pct >= 40:
            for tip in vata_tips:
                if tip not in seen:
                    tips.append(tip)
                    seen.add(tip)
        elif dosha == 'pitta' and pct >= 40:
            for tip in pitta_tips:
                if tip not in seen:
                    tips.append(tip)
                    seen.add(tip)
        elif dosha == 'kapha' and pct >= 40:
            for tip in kapha_tips:
                if tip not in seen:
                    tips.append(tip)
                    seen.add(tip)
    
    return tips


def generate_weighted_morning(active_doshas, symptoms):
    """Generate morning routine"""
    routine = []
    seen = set()
    
    vata_morning = [
        'Wake at 6:00 AM',
        'Warm oil self-massage',
        'Gentle grounding yoga',
        'Meditation practice',
        'Warm nourishing breakfast'
    ]
    
    pitta_morning = [
        'Wake at 5:30 AM',
        'Drink cool water',
        'Cooling pranayama',
        'Moderate exercise',
        'Cool shower'
    ]
    
    kapha_morning = [
        'Wake at 5:00 AM or earlier',
        'Warm water with lemon and ginger',
        'Vigorous exercise (45+ minutes)',
        'Stimulating breathwork',
        'Light or skip breakfast'
    ]
    
    for dosha, pct in active_doshas:
        if dosha == 'vata' and pct >= 40:
            for item in vata_morning:
                if item not in seen:
                    routine.append(item)
                    seen.add(item)
        elif dosha == 'pitta' and pct >= 40:
            for item in pitta_morning:
                if item not in seen:
                    routine.append(item)
                    seen.add(item)
        elif dosha == 'kapha' and pct >= 40:
            for item in kapha_morning:
                if item not in seen:
                    routine.append(item)
                    seen.add(item)
    
    return routine


def generate_weighted_night(active_doshas, symptoms):
    """Generate night routine"""
    routine = []
    seen = set()
    
    vata_night = [
        'Light dinner by 7:00 PM',
        'Warm bath',
        'Gentle restorative yoga',
        'Warm milk with nutmeg',
        'In bed by 10:00 PM'
    ]
    
    pitta_night = [
        'Light dinner by 6:30 PM',
        'Cool shower',
        'Cooling yoga sequence',
        'Avoid work after 8:00 PM',
        'Sleep in cool room'
    ]
    
    kapha_night = [
        'Light dinner before 6:00 PM',
        'Evening walk or activity',
        'Avoid late snacking',
        'Hot stimulating shower',
        'Aim for 6-7 hours sleep only'
    ]
    
    for dosha, pct in active_doshas:
        if dosha == 'vata' and pct >= 40:
            for item in vata_night:
                if item not in seen:
                    routine.append(item)
                    seen.add(item)
        elif dosha == 'pitta' and pct >= 40:
            for item in pitta_night:
                if item not in seen:
                    routine.append(item)
                    seen.add(item)
        elif dosha == 'kapha' and pct >= 40:
            for item in kapha_night:
                if item not in seen:
                    routine.append(item)
                    seen.add(item)
    
    # Insomnia override
    if 'Insomnia' in symptoms:
        routine.insert(0, 'Calming bedtime routine essential')
    
    return routine


def generate_weighted_stress(active_doshas, symptoms):
    """Generate stress management"""
    practices = []
    seen = set()
    
    vata_stress = [
        'Alternate nostril breathing (Nadi Shodhana)',
        'Grounding meditation',
        'Journaling thoughts',
        'Nature walks daily'
    ]
    
    pitta_stress = [
        'Cooling breath (Sitali)',
        'Forgiveness meditation',
        'Creative pursuits',
        'Compassion practice'
    ]
    
    kapha_stress = [
        'Energizing breathwork (Kapalabhati)',
        'Dynamic meditation',
        'New challenges',
        'Social engagement'
    ]
    
    for dosha, pct in active_doshas:
        if dosha == 'vata' and pct >= 40:
            for practice in vata_stress:
                if practice not in seen:
                    practices.append(practice)
                    seen.add(practice)
        elif dosha == 'pitta' and pct >= 40:
            for practice in pitta_stress:
                if practice not in seen:
                    practices.append(practice)
                    seen.add(practice)
        elif dosha == 'kapha' and pct >= 40:
            for practice in kapha_stress:
                if practice not in seen:
                    practices.append(practice)
                    seen.add(practice)
    
    # Anxiety override
    if 'Anxiety' in symptoms:
        practices.insert(0, 'Deep breathing exercises essential')
    
    return practices


# ============================================
# HELPER FUNCTIONS
# ============================================

def remove_contradictions_foods(foods):
    """Remove contradictory food recommendations"""
    contradictions = [
        ('Cold foods', 'Warm soups'),
        ('Spicy foods', 'Cooling cucumbers'),
        ('Heavy oily foods', 'Light, warm foods')
    ]
    
    filtered = []
    for food in foods:
        should_add = True
        for pair in contradictions:
            if pair[0] in food and any(pair[1] in f for f in filtered):
                should_add = False
                break
        if should_add:
            filtered.append(food)
    
    return filtered


def get_vata_yoga_sequence():
    return [
        {
            'name': 'Balasana (Child Pose)',
            'description': 'Grounding forward fold',
            'benefit': 'Calms nervous system',
            'energy': 'Grounding',
            'imagePath': '/images/yoga/balasana.jpg'
        },
        {
            'name': 'Tadasana (Mountain Pose)',
            'description': 'Standing foundation',
            'benefit': 'Grounds energy',
            'energy': 'Stabilizing',
            'imagePath': '/images/yoga/tadasana.jpg'
        },
        {
            'name': 'Viparita Karani',
            'description': 'Legs up wall',
            'benefit': 'Calms Vata',
            'energy': 'Restorative',
            'imagePath': '/images/yoga/viparita-karani.jpg'
        }
    ]


def get_pitta_yoga_sequence():
    return [
        {
            'name': 'Chandra Namaskar',
            'description': 'Moon salutation',
            'benefit': 'Cooling flow',
            'energy': 'Cooling',
            'imagePath': '/images/yoga/chandra-namaskar.jpg'
        },
        {
            'name': 'Matsyasana',
            'description': 'Fish pose',
            'benefit': 'Opens heart',
            'energy': 'Heart-opening',
            'imagePath': '/images/yoga/matsyasana.jpg'
        },
        {
            'name': 'Shavasana',
            'description': 'Corpse pose',
            'benefit': 'Deep relaxation',
            'energy': 'Peaceful',
            'imagePath': '/images/yoga/shavasana.jpg'
        }
    ]


def get_kapha_yoga_sequence():
    return [
        {
            'name': 'Surya Namaskar',
            'description': 'Sun salutation',
            'benefit': 'Energizes body',
            'energy': 'Heating',
            'imagePath': '/images/yoga/surya-namaskar.jpg'
        },
        {
            'name': 'Virabhadrasana',
            'description': 'Warrior pose',
            'benefit': 'Builds strength',
            'energy': 'Empowering',
            'imagePath': '/images/yoga/virabhadrasana.jpg'
        },
        {
            'name': 'Kapalbhati',
            'description': 'Skull-shining breath',
            'benefit': 'Clears congestion',
            'energy': 'Stimulating',
            'imagePath': '/images/yoga/kapalbhati.jpg'
        }
    ]


def calculate_wellness_score(percentages, symptoms):
    """Calculate wellness score (0-100)"""
    score = 100
    
    sorted_percentages = sorted(percentages.values(), reverse=True)
    imbalance = sorted_percentages[0] - sorted_percentages[2]
    
    if imbalance > 50:
        score -= 30
    elif imbalance > 40:
        score -= 20
    elif imbalance > 30:
        score -= 10
    elif imbalance > 20:
        score -= 5
    
    score -= len(symptoms) * 5
    
    if imbalance <= 15:
        score += 10
    
    return max(0, min(100, score))