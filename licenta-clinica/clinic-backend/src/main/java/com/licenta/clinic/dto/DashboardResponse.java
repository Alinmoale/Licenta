package com.licenta.clinic.dto;

public class DashboardResponse {

    private long totalDoctors;
    private long totalPatients;
    private long totalConsultations;
    private double revenue;

    public DashboardResponse(long totalDoctors, long totalPatients,
                             long totalConsultations, double revenue) {
        this.totalDoctors = totalDoctors;
        this.totalPatients = totalPatients;
        this.totalConsultations = totalConsultations;
        this.revenue = revenue;
    }

    public long getTotalDoctors() { return totalDoctors; }
    public long getTotalPatients() { return totalPatients; }
    public long getTotalConsultations() { return totalConsultations; }
    public double getRevenue() { return revenue; }
}