import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ConsultationService } from '../../core/services/consultation';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { BillingService } from '../../core/services/billing';
import { PatientService } from '../../core/services/patient';
import { DoctorService } from '../../core/services/doctor';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './billing.html',
  styleUrl: './billing.scss'
})
export class Billing implements OnInit {

  private billingService = inject(BillingService);
  private patientService = inject(PatientService);
  private doctorService = inject(DoctorService);
  private consultationService = inject(ConsultationService);

  consultations: any[] = [];
  billings: any[] = [];
  patients: any[] = [];
  doctors: any[] = [];

  revenue = 0;

  form = {
    patientId: '',
    doctorId: '',
    consultationId: '',
    serviceName: '',
    price: 0,
    status: 'UNPAID'
  };

  ngOnInit(): void {
    this.loadBilling();
    this.loadPatients();
    this.loadDoctors();
    this.loadRevenue();
  }

  loadBilling() {
    this.billingService.getBilling().subscribe({
      next: (data) => this.billings = data
    });
  }

  loadPatients() {
    this.patientService.getPatients().subscribe({
      next: (data) => this.patients = data
    });
  }

  loadDoctors() {
    this.doctorService.getDoctors().subscribe({
      next: (data) => this.doctors = data
    });
  }

  loadRevenue() {
    this.billingService.getRevenue().subscribe({
      next: (data) => this.revenue = data
    });
  }

  saveBilling() {
    this.billingService.createBilling(this.form).subscribe({
      next: () => {
        this.loadBilling();
        this.loadRevenue();
        this.resetForm();
      },
      error: () => alert('Could not create billing')
    });
  }

  resetForm() {
    this.form = {
      patientId: '',
      doctorId: '',
      consultationId: '',
      serviceName: '',
      price: 0,
      status: 'UNPAID'
    };
  }

  getPatientName(patientId: string) {
    const patient = this.patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : '-';
  }

  getDoctorName(doctorId: string) {
    const doctor = this.doctors.find(d => d.id === doctorId);
    return doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : '-';
  }
  
  loadConsultationsForPatient() {
    if (!this.form.patientId) {
      this.consultations = [];
      this.form.consultationId = '';
      return;
    }

    this.consultationService.getConsultationsByPatient(this.form.patientId).subscribe({
      next: (data) => this.consultations = data
    });
  }
}
