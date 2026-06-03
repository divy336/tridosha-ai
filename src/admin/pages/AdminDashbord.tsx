import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
type AssessmentRow = {
  id: number;
  email?: string;
  user_email?: string;
  dominant_dosha?: string;
  secondary_dosha?: string;
  constitution_type?: string;
  wellness_score?: number;
  created_at?: string;
  vata_percentage?: number;
  pitta_percentage?: number;
  kapha_percentage?: number;
  symptoms?: string[] | string;
  recommendations?: any;
  body_frame?: string;
  skin_type?: string;
  hair_type?: string;
  weight_pattern?: string;
  appetite?: string;
  digestion?: string;
  thirst?: string;
  mind_state?: string;
  sleep_pattern?: string;
  climate_preference?: string;
};

function AdminDashboard() {
  const navigate = useNavigate();

  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalAssessments, setTotalAssessments] = useState<number>(0);
  const [averageScore, setAverageScore] = useState<number>(0);
  const [highScoreCount, setHighScoreCount] = useState<number>(0);

  const [assessments, setAssessments] = useState<AssessmentRow[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentRow | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [detailsLoading, setDetailsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const adminEmail = localStorage.getItem("adminEmail");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [usersRes, assessmentsRes, allAssessmentsRes] = await Promise.all([
        axios.get("https://https://tridosha-ai.onrender.com/api/assessment/get_total_user"),
        axios.get("https://https://tridosha-ai.onrender.com/api/assessment/get_total_assessment"),
        axios.get("https://https://tridosha-ai.onrender.com/api/assessment/get_all_assessments"),
      ]);

      const usersValue =
        usersRes.data?.total_users ??
        usersRes.data?.totalUsers ??
        usersRes.data?.count ??
        0;

      const assessmentValue =
        assessmentsRes.data?.total_assessments ??
        assessmentsRes.data?.totalAssessments ??
        assessmentsRes.data?.count ??
        0;

      const list: AssessmentRow[] = Array.isArray(allAssessmentsRes.data)
        ? allAssessmentsRes.data
        : allAssessmentsRes.data?.assessments || [];

      setTotalUsers(Number(usersValue) || 0);
      setTotalAssessments(Number(assessmentValue) || 0);
      setAssessments(list);

      const validScores = list
        .map((item) => Number(item.wellness_score))
        .filter((score) => !Number.isNaN(score));

      const avg =
        validScores.length > 0
          ? validScores.reduce((sum, score) => sum + score, 0) / validScores.length
          : 0;

      setAverageScore(Number(avg.toFixed(1)));
      setHighScoreCount(list.filter((item) => Number(item.wellness_score) >= 80).length);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminEmail");
    navigate("/admin/login");
  };

  const handleViewAssessment = async (id: number) => {
    try {
      setDetailsLoading(true);
      setError("");

      const localItem = assessments.find((item) => item.id === id) || null;
      setSelectedAssessment(localItem);

      const res = await axios.get(
        `https://https://tridosha-ai.onrender.com/api/assessment/details/${id}`
      );

      const data = res.data?.assessment || res.data;
      setSelectedAssessment(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load assessment details.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const filteredAssessments = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return assessments;

    return assessments.filter((item) => {
      const email =
        (item.email || item.user_email || "").toLowerCase();
      const dosha = (item.dominant_dosha || "").toLowerCase();
      const constitution = (item.constitution_type || "").toLowerCase();
      return (
        email.includes(term) ||
        dosha.includes(term) ||
        constitution.includes(term)
      );
    });
  }, [assessments, searchTerm]);

  const formatDate = (dateValue?: string) => {
    if (!dateValue) return "-";
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return dateValue;
    return date.toLocaleString();
  };

  const getScoreColor = (score?: number) => {
    const value = Number(score) || 0;
    if (value >= 80) return "#1b8f4b";
    if (value >= 60) return "#c58b00";
    if (value >= 40) return "#d97706";
    return "#c0392b";
  };

  const pageStyles: Record<string, React.CSSProperties> = {
    page: {
      minHeight: "100vh",
      color: "#2f2a25",
      padding: "24px",
      fontFamily:
        'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    
      backdropFilter: "blur(2px)",
    },
    container: {
      maxWidth: "1280px",
      margin: "0 auto",
      width: "100%",
    },
    topBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "16px",
      flexWrap: "wrap",
      marginBottom: "24px",
      padding: "22px",
      background: "rgba(255,255,255,0.72)",
      border: "1px solid rgba(140, 92, 45, 0.15)",
      borderRadius: "24px",
      boxShadow: "0 12px 34px rgba(117, 82, 43, 0.10)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
    },
    titleWrap: {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    },
    title: {
      margin: 0,
      fontSize: "32px",
      lineHeight: 1.1,
      color: "#6a3f1d",
      letterSpacing: "-0.02em",
    },
    subtitle: {
      margin: 0,
      color: "#6b6258",
      fontSize: "14px",
    },
    email: {
      margin: 0,
      color: "#8b5a2b",
      fontWeight: 700,
      fontSize: "14px",
    },
    button: {
      border: "none",
      borderRadius: "14px",
      padding: "12px 18px",
      cursor: "pointer",
      fontWeight: 700,
      transition: "transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease",
    },
    logoutBtn: {
      background: "linear-gradient(135deg, #8b4513, #a05a2c)",
      color: "#fff",
      boxShadow: "0 10px 18px rgba(139,69,19,0.20)",
    },
    refreshBtn: {
      background: "#fff",
      color: "#6a3f1d",
      border: "1px solid rgba(139,69,19,0.2)",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "16px",
      marginBottom: "24px",
    },
    card: {
      background: "rgba(255,255,255,0.82)",
      border: "1px solid rgba(140, 92, 45, 0.14)",
      borderRadius: "22px",
      padding: "20px",
      boxShadow: "0 10px 28px rgba(117, 82, 43, 0.08)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
    },
    statLabel: {
      margin: 0,
      color: "#6b6258",
      fontSize: "14px",
      fontWeight: 600,
    },
    statValue: {
      margin: "8px 0 0",
      fontSize: "30px",
      fontWeight: 800,
      color: "#4f2e16",
    },
    statNote: {
      margin: "8px 0 0",
      color: "#8a7d70",
      fontSize: "13px",
    },
    sectionHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "12px",
      flexWrap: "wrap",
      marginBottom: "14px",
    },
    sectionTitle: {
      margin: 0,
      fontSize: "22px",
      color: "#4f2e16",
    },
    search: {
      width: "100%",
      maxWidth: "360px",
      borderRadius: "14px",
      border: "1px solid rgba(139,69,19,0.18)",
      padding: "12px 14px",
      outline: "none",
      background: "#fff",
      color: "#2f2a25",
      boxShadow: "0 4px 10px rgba(0,0,0,0.04)",
    },
    tableWrap: {
      overflowX: "auto",
      borderRadius: "22px",
      border: "1px solid rgba(140, 92, 45, 0.14)",
      background: "rgba(255,255,255,0.84)",
      boxShadow: "0 10px 28px rgba(117, 82, 43, 0.08)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      minWidth: "900px",
    },
    th: {
      textAlign: "left",
      padding: "14px 16px",
      background: "#f4eadb",
      color: "#5c3718",
      fontSize: "14px",
      borderBottom: "1px solid rgba(140, 92, 45, 0.15)",
      whiteSpace: "nowrap",
    },
    td: {
      padding: "14px 16px",
      borderBottom: "1px solid rgba(140, 92, 45, 0.10)",
      fontSize: "14px",
      verticalAlign: "top",
    },
    chip: {
      display: "inline-flex",
      alignItems: "center",
      padding: "6px 10px",
      borderRadius: "999px",
      fontWeight: 700,
      fontSize: "12px",
      background: "#f6eee4",
      color: "#6a3f1d",
    },
    viewBtn: {
      border: "none",
      borderRadius: "12px",
      padding: "10px 14px",
      cursor: "pointer",
      background: "linear-gradient(135deg, #4b7f52, #2f6d3f)",
      color: "#fff",
      fontWeight: 700,
      boxShadow: "0 10px 18px rgba(47, 109, 63, 0.18)",
    },
    empty: {
      padding: "26px",
      textAlign: "center" as const,
      color: "#7b7065",
    },
    modalOverlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(25, 18, 12, 0.62)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "18px",
      zIndex: 50,
    },
    modal: {
      width: "min(1100px, 100%)",
      maxHeight: "90vh",
      overflowY: "auto",
      background: "#fffaf3",
      borderRadius: "24px",
      boxShadow: "0 25px 70px rgba(0,0,0,0.25)",
      border: "1px solid rgba(139,69,19,0.12)",
    },
    modalHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "14px",
      padding: "22px",
      borderBottom: "1px solid rgba(139,69,19,0.10)",
      background: "linear-gradient(135deg, #fbf2e5, #fffaf3)",
    },
    modalTitle: {
      margin: 0,
      color: "#4f2e16",
      fontSize: "24px",
    },
    closeBtn: {
      border: "none",
      borderRadius: "10px",
      background: "#efe5d9",
      color: "#5d452f",
      padding: "10px 14px",
      cursor: "pointer",
      fontWeight: 700,
    },
    modalBody: {
      padding: "22px",
      display: "grid",
      gap: "16px",
    },
    detailGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      gap: "12px",
    },
    detailCard: {
      background: "#fff",
      border: "1px solid rgba(140, 92, 45, 0.14)",
      borderRadius: "18px",
      padding: "16px",
    },
    detailLabel: {
      margin: "0 0 6px",
      color: "#8a7d70",
      fontSize: "12px",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.04em",
    },
    detailValue: {
      margin: 0,
      color: "#35261a",
      fontSize: "15px",
      fontWeight: 600,
      lineHeight: 1.5,
      wordBreak: "break-word",
    },
    listBox: {
      background: "#fff",
      border: "1px solid rgba(140, 92, 45, 0.14)",
      borderRadius: "18px",
      padding: "16px",
    },
    listTitle: {
      margin: "0 0 10px",
      color: "#4f2e16",
      fontSize: "16px",
    },
    list: {
      margin: 0,
      paddingLeft: "18px",
      color: "#35261a",
      lineHeight: 1.7,
    },
    sectionTag: {
      display: "inline-flex",
      alignItems: "center",
      padding: "8px 12px",
      borderRadius: "999px",
      background: "#efe5d9",
      color: "#6a3f1d",
      fontWeight: 700,
      fontSize: "12px",
      marginBottom: "6px",
    },
    error: {
      marginBottom: "18px",
      padding: "14px 16px",
      borderRadius: "14px",
      background: "#fff0f0",
      color: "#b42318",
      border: "1px solid #ffcbcb",
      fontWeight: 600,
    },
  };

  return (
    <div style={pageStyles.page}>
      <div style={pageStyles.container}>
        <div style={pageStyles.topBar}>
          <div style={pageStyles.titleWrap}>
            <h1 style={pageStyles.title}>Admin Dashboard</h1>
            <p style={pageStyles.subtitle}>Ayurveda AI assessment management</p>
            <p style={pageStyles.email}>{adminEmail || "Admin"}</p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              style={{ ...pageStyles.button, ...pageStyles.refreshBtn }}
              onClick={fetchDashboardData}
            >
              Refresh
            </button>

            <button
              style={{ ...pageStyles.button, ...pageStyles.logoutBtn }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        {error && <div style={pageStyles.error}>{error}</div>}

        <div style={pageStyles.statsGrid}>
          <div style={pageStyles.card}>
            <p style={pageStyles.statLabel}>Total Users</p>
            <h2 style={pageStyles.statValue}>{loading ? "..." : totalUsers}</h2>
            <p style={pageStyles.statNote}>Registered accounts in system</p>
          </div>

          <div style={pageStyles.card}>
            <p style={pageStyles.statLabel}>Total Assessments</p>
            <h2 style={pageStyles.statValue}>{loading ? "..." : totalAssessments}</h2>
            <p style={pageStyles.statNote}>Submitted assessment reports</p>
          </div>

          <div style={pageStyles.card}>
            <p style={pageStyles.statLabel}>Average Wellness Score</p>
            <h2 style={pageStyles.statValue}>{loading ? "..." : averageScore}</h2>
            <p style={pageStyles.statNote}>Overall wellness trend</p>
          </div>

          <div style={pageStyles.card}>
            <p style={pageStyles.statLabel}>High Score Reports</p>
            <h2 style={pageStyles.statValue}>{loading ? "..." : highScoreCount}</h2>
            <p style={pageStyles.statNote}>Reports scoring 80+</p>
          </div>
        </div>

        <div style={pageStyles.sectionHeader}>
          <h2 style={pageStyles.sectionTitle}>Recent Assessments</h2>

          <input
            style={pageStyles.search}
            type="text"
            placeholder="Search by email, dosha, constitution..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={pageStyles.tableWrap}>
          <table style={pageStyles.table}>
            <thead>
              <tr>
                <th style={pageStyles.th}>Email</th>
                <th style={pageStyles.th}>Dominant Dosha</th>
                <th style={pageStyles.th}>Constitution</th>
                <th style={pageStyles.th}>Score</th>
                <th style={pageStyles.th}>Date</th>
                <th style={pageStyles.th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td style={pageStyles.td} colSpan={6}>
                    <div style={pageStyles.empty}>Loading assessments...</div>
                  </td>
                </tr>
              ) : filteredAssessments.length === 0 ? (
                <tr>
                  <td style={pageStyles.td} colSpan={6}>
                    <div style={pageStyles.empty}>No assessments found.</div>
                  </td>
                </tr>
              ) : (
                filteredAssessments.map((item) => {
                  const email = item.email || item.user_email || "-";
                  const score = Number(item.wellness_score) || 0;

                  return (
                    <tr key={item.id}>
                      <td style={pageStyles.td}>{email}</td>
                      <td style={pageStyles.td}>
                        <span style={pageStyles.chip}>
                          {item.dominant_dosha || "-"}
                        </span>
                      </td>
                      <td style={pageStyles.td}>{item.constitution_type || "-"}</td>
                      <td style={{ ...pageStyles.td, color: getScoreColor(score), fontWeight: 800 }}>
                        {score}
                      </td>
                      <td style={pageStyles.td}>{formatDate(item.created_at)}</td>
                      <td style={pageStyles.td}>
                        <button
                          style={pageStyles.viewBtn}
                          onClick={() => handleViewAssessment(item.id)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {selectedAssessment && (
          <div style={pageStyles.modalOverlay} onClick={() => setSelectedAssessment(null)}>
            <div style={pageStyles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={pageStyles.modalHeader}>
                <div>
                  <div style={pageStyles.sectionTag}>Assessment Details</div>
                  <h2 style={pageStyles.modalTitle}>
                    {selectedAssessment.email || selectedAssessment.user_email || "User Report"}
                  </h2>
                </div>

                <button
                  style={pageStyles.closeBtn}
                  onClick={() => setSelectedAssessment(null)}
                >
                  Close
                </button>
              </div>

              <div style={pageStyles.modalBody}>
                {detailsLoading ? (
                  <div style={pageStyles.empty}>Loading details...</div>
                ) : (
                  <>
                    <div style={pageStyles.detailGrid}>
                      <div style={pageStyles.detailCard}>
                        <p style={pageStyles.detailLabel}>Dominant Dosha</p>
                        <p style={pageStyles.detailValue}>
                          {selectedAssessment.dominant_dosha || "-"}
                        </p>
                      </div>

                      <div style={pageStyles.detailCard}>
                        <p style={pageStyles.detailLabel}>Secondary Dosha</p>
                        <p style={pageStyles.detailValue}>
                          {selectedAssessment.secondary_dosha || "-"}
                        </p>
                      </div>

                      <div style={pageStyles.detailCard}>
                        <p style={pageStyles.detailLabel}>Constitution Type</p>
                        <p style={pageStyles.detailValue}>
                          {selectedAssessment.constitution_type || "-"}
                        </p>
                      </div>

                      <div style={pageStyles.detailCard}>
                        <p style={pageStyles.detailLabel}>Wellness Score</p>
                        <p style={{ ...pageStyles.detailValue, color: getScoreColor(selectedAssessment.wellness_score) }}>
                          {selectedAssessment.wellness_score ?? "-"}
                        </p>
                      </div>

                      <div style={pageStyles.detailCard}>
                        <p style={pageStyles.detailLabel}>Vata %</p>
                        <p style={pageStyles.detailValue}>
                          {selectedAssessment.vata_percentage ?? "-"}
                        </p>
                      </div>

                      <div style={pageStyles.detailCard}>
                        <p style={pageStyles.detailLabel}>Pitta %</p>
                        <p style={pageStyles.detailValue}>
                          {selectedAssessment.pitta_percentage ?? "-"}
                        </p>
                      </div>

                      <div style={pageStyles.detailCard}>
                        <p style={pageStyles.detailLabel}>Kapha %</p>
                        <p style={pageStyles.detailValue}>
                          {selectedAssessment.kapha_percentage ?? "-"}
                        </p>
                      </div>

                      <div style={pageStyles.detailCard}>
                        <p style={pageStyles.detailLabel}>Created At</p>
                        <p style={pageStyles.detailValue}>
                          {formatDate(selectedAssessment.created_at)}
                        </p>
                      </div>
                    </div>

                    <div style={pageStyles.listBox}>
                      <h3 style={pageStyles.listTitle}>Questionnaire Answers</h3>
                      <ul style={pageStyles.list}>
                        <li>Body Frame: {selectedAssessment.body_frame || "-"}</li>
                        <li>Skin Type: {selectedAssessment.skin_type || "-"}</li>
                        <li>Hair Type: {selectedAssessment.hair_type || "-"}</li>
                        <li>Weight Pattern: {selectedAssessment.weight_pattern || "-"}</li>
                        <li>Appetite: {selectedAssessment.appetite || "-"}</li>
                        <li>Digestion: {selectedAssessment.digestion || "-"}</li>
                        <li>Thirst: {selectedAssessment.thirst || "-"}</li>
                        <li>Mind State: {selectedAssessment.mind_state || "-"}</li>
                        <li>Sleep Pattern: {selectedAssessment.sleep_pattern || "-"}</li>
                        <li>Climate Preference: {selectedAssessment.climate_preference || "-"}</li>
                      </ul>
                    </div>

                    <div style={pageStyles.listBox}>
                      <h3 style={pageStyles.listTitle}>Symptoms</h3>
                      <ul style={pageStyles.list}>
                        {Array.isArray(selectedAssessment.symptoms)
                          ? selectedAssessment.symptoms.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))
                          : typeof selectedAssessment.symptoms === "string" &&
                            selectedAssessment.symptoms.length > 0
                          ? selectedAssessment.symptoms.split(",").map((item, index) => (
                              <li key={index}>{item.trim()}</li>
                            ))
                          : <li>None</li>}
                      </ul>
                    </div>

                    <div style={pageStyles.listBox}>
                      <h3 style={pageStyles.listTitle}>Recommendations</h3>
                      <pre
                        style={{
                          margin: 0,
                          whiteSpace: "pre-wrap",
                          fontFamily: "inherit",
                          color: "#35261a",
                          lineHeight: 1.7,
                        }}
                      >
                        {selectedAssessment.recommendations
                          ? typeof selectedAssessment.recommendations === "string"
                            ? selectedAssessment.recommendations
                            : JSON.stringify(selectedAssessment.recommendations, null, 2)
                          : "No recommendations stored."}
                      </pre>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;