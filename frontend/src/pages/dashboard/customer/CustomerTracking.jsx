import { useEffect, useState } from "react";

import { getShipmentTracking } from "../../../services/customerService";

import "../../../styles/Tracking.css";

function CustomerTracking({ trackingId }) {

    const [shipment, setShipment] = useState(null);

    useEffect(() => {

        if (trackingId) {

            loadShipment();

        }

    }, [trackingId]);

    const loadShipment = async () => {

        try {

            const response = await getShipmentTracking(trackingId);

            setShipment(response);

        }

        catch (error) {

            console.log(error);

        }

    };

    if (!trackingId) {

        return (

            <div
                style={{
                    padding: "40px",
                    textAlign: "center"
                }}
            >

                <h2>Select a shipment to track.</h2>

                <p>

                    Go to <b>Dashboard</b> and click the <b>Track</b> button.

                </p>

            </div>

        );

    }

    if (!shipment) {

        return <h2 style={{ padding: "30px" }}>Loading...</h2>;

    }

    return (

        <div className="tracking-container">

            <h2>Shipment Tracking</h2>

            <div className="tracking-card">

                <p>

                    <strong>Tracking ID :</strong> {shipment.trackingId}

                </p>

                <p>

                    <strong>Origin :</strong> {shipment.origin}

                </p>

                <p>

                    <strong>Destination :</strong> {shipment.destination}

                </p>

                <p>

                    <strong>Status :</strong> {shipment.status}

                </p>

                <p>

                    <strong>Shipment Date :</strong> {shipment.shipmentDate}

                </p>

                <p>

                    <strong>Delivery Date :</strong> {shipment.deliveryDate}

                </p>

                <hr />

                <h3>Shipment Progress</h3>

                <ul
                    style={{
                        listStyle: "none",
                        paddingLeft: 0,
                        lineHeight: "40px",
                        fontSize: "18px"
                    }}
                >

                    <li>✅ Shipment Created</li>

                    <li>✅ Picked Up</li>

                    <li>

                        {(shipment.status === "IN_TRANSIT" ||
                          shipment.status === "OUT_FOR_DELIVERY" ||
                          shipment.status === "DELIVERED")
                            ? "✅"
                            : "⭕"}{" "}

                        In Transit

                    </li>

                    <li>

                        {(shipment.status === "OUT_FOR_DELIVERY" ||
                          shipment.status === "DELIVERED")
                            ? "✅"
                            : "⭕"}{" "}

                        Out For Delivery

                    </li>

                    <li>

                        {shipment.status === "DELIVERED"
                            ? "✅"
                            : "⭕"}{" "}

                        Delivered

                    </li>

                </ul>

            </div>

        </div>

    );

}

export default CustomerTracking;