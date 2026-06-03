import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { DoctorService } from '../../core/services/doctor';
import { DoctorUnavailabilityService } from '../../core/services/doctor-unavailability';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './doctors.html',
  styleUrl: './doctors.scss'
})
export class Doctors implements OnInit {

  private doctorService = inject(DoctorService);
  private doctorUnavailabilityService = inject(DoctorUnavailabilityService);

  doctors: any[] = [];
  unavailabilityList: any[] = [];

  form = {
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    specialization: ''
  };

  ngOnInit(): void {
    this.loadDoctors();
    this.loadUnavailability();
  }

  loadDoctors() {
    this.doctorService.getDoctors().subscribe({
      next: (data) => this.doctors = data,
      error: () => alert('Could not load doctors')
    });
  }

  createDoctor() {
    this.doctorService.createDoctor(this.form).subscribe({
      next: () => {
        this.loadDoctors();
        this.resetForm();
      },
      error: () => alert('Could not create doctor')
    });
  }

  editingDoctorId: string | null = null;

  editDoctor(doctor: any) {
    this.editingDoctorId = doctor.id;

    this.form = {
      username: '',
      email: doctor.email,
      password: '',
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      phone: doctor.phone,
      specialization: doctor.specialization
    };
  }

  saveDoctor() {
    if (this.editingDoctorId) {
      this.doctorService.updateDoctor(this.editingDoctorId, this.form).subscribe({
        next: () => {
          this.loadDoctors();
          this.resetForm();
        },
        error: () => alert('Could not update doctor')
      });
    } else {
      this.createDoctor();
    }
  }

  deleteDoctor(id: string) {
    if (confirm('Are you sure you want to delete this doctor?')) {
      this.doctorService.deleteDoctor(id).subscribe({
        next: () => this.loadDoctors(),
        error: () => alert('Could not delete doctor')
      });
    }
  }

  resetForm() {
    this.editingDoctorId = null;
    this.form = {
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      specialization: ''
    };
  }
  loadUnavailability() {
    this.doctorUnavailabilityService.getAll().subscribe({
      next: (data) => {
        this.unavailabilityList = data;
      }
    });
  }
  isDoctorUnavailable(doctorId: string): boolean {

    const today = new Date();

    return this.unavailabilityList.some(item => {

      if (item.doctorId !== doctorId) {
        return false;
      }

      const start = new Date(item.startDate);
      const end = new Date(item.endDate);

      return today >= start && today <= end;
    });
  }
  getDoctorName(doctorId: string) {
  const doctor = this.doctors.find(d => d.id === doctorId);

  return doctor
    ? `Dr. ${doctor.firstName} ${doctor.lastName}`
    : doctorId;
  }

  deleteUnavailability(id: string) {
    if (!confirm('Delete this leave period?')) {
      return;
    }

    this.doctorUnavailabilityService.delete(id).subscribe({
      next: () => {
        this.loadUnavailability();
      }
    });
  }
}