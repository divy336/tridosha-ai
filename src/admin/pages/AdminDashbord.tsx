import { useNavigate } from "react-router-dom";

function AdminDashboard() {

  const navigate = useNavigate();

  const adminEmail = localStorage.getItem(
    "adminEmail"
  );

  const handleLogout = () => {

    localStorage.removeItem(
      "adminLoggedIn"
    );

    localStorage.removeItem(
      "adminEmail"
    );

    alert("Admin Logout Successful");

    navigate("/admin/login");

  };

  return (

    <div>

      <h1>Admin Dashboard</h1>

      <p>
        Welcome Admin
      </p>

      <h3>
        {adminEmail}
      </h3>

      <hr />

      <h2>Dashboard Menu</h2>

      <ul>

        <li>
          Total Users
        </li>

        <li>
          Reports
        </li>

        <li>
          Analytics
        </li>

        <li>
          Settings
        </li>

      </ul>

      <br />

      <button onClick={handleLogout}>

        Logout

      </button>

    </div>

  );
}

export default AdminDashboard;