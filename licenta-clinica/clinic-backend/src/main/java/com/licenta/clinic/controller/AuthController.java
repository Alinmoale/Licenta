package com.licenta.clinic.controller;

import com.licenta.clinic.dto.LoginRequest;
import com.licenta.clinic.dto.LoginResponse;
import com.licenta.clinic.model.Doctor;
import com.licenta.clinic.model.User;
import com.licenta.clinic.repository.DoctorRepository;
import com.licenta.clinic.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;

    public AuthController(UserRepository userRepository, DoctorRepository doctorRepository) {
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String doctorId = null;

        if ("DOCTOR".equalsIgnoreCase(user.getRole())) {
            doctorId = doctorRepository.findByUserId(user.getId())
                    .map(Doctor::getId)
                    .orElse(null);
        }

        return new LoginResponse(
                user.getId(),
                user.getEmail(),
                user.getRole(),
                doctorId
        );
    }
}