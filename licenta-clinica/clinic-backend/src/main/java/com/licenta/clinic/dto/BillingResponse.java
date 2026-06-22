package com.licenta.clinic.dto;

import java.time.LocalDateTime;

public class BillingResponse {

    private String id;
    private String patientId;
    private String doctorId;
    private String consultationId;
    private LocalDateTime consultationDate;
    private String serviceName;
    private double price;
    private String status;
    private LocalDateTime createdAt;

    public BillingResponse(
            String id,
            String patientId,
            String doctorId,
            String consultationId,
            LocalDateTime consultationDate,
            String serviceName,
            double price,
            String status,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.consultationId = consultationId;
        this.consultationDate = consultationDate;
        this.serviceName = serviceName;
        this.price = price;
        this.status = status;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public String getPatientId() { return patientId; }
    public String getDoctorId() { return doctorId; }
    public String getConsultationId() { return consultationId; }
    public LocalDateTime getConsultationDate() { return consultationDate; }
    public String getServiceName() { return serviceName; }
    public double getPrice() { return price; }
    public String getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
