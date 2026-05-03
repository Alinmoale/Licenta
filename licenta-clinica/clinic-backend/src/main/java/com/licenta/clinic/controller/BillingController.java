package com.licenta.clinic.controller;

import com.licenta.clinic.model.Billing;
import com.licenta.clinic.repository.BillingRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/billing")
public class BillingController {

    private final BillingRepository billingRepository;

    public BillingController(BillingRepository billingRepository) {
        this.billingRepository = billingRepository;
    }

    @PostMapping
    public Billing create(@RequestBody Billing billing) {
        return billingRepository.save(billing);
    }

    @GetMapping
    public List<Billing> getAll() {
        return billingRepository.findAll();
    }

    @GetMapping("/doctor/{doctorId}")
    public List<Billing> getByDoctor(@PathVariable String doctorId) {
        return billingRepository.findByDoctorId(doctorId);
    }

    @GetMapping("/patient/{patientId}")
    public List<Billing> getByPatient(@PathVariable String patientId) {
        return billingRepository.findByPatientId(patientId);
    }

    @GetMapping("/revenue")
    public double getRevenue() {
        return billingRepository.findAll().stream()
                .filter(b -> "PAID".equals(b.getStatus()))
                .mapToDouble(Billing::getPrice)
                .sum();
    }
}