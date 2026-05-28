package com.licenta.clinic.controller;

import com.licenta.clinic.dto.DashboardResponse;
import com.licenta.clinic.repository.*;

import java.util.HashMap;
import java.util.Map;

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

    @GetMapping("/charts")
    public Map<String, Object> getCharts() {

        Map<Integer, Double> revenueByMonth = new HashMap<>();
        Map<Integer, Long> consultationsByMonth = new HashMap<>();

        billingRepository.findAll().forEach(billing -> {
            if ("PAID".equalsIgnoreCase(billing.getStatus()) && billing.getCreatedAt() != null) {

                int month = billing.getCreatedAt().getMonthValue();

                revenueByMonth.put(
                        month,
                        revenueByMonth.getOrDefault(month, 0.0) + billing.getPrice()
                );
            }
        });

        consultationRepository.findAll().forEach(consultation -> {
            if (consultation.getCreatedAt() != null) {

                int month = consultation.getCreatedAt().getMonthValue();

                consultationsByMonth.put(
                        month,
                        consultationsByMonth.getOrDefault(month, 0L) + 1
                );
            }
        });

        Map<String, Object> response = new HashMap<>();

        response.put("revenue", revenueByMonth);
        response.put("consultations", consultationsByMonth);

        return response;
    }
}