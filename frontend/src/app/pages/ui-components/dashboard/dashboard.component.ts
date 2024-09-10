import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import {
	ApexChart,
	ChartComponent,
	ApexDataLabels,
	ApexLegend,
	ApexStroke,
	ApexTooltip,
	ApexAxisChartSeries,
	ApexXAxis,
	ApexYAxis,
	ApexGrid,
	ApexPlotOptions,
	ApexFill,
	ApexMarkers,
	ApexResponsive,
	ApexNonAxisChartSeries,
} from 'ng-apexcharts';
import { ApiService } from '../../../services/api.service';
import { User } from '../../../model/user.model';
import { forkJoin } from 'rxjs';
import { ViolenceAgainstChildren } from '../../../model/vac.model';
import { ViolenceAgainstWomen } from '../../../model/vaw.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalContentComponent } from './modal-content/model-content.component';

interface Month {
	value: string;
	viewValue: string;
}

export interface SalesOverviewChart {
	series: ApexAxisChartSeries;
	chart: ApexChart;
	dataLabels: ApexDataLabels;
	plotOptions: ApexPlotOptions;
	yaxis: ApexYAxis;
	xaxis: ApexXAxis;
	fill: ApexFill;
	tooltip: ApexTooltip;
	stroke: ApexStroke;
	legend: ApexLegend;
	grid: ApexGrid;
	marker: ApexMarkers;
}

export type ChartOptions = {
	series: ApexNonAxisChartSeries;
	chart: ApexChart;
	responsive?: ApexResponsive[];
	labels: any[];
};

interface Stats {
	id: number;
	time: string;
	color: string;
	title?: string;
	subtext?: string;
	link?: string;
}

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	encapsulation: ViewEncapsulation.None,
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
	@ViewChild('chart') chart: ChartComponent = Object.create(null);

	users: User[] = [];
	barangays: any[] = [];

	public salesOverviewChart!: Partial<SalesOverviewChart> | any;
	public salesOverviewChartMonthly!: Partial<SalesOverviewChart> | any;
	public salesOverviewChartQuarterly!: Partial<SalesOverviewChart> | any;
	public chartOptions: Partial<ChartOptions> | any;

	displayedColumns: string[] = ['assigned', 'name', 'priority', 'budget'];
	vac: ViolenceAgainstChildren[] = [];
	vaw: ViolenceAgainstWomen[] = [];
	totalVaw: number[] = [];
	totalVac: number[] = [];
	totalCases: number = 0;

	months: Month[] = [];
	currentYear = new Date().getFullYear();
	currentMonth: string = "";
	currentBarangay: string = "All";
	monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	quarterNames = ['Q1', 'Q2', 'Q3', 'Q4'];
	reportType: string[] = ['Year', 'Monthly', 'Quarterly'];
	selectedReportType: string = 'Year';

	totalVawCaseSubmitted = 0;
	totalVacCaseSubmitted = 0;

	allVacs: any[] = [];
	allVaws: any[] = [];

	constructor(
		private apiService: ApiService,
		private modalService: NgbModal
	) {
		this.currentMonth = new Date().toLocaleString('default', { month: 'long' });
		this.months = this.generateMonthsForCurrentYear();
	}

	ngOnInit() {
		forkJoin([
			this.apiService.getVaws(),
			this.apiService.getVacs(),
			this.apiService.getUsers(),
			this.apiService.getBarangays(),
			this.apiService.getAllVacs(this.currentYear, this.currentMonth),
			this.apiService.getAllVaws(this.currentYear, this.currentMonth)
		]).subscribe(([res1, res2, res3, res4, res5, res6]) => {
			if (res1 && res2) {
				this.vaw = res1;
				this.vac = res2;
				this.users = res3;
				this.barangays = res4;
				this.totalVaw = res1.map(item => item.number_vaw);
				this.totalVac = res2.map(item => item.number_vac);
				this.totalCases = this.totalVaw.reduce((acc, curr) => acc + curr, 0) + this.totalVac.reduce((acc, curr) => acc + curr, 0);
				this.updateCharts();

				this.totalVawCaseSubmitted = res1.filter(r => r.status === 'Submitted').length;
				this.totalVacCaseSubmitted = res2.filter(r => r.status === 'Submitted').length;

				this.allVacs = res5;
				this.allVaws = res6;
			}
		});
	}

	updateCharts() {
		if (this.selectedReportType === 'Year') {
			this.initializeChart();
		} else if (this.selectedReportType === 'Monthly') {
			this.initializeMonthlyChart(this.currentMonth);
		} else if (this.selectedReportType === 'Quarterly') {
			this.initializeQuarterlyChart('Q1');
		}
	}

	initializeChart() {
		const filteredVaw = this.currentBarangay === 'All' ? this.vaw : this.vaw.filter(v => v.barangay === this.currentBarangay.toString().toString());
		const filteredVac = this.currentBarangay === 'All' ? this.vac : this.vac.filter(v => v.barangay === this.currentBarangay.toString().toString());
		this.totalVaw = filteredVaw.map(item => item.number_vaw);
		this.totalVac = filteredVac.map(item => item.number_vac);

		this.salesOverviewChart = {
			series: [
				{
					name: 'Violence Against Children',
					data: this.totalVac,
					color: '#5D87FF',
				},
				{
					name: 'Violence Against Women',
					data: this.totalVaw,
					color: '#49BEFF',
				},
			],
			grid: {
				borderColor: 'rgba(0,0,0,0.1)',
				strokeDashArray: 3,
				xaxis: { lines: { show: false } },
			},
			plotOptions: { bar: { horizontal: false, columnWidth: '35%', borderRadius: [4] } },
			chart: { type: 'bar', height: 390, offsetX: -15, toolbar: { show: false }, foreColor: '#adb0bb', fontFamily: 'inherit', sparkline: { enabled: false } },
			dataLabels: { enabled: false },
			markers: { size: 0 },
			legend: { show: false },
			xaxis: { type: 'category', categories: this.monthNames, labels: { style: { cssClass: 'grey--text lighten-2--text fill-color' } } },
			yaxis: { show: true, min: 0, max: 500, tickAmount: 4, labels: { style: { cssClass: 'grey--text lighten-2--text fill-color' } } },
			stroke: { show: true, width: 3, lineCap: 'butt', colors: ['transparent'] },
			tooltip: { theme: 'light' },
			responsive: [{ breakpoint: 600, options: { plotOptions: { bar: { borderRadius: 3 } } } }],
		};
	}

	initializeMonthlyChart(month: string) {
		const filteredVac = this.currentBarangay === 'All' ? this.vac : this.vac.filter(v => v.barangay === this.currentBarangay.toString());
		const filteredVaw = this.currentBarangay === 'All' ? this.vaw : this.vaw.filter(v => v.barangay === this.currentBarangay.toString());

		const currentMonthVac = filteredVac.filter(f => f.month === month).map(item => item.number_vac);
		const currentMonthVaw = filteredVaw.filter(f => f.month === month).map(item => item.number_vaw);

		this.salesOverviewChartMonthly = {
			series: [
				{
					name: 'Violence Against Children',
					data: currentMonthVac,
					color: '#5D87FF',
				},
				{
					name: 'Violence Against Women',
					data: currentMonthVaw,
					color: '#49BEFF',
				},
			],
			grid: { borderColor: 'rgba(0,0,0,0.1)', strokeDashArray: 3, xaxis: { lines: { show: false } } },
			plotOptions: { bar: { horizontal: false, columnWidth: '35%', borderRadius: [4] } },
			chart: { type: 'bar', height: 390, offsetX: -15, toolbar: { show: false }, foreColor: '#adb0bb', fontFamily: 'inherit', sparkline: { enabled: false } },
			dataLabels: { enabled: false },
			markers: { size: 0 },
			legend: { show: false },
			xaxis: { type: 'category', categories: [month], labels: { style: { cssClass: 'grey--text lighten-2--text fill-color' } } },
			yaxis: { show: true, min: 0, max: 500, tickAmount: 4, labels: { style: { cssClass: 'grey--text lighten-2--text fill-color' } } },
			stroke: { show: true, width: 3, lineCap: 'butt', colors: ['transparent'] },
			tooltip: { theme: 'light' },
			responsive: [{ breakpoint: 600, options: { plotOptions: { bar: { borderRadius: 3 } } } }],
		};
	}

	initializeQuarterlyChart(q: string) {
		const filteredVac = this.currentBarangay === 'All' ? this.vac : this.vac.filter(v => v.barangay === this.currentBarangay.toString());
		const filteredVaw = this.currentBarangay === 'All' ? this.vaw : this.vaw.filter(v => v.barangay === this.currentBarangay.toString());

		let VacPerQuarterData: number[] = [];
		let VawPerQuarterData: number[] = [];
		let currentQMonths: string[] = [];

		if (q === 'Q1') {
			currentQMonths = ['January', 'February', 'March'];
		} else if (q === 'Q2') {
			currentQMonths = ['April', 'May', 'June'];
		} else if (q === 'Q3') {
			currentQMonths = ['July', 'August', 'September'];
		} else if (q === 'Q4') {
			currentQMonths = ['October', 'November', 'December'];
		}

		VacPerQuarterData = filteredVac.filter(f => currentQMonths.includes(f.month)).map(item => item.number_vac);
		VawPerQuarterData = filteredVaw.filter(f => currentQMonths.includes(f.month)).map(item => item.number_vaw);

		this.salesOverviewChartQuarterly = {
			series: [
				{
					name: 'Violence Against Children',
					data: VacPerQuarterData,
					color: '#5D87FF',
				},
				{
					name: 'Violence Against Women',
					data: VawPerQuarterData,
					color: '#49BEFF',
				},
			],
			grid: { borderColor: 'rgba(0,0,0,0.1)', strokeDashArray: 3, xaxis: { lines: { show: false } } },
			plotOptions: { bar: { horizontal: false, columnWidth: '35%', borderRadius: [4] } },
			chart: { type: 'bar', height: 390, offsetX: -15, toolbar: { show: false }, foreColor: '#adb0bb', fontFamily: 'inherit', sparkline: { enabled: false } },
			dataLabels: { enabled: false },
			markers: { size: 0 },
			legend: { show: false },
			xaxis: { type: 'category', categories: currentQMonths, labels: { style: { cssClass: 'grey--text lighten-2--text fill-color' } } },
			yaxis: { show: true, min: 0, max: 500, tickAmount: 4, labels: { style: { cssClass: 'grey--text lighten-2--text fill-color' } } },
			stroke: { show: true, width: 3, lineCap: 'butt', colors: ['transparent'] },
			tooltip: { theme: 'light' },
			responsive: [{ breakpoint: 600, options: { plotOptions: { bar: { borderRadius: 3 } } } }],
		};
	}

	generateMonthsForCurrentYear(): Month[] {
		const currentYear = new Date().getFullYear();
		return this.monthNames.map((name, i) => ({
			value: name,
			viewValue: `${name} ${currentYear}`
		}));
	}

	onReportTypeChange(event: any) {
		this.selectedReportType = event?.value;
		this.updateCharts();
	}

	onBarangayChange(event: any) {
		this.currentBarangay = event?.value;
		this.updateCharts();
	}

	getCurrentMonth() {
		const currentMonthIndex = new Date().getMonth();
		return this.monthNames[currentMonthIndex];
	}

	view(type: string) {
		const modalRef = this.modalService.open(ModalContentComponent, {
			size: 'lg',
			backdrop: 'static',
			centered: true
		});

		if (type === 'vaw') {
			modalRef.componentInstance.data = this.allVaws;
		} else if (type === 'vac') {
			modalRef.componentInstance.data = this.allVacs;
		} else {
			modalRef.componentInstance.data = [];
		}
	}

}
