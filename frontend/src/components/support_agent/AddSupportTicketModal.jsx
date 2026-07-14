import { useEffect, useState } from "react";

import "../../styles/AddShipmentModal.css";

import {
    createTicket,
    updateTicket
} from "../../services/ticketService";

import { getAllShipments } from "../../services/supportService";

function AddSupportTicketModal({

    show,
    ticket,
    onClose,
    onSave

}) {

    const [shipments, setShipments] = useState([]);

    const [ticketData, setTicketData] = useState({

        customerName: "",
        subject: "",
        shipmentId: "",
        status: "OPEN"

    });

    useEffect(() => {

        if (show) {

            loadShipments();

        }

    }, [show]);

    useEffect(() => {

        if (ticket) {

            setTicketData({

                customerName: ticket.customerName || "",

                subject: ticket.subject || "",

                shipmentId:
                    ticket.shipment?.id ||
                    ticket.shipmentId ||
                    "",

                status: ticket.status || "OPEN"

            });

        }

        else {

            setTicketData({

                customerName: "",

                subject: "",

                shipmentId: "",

                status: "OPEN"

            });

        }

    }, [ticket]);

    const loadShipments = async () => {

        try {

            const data = await getAllShipments();

            console.log("Shipments =>", data);

            setShipments(data);

        } catch (error) {

            console.log(error);

        }

    };

    const handleChange = (e) => {

        setTicketData({

            ...ticketData,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            if (onSave) {

                onSave(ticketData);

            }

            else {

                if (ticket) {

                    await updateTicket(ticket.id, ticketData);

                    alert("Ticket Updated Successfully");

                }

                else {

                    await createTicket(ticketData);

                    alert("Ticket Created Successfully");

                }

                onClose();

            }

        }

        catch (error) {

            console.log(error);

            alert("Operation Failed");

        }

    };

    if (!show) return null;

    return (

        <div className="modal-overlay">

            <div className="modal">

                <h2>

                    {

                        ticket
                            ? "Update Support Ticket"
                            : "Create Support Ticket"

                    }

                </h2>

                <form onSubmit={handleSubmit}>

                    <input

                        type="text"

                        name="customerName"

                        placeholder="Customer Name"

                        value={ticketData.customerName}

                        onChange={handleChange}

                        required

                    />

                    <label>

                        Shipment

                    </label>

                    <select

                        name="shipmentId"

                        value={ticketData.shipmentId}

                        onChange={handleChange}

                        required

                    >

                        <option value="">

                            Select Shipment

                        </option>

                        {

                            shipments.map((shipment) => (

                                <option

                                    key={shipment.id}

                                    value={shipment.id}

                                >

                                    {shipment.trackingId}

                                </option>

                            ))

                        }

                    </select>

                    <input

                        type="text"

                        name="subject"

                        placeholder="Subject"

                        value={ticketData.subject}

                        onChange={handleChange}

                        required

                    />

                    <label>

                        Status

                    </label>

                    <select

                        name="status"

                        value={ticketData.status}

                        onChange={handleChange}

                    >

                        <option value="OPEN">

                            OPEN

                        </option>

                        <option value="IN_PROGRESS">

                            IN PROGRESS

                        </option>

                        <option value="RESOLVED">

                            RESOLVED

                        </option>

                        <option value="CLOSED">

                            CLOSED

                        </option>

                    </select>

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

                                ticket
                                    ? "Update Ticket"
                                    : "Create Ticket"

                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default AddSupportTicketModal;