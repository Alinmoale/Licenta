import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-doctor-sidebar',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  templateUrl: './doctor-sidebar.html',
  styleUrl: './doctor-sidebar.scss'
})
export class DoctorSidebar {
  isMenuOpen = false;

  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
