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
            List<Ward> wards = wardRepository.findAll();
            for (Ward ward : wards) {
                List<Bed> existingBeds = bedRepository.findByWardId(ward.getId());
                int currentCount = existingBeds.size();
                int targetCapacity = ward.getCapacity() != null ? ward.getCapacity() : 0;

                if (currentCount < targetCapacity) {
                    System.out.println("Syncing Ward: " + ward.getName() + ". Current beds: " + currentCount + ", Target: " + targetCapacity);
                    for (int i = currentCount + 1; i <= targetCapacity; i++) {
                        Bed bed = Bed.builder()
                                .bedNumber(String.valueOf(i))
                                .wardId(ward.getId())
                                .status("available")
                                .build();
                        bedRepository.save(bed);
                    }
                    System.out.println("Added " + (targetCapacity - currentCount) + " beds to " + ward.getName());
                }
            }
        };
    }
}
