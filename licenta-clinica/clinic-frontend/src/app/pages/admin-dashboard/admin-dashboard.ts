import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/services/dashboard';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, Sidebar, BaseChartDirective],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})

export class AdminDashboard implements OnInit {

  private dashboardService = inject(DashboardService);

  stats: any = null;

  ngOnInit(): void {
    this.dashboardService.getDashboard().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: () => {
        alert('Could not load dashboard');
      }
    });
    this.dashboardService.getCharts().subscribe({
    next: (data) => {

      const revenueEntries = Object.entries(data.revenue);
      const consultationEntries = Object.entries(data.consultations);

      this.revenueChartData = {
        labels: revenueEntries.map((item: any) =>
          this.getMonthName(Number(item[0]))
        ),
        datasets: [
          {
            data: revenueEntries.map((item: any) => Number(item[1])),
            label: 'Revenue'
          }
        ]
      };

      this.consultationChartData = {
        labels: consultationEntries.map((item: any) =>
          this.getMonthName(Number(item[0]))
        ),
        datasets: [
          {
            data: consultationEntries.map((item: any) => Number(item[1])),
            label: 'Consultations'
          }
        ]
      };
    }
  });
  }

  getMonthName(month: number): string {

    const months = [
      '',
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];

    return months[month];
  }
  revenueChartData: any;
  consultationChartData: any;

  chartOptions = {
    responsive: true
  };
}