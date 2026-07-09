import api from "./api";

export const getAllShipments = async () => {

    const response = await api.get("/shipments", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });

    return response.data;

};

export const addShipment = async (shipment) => {

    const response = await api.post(

        "/shipments",

        shipment,

        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }

    );

    return response.data;

};

export const updateShipment = async (id, shipment) => {

    const response = await api.put(

        `/shipments/${id}`,

        shipment,

        {
            headers: {
                Authorization:
                    `Bearer ${localStorage.getItem("token")}`
            }
        }

    );

    return response.data;

};

export const deleteShipment = async (id) => {
    const response = await api.delete(
        `/shipments/${id}`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }
    );

    return response.data;
};