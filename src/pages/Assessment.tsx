import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface FormData {
  bodyFrame: string;
  skinType: string;
  hairType: string;
  weightPattern: string;
  appetite: string;
  digestion: string;
  thirst: string;
  mindState: string;
  sleepPattern: string;
  climatePreference: string;
  symptoms: string[];
}

const Assessment: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    bodyFrame: '',
    skinType: '',
    hairType: '',
    weightPattern: '',
    appetite: '',
    digestion: '',
    thirst: '',
    mindState: '',
    sleepPattern: '',
    climatePreference: '',
    symptoms: []
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleRadioChange = (field: keyof Omit<FormData, 'symptoms'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (symptom: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate all radio questions are answered
    const requiredFields: (keyof Omit<FormData, 'symptoms'>)[] = [
      'bodyFrame', 'skinType', 'hairType', 'weightPattern',
      'appetite', 'digestion', 'thirst', 'mindState',
      'sleepPattern', 'climatePreference'
    ];

    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setError('Please answer all questions before submitting');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/submit-assessment', formData);
      
      // Navigate to report page with results
      navigate('/report', { state: response.data });
    } catch (err) {
      setError('Failed to submit assessment. Please ensure the backend server is running on port 5000.');
      console.error('Submission error:', err);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const symptoms = [
    'Anxiety',
    'Fatigue',
    'Headache',
    'Acidity',
    'Bloating',
    'Congestion',
    'Insomnia',
    'Irritability',
    'Joint Pain',
    'Brain Fog'
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '40px', borderBottom: '3px solid #8B4513', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '36px', color: '#8B4513', margin: '0 0 10px 0' }}>
          🕉️ Ayurvedic Dosha Assessment
        </h1>
        <p style={{ fontSize: '18px', color: '#555', margin: '5px 0' }}>
          Discover Your Unique Constitutional Type
        </p>
        <p style={{ fontSize: '14px', color: '#777', margin: '5px 0' }}>
          Answer all questions honestly for accurate personalized recommendations
        </p>
      </header>

      {/* Error Message */}
      {error && (
        <div style={{ 
          marginBottom: '20px', 
          padding: '15px', 
          backgroundColor: '#ffebee', 
          color: '#c62828',
          borderRadius: '4px',
          border: '1px solid #ef9a9a',
          fontSize: '14px'
        }}>
          <strong>⚠️ Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* SECTION 1 - Physical Traits */}
        <section style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
          <h2 style={{ fontSize: '24px', color: '#8B4513', marginTop: '0', borderBottom: '2px solid #D2691E', paddingBottom: '10px' }}>
            Section 1: Physical Characteristics
          </h2>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
            These questions help identify your body's natural constitution
          </p>

          {/* Question 1 */}
          <fieldset style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '20px', borderRadius: '4px', backgroundColor: 'white' }}>
            <legend style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', padding: '0 10px' }}>
              1. Body Frame & Build
            </legend>
            <label style={{ display: 'block', margin: '10px 0', cursor: 'pointer', padding: '8px', borderRadius: '4px', backgroundColor: formData.bodyFrame === 'A' ? '#e8f5e9' : 'transparent' }}>
              <input
                type="radio"
                name="bodyFrame"
                value="A"
                checked={formData.bodyFrame === 'A'}
                onChange={(e) => handleRadioChange('bodyFrame', e.target.value)}
                style={{ marginRight: '10px' }}
              />
              <strong>A:</strong> Thin, light frame - either tall and lanky or short and petite, difficulty gaining weight
            </label>
            <label style={{ display: 'block', margin: '10px 0', cursor: 'pointer', padding: '8px', borderRadius: '4px', backgroundColor: formData.bodyFrame === 'B' ? '#e8f5e9' : 'transparent' }}>
              <input
                type="radio"
                name="bodyFrame"
                value="B"
                checked={formData.bodyFrame === 'B'}
                onChange={(e) => handleRadioChange('bodyFrame', e.target.value)}
                style={{ marginRight: '10px' }}
              />
              <strong>B:</strong> Medium, athletic build - well-proportioned, moderate muscle development
            </label>
            <label style={{ display: 'block', margin: '10px 0', cursor: 'pointer', padding: '8px', borderRadius: '4px', backgroundColor: formData.bodyFrame === 'C' ? '#e8f5e9' : 'transparent' }}>
              <input
                type="radio"
                name="bodyFrame"
                value="C"
                checked={formData.bodyFrame === 'C'}
                onChange={(e) => handleRadioChange('bodyFrame', e.target.value)}
                style={{ marginRight: '10px' }}
              />
              <strong>C:</strong> Broad, sturdy, heavy build - solid bone structure, gains weight easily, strong
            </label>
          </fieldset>

          {/* Question 2 */}
          <fieldset style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '20px', borderRadius: '4px', backgroundColor: 'white' }}>
            <legend style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', padding: '0 10px' }}>
              2. Skin Type & Texture
            </legend>
            <label style={{ display: 'block', margin: '10px 0', cursor: 'pointer', padding: '8px', borderRadius: '4px', backgroundColor: formData.skinType === 'A' ? '#e8f5e9' : 'transparent' }}>
              <input
                type="radio"
                name="skinType"
                value="A"
                checked={formData.skinType === 'A'}
                onChange={(e) => handleRadioChange('skinType', e.target.value)}
                style={{ marginRight: '10px' }}
              />
              <strong>A:</strong> Dry, rough, thin, cool to touch - prone to cracking, chapping, or flaking
            </label>
            <label style={{ display: 'block', margin: '10px 0', cursor: 'pointer', padding: '8px', borderRadius: '4px', backgroundColor: formData.skinType === 'B' ? '#e8f5e9' : 'transparent' }}>
              <input
                type="radio"
                name="skinType"
                value="B"
                checked={formData.skinType === 'B'}
                onChange={(e) => handleRadioChange('skinType', e.target.value)}
                style={{ marginRight: '10px' }}
              />
              <strong>B:</strong> Warm, sensitive, prone to rashes and inflammation - freckles, moles, acne
            </label>
            <label style={{ display: 'block', margin: '10px 0', cursor: 'pointer', padding: '8px', borderRadius: '4px', backgroundColor: formData.skinType === 'C' ? '#e8f5e9' : 'transparent' }}>
              <input
                type="radio"
                name="skinType"
                value="C"
                checked={formData.skinType === 'C'}
                onChange={(e) => handleRadioChange('skinType', e.target.value)}
                style={{ marginRight: '10px' }}
              />
              <strong>C:</strong> Oily, smooth, thick, cool - soft, moist, well-hydrated skin
            </label>
          </fieldset>

          {/* Question 3 */}
          <fieldset style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '20px', borderRadius: '4px', backgroundColor: 'white' }}>
            <legend style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', padding: '0 10px' }}>
              3. Hair Type & Quality
            </legend>
            <label style={{ display: 'block', margin: '10px 0', cursor: 'pointer', padding: '8px', borderRadius: '4px', backgroundColor: formData.hairType === 'A' ? '#e8f5e9' : 'transparent' }}>
              <input
                type="radio"
                name="hairType"
                value="A"
                checked={formData.hairType === 'A'}
                onChange={(e) => handleRadioChange('hairType', e.target.value)}
                style={{ marginRight: '10px' }}
              />
              <strong>A:</strong> Dry, frizzy, thin, brittle - prone to split ends and breakage
            </label>
            <label style={{ display: 'block', margin: '10px 0', cursor: 'pointer', padding: '8px', borderRadius: '4px', backgroundColor: formData.hairType === 'B' ? '#e8f5e9' : 'transparent' }}>
              <input
                type="radio"
                name="hairType"
                value="B"
                checked={formData.hairType === 'B'}
                onChange={(e) => handleRadioChange('hairType', e.target.value)}
                style={{ marginRight: '10px' }}
              />
              <strong>B:</strong> Fine, soft, early greying or balding - light colored, silky texture
            </label>
            <label style={{ display: 'block', margin: '10px 0', cursor: 'pointer', padding: '8px', borderRadius: '4px', backgroundColor: formData.hairType === 'C' ? '#e8f5e9' : 'transparent' }}>
              <input
                type="radio"
                name="hairType"
                value="C"
                checked={formData.hairType === 'C'}
                onChange={(e) => handleRadioChange('hairType', e.target.value)}
                style={{ marginRight: '10px' }}
              />
              <strong>C:</strong> Thick, oily, wavy, abundant - lustrous, strong, heavy hair
            </label>
          </fieldset>

          {/* Question 4 */}
          <fieldset style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '20px', borderRadius: '4px', backgroundColor: 'white' }}>
            <legend style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', padding: '0 10px' }}>
              4. Weight Pattern & Management
            </legend>
            <label style={{ display: 'block', margin: '10px 0', cursor: 'pointer', padding: '8px', borderRadius: '4px', backgroundColor: formData.weightPattern === 'A' ? '#e8f5e9' : 'transparent' }}>
              <input
                type="radio"
                name="weightPattern"
                value="A"
                checked={formData.weightPattern === 'A'}
                onChange={(e) => handleRadioChange('weightPattern', e.target.value)}
                style={{ marginRight: '10px' }}
              />
              <strong>A:</strong> Hard to gain weight - can eat anything without gaining, naturally thin
            </label>
            <label style={{ display: 'block', margin: '10px 0', cursor: 'pointer', padding: '8px', borderRadius: '4px', backgroundColor: formData.weightPattern === 'B' ? '#e8f5e9' : 'transparent' }}>
              <input
                type="radio"
                name="weightPattern"
                value="B"
                checked={formData.weightPattern === 'B'}
                onChange={(e) => handleRadioChange('weightPattern', e.target.value)}
                style={{ marginRight: '10px' }}
              />
              <strong>B:</strong> Moderate, stable weight - can gain or lose with effort, medium build
            </label>
            <label style={{ display: 'block', margin: '10px 0', cursor: 'pointer', padding: '8px', borderRadius: '4px', backgroundColor: formData.weightPattern === 'C' ? '#e8f5e9' : 'transparent' }}>
              <input
                type="radio"
                name="weightPattern"
                value="C"
                checked={formData.weightPattern === 'C'}
                onChange={(e) => handleRadioChange('weightPattern', e.target.value)}
                style={{ marginRight: '10px' }}
              />
              <strong>C:</strong> Gain weight easily - hard to lose weight, naturally heavy or curvy
            </label>
          </fieldset>
        </section>

        {/* SECTION 2 - Digestion */}
        <section style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
          <h2 style={{ fontSize: '24px', color: '#8B4513', marginTop: '0', borderBottom: '2px solid #D2691E', paddingBottom: '10px' }}>
            Section 2: Digestive System
          </h2>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
            Your digestive patterns reveal important dosha information
          </p>

          {/* Question 5 */}
          <fieldset style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '20px', borderRadius: '4px', backgroundColor: 'white' }}>
            <legend style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', padding: '0 10px' }}>
              5. Appetite & Hunger Patterns
            </legend>
            <label style={{ display: 'block', margin: '10px 0', cursor: 'pointer', padding: '8px', borderRadius: '4px', backgroundColor: formData.appetite === 'A' ? '#e8f5e9' : 'transparent' }}>
              <input
                type="radio"
                name="appetite"
                value="A"
                checked={formData.appetite === 'A'}
                onChange={(e) => handleRadioChange('appetite', e.target.value)}
                style={{ marginRight: '10px' }}
              />
              <strong>A:</strong> Irregular appetite - sometimes very hungry, sometimes not hungry at all
            </label>
            <label style={{ display: 'block', margin: '10px 0', cursor: 'pointer', padding: '8px', borderRadius: '4px', backgroundColor: formData.appetite === 'B' ? '#e8f5e9' : 'transparent' }}>
              <input
                type="radio"
                name="appetite"
                value="B"
                checked={formData.appetite === 'B'}
                onChange={(e) => handleRadioChange('appetite', e.target.value)}
                style={{ marginRight: '10px' }}
              />
              <strong>B:</strong> Strong, sharp appetite - get "hangry" if meals are skipped, need regular eating
            </label>
            <label style={{ display: 'block', margin: '10px 0', cursor: 'pointer', padding: '8px', borderRadius: '4px', backgroundColor: formData.appetite === 'C' ? '#e8f5e9' : 'transparent' }}>
              <input
                type="radio"
                name="appetite"
                value="C"
                checked={formData.appetite === 'C'}
                onChange={(e) => handleRadioChange('appetite', e.target.value)}
                style={{ marginRight: '10px' }}
              />
              <strong>C:</strong> Steady, mild appetite - can skip meals without difficulty, eat out of habit
            </label>
          </fieldset>

          {/* Question 6 */}
          <fieldset style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '20px', borderRadius: '4px', backgroundColor: 'white' }}>
            <legend style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', padding: '0 10px' }}>
              6. Digestion & Elimination
            </legend>
            <label style={{ display: 'block', margin: '10px 0', cursor: 'pointer', padding: '8px', borderRadius: '4px', backgroundColor: formData.digestion === 'A' ? '#e8f5e9' : 'transparent' }}>
              <input
                type="radio"
                name="digestion"
                value="A"
                checked={formData.digestion === 'A'}
                onChange={(e) => handleRadioChange('digestion', e.target.value)}
                style={{ marginRight: '10px' }}
              />
              <strong>A:</strong> Prone to gas, bloating, constipation - irregular bowel movements, variable
            </label>
            <label style={{ display: 'block', margin: '10px 0', cursor: 'pointer', padding: '8px', borderRadius: '4px', backgroundColor: formData.digestion === 'B' ? '#e8f5e9' : 'transparent' }}>
              <input
                type="radio"
                name="digestion"
                value="B"
                checked={formData.digestion === 'B'}
                onChange={(e) => handleRadioChange('digestion', e.target.value)}
                style={{ marginRight: '10px' }}
              />
              <strong>B:</strong> Tendency toward acidity, heartburn, loose stools - quick, strong digestion
            </label>
            <label style={{ display: 'block', margin: '10px 0', cursor: 'pointer', padding: '8px', borderRadius: '4px', backgroundColor: formData.digestion === 'C' ? '#e8f5e9' : 'transparent' }}>
              <input
                type="radio"
                name="digestion"
                value="C"
                checked={formData.digestion === 'C'}
                onChange={(e) => handleRadioChange('digestion', e.target.value)}
                style={{ marginRight: '10px' }}
              />
              <strong>C:</strong> Slow, heavy digestion - feel full for long time, sluggish metabolism
            </label>
          </fieldset>

          {/* Question 7 */}
          <fieldset style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '20px', borderRadius: '4px', backgroundColor: 'white' }}>
            <legend style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', padding: '0 10px' }}>
              7. Thirst & Fluid Intake
            </legend>
            <label style={{ display: 'block', margin: '10px 0', cursor: 'pointer', padding: '8px', borderRadius: '4px', backgroundColor: formData.thirst === 'A' ? '#e8f5e9' : 'transparent' }}>
              <input
                type="radio"
                name="thirst"
                value="A"
                checked={formData.thirst === 'A'}
                onChange={(e) => handleRadioChange('thirst', e.target.value)}
                style={{ marginRight: '10px' }}
              />
              <strong>A:</strong> Variable thirst - forget to drink water, sometimes very thirsty
            </label>
            <label style={{ display: 'block', margin: '10px 0', cursor: 'pointer', padding: '8px', borderRadius: '4px', backgroundColor: formData.thirst === 'B' ? '#e8f5e9' : 'transparent' }}>
              <input
                type="radio"
                name="thirst"
                value="B"
                checked={formData.thirst === 'B'}
                onChange={(e) => handleRadioChange('thirst', e.target.value)}
                style={{ marginRight: '10px' }}
              />
              <strong>B:</strong> Frequently thirsty - prefer cool drinks, drink large quantities
            </label>
            <label style={{ display: 'block', margin: '10px 0', cursor: 'pointer', padding: '8px', borderRadius: '4px', backgroundColor: formData.thirst === 'C' ? '#e8f5e9' : 'transparent' }}>
              <input
                type="radio"
                name="thirst"
                value="C"
                checked={formData.thirst === 'C'}
                onChange={(e) => handleRadioChange('thirst', e.target.value)}
                style={{ marginRight: '10px' }}
              />
              <strong>C:</strong> Rarely thirsty - comfortable with minimal water intake
            </label>
          </fieldset>
        </section>

        {/* SECTION 3 - Mental & Emotional */}
        <section style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
          <h2 style={{ fontSize: '24px', color: '#8B4513', marginTop: '0', borderBottom: '2px solid #D2691E', paddingBottom: '10px' }}>
            Section 3: Mental & Emotional Nature
          </h2>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
            Your mental and emotional patterns are key to understanding your dosha
          </p>

          {/* Question 8 */}
          <fieldset style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '20px', borderRadius: '4px', backgroundColor: 'white' }}>
            <legend style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', padding: '0 10px' }}>
              8. Mind State & Thinking Pattern
            </legend>
            <label style={{ display: 'block', margin: '10px 0', cursor: 'pointer', padding: '8px', borderRadius: '4px', backgroundColor: formData.mindState === 'A' ? '#e8f5e9' : 'transparent' }}>
              <input
                type="radio"
                name="mindState"
                value="A"
                checked={formData.mindState === 'A'}
                onChange={(e) => handleRadioChange('mindState', e.target.value)}
                style={{ marginRight: '10px' }}
              />
              <strong>A:</strong> Quick, restless mind - creative, scattered, many ideas, worry easily
            </label>
            <label style={{ display: 'block', margin: '10px 0', cursor: 'pointer', padding: '8px', borderRadius: '4px', backgroundColor: formData.mindState === 'B' ? '#e8f5e9' : 'transparent' }}>
              <input
                type="radio"
                name="mindState"
                value="B"
                checked={formData.mindState === 'B'}
                onChange={(e) => handleRadioChange('mindState', e.target.value)}
                style={{ marginRight: '10px' }}
              />
              <strong>B:</strong> Sharp, focused, intense - intelligent, critical, perfectionist tendencies
            </label>
            <label style={{ display: 'block', margin: '10px 0', cursor: 'pointer', padding: '8px', borderRadius: '4px', backgroundColor: formData.mindState === 'C' ? '#e8f5e9' : 'transparent' }}>
              <input
                type="radio"
                name="mindState"
                value="C"
                checked={formData.mindState === 'C'}
                onChange={(e) => handleRadioChange('mindState', e.target.value)}
                style={{ marginRight: '10px' }}
              />
              <strong>C:</strong> Calm, steady, slow to change - methodical, good memory, resistant to new ideas
            </label>
          </fieldset>

          {/* Question 9 */}
          <fieldset style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '20px', borderRadius: '4px', backgroundColor: 'white' }}>
            <legend style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', padding: '0 10px' }}>
              9. Sleep Pattern & Quality
            </legend>
            <label style={{ display: 'block', margin: '10px 0', cursor: 'pointer', padding: '8px', borderRadius: '4px', backgroundColor: formData.sleepPattern === 'A' ? '#e8f5e9' : 'transparent' }}>
              <input
                type="radio"
                name="sleepPattern"
                value="A"
                checked={formData.sleepPattern === 'A'}
                onChange={(e) => handleRadioChange('sleepPattern', e.target.value)}
                style={{ marginRight: '10px' }}
              />
              <strong>A:</strong> Light, interrupted sleep - wake easily, trouble falling asleep, active dreams
            </label>
            <label style={{ display: 'block', margin: '10px 0', cursor: 'pointer', padding: '8px', borderRadius: '4px', backgroundColor: formData.sleepPattern === 'B' ? '#e8f5e9' : 'transparent' }}>
              <input
                type="radio"
                name="sleepPattern"
                value="B"
                checked={formData.sleepPattern === 'B'}
                onChange={(e) => handleRadioChange('sleepPattern', e.target.value)}
                style={{ marginRight: '10px' }}
              />
              <strong>B:</strong> Moderate sleep needs - vivid, intense dreams, sleep 6-8 hours
            </label>
            <label style={{ display: 'block', margin: '10px 0', cursor: 'pointer', padding: '8px', borderRadius: '4px', backgroundColor: formData.sleepPattern === 'C' ? '#e8f5e9' : 'transparent' }}>
              <input
                type="radio"
                name="sleepPattern"
                value="C"
                checked={formData.sleepPattern === 'C'}
                onChange={(e) => handleRadioChange('sleepPattern', e.target.value)}
                style={{ marginRight: '10px' }}
              />
              <strong>C:</strong> Deep, heavy sleep - sleep 8+ hours, hard to wake up, love sleeping
            </label>
          </fieldset>

          {/* Question 10 */}
          <fieldset style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '20px', borderRadius: '4px', backgroundColor: 'white' }}>
            <legend style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', padding: '0 10px' }}>
              10. Climate & Weather Preference
            </legend>
            <label style={{ display: 'block', margin: '10px 0', cursor: 'pointer', padding: '8px', borderRadius: '4px', backgroundColor: formData.climatePreference === 'A' ? '#e8f5e9' : 'transparent' }}>
              <input
                type="radio"
                name="climatePreference"
                value="A"
                checked={formData.climatePreference === 'A'}
                onChange={(e) => handleRadioChange('climatePreference', e.target.value)}
                style={{ marginRight: '10px' }}
              />
              <strong>A:</strong> Prefer warm, humid climate - dislike cold, dry, windy weather
            </label>
            <label style={{ display: 'block', margin: '10px 0', cursor: 'pointer', padding: '8px', borderRadius: '4px', backgroundColor: formData.climatePreference === 'B' ? '#e8f5e9' : 'transparent' }}>
              <input
                type="radio"
                name="climatePreference"
                value="B"
                checked={formData.climatePreference === 'B'}
                onChange={(e) => handleRadioChange('climatePreference', e.target.value)}
                style={{ marginRight: '10px' }}
              />
              <strong>B:</strong> Prefer cool climate - dislike heat and humidity, overheat easily
            </label>
            <label style={{ display: 'block', margin: '10px 0', cursor: 'pointer', padding: '8px', borderRadius: '4px', backgroundColor: formData.climatePreference === 'C' ? '#e8f5e9' : 'transparent' }}>
              <input
                type="radio"
                name="climatePreference"
                value="C"
                checked={formData.climatePreference === 'C'}
                onChange={(e) => handleRadioChange('climatePreference', e.target.value)}
                style={{ marginRight: '10px' }}
              />
              <strong>C:</strong> Prefer warm, dry climate - dislike cold, damp weather
            </label>
          </fieldset>
        </section>

        {/* SECTION 4 - Daily Symptoms */}
        <section style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
          <h2 style={{ fontSize: '24px', color: '#8B4513', marginTop: '0', borderBottom: '2px solid #D2691E', paddingBottom: '10px' }}>
            Section 4: Current Symptoms & Health Patterns
          </h2>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
            Select all symptoms you experience regularly (multiple selections allowed)
          </p>

          <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '4px', backgroundColor: 'white' }}>
            {symptoms.map((symptom) => (
              <label 
                key={symptom} 
                style={{ 
                  display: 'block', 
                  margin: '10px 0',
                  cursor: 'pointer',
                  padding: '10px',
                  borderRadius: '4px',
                  backgroundColor: formData.symptoms.includes(symptom) ? '#e3f2fd' : 'transparent',
                  border: formData.symptoms.includes(symptom) ? '1px solid #2196F3' : '1px solid transparent'
                }}
              >
                <input
                  type="checkbox"
                  value={symptom}
                  checked={formData.symptoms.includes(symptom)}
                  onChange={() => handleCheckboxChange(symptom)}
                  style={{ marginRight: '10px' }}
                />
                <strong>{symptom}</strong>
              </label>
            ))}
          </div>
          
          <p style={{ fontSize: '12px', color: '#888', marginTop: '10px', fontStyle: 'italic' }}>
            Selected symptoms: {formData.symptoms.length > 0 ? formData.symptoms.join(', ') : 'None'}
          </p>
        </section>

        {/* Submit Button */}
        <div style={{ textAlign: 'center', marginTop: '30px', marginBottom: '30px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '15px 50px',
              fontSize: '18px',
              fontWeight: 'bold',
              backgroundColor: loading ? '#cccccc' : '#8B4513',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#A0522D';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#8B4513';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {loading ? '⏳ Analyzing Your Constitution...' : '✨ Generate My Dosha Report'}
          </button>
          
          <p style={{ fontSize: '12px', color: '#888', marginTop: '15px' }}>
            Your personalized Ayurvedic wellness plan will be generated in seconds
          </p>
        </div>
      </form>

      {/* Footer */}
      <footer style={{ textAlign: 'center', marginTop: '50px', paddingTop: '20px', borderTop: '1px solid #ddd', color: '#888', fontSize: '12px' }}>
        <p>🌿 Traditional Ayurvedic Assessment System</p>
        <p>For educational purposes - consult an Ayurvedic practitioner for personalized guidance</p>
      </footer>
    </div>
  );
};

export default Assessment;