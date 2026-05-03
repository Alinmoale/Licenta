package com.licenta.clinic.dto;

public class CreatePatientRequest {

    private String doctorId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private Integer age;
    private String gender;
    private String address;
    private String medicalHistory;

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