package com.afyaflow.demo.controller;

import com.afyaflow.demo.dto.AuthRequest;
import com.afyaflow.demo.dto.AuthResponse;
import com.afyaflow.demo.model.AuthProvider;
import com.afyaflow.demo.model.Role;
import com.afyaflow.demo.model.User;
import com.afyaflow.demo.repository.RoleRepository;
import com.afyaflow.demo.repository.UserRepository;
import com.afyaflow.demo.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@SuppressWarnings("null")
public class AuthController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final com.afyaflow.demo.service.AuditService auditService;
    private final com.afyaflow.demo.service.DoctorService doctorService;

    public AuthController(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager, com.afyaflow.demo.service.AuditService auditService, com.afyaflow.demo.service.DoctorService doctorService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.auditService = auditService;
        this.doctorService = doctorService;
    }

    @PostMapping({"/register", "/signup"})
    public ResponseEntity<?> register(@RequestBody AuthRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Email already exists");
            return ResponseEntity.badRequest().body(response);
        }

        Role userRole;
        boolean adminExists = userRepository.existsByRoleName("ADMIN");
        
        if (!adminExists) {
            // If NO Admin exists in the whole system, this user becomes the Admin
            userRole = roleRepository.findByName("ADMIN").orElseGet(() -> {
                Role r = new Role();
                r.setName("ADMIN");
                return roleRepository.save(r);
            });
        } else if (request.getRole() != null) {
            String requestedRole = request.getRole().toUpperCase();
            userRole = roleRepository.findByName(requestedRole).orElseGet(() -> {
                Role r = new Role();
                r.setName(requestedRole);
                return roleRepository.save(r);
            });
        } else {
            // Default to USER for subsequent registrations if no role specified
            userRole = roleRepository.findByName("USER").orElseGet(() -> {
                Role r = new Role();
                r.setName("USER");
                return roleRepository.save(r);
            });
        }

        User user = User.builder()
                .username(request.getEmail())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(userRole)
                .department(request.getDepartment())
                .authProvider(AuthProvider.LOCAL)
                .build();

        userRepository.save(user);

        // Auto-create clinical profile for doctors
        if ("DOCTOR".equals(userRole.getName().toUpperCase())) {
            try {
                com.afyaflow.demo.model.Doctor doctor = com.afyaflow.demo.model.Doctor.builder()
                        .name(request.getEmail())
                        .email(request.getEmail())
                        .specialization("General")
                        .status("available")
                        .patientsSeenToday(0)
                        .build();
                doctorService.createDoctor(doctor);
            } catch (Exception e) {
                // Log but don't fail registration if profile creation fails
                System.err.println("Failed to create doctor profile: " + e.getMessage());
            }
        }

        auditService.log("USER_REGISTERED", "User", user.getId().toString(), "New user registered with email: " + user.getEmail() + " as role: " + userRole.getName());

        String token = jwtService.generateToken(user);
        return ResponseEntity.ok(AuthResponse.builder().token(token).build());
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        
        auditService.log("USER_LOGIN", "User", user.getId().toString(), "User logged in with email: " + user.getEmail());
        
        String token = jwtService.generateToken(user);
        return ResponseEntity.ok(AuthResponse.builder().token(token).build());
    }
}
