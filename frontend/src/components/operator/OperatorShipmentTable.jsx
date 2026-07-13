import "../../styles/ShipmentTable.css";

import { useEffect, useState } from "react";

import {
    getAllShipments,
    updateShipment
} from "../../services/operatorService";

import AddShipmentModal from "../AddShipmentModal";

function OperatorShipmentTable({ searchTerm = "" }) {

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

            await updateShipment(editingShipment.id, shipment);

            alert("Shipment Updated Successfully");

            loadShipments();

            setEditingShipment(null);

            setShowModal(false);

        } catch (error) {

            console.log(error);

            alert("Update Failed");

        }

    };

    return (

        <div className="table-card">

            <div className="table-header">

                <h2>Assigned Shipments</h2>

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

                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

                    {shipments
                        .filter((shipment) =>
                            !searchTerm ||
                            shipment.trackingId
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase())
                        )
                        .map((shipment) => (

                            <tr key={shipment.id}>

                                <td>{shipment.id}</td>

                                <td>{shipment.trackingId}</td>

                                <td>{shipment.customerName}</td>

                                <td>{shipment.origin}</td>

                                <td>{shipment.destination}</td>

                                <td>{shipment.status}</td>

                                <td>{shipment.deliveryDate}</td>

                                <td>

                                    <button
                                        className="edit-btn"
                                        onClick={() => {

                                            setEditingShipment(shipment);

                                            setShowModal(true);

                                        }}
                                    >
                                        Update
                                    </button>

                                </td>

                            </tr>

                        ))}

                </tbody>

            </table>

        </div>

    );

}

export default OperatorShipmentTable;