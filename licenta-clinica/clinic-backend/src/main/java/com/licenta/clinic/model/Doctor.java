package com.licenta.clinic.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "doctors")
public class Doctor {

    @Id
    private String id;

    private String userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String specialization;
    private String status = "ACTIVE";

    public Doctor() {}

    public Doctor(String userId, String firstName, String lastName, String email, String phone, String specialization) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.specialization = specialization;
    }

    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getSpecialization() {
        return specialization;
    }

    public String getStatus() {
        return status;
    }
}