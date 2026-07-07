import "../../styles/Dashboard.css";

function Dashboard() {

    const username = localStorage.getItem("username");

    return (

        <div className="dashboard">

            <h1>🚚 ShipTrack Dashboard</h1>

            <h2>Welcome, {username} 👋</h2>

            <p>
                Login Successful. You are now inside the application.
            </p>

        </div>

    );

}

export default Dashboard;