package com.licenta.clinic.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalTime;

@Document(collection = "appointments")
public class Appointment {

    @Id
    private String id;

    private String doctorId;
    private String patientId;

    private LocalDate appointmentDate;
    private LocalTime startTime;
    private LocalTime endTime;

    private String status = "SCHEDULED";

    public Appointment() {}

    public Appointment(String doctorId, String patientId, LocalDate appointmentDate,
                       LocalTime startTime, LocalTime endTime, String status) {
        this.doctorId = doctorId;
        this.patientId = patientId;
        this.appointmentDate = appointmentDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
    }

    public String getId() { return id; }
    public String getDoctorId() { return doctorId; }
    public String getPatientId() { return patientId; }
    public LocalDate getAppointmentDate() { return appointmentDate; }
    public LocalTime getStartTime() { return startTime; }
    public LocalTime getEndTime() { return endTime; }
    public String getStatus() { return status; }

    public void setStatus(String status) {
        this.status = status;
    }
}