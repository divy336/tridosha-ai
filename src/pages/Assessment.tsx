import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface FormData {
  email: string;
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
    email: '',
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

  const handleInputChange = (field: 'email', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRadioChange = (field: keyof Omit<FormData, 'symptoms' | 'email'>, value: string) => {
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

    // Validate email
    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    const requiredFields: (keyof Omit<FormData, 'symptoms' | 'email'>)[] = [
      'bodyFrame', 'skinType', 'hairType', 'weightPattern',
      'appetite', 'digestion', 'thirst', 'mindState',
      'sleepPattern', 'climatePreference'
    ];

    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setError('Please answer all questions before submitting');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/submit-assessment', formData);
      navigate('/report', { state: response.data });
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to submit assessment. Please try again.';
      setError(errorMessage);
      console.error('Submission error:', err);
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
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Ayurvedic Dosha Assessment</h1>
      <p>Discover your unique constitution through this comprehensive assessment</p>

      <form onSubmit={handleSubmit}>
        {/* Email Field */}
        <div style={{ marginTop: '30px', marginBottom: '30px' }}>
          <h3>Your Email Address</h3>
          <input
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
            required
          />
        </div>

        <div style={{ marginTop: '30px' }}>
          <h2>Section 1: Physical Traits</h2>

          <div style={{ marginTop: '20px' }}>
            <h3>1. Body Frame</h3>
            <label style={{ display: 'block', margin: '5px 0' }}>
              <input
                type="radio"
                name="bodyFrame"
                value="A"
                checked={formData.bodyFrame === 'A'}
                onChange={(e) => handleRadioChange('bodyFrame', e.target.value)}
              />
              <span style={{ marginLeft: '10px' }}>Thin, light, tall or short</span>
            </label>
            <label style={{ display: 'block', margin: '5px 0' }}>
              <input
                type="radio"
                name="bodyFrame"
                value="B"
                checked={formData.bodyFrame === 'B'}
                onChange={(e) => handleRadioChange('bodyFrame', e.target.value)}
              />
              <span style={{ marginLeft: '10px' }}>Medium, athletic build</span>
            </label>
            <label style={{ display: 'block', margin: '5px 0' }}>
              <input
                type="radio"
                name="bodyFrame"
                value="C"
                checked={formData.bodyFrame === 'C'}
                onChange={(e) => handleRadioChange('bodyFrame', e.target.value)}
              />
              <span style={{ marginLeft: '10px' }}>Broad, sturdy, heavy build</span>
            </label>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h3>2. Skin Type</h3>
            <label style={{ display: 'block', margin: '5px 0' }}>
              <input
                type="radio"
                name="skinType"
                value="A"
                checked={formData.skinType === 'A'}
                onChange={(e) => handleRadioChange('skinType', e.target.value)}
              />
              <span style={{ marginLeft: '10px' }}>Dry, rough, thin, cool</span>
            </label>
            <label style={{ display: 'block', margin: '5px 0' }}>
              <input
                type="radio"
                name="skinType"
                value="B"
                checked={formData.skinType === 'B'}
                onChange={(e) => handleRadioChange('skinType', e.target.value)}
              />
              <span style={{ marginLeft: '10px' }}>Warm, sensitive, prone to rashes</span>
            </label>
            <label style={{ display: 'block', margin: '5px 0' }}>
              <input
                type="radio"
                name="skinType"
                value="C"
                checked={formData.skinType === 'C'}
                onChange={(e) => handleRadioChange('skinType', e.target.value)}
              />
              <span style={{ marginLeft: '10px' }}>Oily, smooth, thick, cool</span>
            </label>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h3>3. Hair Type</h3>
            <label style={{ display: 'block', margin: '5px 0' }}>
              <input
                type="radio"
                name="hairType"
                value="A"
                checked={formData.hairType === 'A'}
                onChange={(e) => handleRadioChange('hairType', e.target.value)}
              />
              <span style={{ marginLeft: '10px' }}>Dry, frizzy, thin</span>
            </label>
            <label style={{ display: 'block', margin: '5px 0' }}>
              <input
                type="radio"
                name="hairType"
                value="B"
                checked={formData.hairType === 'B'}
                onChange={(e) => handleRadioChange('hairType', e.target.value)}
              />
              <span style={{ marginLeft: '10px' }}>Fine, soft, early greying</span>
            </label>
            <label style={{ display: 'block', margin: '5px 0' }}>
              <input
                type="radio"
                name="hairType"
                value="C"
                checked={formData.hairType === 'C'}
                onChange={(e) => handleRadioChange('hairType', e.target.value)}
              />
              <span style={{ marginLeft: '10px' }}>Thick, oily, wavy</span>
            </label>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h3>4. Weight Pattern</h3>
            <label style={{ display: 'block', margin: '5px 0' }}>
              <input
                type="radio"
                name="weightPattern"
                value="A"
                checked={formData.weightPattern === 'A'}
                onChange={(e) => handleRadioChange('weightPattern', e.target.value)}
              />
              <span style={{ marginLeft: '10px' }}>Hard to gain weight</span>
            </label>
            <label style={{ display: 'block', margin: '5px 0' }}>
              <input
                type="radio"
                name="weightPattern"
                value="B"
                checked={formData.weightPattern === 'B'}
                onChange={(e) => handleRadioChange('weightPattern', e.target.value)}
              />
              <span style={{ marginLeft: '10px' }}>Moderate weight</span>
            </label>
            <label style={{ display: 'block', margin: '5px 0' }}>
              <input
                type="radio"
                name="weightPattern"
                value="C"
                checked={formData.weightPattern === 'C'}
                onChange={(e) => handleRadioChange('weightPattern', e.target.value)}
              />
              <span style={{ marginLeft: '10px' }}>Gain weight easily</span>
            </label>
          </div>
        </div>

        <div style={{ marginTop: '30px' }}>
          <h2>Section 2: Digestion</h2>

          <div style={{ marginTop: '20px' }}>
            <h3>5. Appetite</h3>
            <label style={{ display: 'block', margin: '5px 0' }}>
              <input
                type="radio"
                name="appetite"
                value="A"
                checked={formData.appetite === 'A'}
                onChange={(e) => handleRadioChange('appetite', e.target.value)}
              />
              <span style={{ marginLeft: '10px' }}>Irregular appetite</span>
            </label>
            <label style={{ display: 'block', margin: '5px 0' }}>
              <input
                type="radio"
                name="appetite"
                value="B"
                checked={formData.appetite === 'B'}
                onChange={(e) => handleRadioChange('appetite', e.target.value)}
              />
              <span style={{ marginLeft: '10px' }}>Strong appetite</span>
            </label>
            <label style={{ display: 'block', margin: '5px 0' }}>
              <input
                type="radio"
                name="appetite"
                value="C"
                checked={formData.appetite === 'C'}
                onChange={(e) => handleRadioChange('appetite', e.target.value)}
              />
              <span style={{ marginLeft: '10px' }}>Steady appetite</span>
            </label>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h3>6. Digestion</h3>
            <label style={{ display: 'block', margin: '5px 0' }}>
              <input
                type="radio"
                name="digestion"
                value="A"
                checked={formData.digestion === 'A'}
                onChange={(e) => handleRadioChange('digestion', e.target.value)}
              />
              <span style={{ marginLeft: '10px' }}>Gas and bloating</span>
            </label>
            <label style={{ display: 'block', margin: '5px 0' }}>
              <input
                type="radio"
                name="digestion"
                value="B"
                checked={formData.digestion === 'B'}
                onChange={(e) => handleRadioChange('digestion', e.target.value)}
              />
              <span style={{ marginLeft: '10px' }}>Acidic digestion</span>
            </label>
            <label style={{ display: 'block', margin: '5px 0' }}>
              <input
                type="radio"
                name="digestion"
                value="C"
                checked={formData.digestion === 'C'}
                onChange={(e) => handleRadioChange('digestion', e.target.value)}
              />
              <span style={{ marginLeft: '10px' }}>Slow digestion</span>
            </label>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h3>7. Thirst</h3>
            <label style={{ display: 'block', margin: '5px 0' }}>
              <input
                type="radio"
                name="thirst"
                value="A"
                checked={formData.thirst === 'A'}
                onChange={(e) => handleRadioChange('thirst', e.target.value)}
              />
              <span style={{ marginLeft: '10px' }}>Variable thirst</span>
            </label>
            <label style={{ display: 'block', margin: '5px 0' }}>
              <input
                type="radio"
                name="thirst"
                value="B"
                checked={formData.thirst === 'B'}
                onChange={(e) => handleRadioChange('thirst', e.target.value)}
              />
              <span style={{ marginLeft: '10px' }}>Often thirsty</span>
            </label>
            <label style={{ display: 'block', margin: '5px 0' }}>
              <input
                type="radio"
                name="thirst"
                value="C"
                checked={formData.thirst === 'C'}
                onChange={(e) => handleRadioChange('thirst', e.target.value)}
              />
              <span style={{ marginLeft: '10px' }}>Rarely thirsty</span>
            </label>
          </div>
        </div>

        <div style={{ marginTop: '30px' }}>
          <h2>Section 3: Mental & Emotional</h2>

          <div style={{ marginTop: '20px' }}>
            <h3>8. Mind State</h3>
            <label style={{ display: 'block', margin: '5px 0' }}>
              <input
                type="radio"
                name="mindState"
                value="A"
                checked={formData.mindState === 'A'}
                onChange={(e) => handleRadioChange('mindState', e.target.value)}
              />
              <span style={{ marginLeft: '10px' }}>Quick and restless</span>
            </label>
            <label style={{ display: 'block', margin: '5px 0' }}>
              <input
                type="radio"
                name="mindState"
                value="B"
                checked={formData.mindState === 'B'}
                onChange={(e) => handleRadioChange('mindState', e.target.value)}
              />
              <span style={{ marginLeft: '10px' }}>Sharp and focused</span>
            </label>
            <label style={{ display: 'block', margin: '5px 0' }}>
              <input
                type="radio"
                name="mindState"
                value="C"
                checked={formData.mindState === 'C'}
                onChange={(e) => handleRadioChange('mindState', e.target.value)}
              />
              <span style={{ marginLeft: '10px' }}>Calm and steady</span>
            </label>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h3>9. Sleep Pattern</h3>
            <label style={{ display: 'block', margin: '5px 0' }}>
              <input
                type="radio"
                name="sleepPattern"
                value="A"
                checked={formData.sleepPattern === 'A'}
                onChange={(e) => handleRadioChange('sleepPattern', e.target.value)}
              />
              <span style={{ marginLeft: '10px' }}>Light sleep</span>
            </label>
            <label style={{ display: 'block', margin: '5px 0' }}>
              <input
                type="radio"
                name="sleepPattern"
                value="B"
                checked={formData.sleepPattern === 'B'}
                onChange={(e) => handleRadioChange('sleepPattern', e.target.value)}
              />
              <span style={{ marginLeft: '10px' }}>Moderate sleep</span>
            </label>
            <label style={{ display: 'block', margin: '5px 0' }}>
              <input
                type="radio"
                name="sleepPattern"
                value="C"
                checked={formData.sleepPattern === 'C'}
                onChange={(e) => handleRadioChange('sleepPattern', e.target.value)}
              />
              <span style={{ marginLeft: '10px' }}>Deep heavy sleep</span>
            </label>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h3>10. Climate Preference</h3>
            <label style={{ display: 'block', margin: '5px 0' }}>
              <input
                type="radio"
                name="climatePreference"
                value="A"
                checked={formData.climatePreference === 'A'}
                onChange={(e) => handleRadioChange('climatePreference', e.target.value)}
              />
              <span style={{ marginLeft: '10px' }}>Warm and humid</span>
            </label>
            <label style={{ display: 'block', margin: '5px 0' }}>
              <input
                type="radio"
                name="climatePreference"
                value="B"
                checked={formData.climatePreference === 'B'}
                onChange={(e) => handleRadioChange('climatePreference', e.target.value)}
              />
              <span style={{ marginLeft: '10px' }}>Cool environment</span>
            </label>
            <label style={{ display: 'block', margin: '5px 0' }}>
              <input
                type="radio"
                name="climatePreference"
                value="C"
                checked={formData.climatePreference === 'C'}
                onChange={(e) => handleRadioChange('climatePreference', e.target.value)}
              />
              <span style={{ marginLeft: '10px' }}>Warm and dry</span>
            </label>
          </div>
        </div>

        <div style={{ marginTop: '30px' }}>
          <h2>Section 4: Daily Symptoms</h2>
          <p>Select all symptoms that you experience regularly</p>

          <div style={{ marginTop: '20px' }}>
            {symptoms.map((symptom) => (
              <label key={symptom} style={{ display: 'block', margin: '8px 0' }}>
                <input
                  type="checkbox"
                  value={symptom}
                  checked={formData.symptoms.includes(symptom)}
                  onChange={() => handleCheckboxChange(symptom)}
                />
                <span style={{ marginLeft: '10px' }}>{symptom}</span>
              </label>
            ))}
          </div>
        </div>

        {error && (
          <div style={{ 
            marginTop: '20px', 
            padding: '10px', 
            backgroundColor: '#ffebee', 
            color: '#c62828',
            borderRadius: '4px'
          }}>
            {error}
          </div>
        )}

        <div style={{ marginTop: '30px', marginBottom: '30px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 30px',
              fontSize: '16px',
              backgroundColor: loading ? '#cccccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Analyzing Your Constitution...' : 'Submit Assessment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Assessment;