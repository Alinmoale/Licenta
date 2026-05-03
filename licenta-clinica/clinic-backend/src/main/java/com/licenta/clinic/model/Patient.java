package com.licenta.clinic.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "patients")
public class Patient {

    @Id
    private String id;

    private String doctorId;

    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private Integer age;
    private String gender;
    private String address;
    private String medicalHistory;

    public Patient() {}

    public Patient(String doctorId, String firstName, String lastName, String email, String phone,
                   Integer age, String gender, String address, String medicalHistory) {
        this.doctorId = doctorId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.age = age;
        this.gender = gender;
        this.address = address;
        this.medicalHistory = medicalHistory;
    }

    public String getId() { return id; }
    public String getDoctorId() { return doctorId; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public Integer getAge() { return age; }
    public String getGender() { return gender; }
    public String getAddress() { return address; }
    public String getMedicalHistory() { return medicalHistory; }
}