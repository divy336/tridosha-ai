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

  const getWellnessScoreColor = (score: number): string => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FFC107';
    if (score >= 40) return '#FF9800';
    return '#F44336';
  };

  const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1>Your Personalized Ayurvedic Report</h1>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Generated on {formatDate(result.timestamp)}
        </p>
      </div>

      {/* Wellness Score */}
      <div style={{
        textAlign: 'center',
        padding: '30px',
        border: '3px solid ' + getWellnessScoreColor(result.wellnessScore),
        borderRadius: '10px',
        marginBottom: '30px',
        backgroundColor: '#f9f9f9'
      }}>
        <h2 style={{ margin: '0 0 10px 0' }}>Wellness Score</h2>
        <div style={{
          fontSize: '48px',
          fontWeight: 'bold',
          color: getWellnessScoreColor(result.wellnessScore)
        }}>
          {result.wellnessScore}/100
        </div>
        <p style={{ margin: '10px 0 0 0', color: '#666' }}>
          {result.wellnessScore >= 80 && 'Excellent Balance'}
          {result.wellnessScore >= 60 && result.wellnessScore < 80 && 'Good Balance - Minor Adjustments Needed'}
          {result.wellnessScore >= 40 && result.wellnessScore < 60 && 'Moderate Imbalance - Follow Recommendations'}
          {result.wellnessScore < 40 && 'Significant Imbalance - Prioritize Lifestyle Changes'}
        </p>
      </div>

      {/* Constitution Summary */}
      <div style={{
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        padding: '30px',
        marginBottom: '30px',
        backgroundColor: '#f9f9f9'
      }}>
        <h2 style={{ marginTop: '0' }}>Your Dosha Constitution</h2>

        <div style={{ marginTop: '20px' }}>
          <h3 style={{ marginBottom: '10px' }}>Constitution Type:</h3>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: getDoshaColor(result.dominantDosha),
            marginBottom: '20px'
          }}>
            {result.constitutionType}
          </div>

          <div style={{ marginTop: '15px' }}>
            <strong>Dominant Dosha:</strong>{' '}
            <span style={{ color: getDoshaColor(result.dominantDosha), fontSize: '18px', fontWeight: 'bold' }}>
              {result.dominantDosha}
            </span>
          </div>

          <div style={{ marginTop: '10px' }}>
            <strong>Secondary Dosha:</strong>{' '}
            <span style={{ color: getDoshaColor(result.secondaryDosha), fontSize: '18px', fontWeight: 'bold' }}>
              {result.secondaryDosha}
            </span>
          </div>
        </div>

        {/* Dosha Percentages */}
        <div style={{ marginTop: '30px' }}>
          <h3>Dosha Distribution</h3>

          <div style={{ marginTop: '15px' }}>
            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <strong>Vata (Air + Space)</strong>
                <span style={{ fontWeight: 'bold' }}>{result.percentages.vata}%</span>
              </div>
              <div style={{
                width: '100%',
                height: '30px',
                backgroundColor: '#e0e0e0',
                borderRadius: '15px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${result.percentages.vata}%`,
                  height: '100%',
                  backgroundColor: getDoshaColor('vata'),
                  transition: 'width 1s ease'
                }}></div>
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <strong>Pitta (Fire + Water)</strong>
                <span style={{ fontWeight: 'bold' }}>{result.percentages.pitta}%</span>
              </div>
              <div style={{
                width: '100%',
                height: '30px',
                backgroundColor: '#e0e0e0',
                borderRadius: '15px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${result.percentages.pitta}%`,
                  height: '100%',
                  backgroundColor: getDoshaColor('pitta'),
                  transition: 'width 1s ease'
                }}></div>
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <strong>Kapha (Earth + Water)</strong>
                <span style={{ fontWeight: 'bold' }}>{result.percentages.kapha}%</span>
              </div>
              <div style={{
                width: '100%',
                height: '30px',
                backgroundColor: '#e0e0e0',
                borderRadius: '15px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${result.percentages.kapha}%`,
                  height: '100%',
                  backgroundColor: getDoshaColor('kapha'),
                  transition: 'width 1s ease'
                }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analyses */}
      <div style={{ marginBottom: '30px' }}>
        <h2>Personalized Analysis</h2>

        <div style={{
          border: '2px solid #2196F3',
          borderRadius: '8px',
          padding: '20px',
          marginTop: '15px',
          marginBottom: '15px',
          backgroundColor: '#E3F2FD'
        }}>
          <h3 style={{ marginTop: '0', color: '#1976D2' }}>Physical Constitution</h3>
          <p style={{ lineHeight: '1.8', margin: '0' }}>{result.physicalAnalysis}</p>
        </div>

        <div style={{
          border: '2px solid #9C27B0',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '15px',
          backgroundColor: '#F3E5F5'
        }}>
          <h3 style={{ marginTop: '0', color: '#7B1FA2' }}>Emotional & Mental Patterns</h3>
          <p style={{ lineHeight: '1.8', margin: '0' }}>{result.emotionalAnalysis}</p>
        </div>

        <div style={{
          border: '2px solid #FF9800',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '15px',
          backgroundColor: '#FFF3E0'
        }}>
          <h3 style={{ marginTop: '0', color: '#F57C00' }}>Digestive System</h3>
          <p style={{ lineHeight: '1.8', margin: '0' }}>{result.digestiveAnalysis}</p>
        </div>

        <div style={{
          border: '2px solid #3F51B5',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '15px',
          backgroundColor: '#E8EAF6'
        }}>
          <h3 style={{ marginTop: '0', color: '#303F9F' }}>Sleep Patterns</h3>
          <p style={{ lineHeight: '1.8', margin: '0' }}>{result.sleepAnalysis}</p>
        </div>
      </div>

      {/* Food Recommendations */}
      <div style={{ marginBottom: '30px' }}>
        <h2>Dietary Recommendations</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
          <div style={{
            border: '3px solid #4CAF50',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: '#E8F5E9'
          }}>
            <h3 style={{ color: '#2E7D32', marginTop: '0' }}>Foods to Prefer ✓</h3>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
              {result.foodsToPrefer.map((food, index) => (
                <li key={index}>{food}</li>
              ))}
            </ul>
          </div>

          <div style={{
            border: '3px solid #f44336',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: '#FFEBEE'
          }}>
            <h3 style={{ color: '#C62828', marginTop: '0' }}>Foods to Avoid ✗</h3>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
              {result.foodsToAvoid.map((food, index) => (
                <li key={index}>{food}</li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
          <div style={{
            border: '2px solid #8BC34A',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: '#F1F8E9'
          }}>
            <h3 style={{ marginTop: '0', color: '#558B2F' }}>Recommended Herbs</h3>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
              {result.herbs.map((herb, index) => (
                <li key={index}>{herb}</li>
              ))}
            </ul>
          </div>

          <div style={{
            border: '2px solid #00BCD4',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: '#E0F7FA'
          }}>
            <h3 style={{ marginTop: '0', color: '#00838F' }}>Recommended Drinks</h3>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
              {result.drinks.map((drink, index) => (
                <li key={index}>{drink}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Yoga Recommendations */}
      <div style={{ marginBottom: '30px' }}>
        <h2>Personalized Yoga Practice</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
          marginTop: '20px'
        }}>
          {result.yoga.map((pose, index) => (
            <div key={index} style={{
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              padding: '15px',
              backgroundColor: '#fafafa'
            }}>
              <div style={{
                width: '100%',
                height: '150px',
                backgroundColor: '#e0e0e0',
                borderRadius: '4px',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                color: '#757575'
              }}>
                {pose.imagePath}
              </div>
              <h4 style={{ marginTop: '0', marginBottom: '8px', color: '#333' }}>{pose.name}</h4>
              <p style={{ margin: '5px 0', fontSize: '14px', fontStyle: 'italic', color: '#666' }}>
                {pose.description}
              </p>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                <strong>Benefit:</strong> {pose.benefit}
              </p>
              <p style={{ margin: '5px 0', fontSize: '14px', color: getDoshaColor(result.dominantDosha) }}>
                <strong>Energy:</strong> {pose.energy}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Lifestyle Tips */}
      <div style={{ marginBottom: '30px' }}>
        <h2>Lifestyle Recommendations</h2>
        <div style={{
          border: '2px solid #673AB7',
          borderRadius: '8px',
          padding: '20px',
          backgroundColor: '#EDE7F6'
        }}>
          <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
            {result.lifestyleTips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Daily Routines */}
      <div style={{ marginBottom: '30px' }}>
        <h2>Daily Routine Recommendations</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
          <div style={{
            border: '2px solid #FF9800',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: '#FFF3E0'
          }}>
            <h3 style={{ marginTop: '0', color: '#E65100' }}>Morning Routine 🌅</h3>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
              {result.morningRoutine.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div style={{
            border: '2px solid #3F51B5',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: '#E8EAF6'
          }}>
            <h3 style={{ marginTop: '0', color: '#1A237E' }}>Night Routine 🌙</h3>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
              {result.nightRoutine.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Stress Management */}
      <div style={{ marginBottom: '30px' }}>
        <h2>Stress Management Practices</h2>
        <div style={{
          border: '2px solid #009688',
          borderRadius: '8px',
          padding: '20px',
          backgroundColor: '#E0F2F1'
        }}>
          <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
            {result.stressManagement.map((practice, index) => (
              <li key={index}>{practice}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Retake Button */}
      <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '40px' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '15px 40px',
            fontSize: '18px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Take New Assessment
        </button>
      </div>

      {/* Disclaimer */}
      <div style={{
        marginTop: '40px',
        padding: '20px',
        backgroundColor: '#fff3e0',
        borderLeft: '4px solid #FF9800',
        borderRadius: '4px',
        fontSize: '14px',
        color: '#e65100'
      }}>
        <strong>Medical Disclaimer:</strong> This assessment is for educational and informational purposes only 
        and should not be considered medical advice. The recommendations provided are based on traditional 
        Ayurvedic principles and are not intended to diagnose, treat, cure, or prevent any disease. Always 
        consult with a qualified healthcare provider or certified Ayurvedic practitioner before making 
        significant changes to your diet, lifestyle, or health regimen, especially if you have existing 
        health conditions or are taking medications.
      </div>
    </div>
  );
};

export default Report;