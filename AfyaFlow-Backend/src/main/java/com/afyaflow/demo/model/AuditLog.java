package com.afyaflow.demo.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String actorUsername;

    private String actorRole;

    private String action; // e.g. PATIENT_VIEWED, STATUS_UPDATED, LOGIN, LOGOUT

    private String entityType; // e.g. Patient, Department, User

    private String entityId;

    @Column(length = 1000)
    private String details;

    private String ipAddress;

    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        if (this.timestamp == null) {
            this.timestamp = LocalDateTime.now();
        }
    }
}
