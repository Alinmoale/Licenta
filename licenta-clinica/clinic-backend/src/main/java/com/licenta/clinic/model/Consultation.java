package com.licenta.clinic.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "consultations")
public class Consultation {

    @Id
    private String id;

    private String patientId;
    private String doctorId;

    private String symptoms;
    private String diagnosis;
    private String treatment;
    private String recommendations;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Consultation() {}

    public Consultation(String patientId, String doctorId, String symptoms,
                        String diagnosis, String treatment, String recommendations) {
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.symptoms = symptoms;
        this.diagnosis = diagnosis;
        this.treatment = treatment;
        this.recommendations = recommendations;
    }

    public String getId() { return id; }
    public String getPatientId() { return patientId; }
    public String getDoctorId() { return doctorId; }
    public String getSymptoms() { return symptoms; }
    public String getDiagnosis() { return diagnosis; }
    public String getTreatment() { return treatment; }
    public String getRecommendations() { return recommendations; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setPatientId(String patientId) {
    this.patientId = patientId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }

    public void setSymptoms(String symptoms) {
        this.symptoms = symptoms;
    }

    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }

    public void setTreatment(String treatment) {
        this.treatment = treatment;
    }

    public void setRecommendations(String recommendations) {
        this.recommendations = recommendations;
    }
}