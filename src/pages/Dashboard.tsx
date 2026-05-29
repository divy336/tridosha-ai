import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./design/dashboad.css";

function Dashboard() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const userEmail = localStorage.getItem("userEmail");
  
  const [reportHistory, setReportHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch assessment history from database
  useEffect(() => {
    if (isLoggedIn && userEmail) {
      fetchAssessmentHistory();
    }
  }, [isLoggedIn, userEmail]);

  const fetchAssessmentHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/get-user-assessments', {
        email: userEmail
      });

      if (response.data.success) {
        setReportHistory(response.data.assessments);
      }
    } catch (error) {
      console.error('Error fetching assessment history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    window.location.reload();
  };

  const viewReport = async (assessmentId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/get-assessment/${assessmentId}`);
      
      // Navigate to report page with data
      navigate('/report', { state: response.data });
    } catch (error) {
      console.error('Error loading report:', error);
      alert('Failed to load report. Please try again.');
    }
  };

  const deleteReport = async (assessmentId) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      try {
        await axios.delete(`http://localhost:5000/api/delete-assessment/${assessmentId}`);
        
        // Refresh history
        fetchAssessmentHistory();
        alert('Report deleted successfully!');
      } catch (error) {
        console.error('Error deleting report:', error);
        alert('Failed to delete report. Please try again.');
      }
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();
  };

  return (
    <section className="dashboard-container">
      {/* HEADER */}
      <header>
        <h2>Ayurveda</h2>
        <div>
          {/* IF NOT LOGGED IN */}
          {!isLoggedIn && (
            <>
              <Link to="/login">
                <button>Login</button>
              </Link>
              <Link to="/signup">
                <button style={{ marginLeft: "10px" }}>Signup</button>
              </Link>
            </>
          )}
          {/* IF LOGGED IN */}
          {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
        </div>
      </header>

      {/* MAIN */}
      <main>
        <h1 className="welcome" style={{ fontFamily: "revert-layer" }}>
          Welcome to
        </h1>

        <b
          className="dashboard-description"
          style={{
            fontFamily: "fangsong",
            fontSize: 60,
            width: "100%"
          }}
        >
          Ayurveda
        </b>

        <br />

        <span className="dashboard-des">
          Discover Your Ayurvedic Constitution
        </span>

        <br />

        <span className="dashboard-de">
          Analyze your biological energies (Doshas) through our refined
          physical and behavioral assessment, receive curated dietary and yoga
          practices, and explore critical medication safety alerts.
        </span>

        <br />
        <br />

        <button
          onClick={() => navigate("/assessment")}
          style={{
            backgroundColor: "#4a7c59",
            color: "#ffffff",
            border: "2px solid #3a6647",
            borderRadius: "8px",
            padding: "12px 40px",
            fontSize: "16px",
            fontWeight: "600",
            letterSpacing: "0.5px",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(74, 124, 89, 0.35)",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = "#3a6647";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(74, 124, 89, 0.5)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = "#4a7c59";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(74, 124, 89, 0.35)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Take Dosha Test
        </button>
      </main>

      {/* REPORT HISTORY SECTION */}
      {isLoggedIn && (
        <div
          style={{
            marginTop: "60px",
            padding: "30px",
            background: "rgba(255, 255, 255, 0.9)",
            borderRadius: "20px",
            border: "2px solid rgba(113, 240, 39, 0.3)",
            maxWidth: "1000px"
          }}
        >
          <h2
            style={{
              fontSize: "32px",
              color: "#4a1f12",
              marginBottom: "20px",
              fontFamily: "Georgia, serif"
            }}
          >
            📋 Your Assessment History
          </h2>

          {loading && (
            <p style={{ textAlign: "center", color: "#666", fontSize: "16px" }}>
              Loading your reports...
            </p>
          )}

          {!loading && reportHistory.length === 0 && (
            <p style={{ textAlign: "center", color: "#666", fontSize: "16px" }}>
              No assessments yet. Take your first Dosha test to see your personalized wellness report!
            </p>
          )}

          {!loading && reportHistory.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {reportHistory.map((report) => (
                <div
                  key={report.id}
                  style={{
                    padding: "20px",
                    background: "#fff",
                    borderRadius: "12px",
                    border: "2px solid #e0e0e0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: "20px",
                        color: "#8B4513",
                        marginBottom: "8px"
                      }}
                    >
                      {report.constitutionType}
                    </h3>
                    <p style={{ fontSize: "14px", color: "#666", margin: "4px 0" }}>
                      <strong>Dominant:</strong> {report.dominantDosha} |{" "}
                      <strong>Vata:</strong> {report.percentages.vata}% |{" "}
                      <strong>Pitta:</strong> {report.percentages.pitta}% |{" "}
                      <strong>Kapha:</strong> {report.percentages.kapha}%
                    </p>
                    <p style={{ fontSize: "14px", color: "#666", margin: "4px 0" }}>
                      <strong>Wellness Score:</strong> {report.wellnessScore}/100
                    </p>
                    <p style={{ fontSize: "12px", color: "#999", marginTop: "8px" }}>
                      Generated: {formatDate(report.timestamp)}
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => viewReport(report.id)}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#4CAF50",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "bold"
                      }}
                    >
                      📄 View & Download PDF
                    </button>

                    <button
                      onClick={() => deleteReport(report.id)}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#f44336",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "bold"
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default Dashboard;