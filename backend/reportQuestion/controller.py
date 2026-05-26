from datetime import datetime
from db import conn, cur


# ─── CONSTANTS ───────────────────────────────────────────────────────────────

EXTREME_DOSHA_THRESHOLD = 60
HIGH_DOSHA_THRESHOLD    = 40
TRIDOSHIC_DIFF_LIMIT    = 15
DUAL_DOSHA_DIFF_LIMIT   = 10
SYMPTOM_PENALTY         = 5


# ─── SCORING ─────────────────────────────────────────────────────────────────

def calculate_advanced_dosha_scores(answers, symptoms):
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

def analyze_constitution(percentages):
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
        {'name': 'Surya Namaskar', 'description': 'Sun salutation',      'benefit': 'Energizes body',   'energy': 'Heating',     'imagePath': '/images/yoga/surya-namaskar.jpg'},
        {'name': 'Virabhadrasana', 'description': 'Warrior pose',        'benefit': 'Builds strength',  'energy': 'Empowering',  'imagePath': '/images/yoga/virabhadrasana.jpg'},
        {'name': 'Kapalbhati',     'description': 'Skull-shining breath','benefit': 'Clears congestion','energy': 'Stimulating', 'imagePath': '/images/yoga/kapalbhati.jpg'}
    ]


# ─── LIFESTYLE / ROUTINE / STRESS HELPERS ────────────────────────────────────

def get_moderate_vata_lifestyle():
    return ['Maintain regular daily routine', 'Practice oil massage 3-4 times per week', 'Avoid excessive stimulation', 'Create warm environment', 'Gentle, grounding exercise']

def get_moderate_pitta_lifestyle():
    return ['Practice moderation in all activities', 'Stay cool and avoid excessive heat', 'Engage in cooling activities', 'Take regular breaks', 'Avoid competitive situations when possible']

def get_moderate_kapha_lifestyle():
    return ['Exercise daily - moderate to vigorous', 'Wake early consistently', 'Seek variety and new experiences', 'Avoid excessive sleep', 'Stay active throughout the day']

def get_vata_morning_routine():
    return ['Wake at 6:00 AM', 'Warm oil massage', 'Gentle yoga', 'Meditation', 'Warm breakfast']

def get_pitta_morning_routine():
    return ['Wake at 5:30 AM', 'Cool water', 'Cooling pranayama', 'Moderate exercise', 'Cool shower']

def get_kapha_morning_routine():
    return ['Wake at 5:00 AM', 'Warm water with spices', 'Vigorous exercise', 'Stimulating pranayama', 'Light or skip breakfast']

def get_vata_night_routine():
    return ['Light dinner by 7:00 PM', 'Warm bath', 'Gentle yoga', 'Warm milk', 'In bed by 10:00 PM']

def get_pitta_night_routine():
    return ['Light dinner by 6:30 PM', 'Cool shower', 'Cooling yoga', 'Avoid work after 8:00 PM', 'Cool sleeping environment']

def get_kapha_night_routine():
    return ['Light dinner before 6:00 PM', 'Evening activity', 'Avoid late snacking', 'Hot shower', 'Aim for 6-7 hours sleep']

def get_vata_stress_management():
    return ['Alternate nostril breathing', 'Grounding meditation', 'Journaling', 'Nature time', 'Avoid overstimulation']

def get_pitta_stress_management():
    return ['Cooling breath practices', 'Forgiveness meditation', 'Creative pursuits', 'Avoid late night work', 'Compassion practice']

def get_kapha_stress_management():
    return ['Energizing breathwork', 'Dynamic meditation', 'New challenges', 'Social engagement', 'Outdoor activities']


# ─── BALANCED / MIXED DOSHAS ─────────────────────────────────────────────────

def handle_balanced_doshas(rec, percentages, constitution):
    constitution_type = constitution['type']
    vata  = percentages['vata']
    pitta = percentages['pitta']
    kapha = percentages['kapha']

    if constitution_type == "Balanced Tridoshic":
        rec['physical_analysis']  = "Your constitution shows beautiful balance among all three doshas. You have the rare gift of equilibrium, experiencing the best qualities of Vata (creativity), Pitta (drive), and Kapha (stability) in harmony. Maintain this balance through seasonal adjustments and mindful living."
        rec['emotional_analysis'] = "Emotionally balanced with access to creativity, intelligence, and stability. You adapt well to change while maintaining groundedness. Your challenge is maintaining this balance through life's changes."
        rec['digestive_analysis'] = "Balanced digestion that adapts well to different foods. Maintain variety in diet while staying mindful of seasonal and environmental changes."
        rec['sleep_analysis']     = "Generally good sleep quality. Maintain consistent sleep schedule and adjust based on seasonal variations."
        rec['foods_prefer'] = ['Seasonal, fresh foods', 'Variety of vegetables and fruits', 'Whole grains', 'Moderate use of all six tastes', 'Fresh, home-cooked meals']
        rec['foods_avoid']  = ['Processed foods', 'Excessive amounts of any one taste', 'Overeating', 'Irregular meal times']

    elif "Vata-Pitta" in constitution_type:
        rec['physical_analysis']  = f"Your constitution is Vata-Pitta ({vata}% Vata, {pitta}% Pitta), combining qualities of air/movement with fire/transformation. You experience both dryness and heat, variable energy with intensity. Need practices that ground and cool simultaneously."
        rec['emotional_analysis'] = "Quick-thinking and driven, but prone to anxiety and irritability when imbalanced. You combine creativity with sharp intellect but can become scattered and intense. Need calming, cooling practices."
        rec['digestive_analysis'] = "Variable appetite combined with acidic tendency. May experience both gas and heartburn. Need warm but not too spicy foods, eaten at regular times."
        rec['sleep_analysis']     = "Light to moderate sleep with tendency toward mental activity at night. Need both calming and cooling evening routine."
        rec['foods_prefer'] = ['Warm but not spicy foods', 'Sweet fruits (grapes, melons)', 'Rice and oats', 'Ghee', 'Cooling spices (coriander, fennel)', 'Cooked vegetables', 'Coconut', 'Sweet dairy']
        rec['foods_avoid']  = ['Cold, dry foods', 'Very spicy foods', 'Caffeine', 'Raw vegetables', 'Sour foods', 'Alcohol']

    elif "Pitta-Kapha" in constitution_type:
        rec['physical_analysis']  = f"Your constitution is Pitta-Kapha ({pitta}% Pitta, {kapha}% Kapha), combining fire/transformation with earth/stability. You have strong build with good metabolism, but can experience inflammation and congestion. Need practices that cool and lighten."
        rec['emotional_analysis'] = "Stable and driven with capacity for sustained effort. Can be stubborn or overly intense. Need practices that promote flexibility and coolness."
        rec['digestive_analysis'] = "Strong appetite with tendency toward both heat and heaviness. Need light, cooling foods that don't slow metabolism."
        rec['sleep_analysis']     = "Good sleep quality but may struggle with heat or heaviness. Need cool, well-ventilated sleeping environment."
        rec['foods_prefer'] = ['Light, cooling vegetables', 'Astringent and bitter tastes', 'Beans and lentils', 'Apples and pears', 'Leafy greens', 'Moderate spices', 'Lean proteins']
        rec['foods_avoid']  = ['Heavy, oily foods', 'Dairy', 'Very spicy foods', 'Red meat', 'Sweets and desserts', 'Fried foods']

    elif "Vata-Kapha" in constitution_type or "Kapha-Vata" in constitution_type:
        rec['physical_analysis']  = f"Your constitution combines Vata-Kapha ({vata}% Vata, {kapha}% Kapha), pairing air/movement with earth/stability. You may experience alternating dryness and congestion, variable energy and lethargy. Need warming, energizing practices."
        rec['emotional_analysis'] = "Creative yet stable, but can alternate between anxiety and depression. Need practices that both ground and energize."
        rec['digestive_analysis'] = "Variable digestion that can be either slow or irregular. Need warm, light foods that are easy to digest."
        rec['sleep_analysis']     = "May experience either light sleep or heavy sleep depending on which dosha is aggravated. Need consistent routine."
        rec['foods_prefer'] = ['Warm, light foods', 'Stimulating spices (ginger, pepper)', 'Cooked vegetables', 'Beans and lentils', 'Light grains (quinoa, barley)', 'Apples and pears', 'Warming herbal teas']
        rec['foods_avoid']  = ['Cold, heavy foods', 'Dairy', 'Wheat', 'Sweets', 'Raw foods', 'Fried foods']

    if not rec['herbs']:
        rec['herbs'] = ['Triphala - balancing for all doshas', 'Tulsi - adaptogenic', 'Brahmi - mental clarity']
    if not rec['drinks']:
        rec['drinks'] = ['CCF tea (cumin, coriander, fennel)', 'Herbal teas based on season', 'Warm water with ginger']
    if not rec['yoga']:
        rec['yoga'] = get_vata_yoga_sequence()
    if not rec['lifestyle_tips']:
        rec['lifestyle_tips'] = get_moderate_vata_lifestyle()
    if not rec['morning_routine']:
        rec['morning_routine'] = get_vata_morning_routine()
    if not rec['night_routine']:
        rec['night_routine'] = get_vata_night_routine()
    if not rec['stress_management']:
        rec['stress_management'] = get_vata_stress_management()


# ─── RECOMMENDATIONS ─────────────────────────────────────────────────────────

def generate_dynamic_recommendations(percentages, constitution, symptoms):
    vata  = percentages['vata']
    pitta = percentages['pitta']
    kapha = percentages['kapha']

    rec = {
        'physical_analysis': '', 'emotional_analysis': '',
        'digestive_analysis': '', 'sleep_analysis': '',
        'foods_prefer': [], 'foods_avoid': [],
        'herbs': [], 'drinks': [], 'yoga': [],
        'lifestyle_tips': [], 'morning_routine': [],
        'night_routine': [], 'stress_management': []
    }

    if vata > EXTREME_DOSHA_THRESHOLD:
        rec['physical_analysis']  = "Your constitution shows extreme Vata dominance, indicating significant nervous system imbalance. You may experience pronounced dryness, coldness, irregular digestion, and variable energy levels. Your body craves warmth, stability, and grounding. Joint crackling, cold extremities, and thin build are common manifestations."
        rec['emotional_analysis'] = "High Vata creates mental restlessness, racing thoughts, anxiety, fear, and overwhelm. You may struggle with focus, experience worry about the future, and feel scattered or ungrounded. Creative but easily overstimulated. Need practices that calm the nervous system."
        rec['digestive_analysis'] = "Irregular appetite with tendency toward gas, bloating, constipation, and dry digestion. Your digestive fire (Agni) is erratic - sometimes strong, sometimes weak. You need warm, moist, well-cooked foods eaten at regular times to stabilize digestion."
        rec['sleep_analysis']     = "Light, interrupted sleep with difficulty falling asleep and staying asleep. You wake easily from noise or thoughts. May experience insomnia, especially between 2-6 AM (Vata time). Need calming bedtime routine and nervous system support."
        rec['foods_prefer'] = ['Warm soups and stews', 'Cooked root vegetables (sweet potato, carrots, beets)', 'Warm milk with cardamom and honey', 'Ghee (clarified butter)', 'Oatmeal with cinnamon', 'Ripe bananas and mangoes', 'Rice and quinoa', 'Nuts soaked overnight (almonds, walnuts)', 'Warm herbal teas', 'Cooked greens with oil']
        rec['foods_avoid']  = ['Cold or frozen foods', 'Dry crackers and chips', 'Raw vegetables (especially cruciferous)', 'Beans (except mung dal)', 'Carbonated drinks', 'Excessive caffeine', 'Leftover or reheated food', 'White sugar']
        rec['herbs']        = ['Ashwagandha - nervous system support and grounding', 'Brahmi - calms mind and improves focus', 'Shatavari - nourishing and moistening', 'Ginger - warming digestive support', 'Licorice root - soothing and grounding']
        rec['drinks']       = ['Warm ginger tea', 'Cinnamon and cardamom tea', 'Warm milk with nutmeg', 'CCF tea (cumin, coriander, fennel)', 'Chamomile tea before bed']
        rec['yoga'] = [
            {'name': 'Balasana (Child Pose)',               'description': 'Grounding forward fold',           'benefit': 'Calms nervous system and reduces anxiety',       'energy': 'Deeply grounding and soothing', 'imagePath': '/images/yoga/balasana.jpg'},
            {'name': 'Tadasana (Mountain Pose)',             'description': 'Standing foundation pose',         'benefit': 'Grounds energy into earth, improves stability',  'energy': 'Centering and stabilizing',     'imagePath': '/images/yoga/tadasana.jpg'},
            {'name': 'Viparita Karani (Legs Up Wall)',       'description': 'Gentle inversion',                 'benefit': 'Reverses downward flow of Vata, deeply calming', 'energy': 'Restorative and peaceful',      'imagePath': '/images/yoga/viparita-karani.jpg'},
            {'name': 'Paschimottanasana (Seated Forward Bend)', 'description': 'Calming forward fold',         'benefit': 'Soothes nervous system, aids digestion',         'energy': 'Introspective and grounding',   'imagePath': '/images/yoga/paschimottanasana.jpg'},
            {'name': 'Sukhasana with Pranayama',             'description': 'Easy seated pose with slow breathing', 'benefit': 'Regulates breath, calms anxiety',          'energy': 'Meditative and stabilizing',    'imagePath': '/images/yoga/sukhasana.jpg'}
        ]
        rec['lifestyle_tips']    = ['Establish strict daily routine - wake, eat, and sleep at same times', 'Practice daily oil massage (Abhyanga) with warm sesame oil', 'Avoid excessive travel, noise, and overstimulation', 'Create warm, cozy living environment', 'Limit screen time, especially before bed', 'Engage in gentle, grounding exercises (no intense cardio)', 'Spend time in nature, practice earthing (barefoot walking)', 'Reduce multitasking - focus on one thing at a time']
        rec['morning_routine']   = ['Wake at 6:00 AM and practice self-massage with warm sesame oil (15 min)', 'Gentle yoga or stretching (20 minutes) - focus on grounding poses', 'Meditation or pranayama (10 minutes) - Nadi Shodhana', 'Warm shower after oil massage', 'Eat warm, nourishing breakfast by 8:00 AM (oatmeal, warm milk)', 'Set clear intentions for the day to prevent scattered energy']
        rec['night_routine']     = ['Light dinner before 7:00 PM (warm soup or cooked vegetables)', 'Evening walk after dinner (15 minutes)', 'Warm bath with essential oils (lavender, sandalwood)', 'Gentle restorative yoga (15 minutes)', 'Foot massage with warm oil', 'Warm milk with nutmeg and cardamom', 'Journaling to settle thoughts', 'In bed by 10:00 PM, read calming content', 'Avoid screens 90 minutes before sleep']
        rec['stress_management'] = ['Practice Nadi Shodhana (alternate nostril breathing) - 5 minutes twice daily', 'Grounding meditation focusing on root chakra', 'Journaling to organize scattered thoughts', 'Spend 20 minutes in nature daily', 'Avoid stimulating news and social media', 'Create predictable, safe environments', 'Practice saying no to overcommitment']

    elif vata >= HIGH_DOSHA_THRESHOLD:
        rec['physical_analysis']  = f"Moderate to high Vata ({vata}%) indicates tendency toward dryness, coldness, and variable energy. You may experience occasional digestive irregularity, dry skin, and sensitivity to cold weather. Your body benefits from routine, warmth, and nourishment."
        rec['emotional_analysis'] = "Elevated Vata brings quick thinking, creativity, but also tendency toward worry and restlessness. You may experience occasional anxiety or scattered focus. Need grounding practices to balance mental activity."
        rec['digestive_analysis'] = "Variable appetite and digestion with tendency toward gas and bloating. Benefit from regular meal times and warm, cooked foods that are easy to digest."
        rec['sleep_analysis']     = "Sleep quality may be inconsistent. You benefit from calming evening routine and avoiding stimulation before bed. May wake during Vata hours (2-6 AM)."
        rec['foods_prefer']      = ['Warm, cooked vegetables', 'Soups and stews', 'Rice and oatmeal', 'Ghee and healthy oils', 'Sweet fruits (ripe)', 'Warm milk drinks', 'Nuts (soaked)', 'Root vegetables']
        rec['foods_avoid']       = ['Cold foods and drinks', 'Raw vegetables', 'Dry snacks', 'Excessive caffeine', 'Carbonated beverages']
        rec['herbs']             = ['Ashwagandha - calming and nourishing', 'Ginger - digestive warmth', 'Cardamom - warming and settling']
        rec['drinks']            = ['Warm ginger tea', 'Warm milk with spices', 'Herbal teas (chamomile, tulsi)']
        rec['yoga']              = get_vata_yoga_sequence()
        rec['lifestyle_tips']    = get_moderate_vata_lifestyle()
        rec['morning_routine']   = get_vata_morning_routine()
        rec['night_routine']     = get_vata_night_routine()
        rec['stress_management'] = get_vata_stress_management()

    elif pitta > EXTREME_DOSHA_THRESHOLD:
        rec['physical_analysis']  = "Your constitution shows extreme Pitta dominance, indicating significant internal heat and metabolic intensity. You may experience inflammatory conditions, acidity, skin sensitivity, premature greying, and strong body heat. Your body craves cooling, calming, and soothing influences."
        rec['emotional_analysis'] = "High Pitta creates intense drive, perfectionism, irritability, anger, and impatience. You may be highly critical of self and others, competitive, and struggle with letting go. Sharp intellect but prone to burnout. Need practices that cool emotional intensity."
        rec['digestive_analysis'] = "Strong, sharp appetite with tendency toward acidity, heartburn, loose stools, and inflammatory gut conditions. Your digestive fire (Agni) is intense and burns hot. You need cooling foods and to avoid spicy, acidic, or fermented foods."
        rec['sleep_analysis']     = "Moderate sleep needs but may struggle with falling asleep due to mental intensity. Dreams may be vivid, intense, or disturbing. Wake during Pitta hours (10 PM-2 AM) if stressed. Need cooling evening routine."
        rec['foods_prefer'] = ['Cooling cucumbers and melons', 'Sweet fruits (grapes, pears, apples)', 'Coconut in all forms', 'Leafy greens and salads', 'Cilantro and mint', 'Sweet and bitter vegetables', 'Basmati rice', 'Mung beans and lentils', 'Ghee (in moderation)', 'Cooling spices (coriander, fennel, cardamom)']
        rec['foods_avoid']  = ['Spicy foods (chili, cayenne, black pepper)', 'Sour foods (yogurt, vinegar, citrus)', 'Fermented foods', 'Red meat', 'Alcohol', 'Caffeine (especially coffee)', 'Fried and oily foods', 'Garlic and onions (raw)', 'Tomatoes and eggplant', 'Salty foods']
        rec['herbs']        = ['Brahmi - cools mind and supports clarity', 'Shatavari - cooling and soothing', 'Neem - blood purifying and cooling', 'Amalaki - cooling digestive support', 'Coriander - cooling and digestive']
        rec['drinks']       = ['Coconut water', 'Mint tea (cool or room temperature)', 'Coriander tea', 'Aloe vera juice', 'Rose water drinks', 'Fennel tea']
        rec['yoga'] = [
            {'name': 'Chandra Namaskar (Moon Salutation)', 'description': 'Cooling flow sequence',    'benefit': 'Reduces internal heat and calms fiery energy',  'energy': 'Cooling and receptive',      'imagePath': '/images/yoga/chandra-namaskar.jpg'},
            {'name': 'Matsyasana (Fish Pose)',              'description': 'Heart-opening backbend',   'benefit': 'Releases tension and opens to compassion',       'energy': 'Heart-centered and cooling', 'imagePath': '/images/yoga/matsyasana.jpg'},
            {'name': 'Shavasana (Corpse Pose)',             'description': 'Complete relaxation pose', 'benefit': 'Deep cooling relaxation, releases perfectionism', 'energy': 'Surrendering and peaceful', 'imagePath': '/images/yoga/shavasana.jpg'},
            {'name': 'Ardha Matsyendrasana (Seated Twist)', 'description': 'Gentle spinal twist',     'benefit': 'Detoxifies liver and cools digestive system',    'energy': 'Cleansing and balancing',   'imagePath': '/images/yoga/ardha-matsyendrasana.jpg'},
            {'name': 'Sitali Pranayama (Cooling Breath)',   'description': 'Tongue-rolled breathing', 'benefit': 'Directly cools body temperature and mind',       'energy': 'Intensely cooling',         'imagePath': '/images/yoga/sitali.jpg'}
        ]
        rec['lifestyle_tips']    = ['Avoid excessive heat - stay in cool environments', 'Practice moderation in all activities (avoid overworking)', 'Engage in cooling activities like swimming', 'Avoid competitive situations and arguments', 'Practice patience and compassion toward self and others', 'Take regular breaks from work and intensity', 'Spend time near water (ocean, lakes, rivers)', 'Avoid intense exercise during hottest part of day']
        rec['morning_routine']   = ['Wake at 5:30 AM before heat of day increases', 'Drink room temperature water with aloe or lime', 'Cooling pranayama (Sitali) - 10 minutes', 'Moderate exercise during cool morning hours', 'Cool shower', 'Eat cooling breakfast (fruit smoothie, coconut)', 'Practice gratitude to counter critical tendencies']
        rec['night_routine']     = ['Light, early dinner by 6:30 PM (cooling foods)', 'Evening walk in nature, especially near water', 'Cool shower before bed', 'Cooling yoga sequence (Moon Salutation)', 'Coconut oil scalp massage', 'Practice forgiveness meditation', 'Avoid work and emails after 8:00 PM', 'Sleep in cool, well-ventilated room', 'In bed by 10:00 PM']
        rec['stress_management'] = ['Practice Sitali or Sitkari pranayama (cooling breath) - 10 minutes daily', 'Moon gazing meditation for cooling effect', 'Practice forgiveness and letting go exercises', 'Engage in creative pursuits without judgment', 'Avoid checking emails or work late at night', 'Practice compassion meditation (Metta)', 'Take cooling walks in nature during evening']

    elif pitta >= HIGH_DOSHA_THRESHOLD:
        rec['physical_analysis']  = f"Moderate to high Pitta ({pitta}%) indicates strong metabolism and internal heat. You may experience occasional acidity, skin sensitivity, and strong appetite. Your body benefits from cooling practices and moderation."
        rec['emotional_analysis'] = "Elevated Pitta brings sharp intellect and drive but also tendency toward irritability and perfectionism. You may push yourself too hard. Need cooling and compassionate practices."
        rec['digestive_analysis'] = "Strong appetite with tendency toward acidity and heat in digestion. Benefit from cooling foods and avoiding spicy, sour, or fermented items."
        rec['sleep_analysis']     = "Generally good sleep but may struggle when stressed or overheated. Benefit from cool sleeping environment and calming evening routine."
        rec['foods_prefer']      = ['Cooling vegetables (cucumber, zucchini)', 'Sweet fruits', 'Coconut products', 'Leafy greens', 'Mint and cilantro', 'Basmati rice', 'Cooling spices']
        rec['foods_avoid']       = ['Spicy foods', 'Sour foods', 'Alcohol', 'Excessive caffeine', 'Fried foods']
        rec['herbs']             = ['Brahmi - mental cooling', 'Shatavari - soothing', 'Coriander - digestive cooling']
        rec['drinks']            = ['Coconut water', 'Mint tea', 'Aloe vera juice']
        rec['yoga']              = get_pitta_yoga_sequence()
        rec['lifestyle_tips']    = get_moderate_pitta_lifestyle()
        rec['morning_routine']   = get_pitta_morning_routine()
        rec['night_routine']     = get_pitta_night_routine()
        rec['stress_management'] = get_pitta_stress_management()

    elif kapha > EXTREME_DOSHA_THRESHOLD:
        rec['physical_analysis']  = "Your constitution shows extreme Kapha dominance, indicating significant tendency toward heaviness, congestion, and sluggish metabolism. You may experience weight gain, water retention, excess mucus, lethargy, and slow digestion. Your body craves stimulation, movement, and lightness."
        rec['emotional_analysis'] = "High Kapha creates attachment, resistance to change, depression, lethargy, and emotional heaviness. You may struggle with motivation, oversleep, and resist new experiences. Stable and loyal but can become stuck. Need practices that energize and inspire."
        rec['digestive_analysis'] = "Slow, heavy digestion with tendency toward weight gain, sluggish metabolism, and mucus formation. Your digestive fire (Agni) is weak and slow. You need light, warm, stimulating foods and may benefit from occasional fasting."
        rec['sleep_analysis']     = "Heavy, prolonged sleep with difficulty waking. You may oversleep, nap during day, and still feel groggy. Sleep more than 8 hours worsens Kapha. Need energizing morning routine and avoid daytime sleep."
        rec['foods_prefer'] = ['Light, warm, dry foods', 'Pungent spices (ginger, black pepper, cayenne)', 'Bitter vegetables (kale, dandelion, arugula)', 'Astringent foods (beans, lentils, pomegranate)', 'Apples and pears', 'Barley and millet', 'Small amounts of honey (raw, unheated)', 'Garlic and onions', 'Cruciferous vegetables', 'Very light breakfast or skip it']
        rec['foods_avoid']  = ['Heavy, oily foods', 'Dairy (especially cheese, ice cream, yogurt)', 'Wheat and heavy grains', 'Sweet foods and desserts', 'Cold foods and drinks', 'Fried foods', 'Red meat', 'Excessive salt', 'Bananas and avocados', 'Late night eating']
        rec['herbs']        = ['Trikatu - powerful digestive stimulant (ginger, black pepper, long pepper)', 'Guggul - supports metabolism and weight management', 'Punarnava - reduces water retention', 'Chitrak - kindles digestive fire', 'Tulsi - energizing and clearing']
        rec['drinks']       = ['Strong ginger tea', 'Black pepper and honey in warm water (morning)', 'Tulsi (holy basil) tea', 'Cinnamon tea', 'Warm water with lemon and cayenne', 'CCF tea (cumin, coriander, fennel) - stimulating blend']
        rec['yoga'] = [
            {'name': 'Surya Namaskar (Sun Salutation)', 'description': 'Dynamic flowing sequence',   'benefit': 'Burns Kapha, generates heat, energizes entire body', 'energy': 'Highly energizing and warming', 'imagePath': '/images/yoga/surya-namaskar.jpg'},
            {'name': 'Virabhadrasana (Warrior Poses)',  'description': 'Standing strength poses',    'benefit': 'Builds stamina, confidence, and burns calories',     'energy': 'Empowering and heating',       'imagePath': '/images/yoga/virabhadrasana.jpg'},
            {'name': 'Utkatasana (Chair Pose)',          'description': 'Challenging standing pose', 'benefit': 'Strengthens legs, boosts metabolism',               'energy': 'Intense and energizing',       'imagePath': '/images/yoga/utkatasana.jpg'},
            {'name': 'Navasana (Boat Pose)',             'description': 'Core strengthening pose',   'benefit': 'Ignites digestive fire, strengthens core',           'energy': 'Challenging and activating',   'imagePath': '/images/yoga/navasana.jpg'},
            {'name': 'Kapalbhati Pranayama',             'description': 'Forceful exhalation breath','benefit': 'Clears mucus, energizes body and mind',              'energy': 'Highly stimulating',           'imagePath': '/images/yoga/kapalbhati.jpg'}
        ]
        rec['lifestyle_tips']    = ['Wake up before 6 AM (before Kapha time increases)', 'Engage in vigorous daily exercise - minimum 45 minutes', 'Avoid daytime napping entirely', 'Seek novelty, variety, and new experiences regularly', 'Practice dry brushing before shower to stimulate circulation', 'Stay mentally stimulated - learn new skills', 'Avoid sedentary behavior - move every hour', 'Reduce sleep to 6-7 hours maximum']
        rec['morning_routine']   = ['Wake at 5:00 AM or earlier (before Kapha time)', 'No snoozing - get up immediately', 'Drink warm water with lemon and ginger', 'Vigorous exercise (45-60 minutes) - cardio, strength training', 'Dry brushing before hot shower', 'Stimulating pranayama (Kapalabhati)', 'Skip breakfast or have very light meal (fruit, tea)', 'Engage mind with challenging tasks early']
        rec['night_routine']     = ['Light, early dinner before 6:00 PM', 'Evening activity (walk, yoga, social engagement)', 'Avoid heavy foods and snacking after dinner', 'Stimulating evening yoga (not too relaxing)', 'Hot, stimulating shower', 'Avoid excessive sleep - aim for 6-7 hours only', 'In bed by 10:00 PM, wake before 6:00 AM']
        rec['stress_management'] = ['Practice Kapalabhati (skull-shining breath) - 5 minutes morning', 'Engage in dynamic, moving meditation', 'Take on new challenges to break routine', 'Practice non-attachment exercises', 'Vigorous outdoor activities', 'Social engagement and stimulating conversations', 'Avoid comfort eating - address emotions directly']

    elif kapha >= HIGH_DOSHA_THRESHOLD:
        rec['physical_analysis']  = f"Moderate to high Kapha ({kapha}%) indicates tendency toward steady energy but also heaviness and slower metabolism. You may gain weight easily and experience occasional congestion. Your body benefits from regular movement and stimulation."
        rec['emotional_analysis'] = "Elevated Kapha brings stability and calm but also tendency toward resistance to change and attachment. You may need motivation to start new things. Need energizing and inspiring practices."
        rec['digestive_analysis'] = "Slow, steady digestion with tendency toward sluggish metabolism. Benefit from light, warm, spiced foods and regular exercise to stimulate digestion."
        rec['sleep_analysis']     = "Deep, heavy sleep with tendency to oversleep. You wake refreshed but may struggle to get out of bed. Benefit from consistent early wake time."
        rec['foods_prefer']      = ['Light, warm foods', 'Stimulating spices', 'Bitter greens', 'Beans and lentils', 'Light fruits (apples, pears)', 'Whole grains (barley, millet)']
        rec['foods_avoid']       = ['Heavy, oily foods', 'Dairy products', 'Sweets and desserts', 'Cold foods', 'Excessive portions']
        rec['herbs']             = ['Trikatu - digestive stimulant', 'Ginger - warming', 'Tulsi - energizing']
        rec['drinks']            = ['Ginger tea', 'Warm water with lemon', 'Tulsi tea']
        rec['yoga']              = get_kapha_yoga_sequence()
        rec['lifestyle_tips']    = get_moderate_kapha_lifestyle()
        rec['morning_routine']   = get_kapha_morning_routine()
        rec['night_routine']     = get_kapha_night_routine()
        rec['stress_management'] = get_kapha_stress_management()

    else:
        handle_balanced_doshas(rec, percentages, constitution)

    return rec


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

        dosha_scores          = calculate_advanced_dosha_scores(answers, symptoms)
        total_score           = sum(dosha_scores.values())
        percentages           = {
            'vata':  round((dosha_scores['vata']  / total_score) * 100, 1),
            'pitta': round((dosha_scores['pitta'] / total_score) * 100, 1),
            'kapha': round((dosha_scores['kapha'] / total_score) * 100, 1)
        }
        constitution_analysis = analyze_constitution(percentages)
        recommendations       = generate_dynamic_recommendations(percentages, constitution_analysis, symptoms)
        wellness_score        = calculate_wellness_score(percentages, symptoms)

        cur.execute("""
            INSERT INTO assessments (
                user_id, body_frame, skin_type, hair_type, weight_pattern,
                appetite, digestion, thirst, mind_state, sleep_pattern,
                climate_preference, symptoms, dominant_dosha, constitution_type,
                vata_percentage, pitta_percentage, kapha_percentage, wellness_score
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            user_id, answers["bodyFrame"], answers["skinType"], answers["hairType"],
            answers["weightPattern"], answers["appetite"], answers["digestion"],
            answers["thirst"], answers["mindState"], answers["sleepPattern"],
            answers["climatePreference"], ",".join(symptoms),
            constitution_analysis["dominant"], constitution_analysis["type"],
            percentages["vata"], percentages["pitta"], percentages["kapha"],
            wellness_score
        ))
        conn.commit()

        return {
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