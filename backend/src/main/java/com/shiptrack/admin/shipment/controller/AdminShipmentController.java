package com.shiptrack.admin.shipment.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.shiptrack.admin.shipment.entity.Shipment;
import com.shiptrack.admin.shipment.service.ShipmentService;

@RestController
@RequestMapping("/api/shipments")
public class AdminShipmentController {

    private final ShipmentService shipmentService;

    public AdminShipmentController(ShipmentService shipmentService) {

        this.shipmentService = shipmentService;

    }

    @GetMapping
    public List<Shipment> getAllShipments() {

        return shipmentService.getAllShipments();

    }

    @PostMapping
    public Shipment addShipment(@RequestBody Shipment shipment) {

        return shipmentService.addShipment(shipment);

    }

    @PutMapping("/{id}")
    public Shipment updateShipment(

            @PathVariable Long id,

            @RequestBody Shipment shipment

    ) {

        return shipmentService.updateShipment(id, shipment);

    }

    @DeleteMapping("/{id}")
    public void deleteShipment(@PathVariable Long id) {
        shipmentService.deleteShipment(id);
    }

}