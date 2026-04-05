package com.afyaflow.demo.controller;

import com.afyaflow.demo.model.Bed;
import com.afyaflow.demo.model.Ward;
import com.afyaflow.demo.service.WardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wards")
public class WardController {

    @Autowired
    private WardService wardService;

    @GetMapping
    public List<Ward> getAllWards() {
        return wardService.getAllWards();
    }

    @GetMapping("/{wardId}/beds")
    public List<Bed> getBedsByWard(@PathVariable Long wardId) {
        return wardService.getBedsByWard(wardId);
    }

    @PutMapping("/beds/{bedId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'DOCTOR')")
    public Bed updateBedStatus(
            @PathVariable Long bedId,
            @RequestParam String status,
            @RequestParam(required = false) String patientId,
            @RequestParam(required = false) String patientName) {
        return wardService.updateBedStatus(bedId, status, patientId, patientName);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Ward createWard(@RequestBody Ward ward) {
        return wardService.saveWard(ward);
    }

    @PostMapping("/{wardId}/beds")
    @PreAuthorize("hasRole('ADMIN')")
    public Bed createBed(@PathVariable Long wardId, @RequestBody Bed bed) {
        bed.setWardId(wardId);
        return wardService.saveBed(bed);
    }
}
