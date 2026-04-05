package com.afyaflow.demo.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.afyaflow.demo.dto.PatientDTO;
import com.afyaflow.demo.exception.ResourceNotFoundException;
import com.afyaflow.demo.mapper.PatientMapper;
import com.afyaflow.demo.model.Patient;
import com.afyaflow.demo.repository.PatientRepository;

@Service
@SuppressWarnings("null")
public class PatientService {

    private final PatientRepository patientRepository;
    private final PatientMapper patientMapper;
    private final AuditService auditService;

    public PatientService(PatientRepository patientRepository, PatientMapper patientMapper, AuditService auditService) {
        this.patientRepository = patientRepository;
        this.patientMapper = patientMapper;
        this.auditService = auditService;
    }

    public PatientDTO registerPatient(PatientDTO patientDTO) {
        Patient patient = patientMapper.toEntity(patientDTO);
        
        // Generate patientCode (tokenId) if not present
        if (patient.getPatientCode() == null || patient.getPatientCode().isEmpty()) {
            patient.setPatientCode(generateTokenId());
        }
        
        if (patient.getStatus() == null) {
            patient.setStatus("queued"); // Default status
        }

        Patient saved = patientRepository.save(patient);
        
        auditService.log("PATIENT_REGISTERED", "Patient", saved.getId().toString(), 
                "New patient " + saved.getName() + " registered with token " + saved.getPatientCode());
        
        return patientMapper.toDTO(saved);
    }

    public List<PatientDTO> getAllPatients() {
        return patientRepository.findAll().stream()
                .map(patientMapper::toDTO)
                .collect(Collectors.toList());
    }

    public PatientDTO getPatient(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
        return patientMapper.toDTO(patient);
    }

    public PatientDTO updatePatientStatus(Long id, String status) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
        String oldStatus = patient.getStatus();
        patient.setStatus(status);
        Patient updated = patientRepository.save(patient);
        
        auditService.log("PATIENT_STATUS_UPDATED", "Patient", updated.getId().toString(), 
                "Status changed from " + oldStatus + " to " + status + " for patient " + updated.getName());
        
        return patientMapper.toDTO(updated);
    }

    public void deletePatient(Long id) {
        if (!patientRepository.existsById(id)) {
            throw new ResourceNotFoundException("Patient not found with id: " + id);
        }
        patientRepository.deleteById(id);
    }

    private String generateTokenId() {
        long count = patientRepository.count();
        return String.format("AFY-%03d", count + 1);
    }
}
