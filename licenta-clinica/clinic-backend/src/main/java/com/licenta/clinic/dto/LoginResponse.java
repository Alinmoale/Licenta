package com.licenta.clinic.dto;

public class LoginResponse {

    private String userId;
    private String email;
    private String role;
    private String doctorId;
    private String displayName;

    public LoginResponse(String userId, String email, String role, String doctorId, String displayName) {
        this.userId = userId;
        this.email = email;
        this.role = role;
        this.doctorId = doctorId;
        this.displayName = displayName;
    }

    public String getUserId() { return userId; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getDoctorId() { return doctorId; }
    public String getDisplayName() { return displayName; }
}