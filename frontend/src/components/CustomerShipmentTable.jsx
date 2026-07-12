import { useEffect, useState } from "react";

import { getCustomerShipments } from "../services/customerService";

import "../styles/ShipmentTable.css";

function CustomerShipmentTable({ searchTerm, onTrack }) {

    const [shipments, setShipments] = useState([]);

    useEffect(() => {

        loadShipments();

    }, []);

    const loadShipments = async () => {

        try {

            const response = await getCustomerShipments();

            setShipments(response);

        }

        catch (error) {

            console.log(error);

        }

    };

    const filteredShipments = shipments.filter((shipment) =>

        shipment.trackingId
            .toLowerCase()
            .includes(searchTerm.toLowerCase())

    );

    return (

        <div className="shipment-table">

            <h2>My Shipments</h2>

            <table>

                <thead>

                    <tr>

                        <th>Tracking ID</th>

                        <th>Origin</th>

                        <th>Destination</th>

                        <th>Status</th>

                        <th>Shipment Date</th>

                        <th>Delivery Date</th>

                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

                    {filteredShipments.length > 0 ? (

                        filteredShipments.map((shipment) => (

                            <tr key={shipment.trackingId}>

                                <td>{shipment.trackingId}</td>

                                <td>{shipment.origin}</td>

                                <td>{shipment.destination}</td>

                                <td>

                                    <span
                                        className={`status ${shipment.status.toLowerCase()}`}
                                    >

                                        {shipment.status}

                                    </span>

                                </td>

                                <td>{shipment.shipmentDate}</td>

                                <td>{shipment.deliveryDate}</td>

                                <td>

                                    <button
                                        className="track-btn"
                                        onClick={() => onTrack(shipment.trackingId)}
                                    >
                                        Track
                                    </button>

                                </td>

                            </tr>

                        ))

                    ) : (

                        <tr>

                            <td colSpan="7">

                                No Shipments Found

                            </td>

                        </tr>

                    )}

                </tbody>

            </table>

        </div>

    );

}

export default CustomerShipmentTable;