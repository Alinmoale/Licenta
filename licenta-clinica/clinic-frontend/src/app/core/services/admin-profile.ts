import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminProfileService {

  private http = inject(HttpClient);
  private API = 'http://localhost:8080/api/admin/profile';

  getProfile(userId: string) {
    return this.http.get<any>(`${this.API}/${userId}`);
  }

  updateProfile(userId: string, data: any) {
    return this.http.put<any>(`${this.API}/${userId}`, data);
  }

  changePassword(userId: string, data: any) {
    return this.http.put(
      `${this.API}/${userId}/change-password`,
      data,
      { responseType: 'text' }
    );
  }
}
