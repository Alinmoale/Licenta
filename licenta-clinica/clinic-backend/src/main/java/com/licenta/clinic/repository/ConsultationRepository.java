package com.licenta.clinic.repository;

import com.licenta.clinic.model.Consultation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ConsultationRepository extends MongoRepository<Consultation, String> {
    List<Consultation> findByDoctorId(String doctorId);
    List<Consultation> findByPatientId(String patientId);
}