package com.shiptrack.support_agent.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.shiptrack.admin.shipment.entity.Shipment;
import com.shiptrack.admin.shipment.entity.ShipmentStatus;
import com.shiptrack.admin.shipment.repository.ShipmentRepository;
import com.shiptrack.admin.shipment.service.ShipmentService;
import com.shiptrack.support_agent.dto.SupportDashboardResponse;

@Service
public class SupportAgentService {

    private final ShipmentRepository shipmentRepository;
    private final ShipmentService shipmentService;

    public SupportAgentService(
            ShipmentRepository shipmentRepository,
            ShipmentService shipmentService) {

        this.shipmentRepository = shipmentRepository;
        this.shipmentService = shipmentService;
    }

    // ==========================
    // Dashboard Statistics
    // ==========================

    public SupportDashboardResponse getDashboard() {

        SupportDashboardResponse response =
                new SupportDashboardResponse();

        response.setTotalShipments(
                shipmentRepository.count());

        response.setActiveDeliveries(
                shipmentRepository.countByStatus(
                        ShipmentStatus.IN_TRANSIT));

        // Change this later when Ticket module is connected
        response.setOpenTickets(0);

        // Change this later when Ticket module is connected
        response.setResolvedToday(0);

        return response;
    }

    // ==========================
    // Get All Shipments
    // ==========================

    public List<Shipment> getAllShipments() {

        return shipmentRepository.findAll();

    }

    // ==========================
    // Update Shipment
    // ==========================

    public Shipment updateShipment(Long id, Shipment shipment) {

        return shipmentService.updateShipment(id, shipment);

    }

}