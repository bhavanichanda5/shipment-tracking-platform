import { useEffect, useMemo, useState } from "react";
import { getAllShipments } from "../../services/shipmentService";
import "../../styles/Tracking.css";

function Tracking() {
    const [shipments, setShipments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [error, setError] = useState("");

    const loadShipments = async () => {
        setLoading(true);
        setError("");

        try {
            const data = await getAllShipments();
            setShipments(data);
            setLastUpdated(new Date());
        } catch (err) {
            console.error(err);
            setError("Unable to load shipment data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const trackingSteps = [
        { key: "order_confirmed", label: "Order Confirmed" },
        { key: "shipped", label: "Shipped" },
        { key: "out_for_delivery", label: "Out for Delivery" },
        { key: "delivered", label: "Delivered" }
    ];

    const getStepIndex = (status) => {
        const raw = String(status || "").toUpperCase().replace(/[- ]/g, "_");
        switch (raw) {
            case "PENDING":
                return 0;
            case "IN_TRANSIT":
                return 1;
            case "DELIVERED":
                return 3;
            case "CANCELLED":
                return -1;
            default:
                return 0;
        }
    };

    const getProgressValue = (status) => {
        const index = getStepIndex(status);
        if (index === -1) {
            return 0;
        }
        return (index / (trackingSteps.length - 1)) * 100;
    };

    const getStepState = (status, stepIndex) => {
        const index = getStepIndex(status);
        if (status === "CANCELLED") {
            return stepIndex === 0 ? "completed" : "cancelled";
        }

        if (index === stepIndex) {
            return "active";
        }
        if (index > stepIndex) {
            return "completed";
        }
        return "upcoming";
    };

    useEffect(() => {
        loadShipments();
        const interval = setInterval(() => {
            loadShipments();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const filteredShipments = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;

        const containsSearchTerm = (shipment) => {
            if (!term) return true;
            return [
                shipment.trackingId,
                shipment.customerName,
                shipment.origin,
                shipment.destination
            ].some((value) =>
                String(value || "").toLowerCase().includes(term)
            );
        };

        const isWithinDateRange = (shipment) => {
            const dateValue = shipment.shipmentDate ? new Date(shipment.shipmentDate) : null;
            if (!dateValue || isNaN(dateValue)) {
                return true;
            }

            if (from && dateValue < from) {
                return false;
            }
            if (to && dateValue > to) {
                return false;
            }
            return true;
        };

        return shipments
            .filter((shipment) => containsSearchTerm(shipment) && isWithinDateRange(shipment))
            .sort((a, b) => {
                const dateA = a.shipmentDate ? new Date(a.shipmentDate) : new Date(0);
                const dateB = b.shipmentDate ? new Date(b.shipmentDate) : new Date(0);
                return dateB - dateA;
            });
    }, [searchTerm, fromDate, toDate, shipments]);

    return (
        <div className="tracking-view">
            <div className="tracking-header">
                <div>
                    <h1>Live Shipment Tracking</h1>
                    <p>Search by Tracking ID, customer or route to see shipment status refreshed in real time.</p>
                </div>
                <div className="tracking-meta">
                    <span className="meta-label">Auto refresh:</span>
                    <span>{lastUpdated ? lastUpdated.toLocaleTimeString() : "Loading..."}</span>
                </div>
            </div>

            <div className="tracking-search-panel">
                <input
                    type="text"
                    placeholder="Enter Tracking ID or customer name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="tracking-date-controls">
                    <label>
                        From
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                    </label>
                    <label>
                        To
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </label>
                </div>
                <button onClick={loadShipments} disabled={loading}>
                    Refresh Now
                </button>
            </div>

            {error && <div className="tracking-error">{error}</div>}

            <div className="tracking-summary">
                <div>
                    <strong>{filteredShipments.length}</strong>
                    <span> Matching shipments</span>
                </div>
                <div>
                    <strong>{shipments.length}</strong>
                    <span> Total shipments</span>
                </div>
            </div>

            <div className="tracking-list">
                {loading && <div className="tracking-loading">Updating shipment location and status...</div>}

                {!loading && filteredShipments.length === 0 && (
                    <div className="tracking-empty">No shipments found for the current search.</div>
                )}

                {filteredShipments.map((shipment) => (
                    <div className="tracking-card" key={shipment.id}>
                        <div className="tracking-card-header">
                            <div>
                                <h2>{shipment.trackingId}</h2>
                                <span>{shipment.customerName}</span>
                            </div>
                            <div className={`status-pill ${String(shipment.status || "").toLowerCase()}`}>
                                {String(shipment.status || "Unknown").replace(/_/g, " ")}
                            </div>
                        </div>

                        <div className="tracking-card-body">
                            <div>
                                <label>Origin</label>
                                <p>{shipment.origin || "—"}</p>
                            </div>
                            <div>
                                <label>Destination</label>
                                <p>{shipment.destination || "—"}</p>
                            </div>
                            <div>
                                <label>Shipped</label>
                                <p>{shipment.shipmentDate || "—"}</p>
                            </div>
                            <div>
                                <label>Delivery</label>
                                <p>{shipment.deliveryDate || "—"}</p>
                            </div>
                        </div>

                        <div className="tracking-steps">
                            <div className="tracking-step-line">
                                <div
                                    className="tracking-step-progress"
                                    style={{ width: `${getProgressValue(shipment.status)}%` }}
                                />
                                {trackingSteps.map((step, index) => {
                                    const state = getStepState(shipment.status, index);
                                    return (
                                        <div
                                            key={step.key}
                                            className={`tracking-step-dot ${state}`}
                                            style={{ left: `${(index / (trackingSteps.length - 1)) * 100}%` }}
                                        />
                                    );
                                })}
                            </div>
                            <div className="tracking-step-labels">
                                {trackingSteps.map((step) => (
                                    <div className="tracking-step-label" key={step.key}>
                                        {step.label}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="tracking-card-footer">
                            <div>Last refresh: {lastUpdated ? lastUpdated.toLocaleTimeString() : "—"}</div>
                            <div>Current status updates live every 5 seconds.</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Tracking;
