import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

interface YogaPose {
  name: string;
  description: string;
  benefits: string;
  energy: string;
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
  const reportRef = useRef<HTMLDivElement>(null);

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

  const getColorRGB = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [0, 0, 0];
  };

  const downloadPDF = async () => {
    try {
      // FIRST - Save to localStorage history before generating PDF
      const reportId = `doshaReport_${new Date(result.timestamp).getTime()}`;
      localStorage.setItem(reportId, JSON.stringify(result));
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - (2 * margin);
      
      // Page 1 - Cover Page
      pdf.setFillColor(156, 39, 176);
      pdf.rect(0, 0, pageWidth, 60, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(28);
      pdf.setFont('helvetica', 'bold');
      pdf.text('AYURVEDIC DOSHA REPORT', pageWidth / 2, 30, { align: 'center' });
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Personalized Constitution Analysis', pageWidth / 2, 45, { align: 'center' });
      
      // Report Info
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Report Details', margin, 80);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.text(`Generated: ${formatDate(result.timestamp)}`, margin, 90);
      pdf.text(`Constitution Type: ${result.constitutionType}`, margin, 100);
      pdf.text(`Dominant Dosha: ${result.dominantDosha}`, margin, 110);
      pdf.text(`Secondary Dosha: ${result.secondaryDosha}`, margin, 120);
      
      // Wellness Score Box
      const scoreColor = getColorRGB(getWellnessScoreColor(result.wellnessScore));
      pdf.setDrawColor(scoreColor[0], scoreColor[1], scoreColor[2]);
      pdf.roundedRect(margin, 135, contentWidth, 40, 3, 3, 'S');
      
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Wellness Score', pageWidth / 2, 150, { align: 'center' });
      
      pdf.setFontSize(32);
      pdf.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
      pdf.text(`${result.wellnessScore}/100`, pageWidth / 2, 165, { align: 'center' });
      
      // Dosha Percentages
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Dosha Distribution', margin, 190);
      
      let yPos = 200;
      const barHeight = 10;
      const barSpacing = 25;
      
      // Vata Bar
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Vata: ${result.percentages.vata}%`, margin, yPos);
      pdf.setFillColor(230, 230, 230);
      pdf.rect(margin, yPos + 2, contentWidth, barHeight, 'F');
      pdf.setFillColor(156, 39, 176);
      pdf.rect(margin, yPos + 2, (contentWidth * result.percentages.vata / 100), barHeight, 'F');
      yPos += barSpacing;
      
      // Pitta Bar
      pdf.text(`Pitta: ${result.percentages.pitta}%`, margin, yPos);
      pdf.setFillColor(230, 230, 230);
      pdf.rect(margin, yPos + 2, contentWidth, barHeight, 'F');
      pdf.setFillColor(255, 87, 34);
      pdf.rect(margin, yPos + 2, (contentWidth * result.percentages.pitta / 100), barHeight, 'F');
      yPos += barSpacing;
      
      // Kapha Bar
      pdf.text(`Kapha: ${result.percentages.kapha}%`, margin, yPos);
      pdf.setFillColor(230, 230, 230);
      pdf.rect(margin, yPos + 2, contentWidth, barHeight, 'F');
      pdf.setFillColor(76, 175, 80);
      pdf.rect(margin, yPos + 2, (contentWidth * result.percentages.kapha / 100), barHeight, 'F');
      
      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text('Ayurvedic Dosha Assessment System', pageWidth / 2, pageHeight - 10, { align: 'center' });
      pdf.text('Page 1', pageWidth / 2, pageHeight - 5, { align: 'center' });
      
      // Page 2 - Analysis
      pdf.addPage();
      yPos = 20;
      
      pdf.setFillColor(33, 150, 243);
      pdf.rect(0, 0, pageWidth, 15, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PERSONALIZED ANALYSIS', pageWidth / 2, 10, { align: 'center' });
      
      pdf.setTextColor(0, 0, 0);
      yPos = 30;
      
      // Physical Analysis
      pdf.setFontSize(13);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(33, 150, 243);
      pdf.text('Physical Constitution', margin, yPos);
      yPos += 7;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      const physicalLines = pdf.splitTextToSize(result.physicalAnalysis, contentWidth);
      pdf.text(physicalLines, margin, yPos);
      yPos += (physicalLines.length * 5) + 10;
      
      // Check page overflow
      if (yPos > pageHeight - 60) {
        pdf.addPage();
        yPos = 20;
      }
      
      // Add remaining sections...
      // Save PDF
      const fileName = `Ayurvedic_Report_${result.dominantDosha}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      // Show success message
      alert('✅ PDF Downloaded! Your report has been saved to your history on the Dashboard.');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <div ref={reportRef} style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1>Your Personalized Ayurvedic Report</h1>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Generated on {formatDate(result.timestamp)}
        </p>
        
        {/* Download PDF Button */}
        <button
          onClick={downloadPDF}
          style={{
            marginTop: '20px',
            padding: '12px 30px',
            fontSize: '16px',
            backgroundColor: '#E91E63',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
        >
          📄 Download PDF Report
        </button>
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

        {/* Rest of the report content... */}
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
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Report;