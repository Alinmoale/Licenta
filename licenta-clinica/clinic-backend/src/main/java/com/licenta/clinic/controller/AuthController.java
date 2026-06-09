package com.licenta.clinic.controller;

import com.licenta.clinic.dto.LoginRequest;
import com.licenta.clinic.dto.LoginResponse;
import com.licenta.clinic.model.Doctor;
import com.licenta.clinic.model.User;
import com.licenta.clinic.repository.DoctorRepository;
import com.licenta.clinic.repository.UserRepository;
import com.licenta.clinic.service.JwtService;
import com.licenta.clinic.service.PasswordService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordService passwordService;
    private final JwtService jwtService;

    public AuthController(
            UserRepository userRepository,
            DoctorRepository doctorRepository,
            PasswordService passwordService,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.passwordService = passwordService;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordService.matchesAndUpgrade(user, request.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String doctorId = null;
        String displayName = user.getEmail();

        if ("DOCTOR".equalsIgnoreCase(user.getRole())) {
            Doctor doctor = doctorRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new RuntimeException("Doctor profile not found"));

            doctorId = doctor.getId();
            displayName = "Dr. " + doctor.getFirstName() + " " + doctor.getLastName();
        }

        return new LoginResponse(
                user.getId(),
                user.getEmail(),
                user.getRole(),
                doctorId,
                displayName,
                jwtService.generateToken(user)
        );
    }
}
