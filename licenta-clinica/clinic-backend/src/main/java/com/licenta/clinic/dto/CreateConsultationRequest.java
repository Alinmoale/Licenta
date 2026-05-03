package com.licenta.clinic.dto;

public class CreateConsultationRequest {

    private String patientId;
    private String doctorId;

    private String symptoms;
    private String diagnosis;
    private String treatment;
    private String recommendations;

    public String getPatientId() { return patientId; }
    public String getDoctorId() { return doctorId; }
    public String getSymptoms() { return symptoms; }
    public String getDiagnosis() { return diagnosis; }
    public String getTreatment() { return treatment; }
    public String getRecommendations() { return recommendations; }
}