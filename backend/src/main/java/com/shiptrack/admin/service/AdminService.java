package com.shiptrack.admin.service;

import java.time.LocalDate;

import org.springframework.stereotype.Service;

import com.shiptrack.admin.dto.DashboardResponse;
import com.shiptrack.auth.repository.UserRepository;
import com.shiptrack.shipment.entity.ShipmentStatus;
import com.shiptrack.shipment.repository.ShipmentRepository;

@Service
public class AdminService {

    private final UserRepository userRepository;

    private final ShipmentRepository shipmentRepository;

    public AdminService(UserRepository userRepository,
                        ShipmentRepository shipmentRepository) {

        this.userRepository = userRepository;
        this.shipmentRepository = shipmentRepository;

    }

    public DashboardResponse getDashboardStats() {

        long totalUsers = userRepository.count();

        long totalShipments = shipmentRepository.count();

        long activeDeliveries =
                shipmentRepository.countByStatus(
                        ShipmentStatus.IN_TRANSIT
                );

        long deliveredToday =
                shipmentRepository.countByStatusAndDeliveryDate(
                        ShipmentStatus.DELIVERED,
                        LocalDate.now()
                );

        return DashboardResponse.builder()

                .totalUsers(totalUsers)

                .totalShipments(totalShipments)

                .activeDeliveries(activeDeliveries)

                .deliveredToday(deliveredToday)

                .build();

    }

}