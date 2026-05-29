import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Sidebar } from '../../shared/sidebar/sidebar';
import { AdminProfileService } from '../../core/services/admin-profile';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './admin-profile.html',
  styleUrl: './admin-profile.scss'
})
export class AdminProfile implements OnInit {

  private adminProfileService = inject(AdminProfileService);

  user: any = null;

  profile = {
    username: '',
    email: ''
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
    this.adminProfileService.getProfile(this.user.userId).subscribe({
      next: (data) => {
        this.profile = {
          username: data.username,
          email: data.email
        };
      }
    });
  }

  saveProfile() {
    this.adminProfileService.updateProfile(this.user.userId, this.profile).subscribe({
      next: (data) => {
        this.user.email = data.email;
        this.user.displayName = data.email;
        localStorage.setItem('user', JSON.stringify(this.user));
        alert('Profile updated successfully');
      }
    });
  }

  changePassword() {
    this.adminProfileService.changePassword(this.user.userId, this.passwordForm).subscribe({
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
