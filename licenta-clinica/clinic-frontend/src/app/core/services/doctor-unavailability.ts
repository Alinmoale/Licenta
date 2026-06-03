import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DoctorUnavailabilityService {

  private http = inject(HttpClient);
  private API = 'http://localhost:8080/api/doctor-unavailability';

  getByDoctor(doctorId: string) {
    return this.http.get<any[]>(`${this.API}/doctor/${doctorId}`);
  }

  create(data: any) {
    return this.http.post(this.API, data);
  }

  delete(id: string) {
    return this.http.delete(`${this.API}/${id}`);
  }
  getAll() {
    return this.http.get<any[]>(this.API);
  }
}