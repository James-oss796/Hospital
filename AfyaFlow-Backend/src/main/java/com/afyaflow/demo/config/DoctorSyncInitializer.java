package com.afyaflow.demo.config;

import com.afyaflow.demo.model.Doctor;
import com.afyaflow.demo.model.User;
import com.afyaflow.demo.repository.DoctorRepository;
import com.afyaflow.demo.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DoctorSyncInitializer {

    @Bean
    public CommandLineRunner syncDoctors(UserRepository userRepository, DoctorRepository doctorRepository) {
        return args -> {
            List<User> doctors = userRepository.findAll().stream()
                    .filter(u -> u.getRole() != null && "DOCTOR".equals(u.getRole().getName().toUpperCase()))
                    .toList();

            for (User user : doctors) {
                java.util.Optional<Doctor> existing = doctorRepository.findByEmail(user.getEmail());
                if (existing.isEmpty()) {
                    System.out.println("Syncing clinical profile for Doctor: " + user.getEmail());
                    Doctor doctor = Doctor.builder()
                            .name(user.getUsername())
                            .email(user.getEmail())
                            .specialization("General")
                            .status("available")
                            .patientsSeenToday(0)
                            .build();
                    doctorRepository.save(doctor);
                } else {
                    Doctor doc = existing.get();
                    if ("Available".equals(doc.getStatus())) {
                        doc.setStatus("available");
                        doctorRepository.save(doc);
                    }
                }
            }
        };
    }
}
