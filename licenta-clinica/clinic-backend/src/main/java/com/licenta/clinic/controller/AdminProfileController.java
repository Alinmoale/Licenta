package com.licenta.clinic.controller;

import com.licenta.clinic.dto.ChangePasswordRequest;
import com.licenta.clinic.model.User;
import com.licenta.clinic.repository.UserRepository;
import com.licenta.clinic.service.PasswordService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/profile")
public class AdminProfileController {

    private final UserRepository userRepository;
    private final PasswordService passwordService;

    public AdminProfileController(UserRepository userRepository, PasswordService passwordService) {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
    }

    @GetMapping("/{userId}")
    public User getProfile(@PathVariable String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PutMapping("/{userId}")
    public User updateProfile(
            @PathVariable String userId,
            @RequestBody User updatedUser
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setUsername(updatedUser.getUsername());
        user.setEmail(updatedUser.getEmail());

        return userRepository.save(user);
    }

    @PutMapping("/{userId}/change-password")
    public String changePassword(
            @PathVariable String userId,
            @RequestBody ChangePasswordRequest request
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordService.matchesAndUpgrade(user, request.getCurrentPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(passwordService.encode(request.getNewPassword()));
        userRepository.save(user);

        return "Password changed successfully";
    }
}
