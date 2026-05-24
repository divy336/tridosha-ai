import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface YogaPose {
  name: string;
  description: string;
  benefit: string;
  energy: string;
  imagePath: string;
}

interface AssessmentResult {
  dominantDosha: string;
  secondaryDosha: string;
  constitutionType: string;
  scores: {
    vata: number;
    pitta: number;
    kapha: number;
  };
  percentages: {
    vata: number;
    pitta: number;
    kapha: number;
  };
  wellnessScore: number;
  physicalAnalysis: string;
  emotionalAnalysis: string;
  digestiveAnalysis: string;
  sleepAnalysis: string;
  foodsToPrefer: string[];
  foodsToAvoid: string[];
  herbs: string[];
  drinks: string[];
  yoga: YogaPose[];
  lifestyleTips: string[];
  morningRoutine: string[];
  nightRoutine: string[];
  stressManagement: string[];
  timestamp: string;
}

const Report: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state as AssessmentResult;

  if (!result) {
    navigate('/');
    return null;
  }

  const getDoshaColor = (dosha: string): string => {
    switch (dosha.toLowerCase()) {
      case 'vata':
        return '#9C27B0';
      case 'pitta':
        return '#FF5722';
      case 'kapha':
        return '#4CAF50';
      default:
        return '#757575';
    }
  };

  const handleRetakeAssessment = () => {
    navigate('/');
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '40px', borderBottom: '3px solid #8B4513', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '36px', color: '#8B4513', margin: '0 0 10px 0' }}>
          🕉️ Your Ayurvedic Dosha Report
        </h1>
        <p style={{ fontSize: '18px', color: '#555' }}>
          Personalized Wellness Plan Based on Your Unique Constitution
        </p>
      </header>

      {/* Constitution Summary */}
      <section style={{ border: '2px solid #D2691E', borderRadius: '8px', padding: '30px', marginBottom: '30px', backgroundColor: '#FFF8DC' }}>
        <h2 style={{ marginTop: '0', color: '#8B4513' }}>Your Constitution Type</h2>
        
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ fontSize: '24px', color: getDoshaColor(result.dominantDosha) }}>
            {result.constitutionType}
          </h3>
          
          <p style={{ fontSize: '16px', marginTop: '10px' }}>
            <strong>Dominant Dosha:</strong> <span style={{ color: getDoshaColor(result.dominantDosha) }}>{result.dominantDosha}</span>
          </p>
          <p style={{ fontSize: '16px' }}>
            <strong>Secondary Dosha:</strong> <span style={{ color: getDoshaColor(result.secondaryDosha) }}>{result.secondaryDosha}</span>
          </p>
          <p style={{ fontSize: '16px' }}>
            <strong>Wellness Score:</strong> {result.wellnessScore}/100
          </p>
        </div>

        {/* Dosha Percentages */}
        <div style={{ marginTop: '30px' }}>
          <h3 style={{ color: '#8B4513' }}>Dosha Distribution</h3>
          
          <div style={{ marginTop: '15px' }}>
            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <strong>Vata</strong>
                <span>{result.percentages.vata}%</span>
              </div>
              <div style={{ width: '100%', height: '25px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${result.percentages.vata}%`, height: '100%', backgroundColor: getDoshaColor('vata') }}></div>
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <strong>Pitta</strong>
                <span>{result.percentages.pitta}%</span>
              </div>
              <div style={{ width: '100%', height: '25px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${result.percentages.pitta}%`, height: '100%', backgroundColor: getDoshaColor('pitta') }}></div>
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <strong>Kapha</strong>
                <span>{result.percentages.kapha}%</span>
              </div>
              <div style={{ width: '100%', height: '25px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${result.percentages.kapha}%`, height: '100%', backgroundColor: getDoshaColor('kapha') }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analysis Sections */}
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#8B4513', borderBottom: '2px solid #D2691E', paddingBottom: '10px' }}>
          Constitutional Analysis
        </h2>

        <div style={{ marginTop: '20px' }}>
          <h3 style={{ color: '#8B4513' }}>Physical Characteristics</h3>
          <p style={{ lineHeight: '1.6', textAlign: 'justify' }}>{result.physicalAnalysis}</p>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3 style={{ color: '#8B4513' }}>Emotional & Mental Nature</h3>
          <p style={{ lineHeight: '1.6', textAlign: 'justify' }}>{result.emotionalAnalysis}</p>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3 style={{ color: '#8B4513' }}>Digestive System</h3>
          <p style={{ lineHeight: '1.6', textAlign: 'justify' }}>{result.digestiveAnalysis}</p>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3 style={{ color: '#8B4513' }}>Sleep Patterns</h3>
          <p style={{ lineHeight: '1.6', textAlign: 'justify' }}>{result.sleepAnalysis}</p>
        </div>
      </section>

      {/* Food Recommendations */}
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#8B4513', borderBottom: '2px solid #D2691E', paddingBottom: '10px' }}>
          Dietary Recommendations
        </h2>
        
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ color: '#4CAF50' }}>✓ Foods to Prefer</h3>
          <ul>
            {result.foodsToPrefer.map((food, index) => (
              <li key={index} style={{ marginBottom: '8px', lineHeight: '1.6' }}>{food}</li>
            ))}
          </ul>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3 style={{ color: '#f44336' }}>✗ Foods to Avoid</h3>
          <ul>
            {result.foodsToAvoid.map((food, index) => (
              <li key={index} style={{ marginBottom: '8px', lineHeight: '1.6' }}>{food}</li>
            ))}
          </ul>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3 style={{ color: '#8B4513' }}>🌿 Recommended Herbs</h3>
          <ul>
            {result.herbs.map((herb, index) => (
              <li key={index} style={{ marginBottom: '8px', lineHeight: '1.6' }}>{herb}</li>
            ))}
          </ul>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3 style={{ color: '#8B4513' }}>🍵 Recommended Drinks</h3>
          <ul>
            {result.drinks.map((drink, index) => (
              <li key={index} style={{ marginBottom: '8px', lineHeight: '1.6' }}>{drink}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Yoga Recommendations */}
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#8B4513', borderBottom: '2px solid #D2691E', paddingBottom: '10px' }}>
          Recommended Yoga Practices
        </h2>
        
        <div style={{ marginTop: '20px' }}>
          {result.yoga.map((pose, index) => (
            <div key={index} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', marginBottom: '15px', backgroundColor: '#f9f9f9' }}>
              <h3 style={{ marginTop: '0', color: '#8B4513' }}>{pose.name}</h3>
              <p style={{ margin: '5px 0' }}><strong>Description:</strong> {pose.description}</p>
              <p style={{ margin: '5px 0' }}><strong>Benefit:</strong> {pose.benefit}</p>
              <p style={{ margin: '5px 0' }}><strong>Energy:</strong> {pose.energy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Lifestyle Tips */}
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#8B4513', borderBottom: '2px solid #D2691E', paddingBottom: '10px' }}>
          Lifestyle Recommendations
        </h2>
        <ul>
          {result.lifestyleTips.map((tip, index) => (
            <li key={index} style={{ marginBottom: '10px', lineHeight: '1.6' }}>{tip}</li>
          ))}
        </ul>
      </section>

      {/* Morning Routine */}
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#8B4513', borderBottom: '2px solid #D2691E', paddingBottom: '10px' }}>
          ☀️ Morning Routine
        </h2>
        <ul>
          {result.morningRoutine.map((routine, index) => (
            <li key={index} style={{ marginBottom: '10px', lineHeight: '1.6' }}>{routine}</li>
          ))}
        </ul>
      </section>

      {/* Night Routine */}
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#8B4513', borderBottom: '2px solid #D2691E', paddingBottom: '10px' }}>
          🌙 Night Routine
        </h2>
        <ul>
          {result.nightRoutine.map((routine, index) => (
            <li key={index} style={{ marginBottom: '10px', lineHeight: '1.6' }}>{routine}</li>
          ))}
        </ul>
      </section>

      {/* Stress Management */}
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#8B4513', borderBottom: '2px solid #D2691E', paddingBottom: '10px' }}>
          🧘 Stress Management Techniques
        </h2>
        <ul>
          {result.stressManagement.map((technique, index) => (
            <li key={index} style={{ marginBottom: '10px', lineHeight: '1.6' }}>{technique}</li>
          ))}
        </ul>
      </section>

      {/* Retake Button */}
      <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '40px' }}>
        <button
          onClick={handleRetakeAssessment}
          style={{
            padding: '15px 40px',
            fontSize: '18px',
            fontWeight: 'bold',
            backgroundColor: '#8B4513',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          🔄 Retake Assessment
        </button>
      </div>

      {/* Disclaimer */}
      <footer style={{ 
        marginTop: '40px',
        padding: '20px',
        backgroundColor: '#FFF8DC',
        borderRadius: '8px',
        border: '1px solid #D2691E',
        fontSize: '14px',
        color: '#8B4513'
      }}>
        <p style={{ margin: '0 0 10px 0' }}>
          <strong>⚠️ Important Disclaimer:</strong>
        </p>
        <p style={{ margin: '0', lineHeight: '1.6' }}>
          This assessment is for educational purposes only and should not replace professional medical advice. 
          The recommendations provided are based on traditional Ayurvedic principles and your self-reported 
          responses. Please consult with a qualified Ayurvedic practitioner or healthcare provider for 
          personalized recommendations, especially if you have any existing health conditions or are taking 
          medications.
        </p>
        <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#888', textAlign: 'center' }}>
          Report generated: {new Date(result.timestamp).toLocaleString()}
        </p>
      </footer>
    </div>
  );
};

export default Report;