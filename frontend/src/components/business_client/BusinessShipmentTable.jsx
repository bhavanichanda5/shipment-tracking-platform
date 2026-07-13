import "../../styles/ShipmentTable.css";

import { useEffect, useState } from "react";

import {
    getAllShipments
} from "../../services/businessService";

function BusinessShipmentTable({ searchTerm = "" }) {

    const [shipments, setShipments] = useState([]);

    useEffect(() => {

        loadShipments();

    }, []);

    const loadShipments = async () => {

        try {

            const data = await getAllShipments();

            setShipments(data);

        }

        catch (error) {

            console.log(error);

        }

    };

    return (

        <div className="table-card">

            <div className="table-header">

                <h2>My Shipments</h2>

            </div>

            <table>

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Tracking ID</th>

                        <th>Customer</th>

                        <th>Origin</th>

                        <th>Destination</th>

                        <th>Status</th>

                        <th>Shipment Date</th>

                        <th>Delivery Date</th>

                    </tr>

                </thead>

                <tbody>

                    {shipments
                        .filter((shipment) =>
                            !searchTerm ||
                            shipment.trackingId
                                ?.toLowerCase()
                                .includes(searchTerm.toLowerCase())
                        )
                        .map((shipment) => (

                            <tr key={shipment.id}>

                                <td>{shipment.id}</td>

                                <td>{shipment.trackingId}</td>

                                <td>{shipment.customerName}</td>

                                <td>{shipment.origin}</td>

                                <td>{shipment.destination}</td>

                                <td>

                                    {(() => {

                                        const raw = String(
                                            shipment.status || ""
                                        ).toUpperCase().trim();

                                        let statusKey;

                                        switch (raw) {

                                            case "IN_TRANSIT":
                                            case "IN TRANSIT":
                                            case "IN-TRANSIT":
                                                statusKey = "in_transit";
                                                break;

                                            case "DELIVERED":
                                                statusKey = "delivered";
                                                break;

                                            case "PENDING":
                                                statusKey = "pending";
                                                break;

                                            case "CANCELLED":
                                                statusKey = "cancelled";
                                                break;

                                            default:
                                                statusKey = raw
                                                    .toLowerCase()
                                                    .replace(/[^a-z0-9]+/g, "_");

                                        }

                                        const display = raw
                                            .toLowerCase()
                                            .replace(/_/g, " ")
                                            .replace(/\b\w/g, c => c.toUpperCase());

                                        return (

                                            <span className={`status ${statusKey}`}>

                                                {display}

                                            </span>

                                        );

                                    })()}

                                </td>

                                <td>{shipment.shipmentDate}</td>

                                <td>{shipment.deliveryDate}</td>

                            </tr>

                        ))}

                </tbody>

            </table>

        </div>

    );

}

export default BusinessShipmentTable;