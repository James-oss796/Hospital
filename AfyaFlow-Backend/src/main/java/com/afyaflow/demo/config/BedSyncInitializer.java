package com.afyaflow.demo.config;

import com.afyaflow.demo.model.Bed;
import com.afyaflow.demo.model.Ward;
import com.afyaflow.demo.repository.BedRepository;
import com.afyaflow.demo.repository.WardRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class BedSyncInitializer {

    @Bean
    public CommandLineRunner syncBeds(WardRepository wardRepository, BedRepository bedRepository) {
        return args -> {
            // Disabled for faster startup
        };
    }
}
