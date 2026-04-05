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
    public ResponseEntity<AuthResponse> register(@RequestBody AuthRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().build(); // Email already exists
        }

        Role userRole;
        String requestedRole = request.getRole() != null ? request.getRole().toUpperCase() : "USER";
        
        if (request.getRole() != null) {
            userRole = roleRepository.findByName(requestedRole).orElseGet(() -> {
                Role r = new Role();
                r.setName(requestedRole);
                return roleRepository.save(r);
            });
        } else if (userRepository.count() == 0) {
            // First user gets Admin role
            userRole = roleRepository.findByName("ADMIN").orElseGet(() -> {
                Role r = new Role();
                r.setName("ADMIN");
                return roleRepository.save(r);
            });
        } else {
            // Subsequent open registrations default to USER
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
            com.afyaflow.demo.model.Doctor doctor = com.afyaflow.demo.model.Doctor.builder()
                    .name(request.getEmail())
                    .email(request.getEmail())
                    .specialization("General")
                    .status("available")
                    .patientsSeenToday(0)
                    .build();
            doctorService.createDoctor(doctor);
        }

        auditService.log("USER_REGISTERED", "User", user.getId().toString(), "New user registered with email: " + user.getEmail());

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
