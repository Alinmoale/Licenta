package com.licenta.clinic.controller;

import com.licenta.clinic.model.Billing;
import com.licenta.clinic.model.Doctor;
import com.licenta.clinic.model.Patient;
import com.licenta.clinic.repository.BillingRepository;
import com.licenta.clinic.repository.DoctorRepository;
import com.licenta.clinic.repository.PatientRepository;
import com.licenta.clinic.service.EmailService;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api/billing")
public class BillingController {

    private final BillingRepository billingRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final EmailService emailService;

    public BillingController(
            BillingRepository billingRepository,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository,
            EmailService emailService
    ) {
        this.billingRepository = billingRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.emailService = emailService;
    }

    @PostMapping
    public Billing create(@RequestBody Billing billing) {
        billing.setStatus("UNPAID");
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
    @PutMapping("/{id}/status")
    public Billing updateBillingStatus(
            @PathVariable String id,
            @RequestParam String status
    ) {
        Billing billing = billingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Billing not found"));

        billing.setStatus(status);

        return billingRepository.save(billing);
    }
    @PostMapping("/{id}/send-invoice")
    public String sendInvoice(@PathVariable String id) {
        Billing billing = billingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Billing not found"));

        if (!"PAID".equals(billing.getStatus())) {
            throw new RuntimeException("Invoice can only be sent for paid billing records");
        }

        Patient patient = patientRepository.findById(billing.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Doctor doctor = doctorRepository.findById(billing.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        String patientName = patient.getFirstName() + " " + patient.getLastName();
        String doctorName = "Dr. " + doctor.getFirstName() + " " + doctor.getLastName();
        String billingDate = billing.getCreatedAt() == null
                ? "-"
                : billing.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));

        emailService.sendInvoiceEmail(
                patient.getEmail(),
                patientName,
                doctorName,
                billing.getServiceName(),
                formatAmount(billing.getPrice()),
                billing.getStatus(),
                billingDate
        );

        return "Invoice sent successfully";
    }

    private String formatAmount(double amount) {
        if (amount == Math.floor(amount)) {
            return String.valueOf((long) amount);
        }

        return String.format(Locale.US, "%.2f", amount);
    }

    @DeleteMapping("/{id}")
    public void deleteBilling(@PathVariable String id) {
        billingRepository.deleteById(id);
    }
}
