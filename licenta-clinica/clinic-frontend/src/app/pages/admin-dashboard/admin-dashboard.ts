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
  styleUrl: './admin-dashboard.scss',
})

export class AdminDashboard implements OnInit {

  private dashboardService = inject(DashboardService);

  stats: any = null;
  chartMode: 'daily' | 'monthly' = 'monthly';
  chartRawData: any = null;

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
        this.chartRawData = data;

        this.loadRevenueChart();
        this.loadConsultationChart();
      }
    });
  }

  setChartMode(mode: 'daily' | 'monthly') {
    this.chartMode = mode;
    this.loadRevenueChart();
  }

  loadRevenueChart() {
    if (!this.chartRawData) return;

    if (this.chartMode === 'monthly') {
      const revenueEntries = Object.entries(this.chartRawData.revenueByMonth);

      this.revenueChartData = {
        labels: revenueEntries.map((item: any) =>
          this.getMonthName(Number(item[0]))
        ),
        datasets: [
          {
            data: revenueEntries.map((item: any) => Number(item[1])),
            label: 'Revenue by Month'
          }
        ]
      };
    } else {

      const revenueMap = this.chartRawData.revenueByDay;

      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth();

      const lastDay = today.getDate();
      const labels = [];
      const values = [];

      for (let day = 1; day <= lastDay; day++) {
        const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        labels.push(String(day));
        values.push(Number(revenueMap[dateKey] || 0));
      }

      this.revenueChartData = {
        labels,
        datasets: [
          {
            data: values,
            label: 'Revenue by Day'
          }
        ]
      };
    }
  }

  loadConsultationChart() {
    const consultationEntries = Object.entries(this.chartRawData.consultations);

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