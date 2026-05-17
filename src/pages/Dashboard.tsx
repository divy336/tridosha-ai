import { Link } from "react-router-dom";

function Dashboard() {

  const isLoggedIn = localStorage.getItem(
    "isLoggedIn"
  );

  const handleLogout = () => {

    localStorage.removeItem(
      "isLoggedIn"
    );

    localStorage.removeItem(
      "userEmail"
    );

    window.location.reload();

  };

  return (

    <div>

      {/* HEADER */}

      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "20px",
          borderBottom: "1px solid lightgray"
        }}
      >

        <h2>
          Tridosha AI
        </h2>

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
                    marginLeft: "10px"
                  }}
                >

                  Signup

                </button>

              </Link>

            </>

          )}

          {/* IF LOGGED IN */}

          {isLoggedIn && (

            <button
              onClick={handleLogout}
            >

              Logout

            </button>

          )}

        </div>

      </header>

      {/* MAIN */}

      <main
        style={{
          textAlign: "center",
          marginTop: "100px"
        }}
      >

        <h1>
          Welcome to Tridosha AI
        </h1>

      </main>

    </div>

  );
}

export default Dashboard;