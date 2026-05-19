package com.licenta.clinic.controller;

import com.licenta.clinic.dto.CreateConsultationRequest;
import com.licenta.clinic.model.Consultation;
import com.licenta.clinic.repository.ConsultationRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consultations")
public class ConsultationController {

    private final ConsultationRepository consultationRepository;

    public ConsultationController(ConsultationRepository consultationRepository) {
        this.consultationRepository = consultationRepository;
    }

    @PostMapping
    public Consultation createConsultation(@RequestBody CreateConsultationRequest request) {

        if (
                request.getPatientId() == null || request.getPatientId().isBlank() ||
                request.getDoctorId() == null || request.getDoctorId().isBlank() ||
                request.getSymptoms() == null || request.getSymptoms().isBlank() ||
                request.getDiagnosis() == null || request.getDiagnosis().isBlank() ||
                request.getTreatment() == null || request.getTreatment().isBlank() ||
                request.getRecommendations() == null || request.getRecommendations().isBlank()
        ) {
            throw new RuntimeException("All consultation fields are required");
        }

        Consultation consultation = new Consultation(
                request.getPatientId(),
                request.getDoctorId(),
                request.getSymptoms(),
                request.getDiagnosis(),
                request.getTreatment(),
                request.getRecommendations()
        );

        return consultationRepository.save(consultation);
    }

    @GetMapping("/doctor/{doctorId}")
    public List<Consultation> getByDoctor(@PathVariable String doctorId) {
        return consultationRepository.findByDoctorId(doctorId);
    }

    @GetMapping("/patient/{patientId}")
    public List<Consultation> getByPatient(@PathVariable String patientId) {
        return consultationRepository.findByPatientId(patientId);
    }
}