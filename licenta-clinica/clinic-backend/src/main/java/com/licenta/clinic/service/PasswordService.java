package com.licenta.clinic.service;

import com.licenta.clinic.model.User;
import com.licenta.clinic.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PasswordService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public PasswordService(PasswordEncoder passwordEncoder, UserRepository userRepository) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    public String encode(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    public boolean matchesAndUpgrade(User user, String rawPassword) {
        String storedPassword = user.getPassword();

        if (storedPassword == null || rawPassword == null) {
            return false;
        }

        if (isEncoded(storedPassword)) {
            return passwordEncoder.matches(rawPassword, storedPassword);
        }

        if (!storedPassword.equals(rawPassword)) {
            return false;
        }

        user.setPassword(encode(rawPassword));
        userRepository.save(user);
        return true;
    }

    private boolean isEncoded(String password) {
        return password.startsWith("$2a$")
                || password.startsWith("$2b$")
                || password.startsWith("$2y$");
    }
}
