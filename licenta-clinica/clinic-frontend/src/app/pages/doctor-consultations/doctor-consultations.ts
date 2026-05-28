import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DoctorSidebar } from '../../shared/doctor-sidebar/doctor-sidebar';
import { PatientService } from '../../core/services/patient';
import { ConsultationService } from '../../core/services/consultation';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-doctor-consultations',
  standalone: true,
  imports: [CommonModule, FormsModule, DoctorSidebar, RouterLink ],
  templateUrl: './doctor-consultations.html',
  styleUrl: './doctor-consultations.scss'
})
export class DoctorConsultations implements OnInit {

  private patientService = inject(PatientService);
  private consultationService = inject(ConsultationService);

  user: any = null;

  patients: any[] = [];
  consultations: any[] = [];

  selectedPatientId = '';

  form = {
    patientId: '',
    doctorId: '',
    symptoms: '',
    diagnosis: '',
    treatment: '',
    recommendations: ''
  };

  showError = false;

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.form.doctorId = this.user.doctorId;
      this.loadPatients();
    }
  }

  loadPatients() {
    this.patientService.getPatientsByDoctor(this.user.doctorId).subscribe({
      next: (data) => this.patients = data
    });
  }

  onPatientChange() {
    this.form.patientId = this.selectedPatientId;
    this.loadConsultationsForPatient();
  }

  loadConsultationsForPatient() {
    if (!this.selectedPatientId) {
      this.consultations = [];
      return;
    }

    this.consultationService.getConsultationsByPatient(this.selectedPatientId).subscribe({
      next: (data) => this.consultations = data
    });
  }

  saveConsultation() {
    if (!this.form.patientId || !this.form.symptoms || !this.form.diagnosis || !this.form.treatment || !this.form.recommendations) {
      this.showError = true;
      return;
    }

    this.showError = false;

    this.consultationService.createConsultation(this.form).subscribe({
      next: () => {
        this.loadConsultationsForPatient();
        this.resetFormFields();
      },
      error: () => alert('Could not save consultation')
    });
  }

  resetFormFields() {
    this.form.symptoms = '';
    this.form.diagnosis = '';
    this.form.treatment = '';
    this.form.recommendations = '';
  }

  sendEmail(consultationId: string) {
    this.consultationService.sendConsultationEmail(consultationId).subscribe({
      next: () => {
        alert('Email sent successfully');
      },
      error: () => {
        alert('Could not send email');
      }
    });
  }
}