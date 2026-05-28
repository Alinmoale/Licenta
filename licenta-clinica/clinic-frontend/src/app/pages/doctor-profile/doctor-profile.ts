import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';


import { DoctorSidebar } from '../../shared/doctor-sidebar/doctor-sidebar';
import { DoctorService } from '../../core/services/doctor';

@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, DoctorSidebar, RouterLink],
  templateUrl: './doctor-profile.html',
  styleUrl: './doctor-profile.scss'
})
export class DoctorProfile implements OnInit {

  private doctorService = inject(DoctorService);

  user: any = null;

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
}
