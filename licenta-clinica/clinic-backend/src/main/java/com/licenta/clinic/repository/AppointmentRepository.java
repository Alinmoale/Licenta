package com.licenta.clinic.repository;

import com.licenta.clinic.model.Appointment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface AppointmentRepository extends MongoRepository<Appointment, String> {
    List<Appointment> findByDoctorId(String doctorId);
    List<Appointment> findByPatientId(String patientId);
    List<Appointment> findByDoctorIdAndAppointmentDate(String doctorId, LocalDate appointmentDate);
}
