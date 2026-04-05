package com.afyaflow.demo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShiftRoster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String staffName;

    private String staffRole;

    private String department;

    private String shiftDate; // ISO date string e.g. 2026-04-04

    private String shiftStart; // e.g. 08:00

    private String shiftEnd;   // e.g. 16:00

    private String shiftType;  // Morning, Afternoon, Night, On-Call

    private String notes;
}
