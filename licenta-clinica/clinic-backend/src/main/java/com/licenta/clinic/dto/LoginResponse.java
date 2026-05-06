package com.licenta.clinic.dto;

public class LoginResponse {

    private String userId;
    private String email;
    private String role;
    private String doctorId;

    public LoginResponse(String userId, String email, String role, String doctorId) {
        this.userId = userId;
        this.email = email;
        this.role = role;
        this.doctorId = doctorId;
    }

    public String getUserId() { return userId; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getDoctorId() { return doctorId; }
}