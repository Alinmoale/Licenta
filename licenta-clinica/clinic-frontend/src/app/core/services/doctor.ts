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
}