import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private http = inject(HttpClient);

  private API = 'http://localhost:8080/api/patients';
  private DOCTORS_API = 'http://localhost:8080/api/admin/doctors';

  getPatients() {
    return this.http.get<any[]>(this.API);
  }

  createPatient(data: any) {
    return this.http.post(this.API, data);
  }

  updatePatient(id: string, data: any) {
    return this.http.put(`${this.API}/${id}`, data);
  }

  deletePatient(id: string) {
    return this.http.delete(`${this.API}/${id}`);
  }

  getDoctors() {
    return this.http.get<any[]>(this.DOCTORS_API);
  }
}