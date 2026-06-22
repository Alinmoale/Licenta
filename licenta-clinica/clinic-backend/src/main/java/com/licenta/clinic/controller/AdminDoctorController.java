package com.licenta.clinic.controller;

import com.licenta.clinic.dto.CreateDoctorRequest;
import com.licenta.clinic.model.Doctor;
import com.licenta.clinic.model.User;
import com.licenta.clinic.repository.DoctorRepository;
import com.licenta.clinic.repository.UserRepository;
import com.licenta.clinic.service.PasswordService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/doctors")
public class AdminDoctorController {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordService passwordService;

    public AdminDoctorController(
            UserRepository userRepository,
            DoctorRepository doctorRepository,
            PasswordService passwordService
    ) {
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.passwordService = passwordService;
    }

    @PostMapping
    public Doctor createDoctor(@RequestBody CreateDoctorRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User(
                request.getUsername(),
                request.getEmail(),
                passwordService.encode(request.getPassword()),
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

        String newEmail = updatedDoctor.getEmail();

        if (newEmail == null || newEmail.isBlank()) {
            throw new RuntimeException("Email is required");
        }

        User user = userRepository.findById(doctor.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String normalizedEmail = newEmail.trim();

        userRepository.findByEmail(normalizedEmail)
                .filter(existingUser -> !existingUser.getId().equals(user.getId()))
                .ifPresent(existingUser -> {
                    throw new RuntimeException("Email already exists");
                });

        user.setEmail(normalizedEmail);
        userRepository.save(user);

        Doctor newDoctor = new Doctor(
                doctor.getUserId(),
                updatedDoctor.getFirstName(),
                updatedDoctor.getLastName(),
                normalizedEmail,
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
