package com.shiptrack.shipment.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "shipments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, updatable = false)
    private String trackingId;

    @Column(nullable = false)
    private String customerName;

    @Column(nullable = false)
    private String origin;

    @Column(nullable = false)
    private String destination;

    @Enumerated(EnumType.STRING)
    private ShipmentStatus status;

    private LocalDate shipmentDate;

    private LocalDate deliveryDate;

}