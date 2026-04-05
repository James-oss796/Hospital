package com.afyaflow.demo.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String patientCode; // Maps to tokenId in frontend

    private String name;

    private String phone;

    private Integer age;

    private String gender;

    private String nationalId;

    private String reason;

    private String assignedDoctor;

    private String status;

    private String department;

    private String priority;

    private LocalDateTime registeredAt;

    private LocalDateTime servedAt;

    private String diagnosis;

    private String consultationNotes;

    // Automatically set registeredAt before saving
    @PrePersist
    protected void onCreate() {
        if (this.registeredAt == null) {
            this.registeredAt = LocalDateTime.now();
        }
    }
}
