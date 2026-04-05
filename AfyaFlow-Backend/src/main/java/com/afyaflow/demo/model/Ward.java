package com.afyaflow.demo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Ward {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String department;

    private String type; // general, icu, maternity, surgical, hdu

    private Integer capacity;

    @OneToMany(mappedBy = "wardId", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @Builder.Default
    private java.util.List<Bed> beds = new java.util.ArrayList<>();
}
