package com.licenta.clinic.repository;

import com.licenta.clinic.model.Patient;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PatientRepository extends MongoRepository<Patient, String> {
    List<Patient> findByDoctorId(String doctorId);
}