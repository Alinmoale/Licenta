package com.licenta.clinic.controller;

import com.licenta.clinic.dto.ChangePasswordRequest;
import com.licenta.clinic.model.Doctor;
import com.licenta.clinic.model.User;
import com.licenta.clinic.repository.DoctorRepository;
import com.licenta.clinic.repository.UserRepository;
import com.licenta.clinic.service.PasswordService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/doctor/profile")
public class DoctorProfileController {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final PasswordService passwordService;

    public DoctorProfileController(
            DoctorRepository doctorRepository,
            UserRepository userRepository,
            PasswordService passwordService
    ) {
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
        this.passwordService = passwordService;
    }

    @GetMapping("/{doctorId}")
    public Doctor getProfile(@PathVariable String doctorId) {
        return doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
    }

    @PutMapping("/{doctorId}")
    public Doctor updateProfile(
            @PathVariable String doctorId,
            @RequestBody Doctor updatedDoctor
    ) {
        Doctor doctor = doctorRepository.findById(doctorId)
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
            idField.set(newDoctor, doctorId);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return doctorRepository.save(newDoctor);
    }

    @PutMapping("/{doctorId}/change-password")
    public String changePassword(
            @PathVariable String doctorId,
            @RequestBody ChangePasswordRequest request
    ) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        User user = userRepository.findById(doctor.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordService.matchesAndUpgrade(user, request.getCurrentPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(passwordService.encode(request.getNewPassword()));
        userRepository.save(user);

        return "Password changed successfully";
    }
}
