package com.afyaflow.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.afyaflow.demo.model.Doctor;
import com.afyaflow.demo.service.DoctorService;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService service;

    public DoctorController(DoctorService service){
        this.service = service;
    }

    @PostMapping
    public Doctor createDoctor(@RequestBody Doctor doctor){
        return service.createDoctor(doctor);
    }

    @GetMapping
    public List<Doctor> getDoctors(@RequestParam(required = false) Long departmentId){
        if (departmentId != null) {
            return service.getDoctorsByDepartment(departmentId);
        }
        return service.getDoctors();
    }

    @GetMapping("/{id}")
    public Doctor getDoctor(@PathVariable Long id){
        return service.getDoctor(id);
    }

    @PutMapping("/{id}")
    public Doctor updateDoctor(@PathVariable Long id, @RequestBody Doctor doctor){
        return service.updateDoctor(id, doctor);
    }

    @DeleteMapping("/{id}")
    public void deleteDoctor(@PathVariable Long id){
        service.deleteDoctor(id);
    }

    @PostMapping("/{id}/password")
    public org.springframework.http.ResponseEntity<?> updatePassword(@PathVariable Long id, @RequestBody java.util.Map<String, String> payload){
        String newPassword = payload.get("password");
        if (newPassword == null || newPassword.isBlank()) {
            return org.springframework.http.ResponseEntity.badRequest().body("Password cannot be empty");
        }
        boolean updated = service.updatePassword(id, newPassword);
        if (updated) {
            return org.springframework.http.ResponseEntity.ok("Password updated successfully");
        }
        return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.NOT_FOUND).body("Doctor or associated user not found");
    }
}
