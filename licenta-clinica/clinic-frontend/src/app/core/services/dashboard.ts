import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private http = inject(HttpClient);
  private API = 'http://localhost:8080/api/admin/dashboard';

  getDashboard() {
    return this.http.get(this.API);
  }
  getCharts() {
    return this.http.get<any>('http://localhost:8080/api/admin/dashboard/charts');
  }
}