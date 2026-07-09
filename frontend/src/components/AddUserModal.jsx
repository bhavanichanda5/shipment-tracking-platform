import { useEffect, useState } from 'react';
import "../styles/AddShipmentModal.css"; // reuse modal styles
import { register } from '../services/authService';

function AddUserModal({ show, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        confirmPassword: '',
        role: 'CUSTOMER'
    });

    useEffect(() => {
        if (!show) return;
        setFormData({ name: '', username: '', password: '', confirmPassword: '', role: 'CUSTOMER' });
    }, [show]);

    if (!show) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const resp = await register({
                name: formData.name,
                username: formData.username,
                password: formData.password,
                role: formData.role
            });

            if (resp.name) {
                localStorage.setItem('name', resp.name);
                window.dispatchEvent(new Event('nameChanged'));
            }
            window.dispatchEvent(new Event('activities:update'));
            alert(resp.message || 'User registered');
            onClose();
        } catch (err) {
            console.error(err);
            if (err.response) alert(err.response.data.message || err.response.data);
            else alert(err.message || 'Registration failed');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Add User</h2>
                <form onSubmit={handleSubmit}>
                    <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                    <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                    <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
                    <select name="role" value={formData.role} onChange={handleChange}>
                        <option value="CUSTOMER">Customer</option>
                        <option value="BUSINESS_CLIENT">Business Client</option>
                        <option value="LOGISTICS_OPERATOR">Logistics Operator</option>
                        <option value="SUPPORT_AGENT">Support Agent</option>
                        <option value="ADMIN">Admin</option>
                    </select>

                    <div className="modal-buttons">
                        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="save-btn">Save User</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddUserModal;
