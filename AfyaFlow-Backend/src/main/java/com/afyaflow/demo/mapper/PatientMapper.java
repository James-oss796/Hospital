package com.afyaflow.demo.mapper;

import java.util.List;

import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import com.afyaflow.demo.dto.PatientDTO;
import com.afyaflow.demo.model.Patient;

@Mapper(componentModel = "spring")
public interface PatientMapper {

    PatientMapper INSTANCE = Mappers.getMapper(PatientMapper.class);

    @Mapping(source = "patientCode", target = "tokenId")
    PatientDTO toDTO(Patient patient);

    @InheritInverseConfiguration
    Patient toEntity(PatientDTO dto);

    List<PatientDTO> toDTOList(List<Patient> patients);
}
