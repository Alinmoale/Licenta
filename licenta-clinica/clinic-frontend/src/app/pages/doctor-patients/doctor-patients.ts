import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PatientService } from '../../core/services/patient';
import { RouterLink } from '@angular/router';
import { DoctorSidebar } from '../../shared/doctor-sidebar/doctor-sidebar';

@Component({
  selector: 'app-doctor-patients',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DoctorSidebar],
  templateUrl: './doctor-patients.html',
  styleUrl: './doctor-patients.scss'
})
export class DoctorPatients implements OnInit {

  private patientService = inject(PatientService);

  user: any = null;
  patients: any[] = [];

  editingPatientId: string | null = null;
  showError = false;

  form = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: 0,
    gender: '',
    address: '',
    medicalHistory: ''
  };

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.loadPatients();
    }
  }

  loadPatients() {
    this.patientService.getPatientsByDoctor(this.user.doctorId).subscribe({
      next: (data) => this.patients = data
    });
  }

  savePatient() {
    if (!this.form.firstName || !this.form.lastName) {
      this.showError = true;
      return;
    }

    this.showError = false;

    if (this.editingPatientId) {
      const payload = {
        doctorId: this.user.doctorId,
        ...this.form
      };

      this.patientService.updatePatient(this.editingPatientId, payload).subscribe({
        next: () => {
          this.loadPatients();
          this.resetForm();
        }
      });

    } else {
      this.patientService.createPatientForDoctor(this.user.doctorId, this.form).subscribe({
        next: () => {
          this.loadPatients();
          this.resetForm();
        }
      });
    }
  }

  editPatient(patient: any) {
    this.editingPatientId = patient.id;

    this.form = {
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      phone: patient.phone,
      age: patient.age,
      gender: patient.gender,
      address: patient.address,
      medicalHistory: patient.medicalHistory
    };
  }

  deletePatient(id: string) {
    if (confirm('Delete patient?')) {
      this.patientService.deletePatient(id).subscribe({
        next: () => this.loadPatients()
      });
    }
  }

  resetForm() {
    this.editingPatientId = null;
    this.showError = false;

    this.form = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      age: 0,
      gender: '',
      address: '',
      medicalHistory: ''
    };
  }
}