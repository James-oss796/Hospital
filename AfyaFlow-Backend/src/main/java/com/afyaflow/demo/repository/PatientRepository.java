package com.afyaflow.demo.repository;

import com.afyaflow.demo.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import org.springframework.stereotype.Repository;
@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    // Find a patient by phone number
    Optional<Patient> findByPhone(String phone);

    // Optional: find by patient code
    Optional<Patient> findByPatientCode(String patientCode);
}
