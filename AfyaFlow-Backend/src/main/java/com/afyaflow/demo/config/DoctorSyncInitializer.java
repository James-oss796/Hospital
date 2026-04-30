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
            // Disabled for faster startup
        };
    }
}
