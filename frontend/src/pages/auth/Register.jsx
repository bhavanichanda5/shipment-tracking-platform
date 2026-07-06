import { useState } from "react";
import { register } from "../../services/authService";
import "../../styles/Register.css";

import { useNavigate } from "react-router-dom";

import registerBg from "../../assets/login-bg.jpg";

function Register() {

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        role: "CUSTOMER"
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

            const response = await register(formData);

            alert(response);

            setFormData({
                username: "",
                password: "",
                role: "CUSTOMER"
            });

        } catch (error) {

            if (error.response) {
                alert(error.response.data);
            } else {
                alert(error.message);
            }

        }

    };

    return (

        <div
            className="register-page"
            style={{ backgroundImage: `url(${registerBg})` }}
        >

            <div className="overlay"></div>

            <div className="register-content">

                <h1>Create an Account</h1>

                <p className="heading-text">
                    Join ShipTrack and start your shipping journey with us.
                </p>

                <div className="register-card">

                    <h2>🚚 ShipTrack</h2>

                    <p className="subtitle">
                        Create Your Account
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

                        <label>Role</label>

                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="CUSTOMER">Customer</option>
                            <option value="BUSINESS_CLIENT">Business Client</option>
                            <option value="LOGISTICS_OPERATOR">Logistics Operator</option>
                            <option value="SUPPORT_AGENT">Support Agent</option>
                            <option value="ADMIN">Admin</option>
                        </select>

                        <button type="submit">
                            Create Account
                        </button>

                    </form>

                   <p className="login-link">
                        Already have an account?

                        <span onClick={() => navigate("/login")}>
                            Login
                        </span>

                    </p>

                </div>

            </div>

        </div>

    );

}

export default Register;