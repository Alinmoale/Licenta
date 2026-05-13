import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { Doctors } from './pages/doctors/doctors';
import { Patients } from './pages/patients/patients';
import { Consultations } from './pages/consultations/consultations';
import { Billing } from './pages/billing/billing';
import { DoctorDashboard } from './pages/doctor-dashboard/doctor-dashboard';
import { DoctorPatients } from './pages/doctor-patients/doctor-patients';

export const routes: Routes = [
  {
    path: '',
    component: Login
  },

  // ADMIN
  {
    path: 'admin/dashboard',
    component: AdminDashboard
  },
  {
    path: 'admin/doctors',
    component: Doctors
  },
  {
    path: 'admin/patients',
    component: Patients
  },
  {
    path: 'admin/consultations',
    component: Consultations
  },
  {
    path: 'admin/billing',
    component: Billing
  },

  // DOCTOR
  {
    path: 'doctor/dashboard',
    component: DoctorDashboard
  },
  {
    path: 'doctor/patients',
    component: DoctorPatients
  }
];