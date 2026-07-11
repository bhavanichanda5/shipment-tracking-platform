package com.shiptrack.admin.shipment.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.shiptrack.activity.service.ActivityService;
import com.shiptrack.admin.shipment.entity.Shipment;
import com.shiptrack.admin.shipment.repository.ShipmentRepository;

@Service
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final ActivityService activityService;

    public ShipmentService(ShipmentRepository shipmentRepository, ActivityService activityService) {

        this.shipmentRepository = shipmentRepository;
        this.activityService = activityService;

    }

    public List<Shipment> getAllShipments() {

        return shipmentRepository.findAll();

    }

    public Shipment addShipment(Shipment shipment) {

        if (shipment.getTrackingId() == null || shipment.getTrackingId().isBlank()) {
            shipment.setTrackingId(generateTrackingId());
        }

        Shipment saved = shipmentRepository.save(shipment);
        try {
            activityService.save(null, "SHIPMENT_CREATED", "Shipment " + saved.getTrackingId() + " created");
        } catch (Exception ignored) {}
        return saved;

    }

    public Shipment updateShipment(Long id, Shipment shipment) {

        Shipment existingShipment = shipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shipment not found"));

        
        existingShipment.setCustomerName(shipment.getCustomerName());
        existingShipment.setOrigin(shipment.getOrigin());
        existingShipment.setDestination(shipment.getDestination());
        existingShipment.setStatus(shipment.getStatus());
        existingShipment.setShipmentDate(shipment.getShipmentDate());
        existingShipment.setDeliveryDate(shipment.getDeliveryDate());

        Shipment saved = shipmentRepository.save(existingShipment);
        try {
            activityService.save(null, "SHIPMENT_UPDATED", "Shipment " + saved.getTrackingId() + " updated");
        } catch (Exception ignored) {}
        return saved;

    }

    public void deleteShipment(Long id) {
        if (!shipmentRepository.existsById(id)) {
            throw new RuntimeException("Shipment not found");
        }
        // capture tracking id for activity
        shipmentRepository.findById(id).ifPresent(s -> {
            try { activityService.save(null, "SHIPMENT_DELETED", "Shipment " + s.getTrackingId() + " deleted"); } catch (Exception ignored) {}
        });
        shipmentRepository.deleteById(id);
    }

    private String generateTrackingId() {
        return "TRK-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

}