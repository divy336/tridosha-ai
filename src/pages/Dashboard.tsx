import { Link, useNavigate } from "react-router-dom";

import "./design/dashboad.css";

function Dashboard() {

  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem(
    "isLoggedIn"
  );

  const handleLogout = () => {

    localStorage.removeItem("isLoggedIn");

    localStorage.removeItem("userEmail");

    window.location.reload();

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

                <button>
                  Login
                </button>

              </Link>

              <Link to="/signup">

                <button
                  style={{
                    marginLeft: "10px",
                  }}
                >
                  Signup
                </button>

              </Link>

            </>

          )}

          {/* IF LOGGED IN */}

          {isLoggedIn && (

            <button onClick={handleLogout}>
              Logout
            </button>

          )}

        </div>

      </header>

      {/* MAIN */}

      <main>

        <h1
          className="welcome"
          style={{
            fontFamily: "revert-layer"
          }}
        >
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

          Analyze your biological energies
          (Doshas) through our refined
          physical and behavioral assessment,
          receive curated dietary and yoga
          practices, and explore critical
          medication safety alerts.

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
            transition: "all 0.2s ease",
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
          Dosha Test
        </button>

      </main>

    </section>

  );

}

export default Dashboard;