import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ConsultationService } from '../../core/services/consultation';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { BillingService } from '../../core/services/billing';
import { PatientService } from '../../core/services/patient';
import { DoctorService } from '../../core/services/doctor';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './billing.html',
  styleUrl: './billing.scss'
})
export class Billing implements OnInit {

  private billingService = inject(BillingService);
  private patientService = inject(PatientService);
  private doctorService = inject(DoctorService);
  private consultationService = inject(ConsultationService);

  consultations: any[] = [];
  billings: any[] = [];
  patients: any[] = [];
  doctors: any[] = [];
  filteredPatients: any[] = [];
  billingChartData: any;


  revenue = 0;

  form = {
    patientId: '',
    doctorId: '',
    consultationId: '',
    serviceName: '',
    price: 0
  };

  ngOnInit(): void {
    this.loadBilling();
    this.loadPatients();
    this.loadDoctors();
    this.loadRevenue();
  }

  loadBilling() {
    this.billingService.getBilling().subscribe({
      next: (data) => {
        this.billings = data.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();

          return dateB - dateA;
        });
      }
    });
  }

  loadPatients() {
    this.patientService.getPatients().subscribe({
      next: (data) => this.patients = data
    });
  }

  loadDoctors() {
    this.doctorService.getDoctors().subscribe({
      next: (data) => this.doctors = data
    });
  }

  loadRevenue() {
    this.billingService.getRevenue().subscribe({
      next: (data) => this.revenue = data
    });
  }

  saveBilling() {
    this.billingService.createBilling(this.form).subscribe({
      next: () => {
        this.loadBilling();
        this.loadRevenue();
        this.resetForm();
      },
      error: () => alert('Could not create billing')
    });
  }

  resetForm() {
    this.form = {
      patientId: '',
      doctorId: '',
      consultationId: '',
      serviceName: '',
      price: 0
    };
  }

  getPatientName(patientId: string) {
    const patient = this.patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : '-';
  }

  getDoctorName(doctorId: string) {
    const doctor = this.doctors.find(d => d.id === doctorId);
    return doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : '-';
  }
  
  loadConsultationsForPatient() {
    this.form.consultationId = '';

    if (!this.form.patientId) {
      this.consultations = [];
      return;
    }

    this.consultationService.getConsultationsByPatient(this.form.patientId).subscribe({
      next: (data) => {
        this.consultations = data;
      }
    });
  }
  
  onDoctorChange() {
    this.form.patientId = '';
    this.form.consultationId = '';
    this.consultations = [];

    if (!this.form.doctorId) {
      this.filteredPatients = [];
      return;
    }

    this.patientService.getPatientsByDoctor(this.form.doctorId).subscribe({
      next: (data) => {
        this.filteredPatients = data;
      }
    });
  }
  get paidCount() {
    return this.billings.filter(b => b.status === 'PAID').length;
  }

  get unpaidCount() {
    return this.billings.filter(b => b.status === 'UNPAID').length;
  }

  get cancelledCount() {
    return this.billings.filter(b => b.status === 'CANCELLED').length;
  }

  getMonthName(month: number): string {

    const months = [
      '',
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];

    return months[month];
  }

  loadChart() {

    const revenueByMonth = new Map<number, number>();

    this.billings
      .filter(b => b.status === 'PAID')
      .forEach(billing => {

        const month = new Date(billing.createdAt).getMonth() + 1;

        revenueByMonth.set(
          month,
          (revenueByMonth.get(month) || 0) + billing.price
        );
      });

    const labels = Array.from(revenueByMonth.keys())
      .sort((a, b) => a - b)
      .map(month => this.getMonthName(month));

    const values = Array.from(revenueByMonth.entries())
      .sort((a, b) => a[0] - b[0])
      .map(entry => entry[1]);

    this.billingChartData = {
      labels,
      datasets: [
        {
          data: values,
          label: 'Revenue'
        }
      ]
    };
  }
  updateStatus(id: string, status: string) {
    this.billingService.updateStatus(id, status).subscribe({
      next: () => {
        this.loadBilling();
        this.loadRevenue();
      }
    });
  }

  sendInvoice(id: string) {
    this.billingService.sendInvoice(id).subscribe({
      next: () => {
        alert('Invoice sent successfully');
      },
      error: () => {
        alert('Invoice can only be sent for paid billing records');
      }
    });
  }

  deleteBilling(id: string) {

    if (!confirm('Delete billing record?')) {
      return;
    }

    this.billingService.deleteBilling(id).subscribe({
      next: () => {
        this.loadBilling();
      }
    });
  }
}
