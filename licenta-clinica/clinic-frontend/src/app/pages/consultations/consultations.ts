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
  filteredPatients: any[] = [];
  editingId: string | null = null;

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

    if (this.editingId) {

      this.consultationService
        .updateConsultation(this.editingId, this.form)
        .subscribe({
          next: () => {

            this.loadConsultationsForPatient();

            this.editingId = null;

            this.form.symptoms = '';
            this.form.diagnosis = '';
            this.form.treatment = '';
            this.form.recommendations = '';
          },
          error: () => alert('Could not update consultation')
        });

      return;
    }

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

  editConsultation(consultation: any) {

    this.editingId = consultation.id;

    this.form = {
      doctorId: consultation.doctorId,
      patientId: consultation.patientId,
      symptoms: consultation.symptoms,
      diagnosis: consultation.diagnosis,
      treatment: consultation.treatment,
      recommendations: consultation.recommendations 
    };
  }

  onDoctorChange() {
    this.form.patientId = '';
    this.consultations = [];
    this.filteredPatients = [];

    if (!this.form.doctorId) {
      return;
    }

    this.patientService.getPatientsByDoctor(this.form.doctorId).subscribe({
      next: (data) => {
        this.filteredPatients = data;
      }
    });
  }

  deleteConsultation(id: string) {

    if (!confirm('Delete consultation?')) {
      return;
    }

    this.consultationService.deleteConsultation(id).subscribe({
      next: () => {
        this.loadConsultationsForPatient();
      }
    });
  }
  getDoctorName(doctorId: string) {
    const doctor = this.doctors.find(d => d.id === doctorId);

    return doctor
      ? `Dr. ${doctor.firstName} ${doctor.lastName}`
      : doctorId;
  }

  getPatientName(patientId: string) {
    const patient = this.filteredPatients.find(p => p.id === patientId);

    return patient
      ? `${patient.firstName} ${patient.lastName}`
      : patientId;
  }
  openConsultationId: string | null = null;

  toggleConsultation(id: string) {
    this.openConsultationId =
      this.openConsultationId === id
        ? null
        : id;
  }


}