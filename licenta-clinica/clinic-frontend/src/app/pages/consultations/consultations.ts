import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Sidebar } from '../../shared/sidebar/sidebar';
import { PatientService } from '../../core/services/patient';
import { DoctorService } from '../../core/services/doctor';
import { ConsultationService } from '../../core/services/consultation';

@Component({
  selector: 'app-consultations',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './consultations.html',
  styleUrl: './consultations.scss'
})
export class Consultations implements OnInit {

  private patientService = inject(PatientService);
  private doctorService = inject(DoctorService);
  private consultationService = inject(ConsultationService);

  patients: any[] = [];
  doctors: any[] = [];
  consultations: any[] = [];

  form = {
    patientId: '',
    doctorId: '',
    symptoms: '',
    diagnosis: '',
    treatment: '',
    recommendations: ''
  };

  ngOnInit(): void {
    this.loadPatients();
    this.loadDoctors();
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

  loadConsultationsForPatient() {
    if (!this.form.patientId) return;

    this.consultationService.getConsultationsByPatient(this.form.patientId).subscribe({
      next: (data) => this.consultations = data
    });
  }

  saveConsultation() {
    this.consultationService.createConsultation(this.form).subscribe({
      next: () => {
        this.loadConsultationsForPatient();
        this.form.symptoms = '';
        this.form.diagnosis = '';
        this.form.treatment = '';
        this.form.recommendations = '';
      },
      error: () => alert('Could not save consultation')
    });
  }
}