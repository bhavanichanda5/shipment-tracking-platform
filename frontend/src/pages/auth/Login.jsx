import { useState } from "react";
import { login } from "../../services/authService";
import "../../styles/Login.css";

import { useNavigate } from "react-router-dom";

import loginBg from "../../assets/login_bg2.png";

function Login() {

    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await login(formData);

            localStorage.setItem("token", response.token);

            alert("Login Successful");

        } catch (error) {

            if (error.response) {
                alert(error.response.data);
            } else {
                alert(error.message);
            }

        }

    };

    return (

        <div className="login-page">

            <div className="left-section">
                <img
                    src={loginBg}
                    alt="Shipment Tracking"
                    className="login-image"
                />
            </div>

            <div className="right-section">

                <div className="login-box">

                    <h2>🚚 ShipTrack</h2>

                    <p>
                        Shipment Tracking & Delivery Visibility Platform
                    </p>

                    <form onSubmit={handleSubmit}>

                        <label>Username</label>

                        <input
                            type="text"
                            name="username"
                            placeholder="Enter Username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />

                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                        <button type="submit">
                            Login
                        </button>

                    </form>

                    <div className="register-link">
                        Don't have an account?

                        <span onClick={() => navigate("/register")}>
                            Register
                        </span>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Login;