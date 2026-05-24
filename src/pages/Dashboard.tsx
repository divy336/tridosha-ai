import { Link } from "react-router-dom";
<<<<<<< HEAD
import "./design/dashboad.css";

function Dashboard() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
=======
import { useNavigate } from "react-router-dom";


function Dashboard() {
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem(
    "isLoggedIn"
  );
>>>>>>> 1b64b9f71a8519be5886ebe9679f618a896a6590

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

<<<<<<< HEAD
      <main>
        <h1 style={{ fontFamily: "revert-layer" }}>Welcome to</h1>
        <b
          className="dashboard-description"
          style={{ fontFamily: "fangsong", fontSize: 60, width: "100%" }}
        >
          Ayurveda
        </b>
        <span
          style={{
            fontSize: 30,
            color: "rgb(51, 78, 36)",
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          }}
        >
          Discover Your Ayurvedic Constitution
        </span>
        <br></br>
        <span
          style={{
            fontSize: 20,
            color: "rgb(51, 78, 36)",
            fontFamily: "cursive",
          }}
        >
          Analyze your biological energies (Doshas) through our refined physical
          and behavioral assessment, receive curated dietary and yoga practices,
          and explore critical medication safety alerts.
        </span>
=======
      <main
        style={{
          textAlign: "center",
          marginTop: "100px"
        }}
      >

        <h1>
          Welcome to Tridosha AI
            <button onClick={() => navigate("/assessment")}>
        Dosha Test
      </button>
        </h1>

>>>>>>> 1b64b9f71a8519be5886ebe9679f618a896a6590
      </main>
    </section>
  );
}

export default Dashboard;
