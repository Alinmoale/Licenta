package com.licenta.clinic.repository;

import com.licenta.clinic.model.Billing;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface BillingRepository extends MongoRepository<Billing, String> {
    List<Billing> findByDoctorId(String doctorId);
    List<Billing> findByPatientId(String patientId);
    @Query("""
    SELECT MONTH(b.createdAt), SUM(b.amount)
    FROM Billing b
    GROUP BY MONTH(b.createdAt)
    ORDER BY MONTH(b.createdAt)
    """)
    List<Object[]> getRevenueByMonth();
}