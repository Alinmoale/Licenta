package com.licenta.clinic.repository;

import com.licenta.clinic.model.Consultation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface ConsultationRepository extends MongoRepository<Consultation, String> {
    List<Consultation> findByDoctorId(String doctorId);
    List<Consultation> findByPatientId(String patientId);
    @Query("""
    SELECT MONTH(c.createdAt), COUNT(c)
    FROM Consultation c
    GROUP BY MONTH(c.createdAt)
    ORDER BY MONTH(c.createdAt)
    """)
    List<Object[]> getConsultationsByMonth();
}