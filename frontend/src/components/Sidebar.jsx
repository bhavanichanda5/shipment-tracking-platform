import {
    FaTachometerAlt,
    FaUsers,
    FaBoxOpen,
    FaMapMarkedAlt,
    FaTruck,
    FaRoute,
    FaCamera,
    FaBell,
    FaChartBar,
    FaFileAlt,
    FaCog,
    FaSignOutAlt,
    FaBars
} from "react-icons/fa";

import { useState } from "react";

import "../styles/Sidebar.css";

function Sidebar({ onSelect }) {

    const [collapsed, setCollapsed] = useState(false);

    const select = (key) => {
        if (onSelect) onSelect(key);
    };

    return (

        <div className={collapsed ? "sidebar collapsed" : "sidebar"}>

            <div className="sidebar-header">

                <button
                    className="menu-btn"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <FaBars />
                </button>

                {!collapsed && <h2>🚚 ShipTrack</h2>}

            </div>

            <ul>

                <li onClick={() => select('dashboard')}>
                    <FaTachometerAlt />
                    {!collapsed && <span>Dashboard</span>}
                </li>

                <li onClick={() => select('users')}>
                    <FaUsers />
                    {!collapsed && <span>Users</span>}
                </li>

                <li onClick={() => select('shipments')}>
                    <FaBoxOpen />
                    {!collapsed && <span>Shipments</span>}
                </li>

                <li>
                    <FaMapMarkedAlt />
                    {!collapsed && <span>Tracking</span>}
                </li>

                <li>
                    <FaTruck />
                    {!collapsed && <span>Delivery</span>}
                </li>

                <li>
                    <FaRoute />
                    {!collapsed && <span>Routes</span>}
                </li>

                <li>
                    <FaCamera />
                    {!collapsed && <span>Proof of Delivery</span>}
                </li>

                <li>
                    <FaBell />
                    {!collapsed && <span>Notifications</span>}
                </li>

                <li>
                    <FaChartBar />
                    {!collapsed && <span>Analytics</span>}
                </li>

                <li>
                    <FaFileAlt />
                    {!collapsed && <span>Reports</span>}
                </li>

                <li>
                    <FaCog />
                    {!collapsed && <span>Settings</span>}
                </li>

            </ul>

            <div className="logout">

                <FaSignOutAlt />

                {!collapsed && <span>Logout</span>}

            </div>

        </div>

    );

}

export default Sidebar;