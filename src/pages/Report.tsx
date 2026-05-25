import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

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

  const downloadPDF = async () => {
    if (!reportRef.current) return;

    try {
      // Show loading state
      const originalContent = reportRef.current.innerHTML;
      const loadingDiv = document.createElement('div');
      loadingDiv.innerHTML = '<div style="text-align: center; padding: 50px; font-size: 20px; color: #2196F3;">Generating your Ayurvedic Report PDF...</div>';
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - (2 * margin);
      
      // Page 1 - Cover Page
      pdf.setFillColor(156, 39, 176); // Purple
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
      // Wellness Score Box

const scoreColor = getColorRGB(
  getWellnessScoreColor(
    result.wellnessScore
  )
);

pdf.setDrawColor(
  scoreColor[0],
  scoreColor[1],
  scoreColor[2]
);

pdf.setFillColor(
  scoreColor[0],
  scoreColor[1],
  scoreColor[2]
);

pdf.roundedRect(
  margin,
  135,
  contentWidth,
  40,
  3,
  3,
  'S'
);

pdf.setFontSize(16);

pdf.setFont(
  'helvetica',
  'bold'
);

pdf.setTextColor(
  0,
  0,
  0
);

pdf.text(
  'Wellness Score',
  pageWidth / 2,
  150,
  {
    align: 'center'
  }
);

pdf.setFontSize(32);

pdf.setTextColor(
  scoreColor[0],
  scoreColor[1],
  scoreColor[2]
);

pdf.text(
  `${result.wellnessScore}/100`,
  pageWidth / 2,
  165,
  {
    align: 'center'
  }
);
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
      
      // Emotional Analysis
      if (yPos > pageHeight - 60) {
        pdf.addPage();
        yPos = 20;
      }
      
      pdf.setFontSize(13);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(156, 39, 176);
      pdf.text('Emotional & Mental Patterns', margin, yPos);
      yPos += 7;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      const emotionalLines = pdf.splitTextToSize(result.emotionalAnalysis, contentWidth);
      pdf.text(emotionalLines, margin, yPos);
      yPos += (emotionalLines.length * 5) + 10;
      
      // Digestive Analysis
      if (yPos > pageHeight - 60) {
        pdf.addPage();
        yPos = 20;
      }
      
      pdf.setFontSize(13);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 152, 0);
      pdf.text('Digestive System', margin, yPos);
      yPos += 7;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      const digestiveLines = pdf.splitTextToSize(result.digestiveAnalysis, contentWidth);
      pdf.text(digestiveLines, margin, yPos);
      yPos += (digestiveLines.length * 5) + 10;
      
      // Sleep Analysis
      if (yPos > pageHeight - 60) {
        pdf.addPage();
        yPos = 20;
      }
      
      pdf.setFontSize(13);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(63, 81, 181);
      pdf.text('Sleep Patterns', margin, yPos);
      yPos += 7;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      const sleepLines = pdf.splitTextToSize(result.sleepAnalysis, contentWidth);
      pdf.text(sleepLines, margin, yPos);
      
      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text('Ayurvedic Dosha Assessment System', pageWidth / 2, pageHeight - 10, { align: 'center' });
      pdf.text('Page 2', pageWidth / 2, pageHeight - 5, { align: 'center' });
      
      // Page 3 - Dietary Recommendations
      pdf.addPage();
      yPos = 20;
      
      pdf.setFillColor(76, 175, 80);
      pdf.rect(0, 0, pageWidth, 15, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('DIETARY RECOMMENDATIONS', pageWidth / 2, 10, { align: 'center' });
      
      pdf.setTextColor(0, 0, 0);
      yPos = 30;
      
      // Foods to Prefer
      pdf.setFontSize(13);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(46, 125, 50);
      pdf.text('Foods to Prefer ✓', margin, yPos);
      yPos += 7;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      result.foodsToPrefer.forEach((food, index) => {
        if (yPos > pageHeight - 30) {
          pdf.addPage();
          yPos = 20;
        }
        pdf.text(`• ${food}`, margin + 5, yPos);
        yPos += 6;
      });
      
      yPos += 5;
      
      // Foods to Avoid
      if (yPos > pageHeight - 60) {
        pdf.addPage();
        yPos = 20;
      }
      
      pdf.setFontSize(13);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(198, 40, 40);
      pdf.text('Foods to Avoid ✗', margin, yPos);
      yPos += 7;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      result.foodsToAvoid.forEach((food, index) => {
        if (yPos > pageHeight - 30) {
          pdf.addPage();
          yPos = 20;
        }
        pdf.text(`• ${food}`, margin + 5, yPos);
        yPos += 6;
      });
      
      yPos += 5;
      
      // Recommended Herbs
      if (yPos > pageHeight - 60) {
        pdf.addPage();
        yPos = 20;
      }
      
      pdf.setFontSize(13);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(85, 139, 47);
      pdf.text('Recommended Herbs', margin, yPos);
      yPos += 7;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      result.herbs.forEach((herb, index) => {
        if (yPos > pageHeight - 30) {
          pdf.addPage();
          yPos = 20;
        }
        pdf.text(`• ${herb}`, margin + 5, yPos);
        yPos += 6;
      });
      
      yPos += 5;
      
      // Recommended Drinks
      if (yPos > pageHeight - 60) {
        pdf.addPage();
        yPos = 20;
      }
      
      pdf.setFontSize(13);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 131, 143);
      pdf.text('Recommended Drinks', margin, yPos);
      yPos += 7;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      result.drinks.forEach((drink, index) => {
        if (yPos > pageHeight - 30) {
          pdf.addPage();
          yPos = 20;
        }
        pdf.text(`• ${drink}`, margin + 5, yPos);
        yPos += 6;
      });
      
      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text('Ayurvedic Dosha Assessment System', pageWidth / 2, pageHeight - 10, { align: 'center' });
      pdf.text('Page 3', pageWidth / 2, pageHeight - 5, { align: 'center' });
      
      // Page 4 - Yoga Recommendations
      pdf.addPage();
      yPos = 20;
      
      pdf.setFillColor(103, 58, 183);
      pdf.rect(0, 0, pageWidth, 15, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PERSONALIZED YOGA PRACTICE', pageWidth / 2, 10, { align: 'center' });
      
      pdf.setTextColor(0, 0, 0);
      yPos = 30;
      
      result.yoga.forEach((pose, index) => {
        if (yPos > pageHeight - 50) {
          pdf.addPage();
          yPos = 20;
        }
        
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${index + 1}. ${pose.name}`, margin, yPos);
        yPos += 6;
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'italic');
        pdf.text(pose.description, margin + 5, yPos);
        yPos += 5;
        
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Benefit: ${pose.benefit}`, margin + 5, yPos);
        yPos += 5;
        
        pdf.text(`Energy: ${pose.energy}`, margin + 5, yPos);
        yPos += 10;
      });
      
      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text('Ayurvedic Dosha Assessment System', pageWidth / 2, pageHeight - 10, { align: 'center' });
      pdf.text('Page 4', pageWidth / 2, pageHeight - 5, { align: 'center' });
      
      // Page 5 - Lifestyle & Routines
      pdf.addPage();
      yPos = 20;
      
      pdf.setFillColor(255, 152, 0);
      pdf.rect(0, 0, pageWidth, 15, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('LIFESTYLE & DAILY ROUTINES', pageWidth / 2, 10, { align: 'center' });
      
      pdf.setTextColor(0, 0, 0);
      yPos = 30;
      
      // Lifestyle Tips
      pdf.setFontSize(13);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(103, 58, 183);
      pdf.text('Lifestyle Recommendations', margin, yPos);
      yPos += 7;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      result.lifestyleTips.forEach((tip, index) => {
        if (yPos > pageHeight - 30) {
          pdf.addPage();
          yPos = 20;
        }
        const tipLines = pdf.splitTextToSize(`• ${tip}`, contentWidth - 5);
        pdf.text(tipLines, margin + 5, yPos);
        yPos += (tipLines.length * 5) + 2;
      });
      
      yPos += 5;
      
      // Morning Routine
      if (yPos > pageHeight - 60) {
        pdf.addPage();
        yPos = 20;
      }
      
      pdf.setFontSize(13);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 152, 0);
      pdf.text('Morning Routine 🌅', margin, yPos);
      yPos += 7;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      result.morningRoutine.forEach((item, index) => {
        if (yPos > pageHeight - 30) {
          pdf.addPage();
          yPos = 20;
        }
        const itemLines = pdf.splitTextToSize(`• ${item}`, contentWidth - 5);
        pdf.text(itemLines, margin + 5, yPos);
        yPos += (itemLines.length * 5) + 2;
      });
      
      yPos += 5;
      
      // Night Routine
      if (yPos > pageHeight - 60) {
        pdf.addPage();
        yPos = 20;
      }
      
      pdf.setFontSize(13);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(63, 81, 181);
      pdf.text('Night Routine 🌙', margin, yPos);
      yPos += 7;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      result.nightRoutine.forEach((item, index) => {
        if (yPos > pageHeight - 30) {
          pdf.addPage();
          yPos = 20;
        }
        const itemLines = pdf.splitTextToSize(`• ${item}`, contentWidth - 5);
        pdf.text(itemLines, margin + 5, yPos);
        yPos += (itemLines.length * 5) + 2;
      });
      
      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text('Ayurvedic Dosha Assessment System', pageWidth / 2, pageHeight - 10, { align: 'center' });
      pdf.text('Page 5', pageWidth / 2, pageHeight - 5, { align: 'center' });
      
      // Page 6 - Stress Management & Disclaimer
      pdf.addPage();
      yPos = 20;
      
      pdf.setFillColor(0, 150, 136);
      pdf.rect(0, 0, pageWidth, 15, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('STRESS MANAGEMENT', pageWidth / 2, 10, { align: 'center' });
      
      pdf.setTextColor(0, 0, 0);
      yPos = 30;
      
      pdf.setFontSize(13);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 150, 136);
      pdf.text('Stress Management Practices', margin, yPos);
      yPos += 7;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      result.stressManagement.forEach((practice, index) => {
        if (yPos > pageHeight - 80) {
          pdf.addPage();
          yPos = 20;
        }
        const practiceLines = pdf.splitTextToSize(`• ${practice}`, contentWidth - 5);
        pdf.text(practiceLines, margin + 5, yPos);
        yPos += (practiceLines.length * 5) + 2;
      });
      
      yPos += 15;
      
      // Disclaimer
      if (yPos > pageHeight - 100) {
        pdf.addPage();
        yPos = 20;
      }
      
      pdf.setDrawColor(255, 152, 0);
      pdf.setLineWidth(0.5);
      pdf.rect(margin, yPos, contentWidth, 70);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(230, 81, 0);
      pdf.text('Medical Disclaimer', margin + 3, yPos + 7);
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      const disclaimerText = 'This assessment is for educational and informational purposes only and should not be considered medical advice. The recommendations provided are based on traditional Ayurvedic principles and are not intended to diagnose, treat, cure, or prevent any disease. Always consult with a qualified healthcare provider or certified Ayurvedic practitioner before making significant changes to your diet, lifestyle, or health regimen, especially if you have existing health conditions or are taking medications.';
      const disclaimerLines = pdf.splitTextToSize(disclaimerText, contentWidth - 10);
      pdf.text(disclaimerLines, margin + 3, yPos + 15);
      
      // Final Footer
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text('Ayurvedic Dosha Assessment System', pageWidth / 2, pageHeight - 10, { align: 'center' });
      pdf.text('Page 6', pageWidth / 2, pageHeight - 5, { align: 'center' });
      pdf.text(`Report Generated: ${formatDate(result.timestamp)}`, pageWidth / 2, pageHeight - 15, { align: 'center' });
      
      // Save PDF
      const fileName = `Ayurvedic_Report_${result.dominantDosha}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const getColorRGB = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [0, 0, 0];
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