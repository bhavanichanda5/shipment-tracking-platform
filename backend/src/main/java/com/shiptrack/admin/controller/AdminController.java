package com.shiptrack.admin.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shiptrack.admin.dto.DashboardResponse;
import com.shiptrack.admin.service.AdminService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {

        this.adminService = adminService;

    }

    @GetMapping("/dashboard")
    public DashboardResponse dashboard() {

        return adminService.getDashboardStats();

    }

}