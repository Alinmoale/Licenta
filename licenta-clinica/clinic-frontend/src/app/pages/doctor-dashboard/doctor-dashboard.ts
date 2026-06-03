import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DoctorSidebar } from '../../shared/doctor-sidebar/doctor-sidebar';

import { PatientService } from '../../core/services/patient';
import { ConsultationService } from '../../core/services/consultation';
import { AppointmentService } from '../../core/services/appointment';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DoctorSidebar],
  templateUrl: './doctor-dashboard.html',
  styleUrl: './doctor-dashboard.scss'
})
export class DoctorDashboard implements OnInit {

  private patientService = inject(PatientService);
  private consultationService = inject(ConsultationService);
  private appointmentService = inject(AppointmentService);

  user: any = null;
  patients: any[] = [];
  consultations: any[] = [];
  doctorName = '';
  appointments: any[] = [];

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.doctorName = this.user.displayName;
      this.loadDoctorData();
    }
  }

  loadDoctorData() {
    this.patientService.getPatientsByDoctor(this.user.doctorId).subscribe({
      next: (data) => this.patients = data
    });

    this.consultationService.getConsultationsByDoctor(this.user.doctorId).subscribe({
      next: (data) => this.consultations = data
    });
    this.appointmentService.getAppointmentsByDoctor(this.user.doctorId).subscribe({
    next: (data) => {
      this.appointments = data.filter(a => a.status === 'SCHEDULED');
    }
  });
  }
}