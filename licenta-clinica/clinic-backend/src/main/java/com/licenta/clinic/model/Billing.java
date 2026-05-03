package com.licenta.clinic.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "billing")
public class Billing {

    @Id
    private String id;

    private String patientId;
    private String doctorId;
    private String consultationId;

    private String serviceName;
    private double price;

    private String status; // PAID / UNPAID

    private LocalDateTime createdAt = LocalDateTime.now();

    public Billing() {}

    public Billing(String patientId, String doctorId, String consultationId,
                   String serviceName, double price, String status) {
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.consultationId = consultationId;
        this.serviceName = serviceName;
        this.price = price;
        this.status = status;
    }

    public String getId() { return id; }
    public String getPatientId() { return patientId; }
    public String getDoctorId() { return doctorId; }
    public String getConsultationId() { return consultationId; }
    public String getServiceName() { return serviceName; }
    public double getPrice() { return price; }
    public String getStatus() { return status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}