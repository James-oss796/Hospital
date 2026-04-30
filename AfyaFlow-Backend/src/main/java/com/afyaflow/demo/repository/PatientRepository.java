package com.afyaflow.demo.repository;

import com.afyaflow.demo.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByPhone(String phone);
    Optional<Patient> findByPatientCode(String patientCode);
    Optional<Patient> findByEmail(String email);
}
