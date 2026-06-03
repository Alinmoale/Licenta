package com.licenta.clinic.controller;

import com.licenta.clinic.dto.CreateAppointmentRequest;
import com.licenta.clinic.model.Appointment;
import com.licenta.clinic.repository.AppointmentRepository;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import com.licenta.clinic.repository.DoctorUnavailabilityRepository;

import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final DoctorUnavailabilityRepository doctorUnavailabilityRepository;
    public AppointmentController(
        AppointmentRepository appointmentRepository,
        DoctorUnavailabilityRepository doctorUnavailabilityRepository
) {
    this.appointmentRepository = appointmentRepository;
    this.doctorUnavailabilityRepository = doctorUnavailabilityRepository;
}

    @PostMapping
    public Appointment createAppointment(@RequestBody CreateAppointmentRequest request) {

        if (
                request.getDoctorId() == null || request.getDoctorId().isBlank() ||
                request.getPatientId() == null || request.getPatientId().isBlank() ||
                request.getAppointmentDate() == null ||
                request.getStartTime() == null
        ) {
            throw new RuntimeException("All appointment fields are required");
        }

        LocalTime endTime = request.getStartTime().plusHours(1);

        List<Appointment> doctorAppointments =
                appointmentRepository.findByDoctorIdAndAppointmentDate(
                        request.getDoctorId(),
                        request.getAppointmentDate()
                );

        boolean overlaps = doctorAppointments.stream()
                .filter(a -> !"CANCELLED".equalsIgnoreCase(a.getStatus()))
                .anyMatch(a ->
                        request.getStartTime().isBefore(a.getEndTime()) &&
                        endTime.isAfter(a.getStartTime())
                );

        if (overlaps) {
            throw new RuntimeException("Doctor is not available at this time");
        }

        Appointment appointment = new Appointment(
                request.getDoctorId(),
                request.getPatientId(),
                request.getAppointmentDate(),
                request.getStartTime(),
                endTime,
                "SCHEDULED"
        );

        return appointmentRepository.save(appointment);
    }

    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    @GetMapping("/doctor/{doctorId}")
    public List<Appointment> getByDoctor(@PathVariable String doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    @GetMapping("/patient/{patientId}")
    public List<Appointment> getByPatient(@PathVariable String patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    @PutMapping("/{id}/status")
    public Appointment updateStatus(
            @PathVariable String id,
            @RequestParam String status
    ) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        appointment.setStatus(status);

        return appointmentRepository.save(appointment);
    }

    @DeleteMapping("/{id}")
    public void deleteAppointment(@PathVariable String id) {
        appointmentRepository.deleteById(id);
    }
    @GetMapping("/doctor/{doctorId}/available-times")
public List<String> getAvailableTimes(
        @PathVariable String doctorId,
        @RequestParam String date
) {
    LocalDate appointmentDate = LocalDate.parse(date);
        boolean doctorUnavailable = doctorUnavailabilityRepository
                .findByDoctorId(doctorId)
                .stream()
                .anyMatch(unavailability ->
                        !appointmentDate.isBefore(unavailability.getStartDate()) &&
                        !appointmentDate.isAfter(unavailability.getEndDate())
                );

        if (doctorUnavailable) {
        return List.of();
        }

    List<String> allTimes = List.of(
            "09:00",
            "10:00",
            "11:00",
            "12:00",
            "13:00",
            "14:00",
            "15:00",
            "16:00",
            "17:00"
    );

    List<Appointment> doctorAppointments =
            appointmentRepository.findByDoctorIdAndAppointmentDate(
                    doctorId,
                    appointmentDate
            );

    List<String> unavailableTimes = doctorAppointments.stream()
            .filter(a -> !"CANCELLED".equalsIgnoreCase(a.getStatus()))
            .map(a -> a.getStartTime().toString())
            .toList();

    return allTimes.stream()
            .filter(time -> !unavailableTimes.contains(time))
            .toList();
}
}

