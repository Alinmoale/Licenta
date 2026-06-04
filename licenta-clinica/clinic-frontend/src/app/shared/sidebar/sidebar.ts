import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})

export class Sidebar {
  isMenuOpen = false;

  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}