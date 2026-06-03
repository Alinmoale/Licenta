import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Sidebar } from '../../shared/sidebar/sidebar';
import { AppointmentService } from '../../core/services/appointment';
import { DoctorService } from '../../core/services/doctor';
import { PatientService } from '../../core/services/patient';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { DatePickerModule } from 'primeng/datepicker';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar,DatePickerModule, MatDatepickerModule, MatNativeDateModule, MatInputModule],
  templateUrl: './appointments.html',
  styleUrl: './appointments.scss'
})
export class Appointments implements OnInit {

  private appointmentService = inject(AppointmentService);
  private doctorService = inject(DoctorService);
  private patientService = inject(PatientService);

  appointments: any[] = [];
  doctors: any[] = [];
  filteredPatients: any[] = [];
  availableTimes: string[] = [];
  selectedTime = '';
  currentPage = 1;
  itemsPerPage = 10;
  patients: any[] = [];
  openMenuId: string | null = null;


  form = {
    doctorId: '',
    patientId: '',
    appointmentDate: null as any,
    startTime: ''
  };

  errorMessage = '';

  ngOnInit(): void {
    this.loadAppointments();
    this.loadDoctors();
    this.loadPatients();
  }

  loadAppointments() {
    this.appointmentService.getAppointments().subscribe({
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
    this.patientService.getPatients().subscribe({
      next: (data) => {
        this.patients = data;
      }
    });
  }

  loadDoctors() {
    this.doctorService.getDoctors().subscribe({
      next: (data) => this.doctors = data
    });
  }

  onDoctorChange() {
    this.form.patientId = '';
    this.filteredPatients = [];

    if (!this.form.doctorId) return;

    this.patientService.getPatientsByDoctor(this.form.doctorId).subscribe({
      next: (data) => this.filteredPatients = data
    });
  }

  saveAppointment() {
    this.errorMessage = '';

    if (
      !this.form.doctorId ||
      !this.form.patientId ||
      !this.form.appointmentDate ||
      !this.form.startTime
    ) {
      this.errorMessage = 'All fields are required';
      return;
    }

    const payload = {
      ...this.form,
      appointmentDate: this.formatDate(this.form.appointmentDate)
    };

    this.appointmentService.createAppointment(payload).subscribe({
      next: () => {
        this.loadAppointments();
        this.resetForm();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Doctor is not available at this time';
      }
    });
  }
    toggleMenu(id: string, event: Event) {
    event.stopPropagation();

    this.openMenuId =
      this.openMenuId === id
        ? null
        : id;
  }

  @HostListener('document:click')
  closeMenu() {
    this.openMenuId = null;
  }

  updateStatus(id: string, status: string) {
    this.appointmentService.updateStatus(id, status).subscribe({
      next: () => this.loadAppointments()
    });
  }

  deleteAppointment(id: string) {
    if (confirm('Delete appointment?')) {
      this.appointmentService.deleteAppointment(id).subscribe({
        next: () => this.loadAppointments()
      });
    }
  }

  formatDate(date: any): string {

    const d = new Date(date);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  resetForm() {
    this.form = {
      doctorId: '',
      patientId: '',
      appointmentDate: '',
      startTime: ''
    };
    this.filteredPatients = [];
  }

  getDoctorName(doctorId: string) {
    const doctor = this.doctors.find(d => d.id === doctorId);
    return doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : doctorId;
  }

  getPatientName(patientId: string) {
    const patient = this.filteredPatients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : patientId;
  }
  loadAvailableTimes() {

  this.availableTimes = [];
  this.selectedTime = '';

  if (!this.form.doctorId || !this.form.appointmentDate) {
    return;
  }

  const formattedDate = this.formatDate(this.form.appointmentDate);

    this.appointmentService
      .getAvailableTimes(this.form.doctorId, formattedDate)
      .subscribe({
        next: (data) => {
          this.availableTimes = data;
        }
      });
  }
  selectTime(time: string) {
    this.selectedTime = time;
    this.form.startTime = time;
  }
  dateFilter = (date: Date | null): boolean => {

    if (!date) return false;

    const day = date.getDay();

    // 0 = Sunday
    // 6 = Saturday

    return day !== 0 && day !== 6;
  };
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
  getPatientNameById(patientId: string) {

    const patient = this.patients.find(
      p => p.id === patientId
    );

    return patient
      ? `${patient.firstName} ${patient.lastName}`
      : patientId;
  }
}
