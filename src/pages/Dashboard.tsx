import { Link } from "react-router-dom";
import "./design/dashboad.css";

function Dashboard() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

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
                <button>Login</button>
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

          {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
        </div>
      </header>

      {/* MAIN */}

      <main>
        <h1 className="welcome" style={{ fontFamily: "revert-layer" }}>
          Welcome to
        </h1>
        <b className="dashboard-description">Ayurveda</b>
        <br></br>
        <span className="dashboard-des">
          Discover Your Ayurvedic Constitution
        </span>

        <span className="dashboard-de">
          Analyze your biological energies (Doshas) through our refined physical
          and behavioral assessment, receive curated dietary and yoga practices,
          and explore critical medication safety alerts.
        </span>
      </main>
    </section>
  );
}

export default Dashboard;
