package com.shiptrack.customer.dto;

import java.time.LocalDate;

import com.shiptrack.admin.shipment.entity.ShipmentStatus;

public class ShipmentTrackingResponse {

    private String trackingId;
    private String customerName;
    private String origin;
    private String destination;
    private ShipmentStatus status;
    private LocalDate shipmentDate;
    private LocalDate deliveryDate;

    public ShipmentTrackingResponse() {
    }

    public ShipmentTrackingResponse(
            String trackingId,
            String customerName,
            String origin,
            String destination,
            ShipmentStatus status,
            LocalDate shipmentDate,
            LocalDate deliveryDate) {

        this.trackingId = trackingId;
        this.customerName = customerName;
        this.origin = origin;
        this.destination = destination;
        this.status = status;
        this.shipmentDate = shipmentDate;
        this.deliveryDate = deliveryDate;
    }

    public String getTrackingId() {
        return trackingId;
    }

    public void setTrackingId(String trackingId) {
        this.trackingId = trackingId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public ShipmentStatus getStatus() {
        return status;
    }

    public void setStatus(ShipmentStatus status) {
        this.status = status;
    }

    public LocalDate getShipmentDate() {
        return shipmentDate;
    }

    public void setShipmentDate(LocalDate shipmentDate) {
        this.shipmentDate = shipmentDate;
    }

    public LocalDate getDeliveryDate() {
        return deliveryDate;
    }

    public void setDeliveryDate(LocalDate deliveryDate) {
        this.deliveryDate = deliveryDate;
    }
}