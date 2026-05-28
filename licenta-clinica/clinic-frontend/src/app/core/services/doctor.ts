import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private http = inject(HttpClient);
  private API = 'http://localhost:8080/api/admin/doctors';

  getDoctors() {
    return this.http.get<any[]>(this.API);
  }

  createDoctor(data: any) {
    return this.http.post(this.API, data);
  }

  updateDoctor(id: string, data: any) {
  return this.http.put(`${this.API}/${id}`, data);
  }

  deleteDoctor(id: string) {
    return this.http.delete(`${this.API}/${id}`);
  }

  getDoctorProfile(doctorId: string) {
    return this.http.get<any>(`http://localhost:8080/api/doctor/profile/${doctorId}`);
  }

  updateDoctorProfile(doctorId: string, data: any) {
    return this.http.put<any>(`http://localhost:8080/api/doctor/profile/${doctorId}`, data);
  }

  changePassword(doctorId: string, data: any) {
    return this.http.put(
      `http://localhost:8080/api/doctor/profile/${doctorId}/change-password`,
      data,
      { responseType: 'text' }
    );
  }
}