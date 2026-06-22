package com.licenta.clinic.controller;

import com.licenta.clinic.dto.BillingResponse;
import com.licenta.clinic.model.Billing;
import com.licenta.clinic.model.Consultation;
import com.licenta.clinic.model.Doctor;
import com.licenta.clinic.model.Patient;
import com.licenta.clinic.repository.BillingRepository;
import com.licenta.clinic.repository.ConsultationRepository;
import com.licenta.clinic.repository.DoctorRepository;
import com.licenta.clinic.repository.PatientRepository;
import com.licenta.clinic.service.EmailService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api/billing")
public class BillingController {

    private final BillingRepository billingRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final ConsultationRepository consultationRepository;
    private final EmailService emailService;

    public BillingController(
            BillingRepository billingRepository,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository,
            ConsultationRepository consultationRepository,
            EmailService emailService
    ) {
        this.billingRepository = billingRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.consultationRepository = consultationRepository;
        this.emailService = emailService;
    }

    @PostMapping
    public Billing create(@RequestBody Billing billing) {
        billing.setStatus("UNPAID");
        return billingRepository.save(billing);
    }

    @GetMapping
    public List<BillingResponse> getAll() {
        return billingRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @GetMapping("/doctor/{doctorId}")
    public List<BillingResponse> getByDoctor(@PathVariable String doctorId) {
        return billingRepository.findByDoctorId(doctorId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @GetMapping("/patient/{patientId}")
    public List<BillingResponse> getByPatient(@PathVariable String patientId) {
        return billingRepository.findByPatientId(patientId)
                .stream()
                .map(this::toResponse)
                .toList();
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

    private BillingResponse toResponse(Billing billing) {
        LocalDateTime consultationDate = null;

        if (billing.getConsultationId() != null && !billing.getConsultationId().isBlank()) {
            consultationDate = consultationRepository.findById(billing.getConsultationId())
                    .map(Consultation::getCreatedAt)
                    .orElse(null);
        }

        return new BillingResponse(
                billing.getId(),
                billing.getPatientId(),
                billing.getDoctorId(),
                billing.getConsultationId(),
                consultationDate,
                billing.getServiceName(),
                billing.getPrice(),
                billing.getStatus(),
                billing.getCreatedAt()
        );
    }

    @DeleteMapping("/{id}")
    public void deleteBilling(@PathVariable String id) {
        billingRepository.deleteById(id);
    }
}
