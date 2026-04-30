package com.afyaflow.demo.dto;

import lombok.Data;

/**
 * DTO for the appointment booking request from the new AfyaFlow-Frontend.
 */
@Data
public class BookAppointmentRequest {
    private Long doctorId;
    private Long departmentId;
    private String date;  // YYYY-MM-DD
    private String time;  // HH:mm
}
