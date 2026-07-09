package com.shiptrack.shipment.repository;

import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shiptrack.shipment.entity.Shipment;
import com.shiptrack.shipment.entity.ShipmentStatus;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {

    long countByStatus(ShipmentStatus status);

    long countByStatusAndDeliveryDate(
            ShipmentStatus status,
            LocalDate deliveryDate
    );

}