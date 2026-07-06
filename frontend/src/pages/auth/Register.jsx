import { useState } from "react";
import { register } from "../../services/authService";

function Register() {

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        role: "CUSTOMER"
    });

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

        }  catch (error) {
    console.error("Error:", error);

    if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", error.response.data);
        alert(error.response.data);
    } else {
        alert(error.message);
    }
}
    };

    return (
        <div style={{ padding: "30px" }}>

            <h2>Register</h2>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                />

                <br /><br />

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

                <br /><br />

                <button type="submit">
                    Register
                </button>

            </form>

        </div>
    );
}

export default Register;