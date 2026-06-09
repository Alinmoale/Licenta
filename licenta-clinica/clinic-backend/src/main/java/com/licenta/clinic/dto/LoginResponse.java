package com.licenta.clinic.dto;

public class LoginResponse {

    private String userId;
    private String email;
    private String role;
    private String doctorId;
    private String displayName;
    private String token;

    public LoginResponse(String userId, String email, String role, String doctorId, String displayName, String token) {
        this.userId = userId;
        this.email = email;
        this.role = role;
        this.doctorId = doctorId;
        this.displayName = displayName;
        this.token = token;
    }

    public String getUserId() { return userId; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getDoctorId() { return doctorId; }
    public String getDisplayName() { return displayName; }
    public String getToken() { return token; }
}
