package com.afyaflow.demo.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.afyaflow.demo.dto.BookAppointmentRequest;
import com.afyaflow.demo.model.Appointment;
import com.afyaflow.demo.service.AppointmentService;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService service;

    public AppointmentController(AppointmentService service){
        this.service = service;
    }

    /** Legacy endpoint used by afyaflow-react */
    @PostMapping("/legacy")
    public Appointment createAppointment(@RequestBody Appointment appointment){
        return service.createAppointment(appointment);
    }

    /** Get all appointments, optionally filtered by patientId or doctorId */
    @GetMapping
    public List<Appointment> getAppointments(
            @RequestParam(required = false) Long patientId,
            @RequestParam(required = false) Long doctorId) {
        if (patientId != null) {
            return service.getAppointmentsByPatient(patientId);
        } else if (doctorId != null) {
            return service.getAppointmentsByDoctor(doctorId);
        }
        return service.getAppointments();
    }

    /**
     * Returns available time slots for a doctor on a date.
     * Called by the new AfyaFlow-Frontend booking flow.
     * GET /api/appointments/available-slots?doctorId=1&date=2026-04-20
     */
    @GetMapping("/available-slots")
    public List<String> getAvailableSlots(
            @RequestParam(required = false) Long doctorId,
            @RequestParam(required = false) Long departmentId,
            @RequestParam String date) {
        System.out.println("DEBUG: getAvailableSlots called with doctorId=" + doctorId + ", departmentId=" + departmentId + ", date=" + date);
        if (doctorId != null) {
            return service.getAvailableSlots(doctorId, date);
        } else if (departmentId != null) {
            return service.getAvailableSlotsByDepartment(departmentId, date);
        }
        return List.of();
    }

    /**
     * Book an appointment for the currently logged-in patient.
     * Called by the new AfyaFlow-Frontend.
     * POST /api/appointments  { doctorId, departmentId, date, time }
     */
    @PostMapping
    public ResponseEntity<Appointment> bookAppointment(
            @RequestBody BookAppointmentRequest request,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        Appointment appt = service.bookAppointment(
            principal.getName(),
            request.getDoctorId(),
            request.getDepartmentId(),
            request.getDate(),
            request.getTime()
        );
        return ResponseEntity.ok(appt);
    }
}
