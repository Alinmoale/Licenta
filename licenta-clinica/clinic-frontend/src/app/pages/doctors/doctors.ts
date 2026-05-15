import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { DoctorService } from '../../core/services/doctor';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './doctors.html',
  styleUrl: './doctors.scss'
})
export class Doctors implements OnInit {

  private doctorService = inject(DoctorService);

  doctors: any[] = [];

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
}