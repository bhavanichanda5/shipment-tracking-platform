import { useEffect, useState } from "react";
import "../styles/AddShipmentModal.css";

function AddShipmentModal({

    show,
    shipment,
    onClose,
    onSave

}) {

    const [shipmentData, setShipmentData] = useState({

        customerName: "",
        origin: "",
        destination: "",
        status: "PENDING",
        shipmentDate: "",
        deliveryDate: ""

    });

    useEffect(() => {

        if (shipment) {

            setShipmentData({

                trackingId: shipment.trackingId,
                customerName: shipment.customerName,
                origin: shipment.origin,
                destination: shipment.destination,
                status: shipment.status,
                shipmentDate: shipment.shipmentDate,
                deliveryDate: shipment.deliveryDate

            });

        } else {

            setShipmentData({

                customerName: "",
                origin: "",
                destination: "",
                status: "PENDING",
                shipmentDate: "",
                deliveryDate: ""

            });

        }

    }, [shipment]);

    if (!show) return null;

    const handleChange = (e) => {

        setShipmentData({

            ...shipmentData,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        await onSave(shipmentData);

        if (!shipment) {

            setShipmentData({

                customerName: "",
                origin: "",
                destination: "",
                status: "PENDING",
                shipmentDate: "",
                deliveryDate: ""

            });

        }

    };

    return (

        <div className="modal-overlay">

            <div className="modal">

                <h2>

                    {

                        shipment

                            ? "Edit Shipment"

                            : "Add Shipment"

                    }

                </h2>

                <form onSubmit={handleSubmit}>

                    <input
                        name="customerName"
                        placeholder="Customer Name"
                        value={shipmentData.customerName}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="origin"
                        placeholder="Origin"
                        value={shipmentData.origin}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="destination"
                        placeholder="Destination"
                        value={shipmentData.destination}
                        onChange={handleChange}
                        required
                    />

                    <select
                        name="status"
                        value={shipmentData.status}
                        onChange={handleChange}
                    >

                        <option value="PENDING">
                            Pending
                        </option>

                        <option value="IN_TRANSIT">
                            In Transit
                        </option>

                        <option value="DELIVERED">
                            Delivered
                        </option>

                        <option value="CANCELLED">
                            Cancelled
                        </option>

                    </select>

                    <label>Shipment Date</label>

                    <input
                        type="date"
                        name="shipmentDate"
                        value={shipmentData.shipmentDate}
                        onChange={handleChange}
                        required
                    />

                    <label>Delivery Date</label>

                    <input
                        type="date"
                        name="deliveryDate"
                        value={shipmentData.deliveryDate}
                        onChange={handleChange}
                        required
                    />

                    <div className="modal-buttons">

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="save-btn"
                        >

                            {

                                shipment

                                    ? "Update Shipment"

                                    : "Save Shipment"

                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default AddShipmentModal;