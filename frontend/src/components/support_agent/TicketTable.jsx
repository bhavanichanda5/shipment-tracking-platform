import "../../styles/ShipmentTable.css";

import { useEffect, useState } from "react";

import AddSupportTicketModal from "./AddSupportTicketModal";

import {
    getAllTickets,
    deleteTicket
} from "../../services/ticketService";

function TicketTable() {

    const [tickets, setTickets] = useState([]);

    const [showModal, setShowModal] = useState(false);

    const [editingTicket, setEditingTicket] = useState(null);

    useEffect(() => {

        loadTickets();

    }, []);

   const loadTickets = async () => {

        try {

            const data = await getAllTickets();

            console.log("Tickets =>", data);

            setTickets(data);

        }

        catch (error) {

            console.log(error);

        }

    };

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this Ticket?")) {

            return;

        }

        try {

            await deleteTicket(id);

            alert("Ticket Deleted Successfully");

            loadTickets();

        }

        catch (error) {

            console.log(error);

            alert("Delete Failed");

        }

    };

    return (

        <div className="table-card">

            <div className="table-header">

                <h2>

                    Support Tickets

                </h2>

                <button

                    className="add-btn"

                    onClick={() => {

                        setEditingTicket(null);

                        setShowModal(true);

                    }}

                >

                    + Add Ticket

                </button>

            </div>

            <AddSupportTicketModal

                show={showModal}

                ticket={editingTicket}

                onClose={() => {

                    setShowModal(false);

                    setEditingTicket(null);

                    loadTickets();

                }}

            />

            <table>

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Customer</th>

                        <th>Tracking ID</th>

                        <th>Subject</th>

                        <th>Status</th>

                        <th>Assigned To</th>

                        <th>Created</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        tickets.map((ticket) => (

                            <tr key={ticket.id}>

                                <td>

                                    {ticket.id}

                                </td>

                                <td>

                                    {ticket.customerName}

                                </td>

                                <td>

                                    {ticket.trackingId}

                                </td>

                                <td>

                                    {ticket.subject}

                                </td>

                                <td>
                                    {ticket.status}
                                </td>

                                <td>

                                    {ticket.assignedToName || "-"}

                                </td>

                                <td>

                                    {

                                        ticket.createdAt
                                            ?.substring(0, 10)

                                    }

                                </td>

                                <td>

                                    <button

                                        className="edit-btn"

                                        onClick={() => {

                                            setEditingTicket(ticket);

                                            setShowModal(true);

                                        }}

                                    >

                                        Edit

                                    </button>

                                    <button

                                        className="delete-btn"

                                        onClick={() =>

                                            handleDelete(ticket.id)

                                        }

                                    >

                                        Delete

                                    </button>

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

}

export default TicketTable;