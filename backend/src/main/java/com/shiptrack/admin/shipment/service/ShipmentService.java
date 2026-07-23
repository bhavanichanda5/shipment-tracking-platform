package com.shiptrack.admin.shipment.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shiptrack.activity.service.ActivityService;
import com.shiptrack.admin.shipment.entity.Shipment;
import com.shiptrack.admin.shipment.repository.ShipmentRepository;
import com.shiptrack.auth.repository.UserRepository;

//import com.shiptrack.auth.repository.UserRepository;
import com.shiptrack.auth.entity.User;

@Service
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final ActivityService activityService;

    @Autowired
    private UserRepository userRepository;

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

    if (shipment.getCustomerId() != null && shipment.getCustomerId().getId() != null) {
        // FIX: Pass the inner Long ID (.getId()) to the repository, not the object itself
        User customer = userRepository.findById(shipment.getCustomerId().getId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        shipment.setCustomerId(customer);
        shipment.setCustomerName(customer.getName());
    }

    Shipment saved = shipmentRepository.save(shipment);

    try {
        activityService.save(
                null,
                "SHIPMENT_CREATED",
                "Shipment " + saved.getTrackingId() + " created");
    } catch (Exception ignored) {}

    return saved;
}

public Shipment updateShipment(Long id, Shipment shipment) {
    Shipment existingShipment = shipmentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Shipment not found"));

    if (shipment.getCustomerId() != null && shipment.getCustomerId().getId() != null) {
        // FIX: Fetch the managed User from the database using the internal Long ID
        User customer = userRepository.findById(shipment.getCustomerId().getId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        existingShipment.setCustomerId(customer);
    } else {
        existingShipment.setCustomerId(null);
    }
    
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