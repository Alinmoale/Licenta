import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BillingService {

  private http = inject(HttpClient);
  private API = 'http://localhost:8080/api/billing';

  getBilling() {
    return this.http.get<any[]>(this.API);
  }

  createBilling(data: any) {
    return this.http.post(this.API, data);
  }

  getRevenue() {
    return this.http.get<number>(`${this.API}/revenue`);
  }
  updateStatus(id: string, status: string) {
    return this.http.put(`${this.API}/${id}/status?status=${status}`, {});
  }
  sendInvoice(id: string) {
    return this.http.post(
      `${this.API}/${id}/send-invoice`,
      {},
      { responseType: 'text' }
    );
  }
  deleteBilling(id: string) {
    return this.http.delete(`${this.API}/${id}`);
  }

}
