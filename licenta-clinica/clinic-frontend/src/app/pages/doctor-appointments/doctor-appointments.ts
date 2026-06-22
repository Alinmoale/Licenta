import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppointmentService } from '../../core/services/appointment';
import { PatientService } from '../../core/services/patient';
import { DoctorSidebar } from '../../shared/doctor-sidebar/doctor-sidebar';
import { RouterLink } from '@angular/router';


import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-doctor-appointments',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DoctorSidebar,
    RouterLink,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule
  ],
  templateUrl: './doctor-appointments.html',
  styleUrl: './doctor-appointments.scss'
})
export class DoctorAppointments implements OnInit {

  private appointmentService = inject(AppointmentService);
  private patientService = inject(PatientService);

  user: any = null;
  appointments: any[] = [];
  patients: any[] = [];
  availableTimes: string[] = [];
  selectedTime = '';
  currentPage = 1;
  itemsPerPage = 10;
  today = new Date();
  doctorUnavailableMessage = '';
  errorMessage = '';


  form = {
    patientId: '',
    appointmentDate: null as any,
    startTime: ''
    
  };


  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.loadAppointments();
      this.loadPatients();
    }
  }

  loadAppointments() {
    this.appointmentService.getAppointmentsByDoctor(this.user.doctorId).subscribe({
      next: (data) => {
        this.appointments = data.sort((a, b) => {
          const dateA = new Date(`${a.appointmentDate}T${a.startTime}`).getTime();
          const dateB = new Date(`${b.appointmentDate}T${b.startTime}`).getTime();
          return dateB - dateA;
        });
        this.currentPage = 1;
      }
    });
  }

  loadPatients() {
    this.patientService.getPatientsByDoctor(this.user.doctorId).subscribe({
      next: (data) => this.patients = data
    });
  }

  onPatientChange(patientId: string) {
    this.form.patientId = patientId;
    this.availableTimes = [];
    this.selectedTime = '';
    this.form.startTime = '';
    this.doctorUnavailableMessage = '';
    this.errorMessage = '';

    if (this.form.appointmentDate) {
      this.loadAvailableTimes();
    }
  }

  onDateChange(date: any) {
    this.form.appointmentDate = date;
    this.loadAvailableTimes();
  }

  loadAvailableTimes() {
    this.availableTimes = [];
    this.selectedTime = '';
    this.form.startTime = '';
    this.doctorUnavailableMessage = '';
    this.errorMessage = '';

    if (!this.form.patientId || !this.form.appointmentDate) {
      return;
    }

    const formattedDate = this.formatDate(this.form.appointmentDate);

    this.appointmentService
      .getAvailableTimes(this.user.doctorId, formattedDate)
      .subscribe({
        next: (data) => {
          this.availableTimes = data;

          if (data.length === 0) {
            this.doctorUnavailableMessage =
              'Doctor is unavailable on this date.';
          }
        },
        error: (err) => {
          this.errorMessage =
            err.error?.message || 'Could not load available times';
        }
      });
  }

  selectTime(time: string) {
    this.selectedTime = time;
    this.form.startTime = time;
  }

  saveAppointment() {
    this.errorMessage = '';

    if (!this.form.patientId || !this.form.appointmentDate || !this.form.startTime) {
      this.errorMessage = 'All fields are required';
      return;
    }

    const payload = {
      doctorId: this.user.doctorId,
      patientId: this.form.patientId,
      appointmentDate: this.formatDate(this.form.appointmentDate),
      startTime: this.form.startTime
    };

    this.appointmentService.createAppointment(payload).subscribe({
      next: () => {
        this.loadAppointments();
        this.resetForm();
      },
      error: (err) => {
        this.errorMessage =
          err.error?.message || 'Doctor is not available at this time';
      }
    });
  }

  resetForm() {
    this.form = {
      patientId: '',
      appointmentDate: null as any,
      startTime: ''
    };

    this.availableTimes = [];
    this.selectedTime = '';
    this.doctorUnavailableMessage = '';
    this.errorMessage = '';
  }

  formatDate(date: any): string {

    const d = new Date(date);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  getPatientName(patientId: string) {
    const patient = this.patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : patientId;
  }

  updateStatus(id: string, status: string) {
    this.appointmentService.updateStatus(id, status).subscribe({
      next: () => this.loadAppointments()
    });
  }

  get scheduledCount() {
    return this.countAppointmentsByStatus('SCHEDULED');
  }

  get completedCount() {
    return this.countAppointmentsByStatus('COMPLETED');
  }

  get cancelledCount() {
    return this.countAppointmentsByStatus('CANCELLED');
  }

  get hasAppointmentStats() {
    return this.scheduledCount > 0 ||
      this.completedCount > 0 ||
      this.cancelledCount > 0;
  }

  dateFilter = (date: Date | null): boolean => {

    if (!date) return false;

    const day = date.getDay();
    const isPastDate = this.startOfDay(date) < this.startOfDay(this.today);

    return !isPastDate && day !== 0 && day !== 6;
  };

  private startOfDay(date: Date): number {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    return normalizedDate.getTime();
  }

  private countAppointmentsByStatus(status: string): number {
    return this.appointments.filter(appointment =>
      appointment.status?.toUpperCase() === status
    ).length;
  }

  get paginatedAppointments() {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  return this.appointments.slice(start, start + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.appointments.length / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
   
}
