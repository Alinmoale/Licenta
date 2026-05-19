import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-doctor-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './doctor-sidebar.html',
  styleUrl: './doctor-sidebar.scss'
})
export class DoctorSidebar {

  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }
}