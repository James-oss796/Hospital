package com.afyaflow.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for the patient self-registration request coming from the new AfyaFlow-Frontend.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String password;
    private String dob;       // YYYY-MM-DD
    private String gender;    // MALE | FEMALE | OTHER
    private String address;
    private String nationalId;
    private Long departmentId;
    // Optional: role override (only respected for admin-created staff accounts)
    private String role;
}
