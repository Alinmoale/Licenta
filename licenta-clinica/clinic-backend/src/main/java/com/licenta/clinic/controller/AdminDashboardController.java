package com.licenta.clinic.controller;

import com.licenta.clinic.dto.DashboardResponse;
import com.licenta.clinic.repository.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final ConsultationRepository consultationRepository;
    private final BillingRepository billingRepository;

    public AdminDashboardController(
            DoctorRepository doctorRepository,
            PatientRepository patientRepository,
            ConsultationRepository consultationRepository,
            BillingRepository billingRepository
    ) {
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.consultationRepository = consultationRepository;
        this.billingRepository = billingRepository;
    }

    @GetMapping
    public DashboardResponse getDashboard() {

        long doctors = doctorRepository.count();
        long patients = patientRepository.count();
        long consultations = consultationRepository.count();

        double revenue = billingRepository.findAll().stream()
                .filter(b -> "PAID".equalsIgnoreCase(b.getStatus()))
                .mapToDouble(b -> b.getPrice())
                .sum();

        return new DashboardResponse(doctors, patients, consultations, revenue);
    }
}