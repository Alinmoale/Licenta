package com.licenta.clinic.repository;

import com.licenta.clinic.model.DoctorUnavailability;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorUnavailabilityRepository
        extends MongoRepository<DoctorUnavailability, String> {

    List<DoctorUnavailability> findByDoctorId(String doctorId);
}