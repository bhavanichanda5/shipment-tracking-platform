package com.shiptrack.shipment.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.shiptrack.shipment.entity.Shipment;
import com.shiptrack.shipment.repository.ShipmentRepository;

@Service
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;

    public ShipmentService(ShipmentRepository shipmentRepository) {

        this.shipmentRepository = shipmentRepository;

    }

    public List<Shipment> getAllShipments() {

        return shipmentRepository.findAll();

    }

    public Shipment addShipment(Shipment shipment) {

        if (shipment.getTrackingId() == null || shipment.getTrackingId().isBlank()) {
            shipment.setTrackingId(generateTrackingId());
        }

        return shipmentRepository.save(shipment);

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

        return shipmentRepository.save(existingShipment);

    }

    public void deleteShipment(Long id) {
        if (!shipmentRepository.existsById(id)) {
            throw new RuntimeException("Shipment not found");
        }
        shipmentRepository.deleteById(id);
    }

    private String generateTrackingId() {
        return "TRK-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

}