import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { DoctorUnavailabilityService } from '../../core/services/doctor-unavailability';
import { DoctorSidebar } from '../../shared/doctor-sidebar/doctor-sidebar';
import { DoctorService } from '../../core/services/doctor';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, DoctorSidebar, RouterLink, MatDatepickerModule, MatNativeDateModule, MatInputModule
  ],
  templateUrl: './doctor-profile.html',
  styleUrl: './doctor-profile.scss'
})
export class DoctorProfile implements OnInit {

  private doctorService = inject(DoctorService);
  private doctorUnavailabilityService = inject(DoctorUnavailabilityService);

  user: any = null;
  unavailabilityList: any[] = [];
  today = new Date();

  availabilityForm: {
    startDate: Date | string;
    endDate: Date | string;
    reason: string;
  } = {
    startDate: '',
    endDate: '',
    reason: ''
  };

  profile = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialization: ''
  };

  passwordForm = {
    currentPassword: '',
    newPassword: ''
  };

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.loadProfile();
      this.loadUnavailability();
    }
  }

  loadProfile() {
    this.doctorService.getDoctorProfile(this.user.doctorId).subscribe({
      next: (data) => {
        this.profile = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          specialization: data.specialization
        };
      }
    });
  }

  saveProfile() {
    this.doctorService.updateDoctorProfile(this.user.doctorId, this.profile).subscribe({
      next: () => {
        this.user.displayName = `Dr. ${this.profile.firstName} ${this.profile.lastName}`;
        localStorage.setItem('user', JSON.stringify(this.user));
        alert('Profile updated successfully');
      }
    });
  }

  changePassword() {
    this.doctorService.changePassword(this.user.doctorId, this.passwordForm).subscribe({
      next: () => {
        alert('Password changed successfully');
        this.passwordForm = {
          currentPassword: '',
          newPassword: ''
        };
      },
      error: () => alert('Could not change password')
    });
  }
  loadUnavailability() {

    this.doctorUnavailabilityService
      .getByDoctor(this.user.doctorId)
      .subscribe({
        next: (data) => {
          this.unavailabilityList = data;
        }
      });
  }
  saveUnavailability() {

    if (
      !this.availabilityForm.startDate ||
      !this.availabilityForm.endDate ||
      !this.availabilityForm.reason
    ) {
      alert('All fields are required');
      return;
    }

    const payload = {
      doctorId: this.user.doctorId,
      startDate: this.availabilityForm.startDate,
      endDate: this.availabilityForm.endDate,
      reason: this.availabilityForm.reason
    };

    this.doctorUnavailabilityService.create(payload).subscribe({
      next: () => {

        this.loadUnavailability();

        this.availabilityForm = {
          startDate: '',
          endDate: '',
          reason: ''
        };
      }
    });
  }

  futureDateFilter = (date: Date | null): boolean => {
    if (!date) {
      return false;
    }

    return this.startOfDay(date) >= this.startOfDay(this.today);
  };

  endDateFilter = (date: Date | null): boolean => {
    if (!this.futureDateFilter(date)) {
      return false;
    }

    const startDate = this.toDate(this.availabilityForm.startDate);

    if (!startDate || !date) {
      return true;
    }

    return this.startOfDay(date) >= this.startOfDay(startDate);
  };

  onStartDateChange() {
    const startDate = this.toDate(this.availabilityForm.startDate);
    const endDate = this.toDate(this.availabilityForm.endDate);

    if (startDate && endDate && this.startOfDay(endDate) < this.startOfDay(startDate)) {
      this.availabilityForm.endDate = '';
    }
  }

  private toDate(value: Date | string): Date | null {
    if (!value) {
      return null;
    }

    return value instanceof Date ? value : new Date(value);
  }

  private startOfDay(date: Date): number {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    return normalizedDate.getTime();
  }

  deleteUnavailability(id: string) {

    if (!confirm('Delete this unavailability period?')) {
      return;
    }

    this.doctorUnavailabilityService.delete(id).subscribe({
      next: () => {
        this.loadUnavailability();
      }
    });
  }
}
