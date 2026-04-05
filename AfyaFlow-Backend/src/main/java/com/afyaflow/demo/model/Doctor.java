package com.afyaflow.demo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String specialization;

    private String station;

    private String shift;

    private String status;

    private Integer patientsSeenToday;

    private String phone;

    private String email;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

}
