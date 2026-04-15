package com.afyaflow.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.afyaflow.demo.model.Appointment;
import com.afyaflow.demo.repository.AppointmentRepository;

@Service
public class AppointmentService {

    private final AppointmentRepository repository;

    public AppointmentService(AppointmentRepository repository) {
        this.repository = repository;
    }

    public Appointment createAppointment(Appointment appointment) {
        return repository.save(appointment);
    }

    public List<Appointment> getAppointments() {
        return repository.findAll();
    }

    public List<Appointment> getAppointmentsByPatient(Long patientId) {
        return repository.findByPatientId(patientId);
    }

    public List<Appointment> getAppointmentsByDoctor(Long doctorId) {
        return repository.findByDoctorId(doctorId);
    }
}
