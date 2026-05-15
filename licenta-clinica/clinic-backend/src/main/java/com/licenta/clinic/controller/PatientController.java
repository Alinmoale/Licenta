package com.licenta.clinic.controller;

import com.licenta.clinic.dto.CreatePatientRequest;
import com.licenta.clinic.model.Patient;
import com.licenta.clinic.repository.PatientRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientRepository patientRepository;

    public PatientController(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    // Admin: vede toți pacienții
    @GetMapping
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    // Admin: adaugă pacient pentru orice doctor
    @PostMapping
    public Patient createPatientByAdmin(@RequestBody CreatePatientRequest request) {
        Patient patient = new Patient(
                request.getDoctorId(),
                request.getFirstName(),
                request.getLastName(),
                request.getEmail(),
                request.getPhone(),
                request.getAge(),
                request.getGender(),
                request.getAddress(),
                request.getMedicalHistory()
        );

        return patientRepository.save(patient);
    }

    // Doctor: vede doar pacienții lui
    @GetMapping("/doctor/{doctorId}")
    public List<Patient> getPatientsByDoctor(@PathVariable String doctorId) {
        return patientRepository.findByDoctorId(doctorId);
    }

    // Doctor: adaugă pacient automat pe doctorul lui
    @PostMapping("/doctor/{doctorId}")
    public Patient createPatientByDoctor(
            @PathVariable String doctorId,
            @RequestBody CreatePatientRequest request
    ) {
        Patient patient = new Patient(
                doctorId,
                request.getFirstName(),
                request.getLastName(),
                request.getEmail(),
                request.getPhone(),
                request.getAge(),
                request.getGender(),
                request.getAddress(),
                request.getMedicalHistory()
        );

        return patientRepository.save(patient);
    }

    @PutMapping("/{id}")
    public Patient updatePatient(
            @PathVariable String id,
            @RequestBody Patient updatedPatient
    ) {
        patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Patient newPatient = new Patient(
                updatedPatient.getDoctorId(),
                updatedPatient.getFirstName(),
                updatedPatient.getLastName(),
                updatedPatient.getEmail(),
                updatedPatient.getPhone(),
                updatedPatient.getAge(),
                updatedPatient.getGender(),
                updatedPatient.getAddress(),
                updatedPatient.getMedicalHistory()
        );

        try {
            java.lang.reflect.Field idField = Patient.class.getDeclaredField("id");
            idField.setAccessible(true);
            idField.set(newPatient, id);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return patientRepository.save(newPatient);
    }

    @DeleteMapping("/{id}")
    public void deletePatient(@PathVariable String id) {
        patientRepository.deleteById(id);
    }
}