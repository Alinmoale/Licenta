package com.licenta.clinic.dto;

public class CreateDoctorRequest {

    private String username;
    private String email;
    private String password;

    private String firstName;
    private String lastName;
    private String phone;
    private String specialization;

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getPhone() {
        return phone;
    }

    public String getSpecialization() {
        return specialization;
    }
}