package com.afyaflow.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    // Used by old afyaflow-react frontend
    private String token;

    // Used by new AfyaFlow-Frontend
    private String accessToken;
    private String role;
    private Long userId;
}
