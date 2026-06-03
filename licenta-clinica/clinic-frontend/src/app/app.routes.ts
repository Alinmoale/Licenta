import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { Doctors } from './pages/doctors/doctors';
import { Patients } from './pages/patients/patients';
import { Consultations } from './pages/consultations/consultations';
import { Billing } from './pages/billing/billing';
import { DoctorDashboard } from './pages/doctor-dashboard/doctor-dashboard';
import { DoctorPatients } from './pages/doctor-patients/doctor-patients';
import { DoctorConsultations } from './pages/doctor-consultations/doctor-consultations';
import { DoctorProfile } from './pages/doctor-profile/doctor-profile';
import { Appointments } from './pages/appointments/appointments';
import { DoctorAppointments } from './pages/doctor-appointments/doctor-appointments';
import { AdminProfile } from './pages/admin-profile/admin-profile';
import { doctorGuard } from './core/guards/doctor-guard';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
  {
    path: '',
    component: Login
  },

  // ADMIN
  {
    path: 'admin/dashboard',
    component: AdminDashboard,
    canActivate: [adminGuard]
  },
  {
    path: 'admin/doctors',
    component: Doctors,
    canActivate: [adminGuard]
  },
  {
    path: 'admin/patients',
    component: Patients,
    canActivate: [adminGuard]
  },
  {
    path: 'admin/consultations',
    component: Consultations,
    canActivate: [adminGuard]
  },
  {
    path: 'admin/billing',
    component: Billing,
    canActivate: [adminGuard]
  },
  {
    path: 'admin/appointments',
    component: Appointments,
    canActivate: [adminGuard]
  },
  {
    path: 'admin/profile',
    component: AdminProfile,
    canActivate: [adminGuard]
  },

  // DOCTOR
  {
    path: 'doctor/dashboard',
    component: DoctorDashboard,
    canActivate: [doctorGuard]
  },
  {
    path: 'doctor/patients',
    component: DoctorPatients,
    canActivate: [doctorGuard]
  },
  {
    path: 'doctor/consultations',
    component: DoctorConsultations,
    canActivate: [doctorGuard]
  },
  {
    path: 'doctor/profile',
    component: DoctorProfile,
    canActivate: [doctorGuard]
  },
  {
    path: 'doctor/appointments',
    component: DoctorAppointments,
    canActivate: [doctorGuard]
  }
];