import { useEffect, useState } from "react";
import { getCustomerProfile } from "../../../services/customerService";

import {
    FaUserCircle,
    FaUser,
    FaShieldAlt,
    FaIdBadge
} from "react-icons/fa";

import "./Profile.css";

function CustomerProfile() {

    const [profile, setProfile] = useState({

        id: "",

        username: "",

        role: ""

    });

    useEffect(() => {

        loadProfile();

    }, []);

    const loadProfile = async () => {

        try {

            const response = await getCustomerProfile();

            setProfile(response);

        }

        catch (error) {

            console.log(error);

        }

    };

    return (

        <div className="profile-container">

            <div className="profile-card">

                <FaUserCircle className="profile-avatar"/>

                <h2>{profile.username}</h2>

                <p>Customer Account</p>

                <div className="profile-info">

                    <div>

                        <FaIdBadge/>

                        <span>ID</span>

                        <strong>{profile.id}</strong>

                    </div>

                    <div>

                        <FaUser/>

                        <span>Username</span>

                        <strong>{profile.username}</strong>

                    </div>

                    <div>

                        <FaShieldAlt/>

                        <span>Role</span>

                        <strong>{profile.role}</strong>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default CustomerProfile;