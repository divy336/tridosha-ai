from datetime import datetime
from db import conn, cur
import json


# ─── CONSTANTS ───────────────────────────────────────────────────────────────

ACTIVE_DOSHA_THRESHOLD  = 30
HIGH_DOSHA_THRESHOLD    = 40
EXTREME_DOSHA_THRESHOLD = 60
TRIDOSHIC_DIFF_LIMIT    = 15
DUAL_DOSHA_DIFF_LIMIT   = 10
SYMPTOM_PENALTY         = 5


# ─── SCORING ─────────────────────────────────────────────────────────────────

def calculate_hybrid_dosha_scores(answers, symptoms):
    scores = {'vata': 0.0, 'pitta': 0.0, 'kapha': 0.0}

    question_weights = {
        'bodyFrame': 1.5, 'skinType': 1.3, 'hairType': 1.0,
        'weightPattern': 1.4, 'appetite': 1.2, 'digestion': 1.5,
        'thirst': 1.0, 'mindState': 1.4, 'sleepPattern': 1.3,
        'climatePreference': 1.1
    }

    for question, answer in answers.items():
        weight = question_weights.get(question, 1.0)
        if answer == 'A':
            scores['vata'] += weight
        elif answer == 'B':
            scores['pitta'] += weight
        elif answer == 'C':
            scores['kapha'] += weight

    symptom_influences = {
        'Anxiety':      {'vata': 2.0, 'pitta': 0.3},
        'Fatigue':      {'kapha': 1.8, 'vata': 0.4},
        'Headache':     {'pitta': 1.5, 'vata': 0.5},
        'Acidity':      {'pitta': 2.0, 'kapha': 0.2},
        'Bloating':     {'vata': 1.8, 'kapha': 0.4},
        'Congestion':   {'kapha': 2.0, 'pitta': 0.2},
        'Insomnia':     {'vata': 2.0, 'pitta': 0.5},
        'Irritability': {'pitta': 1.8, 'vata': 0.4},
        'Joint Pain':   {'vata': 1.8, 'kapha': 0.3},
        'Brain Fog':    {'kapha': 1.8, 'vata': 0.3}
    }

    for symptom in symptoms:
        if symptom in symptom_influences:
            for dosha, impact in symptom_influences[symptom].items():
                scores[dosha] += impact

    return scores


def calculate_wellness_score(percentages, symptoms):
    score = 100
    sorted_percentages = sorted(percentages.values(), reverse=True)
    imbalance = sorted_percentages[0] - sorted_percentages[2]

    if imbalance > 50:   score -= 30
    elif imbalance > 40: score -= 20
    elif imbalance > 30: score -= 10
    elif imbalance > 20: score -= 5

    score -= len(symptoms) * SYMPTOM_PENALTY

    if imbalance <= TRIDOSHIC_DIFF_LIMIT:
        score += 10

    return max(0, min(100, score))


# ─── CONSTITUTION ─────────────────────────────────────────────────────────────

def analyze_constitution_advanced(percentages):
    sorted_doshas = sorted(percentages.items(), key=lambda x: x[1], reverse=True)
    dominant  = sorted_doshas[0][0].capitalize()
    secondary = sorted_doshas[1][0].capitalize()

    max_diff    = sorted_doshas[0][1] - sorted_doshas[1][1]
    second_diff = sorted_doshas[1][1] - sorted_doshas[2][1]

    if max_diff <= TRIDOSHIC_DIFF_LIMIT and second_diff <= TRIDOSHIC_DIFF_LIMIT:
        constitution_type = "Balanced Tridoshic"
    elif max_diff <= DUAL_DOSHA_DIFF_LIMIT:
        constitution_type = f"{dominant}-{secondary}"
    else:
        constitution_type = f"{dominant} Dominant"

    return {
        'dominant': dominant,
        'secondary': secondary,
        'type': constitution_type,
        'percentages': percentages
    }


# ─── YOGA SEQUENCES ──────────────────────────────────────────────────────────

def get_vata_yoga_sequence():
    return [
        {'name': 'Balasana (Child Pose)',    'description': 'Grounding forward fold', 'benefit': 'Calms nervous system', 'energy': 'Grounding',   'imagePath': '/images/yoga/balasana.jpg'},
        {'name': 'Tadasana (Mountain Pose)', 'description': 'Standing foundation',    'benefit': 'Grounds energy',       'energy': 'Stabilizing', 'imagePath': '/images/yoga/tadasana.jpg'},
        {'name': 'Viparita Karani',          'description': 'Legs up wall',           'benefit': 'Calms Vata',           'energy': 'Restorative', 'imagePath': '/images/yoga/viparita-karani.jpg'}
    ]

def get_pitta_yoga_sequence():
    return [
        {'name': 'Chandra Namaskar', 'description': 'Moon salutation', 'benefit': 'Cooling flow',    'energy': 'Cooling',       'imagePath': '/images/yoga/chandra-namaskar.jpg'},
        {'name': 'Matsyasana',       'description': 'Fish pose',       'benefit': 'Opens heart',      'energy': 'Heart-opening', 'imagePath': '/images/yoga/matsyasana.jpg'},
        {'name': 'Shavasana',        'description': 'Corpse pose',     'benefit': 'Deep relaxation',  'energy': 'Peaceful',      'imagePath': '/images/yoga/shavasana.jpg'}
    ]

def get_kapha_yoga_sequence():
    return [
        {'name': 'Surya Namaskar', 'description': 'Sun salutation',       'benefit': 'Energizes body',   'energy': 'Heating',     'imagePath': '/images/yoga/surya-namaskar.jpg'},
        {'name': 'Virabhadrasana', 'description': 'Warrior pose',         'benefit': 'Builds strength',  'energy': 'Empowering',  'imagePath': '/images/yoga/virabhadrasana.jpg'},
        {'name': 'Kapalbhati',     'description': 'Skull-shining breath', 'benefit': 'Clears congestion','energy': 'Stimulating', 'imagePath': '/images/yoga/kapalbhati.jpg'}
    ]


# ─── ANALYSIS GENERATORS ─────────────────────────────────────────────────────

def generate_physical_analysis_hybrid(vata, pitta, kapha, active_doshas, symptoms):
    parts = []

    for dosha, pct in active_doshas:
        if dosha == 'vata':
            if pct >= EXTREME_DOSHA_THRESHOLD:
                parts.append(f"Extreme Vata dominance ({pct}%) creates significant dryness, coldness, and nervous system sensitivity")
            elif pct >= HIGH_DOSHA_THRESHOLD:
                parts.append(f"High Vata ({pct}%) contributes to variable energy, dryness, and cold sensitivity")
            elif pct >= ACTIVE_DOSHA_THRESHOLD:
                parts.append(f"Moderate Vata ({pct}%) adds movement and variability to your constitution")

        if dosha == 'pitta':
            if pct >= EXTREME_DOSHA_THRESHOLD:
                parts.append(f"Extreme Pitta dominance ({pct}%) generates intense internal heat and inflammatory tendencies")
            elif pct >= HIGH_DOSHA_THRESHOLD:
                parts.append(f"High Pitta ({pct}%) creates strong metabolism, heat, and sharp appetite")
            elif pct >= ACTIVE_DOSHA_THRESHOLD:
                parts.append(f"Moderate Pitta ({pct}%) adds warmth and metabolic fire")

        if dosha == 'kapha':
            if pct >= EXTREME_DOSHA_THRESHOLD:
                parts.append(f"Extreme Kapha dominance ({pct}%) leads to heaviness, congestion, and slow metabolism")
            elif pct >= HIGH_DOSHA_THRESHOLD:
                parts.append(f"High Kapha ({pct}%) provides stability but can create sluggishness and weight gain tendency")
            elif pct >= ACTIVE_DOSHA_THRESHOLD:
                parts.append(f"Moderate Kapha ({pct}%) gives you grounding and endurance")

    if 'Joint Pain'   in symptoms: parts.append("Joint pain indicates Vata aggravation requiring warming, grounding therapies")
    if 'Congestion'   in symptoms: parts.append("Congestion shows Kapha excess needing stimulation and drying")
    if 'Acidity'      in symptoms: parts.append("Acidity reveals Pitta imbalance requiring cooling interventions")

    return ". ".join(parts) + "."


def generate_emotional_analysis_hybrid(vata, pitta, kapha, active_doshas, symptoms):
    parts = []

    for dosha, pct in active_doshas:
        if dosha == 'vata'  and pct >= HIGH_DOSHA_THRESHOLD: parts.append(f"Vata ({pct}%) creates mental activity, creativity, but also anxiety and restlessness")
        if dosha == 'pitta' and pct >= HIGH_DOSHA_THRESHOLD: parts.append(f"Pitta ({pct}%) brings sharp intellect and drive, but also irritability and perfectionism")
        if dosha == 'kapha' and pct >= HIGH_DOSHA_THRESHOLD: parts.append(f"Kapha ({pct}%) provides emotional stability, but can lead to attachment and resistance to change")

    if 'Anxiety'     in symptoms: parts.append("Anxiety indicates need for Vata-calming practices")
    if 'Irritability' in symptoms: parts.append("Irritability shows Pitta excess requiring cooling compassion practices")
    if 'Fatigue'     in symptoms: parts.append("Fatigue suggests Kapha heaviness needing energizing interventions")

    return ". ".join(parts) + "."


def generate_digestive_analysis_hybrid(vata, pitta, kapha, active_doshas, symptoms):
    parts = []

    for dosha, pct in active_doshas:
        if dosha == 'vata'  and pct >= HIGH_DOSHA_THRESHOLD: parts.append("Vata creates irregular appetite with gas and bloating tendency")
        if dosha == 'pitta' and pct >= HIGH_DOSHA_THRESHOLD: parts.append("Pitta generates strong appetite with acidic and inflammatory tendencies")
        if dosha == 'kapha' and pct >= HIGH_DOSHA_THRESHOLD: parts.append("Kapha slows digestion with heaviness and sluggish metabolism")

    if 'Acidity'    in symptoms: parts.append("Acidity requires cooling foods and avoiding spicy/sour items")
    if 'Bloating'   in symptoms: parts.append("Bloating indicates need for warm, well-cooked foods at regular times")
    if 'Congestion' in symptoms: parts.append("Digestive congestion needs light, stimulating foods")

    return ". ".join(parts) + "."


def generate_sleep_analysis_hybrid(vata, pitta, kapha, active_doshas, symptoms):
    parts = []

    for dosha, pct in active_doshas:
        if dosha == 'vata'  and pct >= HIGH_DOSHA_THRESHOLD: parts.append("Vata creates light, interrupted sleep with difficulty falling asleep")
        if dosha == 'pitta' and pct >= HIGH_DOSHA_THRESHOLD: parts.append("Pitta may cause vivid dreams and waking due to mental intensity")
        if dosha == 'kapha' and pct >= HIGH_DOSHA_THRESHOLD: parts.append("Kapha brings heavy sleep with tendency to oversleep")

    if 'Insomnia' in symptoms: parts.append("Insomnia requires calming bedtime routine and nervous system support")

    return ". ".join(parts) + "."


# ─── WEIGHTED RECOMMENDATION GENERATORS ──────────────────────────────────────

def generate_weighted_foods_prefer(active_doshas, symptoms):
    vata_foods  = ['Warm soups and stews', 'Cooked root vegetables', 'Ghee and healthy oils', 'Warm milk with spices', 'Oatmeal with cinnamon', 'Rice and quinoa', 'Soaked nuts']
    pitta_foods = ['Cooling cucumbers and melons', 'Sweet fruits (grapes, pears)', 'Coconut products', 'Leafy greens', 'Mint and cilantro', 'Basmati rice', 'Cooling spices (coriander, fennel)']
    kapha_foods = ['Light, warm foods', 'Stimulating spices (ginger, pepper)', 'Bitter greens', 'Beans and lentils', 'Apples and pears', 'Light grains (barley, millet)']

    dosha_map = {'vata': vata_foods, 'pitta': pitta_foods, 'kapha': kapha_foods}
    foods, seen = [], set()

    for dosha, pct in active_doshas:
        count = 7 if pct >= EXTREME_DOSHA_THRESHOLD else 5 if pct >= HIGH_DOSHA_THRESHOLD else 3
        for food in dosha_map[dosha][:count]:
            if food not in seen:
                foods.append(food)
                seen.add(food)

    if 'Acidity'  in symptoms and 'Cooling cucumbers and melons' not in seen: foods.insert(0, 'Cooling cucumbers and melons')
    if 'Congestion' in symptoms and 'Stimulating spices (ginger, pepper)' not in seen: foods.insert(0, 'Stimulating spices (ginger, pepper)')
    if 'Anxiety'  in symptoms and 'Warm milk with spices' not in seen: foods.insert(0, 'Warm milk with spices')

    return remove_contradictions_foods(foods)


def generate_weighted_foods_avoid(active_doshas, symptoms):
    vata_avoid  = ['Cold foods', 'Raw vegetables', 'Dry snacks', 'Carbonated drinks']
    pitta_avoid = ['Spicy foods', 'Sour foods', 'Alcohol', 'Fried foods']
    kapha_avoid = ['Heavy oily foods', 'Dairy products', 'Sweets', 'Cold drinks']

    dosha_map = {'vata': vata_avoid, 'pitta': pitta_avoid, 'kapha': kapha_avoid}
    foods, seen = [], set()

    for dosha, pct in active_doshas:
        if pct >= HIGH_DOSHA_THRESHOLD:
            for food in dosha_map[dosha]:
                if food not in seen:
                    foods.append(food)
                    seen.add(food)

    if 'Acidity'    in symptoms and 'Spicy foods'     not in seen: foods.insert(0, 'Spicy foods')
    if 'Congestion' in symptoms and 'Dairy products'  not in seen: foods.insert(0, 'Dairy products')

    return foods


def generate_weighted_herbs(active_doshas, symptoms):
    vata_herbs  = ['Ashwagandha - nervous system support', 'Ginger - warming digestion', 'Brahmi - calms mind']
    pitta_herbs = ['Brahmi - cooling clarity', 'Shatavari - cooling support', 'Coriander - digestive cooling']
    kapha_herbs = ['Trikatu - digestive fire', 'Tulsi - energizing', 'Ginger - warming stimulation']

    dosha_map = {'vata': vata_herbs, 'pitta': pitta_herbs, 'kapha': kapha_herbs}
    herbs, seen = [], set()

    for dosha, pct in active_doshas:
        if pct >= HIGH_DOSHA_THRESHOLD:
            for herb in dosha_map[dosha]:
                if herb not in seen:
                    herbs.append(herb)
                    seen.add(herb)

    if 'Anxiety'  in symptoms: herbs.insert(0, 'Ashwagandha - anxiety relief')
    if 'Insomnia' in symptoms: herbs.insert(0, 'Brahmi - sleep support')

    return herbs


def generate_weighted_drinks(active_doshas, symptoms):
    vata_drinks  = ['Warm ginger tea', 'Warm milk with nutmeg', 'Chamomile tea']
    pitta_drinks = ['Coconut water', 'Mint tea', 'Coriander tea']
    kapha_drinks = ['Ginger tea', 'Warm water with lemon', 'Tulsi tea']

    dosha_map = {'vata': vata_drinks, 'pitta': pitta_drinks, 'kapha': kapha_drinks}
    drinks, seen = [], set()

    for dosha, pct in active_doshas:
        if pct >= HIGH_DOSHA_THRESHOLD:
            for drink in dosha_map[dosha]:
                if drink not in seen:
                    drinks.append(drink)
                    seen.add(drink)

    return drinks


def generate_weighted_yoga(active_doshas, symptoms):
    primary = active_doshas[0][0] if active_doshas else 'vata'
    return {'vata': get_vata_yoga_sequence, 'pitta': get_pitta_yoga_sequence, 'kapha': get_kapha_yoga_sequence}[primary]()


def generate_weighted_lifestyle(active_doshas, symptoms):
    vata_tips  = ['Maintain regular daily routine', 'Practice oil massage regularly', 'Create warm, cozy environment', 'Avoid excessive stimulation']
    pitta_tips = ['Practice moderation in all activities', 'Avoid excessive heat', 'Take regular breaks', 'Practice patience and compassion']
    kapha_tips = ['Exercise daily - vigorous intensity', 'Wake early consistently', 'Seek variety and new experiences', 'Stay active throughout day']

    dosha_map = {'vata': vata_tips, 'pitta': pitta_tips, 'kapha': kapha_tips}
    tips, seen = [], set()

    for dosha, pct in active_doshas:
        if pct >= HIGH_DOSHA_THRESHOLD:
            for tip in dosha_map[dosha]:
                if tip not in seen:
                    tips.append(tip)
                    seen.add(tip)

    return tips


def generate_weighted_morning(active_doshas, symptoms):
    vata_morning  = ['Wake at 6:00 AM', 'Warm oil self-massage', 'Gentle grounding yoga', 'Meditation practice', 'Warm nourishing breakfast']
    pitta_morning = ['Wake at 5:30 AM', 'Drink cool water', 'Cooling pranayama', 'Moderate exercise', 'Cool shower']
    kapha_morning = ['Wake at 5:00 AM or earlier', 'Warm water with lemon and ginger', 'Vigorous exercise (45+ minutes)', 'Stimulating breathwork', 'Light or skip breakfast']

    dosha_map = {'vata': vata_morning, 'pitta': pitta_morning, 'kapha': kapha_morning}
    routine, seen = [], set()

    for dosha, pct in active_doshas:
        if pct >= HIGH_DOSHA_THRESHOLD:
            for item in dosha_map[dosha]:
                if item not in seen:
                    routine.append(item)
                    seen.add(item)

    return routine


def generate_weighted_night(active_doshas, symptoms):
    vata_night  = ['Light dinner by 7:00 PM', 'Warm bath', 'Gentle restorative yoga', 'Warm milk with nutmeg', 'In bed by 10:00 PM']
    pitta_night = ['Light dinner by 6:30 PM', 'Cool shower', 'Cooling yoga sequence', 'Avoid work after 8:00 PM', 'Sleep in cool room']
    kapha_night = ['Light dinner before 6:00 PM', 'Evening walk or activity', 'Avoid late snacking', 'Hot stimulating shower', 'Aim for 6-7 hours sleep only']

    dosha_map = {'vata': vata_night, 'pitta': pitta_night, 'kapha': kapha_night}
    routine, seen = [], set()

    for dosha, pct in active_doshas:
        if pct >= HIGH_DOSHA_THRESHOLD:
            for item in dosha_map[dosha]:
                if item not in seen:
                    routine.append(item)
                    seen.add(item)

    if 'Insomnia' in symptoms:
        routine.insert(0, 'Calming bedtime routine essential')

    return routine


def generate_weighted_stress(active_doshas, symptoms):
    vata_stress  = ['Alternate nostril breathing (Nadi Shodhana)', 'Grounding meditation', 'Journaling thoughts', 'Nature walks daily']
    pitta_stress = ['Cooling breath (Sitali)', 'Forgiveness meditation', 'Creative pursuits', 'Compassion practice']
    kapha_stress = ['Energizing breathwork (Kapalabhati)', 'Dynamic meditation', 'New challenges', 'Social engagement']

    dosha_map = {'vata': vata_stress, 'pitta': pitta_stress, 'kapha': kapha_stress}
    practices, seen = [], set()

    for dosha, pct in active_doshas:
        if pct >= HIGH_DOSHA_THRESHOLD:
            for practice in dosha_map[dosha]:
                if practice not in seen:
                    practices.append(practice)
                    seen.add(practice)

    if 'Anxiety' in symptoms:
        practices.insert(0, 'Deep breathing exercises essential')

    return practices


# ─── CONTRADICTION FILTER ────────────────────────────────────────────────────

def remove_contradictions_foods(foods):
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


# ─── RECOMMENDATION ORCHESTRATOR ─────────────────────────────────────────────

def generate_hybrid_recommendations(percentages, constitution, symptoms, answers):
    vata  = percentages['vata']
    pitta = percentages['pitta']
    kapha = percentages['kapha']

    active_doshas = sorted(
        [(d, p) for d, p in [('vata', vata), ('pitta', pitta), ('kapha', kapha)] if p >= ACTIVE_DOSHA_THRESHOLD],
        key=lambda x: x[1], reverse=True
    )

    return {
        'physical_analysis':  generate_physical_analysis_hybrid(vata, pitta, kapha, active_doshas, symptoms),
        'emotional_analysis': generate_emotional_analysis_hybrid(vata, pitta, kapha, active_doshas, symptoms),
        'digestive_analysis': generate_digestive_analysis_hybrid(vata, pitta, kapha, active_doshas, symptoms),
        'sleep_analysis':     generate_sleep_analysis_hybrid(vata, pitta, kapha, active_doshas, symptoms),
        'foods_prefer':       generate_weighted_foods_prefer(active_doshas, symptoms),
        'foods_avoid':        generate_weighted_foods_avoid(active_doshas, symptoms),
        'herbs':              generate_weighted_herbs(active_doshas, symptoms),
        'drinks':             generate_weighted_drinks(active_doshas, symptoms),
        'yoga':               generate_weighted_yoga(active_doshas, symptoms),
        'lifestyle_tips':     generate_weighted_lifestyle(active_doshas, symptoms),
        'morning_routine':    generate_weighted_morning(active_doshas, symptoms),
        'night_routine':      generate_weighted_night(active_doshas, symptoms),
        'stress_management':  generate_weighted_stress(active_doshas, symptoms),
    }


# ─── MAIN HANDLER ────────────────────────────────────────────────────────────

def handle_submit_assessment(data):
    try:
        email = data.get("email")
        cur.execute("SELECT id FROM users WHERE email=%s", (email,))
        user = cur.fetchone()
        if user is None:
            return {"error": "User not found"}, 404
        user_id = user[0]

        answers = {
            'bodyFrame':         data.get('bodyFrame'),
            'skinType':          data.get('skinType'),
            'hairType':          data.get('hairType'),
            'weightPattern':     data.get('weightPattern'),
            'appetite':          data.get('appetite'),
            'digestion':         data.get('digestion'),
            'thirst':            data.get('thirst'),
            'mindState':         data.get('mindState'),
            'sleepPattern':      data.get('sleepPattern'),
            'climatePreference': data.get('climatePreference')
        }
        symptoms = data.get('symptoms', [])

        dosha_scores          = calculate_hybrid_dosha_scores(answers, symptoms)
        total_score           = sum(dosha_scores.values())
        percentages           = {
            'vata':  round((dosha_scores['vata']  / total_score) * 100, 1),
            'pitta': round((dosha_scores['pitta'] / total_score) * 100, 1),
            'kapha': round((dosha_scores['kapha'] / total_score) * 100, 1)
        }
        constitution_analysis = analyze_constitution_advanced(percentages)
        recommendations       = generate_hybrid_recommendations(percentages, constitution_analysis, symptoms, answers)
        wellness_score        = calculate_wellness_score(percentages, symptoms)

        cur.execute("""
            INSERT INTO assessments (
                user_id, body_frame, skin_type, hair_type, weight_pattern,
                appetite, digestion, thirst, mind_state, sleep_pattern,
                climate_preference, symptoms, dominant_dosha, constitution_type,
                vata_percentage, pitta_percentage, kapha_percentage, wellness_score,
                created_at
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """, (
            user_id, answers["bodyFrame"], answers["skinType"], answers["hairType"],
            answers["weightPattern"], answers["appetite"], answers["digestion"],
            answers["thirst"], answers["mindState"], answers["sleepPattern"],
            answers["climatePreference"], ",".join(symptoms),
            constitution_analysis["dominant"], constitution_analysis["type"],
            percentages["vata"], percentages["pitta"], percentages["kapha"],
            wellness_score,  datetime.now()
        ))

        assessment_id = cur.fetchone()[0]
        conn.commit()

        return {
            'assessmentId':      assessment_id,
            'dominantDosha':     constitution_analysis['dominant'],
            'secondaryDosha':    constitution_analysis['secondary'],
            'constitutionType':  constitution_analysis['type'],
            'scores':            dosha_scores,
            'percentages':       percentages,
            'wellnessScore':     wellness_score,
            'physicalAnalysis':  recommendations['physical_analysis'],
            'emotionalAnalysis': recommendations['emotional_analysis'],
            'digestiveAnalysis': recommendations['digestive_analysis'],
            'sleepAnalysis':     recommendations['sleep_analysis'],
            'foodsToPrefer':     recommendations['foods_prefer'],
            'foodsToAvoid':      recommendations['foods_avoid'],
            'herbs':             recommendations['herbs'],
            'drinks':            recommendations['drinks'],
            'yoga':              recommendations['yoga'],
            'lifestyleTips':     recommendations['lifestyle_tips'],
            'morningRoutine':    recommendations['morning_routine'],
            'nightRoutine':      recommendations['night_routine'],
            'stressManagement':  recommendations['stress_management'],
            'timestamp':         datetime.now().isoformat()
        }, 200

    except Exception as e:
        conn.rollback()
        print(f"Error in submit_assessment: {e}")
        return {"error": str(e)}, 500