package com.licenta.clinic.controller;

import com.licenta.clinic.model.DoctorUnavailability;
import com.licenta.clinic.repository.DoctorUnavailabilityRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctor-unavailability")
public class DoctorUnavailabilityController {

    private final DoctorUnavailabilityRepository repository;

    public DoctorUnavailabilityController(DoctorUnavailabilityRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/doctor/{doctorId}")
    public List<DoctorUnavailability> getByDoctor(@PathVariable String doctorId) {
        return repository.findByDoctorId(doctorId);
    }

    @PostMapping
    public DoctorUnavailability create(@RequestBody DoctorUnavailability request) {

        if (
                request.getDoctorId() == null || request.getDoctorId().isBlank() ||
                request.getStartDate() == null ||
                request.getEndDate() == null ||
                request.getReason() == null || request.getReason().isBlank()
        ) {
            throw new RuntimeException("All fields are required");
        }

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new RuntimeException("End date cannot be before start date");
        }

        return repository.save(request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        repository.deleteById(id);
    }
    @GetMapping
    public List<DoctorUnavailability> getAll() {
        return repository.findAll();
    }
}
