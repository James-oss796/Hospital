package com.afyaflow.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.afyaflow.demo.model.Doctor;
import com.afyaflow.demo.repository.DoctorRepository;

@Service
@SuppressWarnings("null")
public class DoctorService {

    private final DoctorRepository repository;

    public DoctorService(DoctorRepository repository) {
        this.repository = repository;
    }

    public Doctor createDoctor(Doctor doctor) {
        return repository.save(doctor);
    }

    public List<Doctor> getDoctors() {
        return repository.findAll();
    }

    public Doctor getDoctor(Long id) {
        return repository.findById(id).orElse(null);
    }

    public List<Doctor> getDoctorsByDepartment(Long departmentId) {
        return repository.findByDepartmentId(departmentId);
    }
}
