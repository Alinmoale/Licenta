package com.licenta.clinic.repository;

import com.licenta.clinic.model.Billing;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BillingRepository extends MongoRepository<Billing, String> {
    List<Billing> findByDoctorId(String doctorId);
    List<Billing> findByPatientId(String patientId);
}