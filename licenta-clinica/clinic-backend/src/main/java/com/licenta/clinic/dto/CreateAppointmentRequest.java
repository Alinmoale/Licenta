package com.licenta.clinic.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class CreateAppointmentRequest {

    private String doctorId;
    private String patientId;
    private LocalDate appointmentDate;
    private LocalTime startTime;

    public String getDoctorId() { return doctorId; }
    public String getPatientId() { return patientId; }
    public LocalDate getAppointmentDate() { return appointmentDate; }
    public LocalTime getStartTime() { return startTime; }
}
