import { useState } from "react";
import { login } from "../../services/authService";

function Login() {

    const [formData, setFormData] = useState({
        username: "",
        password: ""
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

            const response = await login(formData);

            // Save JWT
            localStorage.setItem("token", response.token);

            alert("Login Successful");

            setFormData({
                username: "",
                password: ""
            });

        } catch (error) {

            console.error(error);

            if (error.response) {
                alert(error.response.data);
            } else {
                alert(error.message);
            }

        }

    };

    return (

        <div style={{ padding: "30px" }}>

            <h2>Login</h2>

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

                <button type="submit">
                    Login
                </button>

            </form>

        </div>

    );

}

export default Login;