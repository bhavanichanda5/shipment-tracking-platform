import { useEffect, useMemo, useState } from "react";
import { getAllShipments } from "../../services/shipmentService";
import "../../styles/Reports.css";

function Reports() {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const loadShipments = async () => {
        setLoading(true);
        setError("");

        try {
            const data = await getAllShipments();
            setShipments(data);
        } catch (err) {
            console.error(err);
            setError("Unable to load shipments for reports.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadShipments();
    }, []);

    const filtered = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return shipments;

        return shipments.filter((shipment) =>
            [shipment.trackingId, shipment.customerName, shipment.origin, shipment.destination]
                .some((value) => String(value || "").toLowerCase().includes(term))
        );
    }, [searchTerm, shipments]);

    const downloadCsv = () => {
        const keys = [
            "id",
            "trackingId",
            "customerName",
            "origin",
            "destination",
            "status",
            "shipmentDate",
            "deliveryDate"
        ];
        const csvRows = [keys.join(",")];

        filtered.forEach((item) => {
            const row = keys.map((key) => {
                const value = item[key] ?? "";
                return `"${String(value).replace(/"/g, '""')}"`;
            });
            csvRows.push(row.join(","));
        });

        const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `shipment_report_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="reports-page">
            <div className="reports-header">
                <div>
                    <h1>Reports</h1>
                    <p>Generate downloadable shipment reports and browse delivery data.</p>
                </div>
                <button className="reports-download" onClick={downloadCsv} disabled={filtered.length === 0}>
                    Export CSV
                </button>
            </div>

            <div className="reports-search">
                <input
                    type="text"
                    placeholder="Search tracking ID, customer, origin, destination"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {error && <div className="reports-error">{error}</div>}

            <div className="reports-stat">
                <span>{filtered.length} shipments visible</span>
                <span>Total shipments: {shipments.length}</span>
            </div>

            <div className="reports-table">
                <div className="reports-row reports-row-header">
                    <div>ID</div>
                    <div>Tracking ID</div>
                    <div>Customer</div>
                    <div>Origin</div>
                    <div>Destination</div>
                    <div>Status</div>
                    <div>Shipment Date</div>
                    <div>Delivery Date</div>
                </div>
                {loading ? (
                    <div className="reports-row reports-loading">Loading shipments...</div>
                ) : filtered.length === 0 ? (
                    <div className="reports-row reports-empty">No shipment records found.</div>
                ) : (
                    filtered.map((shipment) => (
                        <div className="reports-row" key={shipment.id}>
                            <div>{shipment.id}</div>
                            <div>{shipment.trackingId}</div>
                            <div>{shipment.customerName}</div>
                            <div>{shipment.origin}</div>
                            <div>{shipment.destination}</div>
                            <div>{String(shipment.status || "").replace(/_/g, " ")}</div>
                            <div>{shipment.shipmentDate}</div>
                            <div>{shipment.deliveryDate}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Reports;
