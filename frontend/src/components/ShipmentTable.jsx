import "../styles/ShipmentTable.css";

import { useEffect, useState } from "react";

import AddShipmentModal from "./AddShipmentModal";

import {
    getAllShipments,
    addShipment,
    updateShipment,
    deleteShipment
} from "../services/shipmentService";

function ShipmentTable() {
    const [shipments, setShipments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingShipment, setEditingShipment] = useState(null);

    useEffect(() => {
        loadShipments();
    }, []);

    const loadShipments = async () => {
        try {
            const data = await getAllShipments();
            setShipments(data);
        } catch (error) {
            console.log(error);
        }
    };

    const saveShipment = async (shipment) => {
        try {
            if (editingShipment) {
                await updateShipment(editingShipment.id, shipment);
                alert("Shipment Updated Successfully");
            } else {
                await addShipment(shipment);
                alert("Shipment Added Successfully");
            }

            loadShipments();
            setEditingShipment(null);
            setShowModal(false);
        } catch (error) {
            console.log(error);
            alert("Operation Failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this shipment?")) {
            return;
        }

        try {
            await deleteShipment(id);
            alert("Shipment Deleted Successfully");
            loadShipments();
        } catch (error) {
            console.log(error);
            alert("Failed to delete shipment");
        }
    };

    return (
        <div className="table-card">
            <div className="table-header">
                <h2>Recent Shipments</h2>
                <button onClick={() => setShowModal(true)}>
                    + Add Shipment
                </button>
            </div>

            <AddShipmentModal
                show={showModal}
                shipment={editingShipment}
                onClose={() => {
                    setShowModal(false);
                    setEditingShipment(null);
                }}
                onSave={saveShipment}
            />

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tracking ID</th>
                        <th>Customer</th>
                        <th>Origin</th>
                        <th>Destination</th>
                        <th>Status</th>
                        <th>Delivery Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {shipments.map((shipment) => (
                        <tr key={shipment.id}>
                            <td>{shipment.id}</td>
                            <td>{shipment.trackingId}</td>
                            <td>{shipment.customerName}</td>
                            <td>{shipment.origin}</td>
                            <td>{shipment.destination}</td>
                            <td>
                                <span className={`status ${shipment.status.toLowerCase()}`}>
                                    {shipment.status
                                        .toLowerCase()
                                        .replace("_", " ")
                                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                                </span>
                            </td>
                            <td>{shipment.deliveryDate}</td>
                            <td>
                                <button
                                    className="edit-btn"
                                    onClick={() => {
                                        setEditingShipment(shipment);
                                        setShowModal(true);
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(shipment.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ShipmentTable;
