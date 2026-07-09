import "../styles/ShipmentTable.css";
import { useEffect, useState } from "react";
import { getAllUsers } from "../services/userService";

function UsersTable(){
    const [users, setUsers] = useState([]);

    useEffect(() => { load(); }, []);

    const load = async () => {
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (err) { console.error(err); setUsers([]); }
    }

    return (
        <div className="table-card">
            <div className="table-header">
                <h2>Users</h2>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.name}</td>
                            <td>{u.username}</td>
                            <td>{u.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UsersTable;
