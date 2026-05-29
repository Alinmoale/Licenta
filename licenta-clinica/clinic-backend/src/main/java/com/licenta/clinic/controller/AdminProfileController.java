package com.licenta.clinic.controller;

import com.licenta.clinic.dto.ChangePasswordRequest;
import com.licenta.clinic.model.User;
import com.licenta.clinic.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/profile")
public class AdminProfileController {

    private final UserRepository userRepository;

    public AdminProfileController(UserRepository userRepository) {
        this.userRepository = userRepository;
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

        if (!user.getPassword().equals(request.getCurrentPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(request.getNewPassword());
        userRepository.save(user);

        return "Password changed successfully";
    }
}
