package com.shiptrack.admin.shipment.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
//import java.util.UUID;

import com.shiptrack.auth.entity.User;

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

    @Column(nullable = true)
private String receiverName;

    @Column(nullable = false)
    private String origin;

    @Column(nullable = false)
    private String destination;

    @Enumerated(EnumType.STRING)
    private ShipmentStatus status;

    private LocalDate shipmentDate;

    private LocalDate deliveryDate;

   @ManyToOne
    @JoinColumn(name = "customer_id")
    private User customerId;
    

}