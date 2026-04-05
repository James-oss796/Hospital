package com.afyaflow.demo.controller;

import com.afyaflow.demo.model.AuditLog;
import com.afyaflow.demo.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
@PreAuthorize("hasRole('ADMIN')")
public class AuditLogController {

    @Autowired
    private AuditService auditService;

    @GetMapping
    public List<AuditLog> getAllLogs() {
        return auditService.getAllLogs();
    }
}
