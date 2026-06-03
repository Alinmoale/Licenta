import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {

  private http = inject(HttpClient);
  private API = 'http://localhost:8080/api/consultations';

  getConsultationsByPatient(patientId: string) {
    return this.http.get<any[]>(`${this.API}/patient/${patientId}`);
  }

  getConsultationsByDoctor(doctorId: string) {
    return this.http.get<any[]>(`${this.API}/doctor/${doctorId}`);
  }

  createConsultation(data: any) {
    return this.http.post(this.API, data);
  }
  updateConsultation(id: string, consultation: any) {
    return this.http.put(
      `${this.API}/${id}`,
      consultation
    );
  }
    deleteConsultation(id: string) {
    return this.http.delete(`${this.API}/${id}`);
  }

  sendConsultationEmail(consultationId: string) {
  return this.http.post(
    `${this.API}/${consultationId}/send-email`,
    {},
    { responseType: 'text' }
  );
}
}