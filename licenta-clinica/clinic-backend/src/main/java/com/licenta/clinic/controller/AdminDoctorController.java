package com.licenta.clinic.controller;

import com.licenta.clinic.dto.CreateDoctorRequest;
import com.licenta.clinic.model.Doctor;
import com.licenta.clinic.model.User;
import com.licenta.clinic.repository.DoctorRepository;
import com.licenta.clinic.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/doctors")
public class AdminDoctorController {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;

    public AdminDoctorController(UserRepository userRepository, DoctorRepository doctorRepository) {
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
    }

    @PostMapping
    public Doctor createDoctor(@RequestBody CreateDoctorRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User(
                request.getUsername(),
                request.getEmail(),
                request.getPassword(),
                "DOCTOR"
        );

        User savedUser = userRepository.save(user);

        Doctor doctor = new Doctor(
                savedUser.getId(),
                request.getFirstName(),
                request.getLastName(),
                request.getEmail(),
                request.getPhone(),
                request.getSpecialization()
        );

        return doctorRepository.save(doctor);
    }

    @GetMapping
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    @PutMapping("/{id}")
    public Doctor updateDoctor(@PathVariable String id, @RequestBody Doctor updatedDoctor) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Doctor newDoctor = new Doctor(
                doctor.getUserId(),
                updatedDoctor.getFirstName(),
                updatedDoctor.getLastName(),
                updatedDoctor.getEmail(),
                updatedDoctor.getPhone(),
                updatedDoctor.getSpecialization()
        );

        try {
            java.lang.reflect.Field idField = Doctor.class.getDeclaredField("id");
            idField.setAccessible(true);
            idField.set(newDoctor, id);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return doctorRepository.save(newDoctor);
    }

    @DeleteMapping("/{id}")
    public void deleteDoctor(@PathVariable String id) {
        doctorRepository.deleteById(id);
    }
}