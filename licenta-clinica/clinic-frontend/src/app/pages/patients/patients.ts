import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Sidebar } from '../../shared/sidebar/sidebar';
import { PatientService } from '../../core/services/patient';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './patients.html',
  styleUrl: './patients.scss'
})
export class Patients implements OnInit {

  private patientService = inject(PatientService);

  patients: any[] = [];
  doctors: any[] = [];

  editingPatientId: string | null = null;

  form = {
    doctorId: '',
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
    this.loadPatients();
    this.loadDoctors();
  }

  loadPatients() {
    this.patientService.getPatients().subscribe({
      next: (data) => this.patients = data
    });
  }

  loadDoctors() {
    this.patientService.getDoctors().subscribe({
      next: (data) => this.doctors = data
    });
  }

  savePatient() {

    if (this.editingPatientId) {

      this.patientService.updatePatient(
        this.editingPatientId,
        this.form
      ).subscribe({
        next: () => {
          this.loadPatients();
          this.resetForm();
        }
      });

    } else {

      this.patientService.createPatient(this.form).subscribe({
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
      doctorId: patient.doctorId,
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

    this.form = {
      doctorId: '',
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