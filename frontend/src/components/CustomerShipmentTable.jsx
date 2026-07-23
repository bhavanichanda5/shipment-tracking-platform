import { useEffect, useState, useMemo } from "react";
import { getCustomerShipments } from "../services/customerService";
import "../styles/ShipmentTable.css";

const ITEMS_PER_PAGE = 5;

function CustomerShipmentTable({ searchTerm = "", onTrack, onAddShipment }) {
    const [shipments, setShipments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const [formData, setFormData] = useState({
        sender: "",
        receiver: "",
        origin: "",
        destination: ""
    });

    useEffect(() => {
        loadShipments();
    }, []);

    const loadShipments = async () => {
        try {
            const response = await getCustomerShipments();
            setShipments(response || []);
        } catch (error) {
            console.error("Failed to fetch shipments:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreateShipment = async (e) => {
        e.preventDefault();

        if (!formData.sender || !formData.receiver || !formData.origin || !formData.destination) {
            alert("Please fill in all fields");
            return;
        }

        try {
            const savedShipment = await createCustomerShipment(formData);

            setShipments((prev) => [savedShipment, ...prev]);

            if (onAddShipment) {
                onAddShipment(savedShipment);
            }

            setFormData({ sender: "", receiver: "", origin: "", destination: "" });
            setIsModalOpen(false);
        } catch (error) {
            console.error("Backend Error Details:", error.response?.data || error.message);
            alert("Failed to create shipment: " + (error.response?.data?.message || error.message));
        }
    };

    // --- Memoized Filtering ---
    const filteredShipments = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        if (!query) return shipments;
        return shipments.filter((shipment) =>
            shipment.trackingId?.toLowerCase().includes(query)
        );
    }, [shipments, searchTerm]);

    // Reset page on search or data change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, shipments.length]);

    // --- Memoized Pagination Calculations ---
    const totalPages = Math.ceil(filteredShipments.length / ITEMS_PER_PAGE) || 1;

    const currentShipments = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredShipments.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredShipments, currentPage]);

    const startEntry = filteredShipments.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endEntry = Math.min(currentPage * ITEMS_PER_PAGE, filteredShipments.length);

    // --- Helper for Smart Page Number Window ---
    const getPageNumbers = () => {
        const pages = [];
        const maxVisibleButtons = 5;

        if (totalPages <= maxVisibleButtons) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            let startPage = Math.max(1, currentPage - 1);
            let endPage = Math.min(totalPages, currentPage + 1);

            if (currentPage <= 2) {
                endPage = 3;
            } else if (currentPage >= totalPages - 1) {
                startPage = totalPages - 2;
            }

            if (startPage > 1) pages.push(1, "...");
            for (let i = startPage; i <= endPage; i++) pages.push(i);
            if (endPage < totalPages) pages.push("...", totalPages);
        }

        return pages;
    };

    return (
        <div className="table-card">
            {/* Table Header */}
            <div className="table-header">
                <div className="table-title-group">
                    <h2>My Shipments</h2>
                    <span className="count-badge">{filteredShipments.length} total</span>
                </div>
                <button className="add-btn" onClick={() => setIsModalOpen(true)}>
                    + Add Shipment
                </button>
            </div>

            {/* Table */}
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
                    {currentShipments.length > 0 ? (
                        currentShipments.map((shipment) => (
                            <tr key={shipment.trackingId}>
                                <td><strong>{shipment.trackingId}</strong></td>
                                <td>{shipment.origin}</td>
                                <td>{shipment.destination}</td>
                                <td>
                                    <span className={`status ${shipment.status?.toLowerCase().replace(/\s+/g, '_')}`}>
                                        {shipment.status}
                                    </span>
                                </td>
                                <td>{shipment.shipmentDate || "N/A"}</td>
                                <td>{shipment.deliveryDate || "N/A"}</td>
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
                            <td colSpan="7" style={{ textAlign: "center", padding: "28px", color: "#64748b" }}>
                                No Shipments Found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* --- Pagination Footer --- */}
            {filteredShipments.length > 0 && (
                <div className="pagination-container">
                    <span className="pagination-info">
                        Showing <strong>{startEntry}</strong> to <strong>{endEntry}</strong> of <strong>{filteredShipments.length}</strong> entries
                    </span>

                    <div className="pagination-controls">
                        <button
                            className="pagination-btn"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            &larr; Previous
                        </button>

                        <div className="pagination-numbers">
                            {getPageNumbers().map((page, idx) =>
                                page === "..." ? (
                                    <span key={`ellipsis-${idx}`} className="pagination-ellipsis">
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        key={`page-${page}`}
                                        className={`pagination-number ${currentPage === page ? "active" : ""}`}
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </button>
                                )
                            )}
                        </div>

                        <button
                            className="pagination-btn"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next &rarr;
                        </button>
                    </div>
                </div>
            )}

            {/* Modal Pop-up */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Create New Shipment</h3>
                        <form onSubmit={handleCreateShipment}>
                            <div className="form-group">
                                <label>Sender</label>
                                <input
                                    type="text"
                                    name="sender"
                                    placeholder="Sender Name"
                                    value={formData.sender}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Receiver</label>
                                <input
                                    type="text"
                                    name="receiver"
                                    placeholder="Receiver Name"
                                    value={formData.receiver}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Origin</label>
                                <input
                                    type="text"
                                    name="origin"
                                    placeholder="Origin City / Address"
                                    value={formData.origin}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Destination</label>
                                <input
                                    type="text"
                                    name="destination"
                                    placeholder="Destination City / Address"
                                    value={formData.destination}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="submit-btn">
                                    Create Shipment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CustomerShipmentTable;