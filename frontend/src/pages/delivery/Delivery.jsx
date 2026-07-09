import { useEffect, useMemo, useState } from "react";
import { getAllShipments } from "../../services/shipmentService";
import "../../styles/Delivery.css";

function Delivery() {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [activeStatus, setActiveStatus] = useState("IN_TRANSIT");

    const loadShipments = async () => {
        setLoading(true);
        setError("");

        try {
            const data = await getAllShipments();
            setShipments(data);
        } catch (err) {
            console.error(err);
            setError("Unable to load delivery data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadShipments();
    }, []);

    const groupedShipments = useMemo(() => {
        return {
            pending: shipments.filter((shipment) => shipment.status === "PENDING"),
            inTransit: shipments.filter((shipment) => shipment.status === "IN_TRANSIT"),
            delivered: shipments.filter((shipment) => shipment.status === "DELIVERED"),
            cancelled: shipments.filter((shipment) => shipment.status === "CANCELLED")
        };
    }, [shipments]);

    const activeList = useMemo(() => {
        switch (activeStatus) {
            case "PENDING":
                return groupedShipments.pending;
            case "IN_TRANSIT":
                return groupedShipments.inTransit;
            case "DELIVERED":
                return groupedShipments.delivered;
            case "CANCELLED":
                return groupedShipments.cancelled;
            default:
                return shipments;
        }
    }, [activeStatus, groupedShipments, shipments]);

    return (
        <div className="delivery-page">
            <div className="delivery-header">
                <div>
                    <h1>Delivery Dashboard</h1>
                    <p>Track active deliveries and see shipment status grouped by delivery stage.</p>
                </div>
                <button className="refresh-btn" onClick={loadShipments} disabled={loading}>
                    {loading ? "Refreshing..." : "Refresh Deliveries"}
                </button>
            </div>

            <div className="delivery-summary-cards">
                <div className="summary-card">
                    <span>Scheduled</span>
                    <strong>{groupedShipments.pending.length}</strong>
                </div>
                <div className="summary-card">
                    <span>In Transit</span>
                    <strong>{groupedShipments.inTransit.length}</strong>
                </div>
                <div className="summary-card delivered-card">
                    <span>Delivered</span>
                    <strong>{groupedShipments.delivered.length}</strong>
                </div>
                <div className="summary-card cancelled-card">
                    <span>Cancelled</span>
                    <strong>{groupedShipments.cancelled.length}</strong>
                </div>
            </div>

            <div className="delivery-filters">
                {[
                    { key: "ALL", label: "All Deliveries" },
                    { key: "PENDING", label: "Scheduled" },
                    { key: "IN_TRANSIT", label: "In Transit" },
                    { key: "DELIVERED", label: "Delivered" },
                    { key: "CANCELLED", label: "Cancelled" }
                ].map((filter) => (
                    <button
                        key={filter.key}
                        className={filter.key === activeStatus ? "filter-btn active" : "filter-btn"}
                        onClick={() => setActiveStatus(filter.key)}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {error && <div className="delivery-error">{error}</div>}

            <div className="delivery-list">
                {activeList.length === 0 && !loading ? (
                    <div className="delivery-empty">No shipments found for this delivery status.</div>
                ) : (
                    activeList.map((shipment) => (
                        <div className="delivery-card" key={shipment.id}>
                            <div className="delivery-card-header">
                                <div>
                                    <h2>{shipment.trackingId}</h2>
                                    <span>{shipment.customerName}</span>
                                </div>
                                <div className={`status-pill ${String(shipment.status || "").toLowerCase()}`}>
                                    {String(shipment.status || "Unknown").replace(/_/g, " ")}
                                </div>
                            </div>
                            <div className="delivery-card-body">
                                <div>
                                    <label>Origin</label>
                                    <p>{shipment.origin || "—"}</p>
                                </div>
                                <div>
                                    <label>Destination</label>
                                    <p>{shipment.destination || "—"}</p>
                                </div>
                                <div>
                                    <label>Shipment Date</label>
                                    <p>{shipment.shipmentDate || "—"}</p>
                                </div>
                                <div>
                                    <label>Delivery Date</label>
                                    <p>{shipment.deliveryDate || "—"}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Delivery;
