import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private http = inject(HttpClient);
  private API = 'http://localhost:8080/api/appointments';

  getAppointments() {
    return this.http.get<any[]>(this.API);
  }

  getAppointmentsByDoctor(doctorId: string) {
    return this.http.get<any[]>(`${this.API}/doctor/${doctorId}`);
  }

  createAppointment(data: any) {
    return this.http.post(this.API, data);
  }

  updateStatus(id: string, status: string) {
    return this.http.put(`${this.API}/${id}/status?status=${status}`, {});
  }

  deleteAppointment(id: string) {
    return this.http.delete(`${this.API}/${id}`);
  }
  getAvailableTimes(doctorId: string, date: string) {
  return this.http.get<string[]>(
    `${this.API}/doctor/${doctorId}/available-times?date=${date}`
  );
}
}