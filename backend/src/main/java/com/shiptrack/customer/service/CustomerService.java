package com.shiptrack.customer.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.shiptrack.admin.shipment.entity.Shipment;
import com.shiptrack.admin.shipment.entity.ShipmentStatus;
import com.shiptrack.admin.shipment.repository.ShipmentRepository;
import com.shiptrack.auth.entity.User;
import com.shiptrack.auth.repository.UserRepository;
import com.shiptrack.customer.dto.CustomerDashboardResponse;
import com.shiptrack.customer.dto.CustomerProfileResponse;
import com.shiptrack.customer.dto.CustomerShipmentResponse;
import com.shiptrack.customer.dto.ShipmentTrackingResponse;
//import com.shiptrack.admin.shipment.entity.Shipment;

@Service
public class CustomerService {

    private final ShipmentRepository shipmentRepository;
    private final UserRepository userRepository;

    public CustomerService(ShipmentRepository shipmentRepository,
                           UserRepository userRepository) {

        this.shipmentRepository = shipmentRepository;
        this.userRepository = userRepository;
    }

    // ================= Dashboard =================

    public CustomerDashboardResponse getDashboard(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found"));

        List<Shipment> shipments = shipmentRepository.findByCustomerId(user);

        int total = shipments.size();

        int active = (int) shipments.stream()
                .filter(s -> s.getStatus() == ShipmentStatus.IN_TRANSIT)
                .count();

        int delivered = (int) shipments.stream()
                .filter(s -> s.getStatus() == ShipmentStatus.DELIVERED)
                .count();

        int pending = (int) shipments.stream()
                .filter(s -> s.getStatus() == ShipmentStatus.PENDING)
                .count();

        return new CustomerDashboardResponse(

                user.getUsername(),

                total,

                active,

                delivered,

                pending

        );
    }

    // ================= My Shipments =================

    public List<CustomerShipmentResponse> getMyShipments(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found"));

        return shipmentRepository.findByCustomerId(user)
                .stream()
                .map(shipment -> new CustomerShipmentResponse(

                        shipment.getTrackingId(),

                        shipment.getOrigin(),

                        shipment.getDestination(),

                        shipment.getStatus(),

                        shipment.getShipmentDate(),

                        shipment.getDeliveryDate()

                ))
                .collect(Collectors.toList());
    }

        public ShipmentTrackingResponse getTracking(String username, String trackingId) {

                User user = userRepository.findByUsername(username)
                        .orElseThrow(() ->
                                new UsernameNotFoundException("User not found"));

                Shipment shipment = shipmentRepository.findByTrackingId(trackingId)
                        .orElseThrow(() ->
                                new RuntimeException("Shipment not found"));

                // Security Check
                // Customer can only view their own shipment
                if (!shipment.getCustomerId().getId().equals(user.getId())) {

                        throw new RuntimeException("Access Denied");

                }

                return new ShipmentTrackingResponse(
                shipment.getTrackingId(),
                user.getUsername(),           // Pass the customer name here
                shipment.getOrigin(),         // Pass origin here
                shipment.getDestination(),    // Pass destination here
                shipment.getStatus(),
                shipment.getShipmentDate(),
                shipment.getDeliveryDate()
        );

        }

        public CustomerProfileResponse getProfile(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found"));

        return new CustomerProfileResponse(

                user.getId(),

                user.getUsername(),

                user.getRole().name().replace("_", " ")

        );

        }

}