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

interface month {
	value: string;
	viewValue: string;
}

export interface salesOverviewChart {
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

interface stats {
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

	public salesOverviewChart!: Partial<salesOverviewChart> | any;
	public salesOverviewChartMonthly!: Partial<salesOverviewChart> | any;
	public salesOverviewChartQuarterly!: Partial<salesOverviewChart> | any;
	public chartOptions: Partial<ChartOptions> | any;

	displayedColumns: string[] = ['assigned', 'name', 'priority', 'budget'];
	vac: ViolenceAgainstChildren[] = [];
	vaw: ViolenceAgainstWomen[] = [];
	totalVaw: number[] = [];
	totalVac: number[] = [];
	totalCases: number = 0;

	months: month[] = [];
	currentMonth: string = "";

	monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	quarterNames = ['Q1', 'Q2', 'Q3', 'Q4']
	reportType: string[]  = ['Year', 'Monthly', 'Quarterly'];
	selectedReportType: string = 'Year';

	constructor(
		private apiService: ApiService
	) {
		this.currentMonth = new Date().toLocaleString('default', { month: 'long' });
		this.months = this.generateMonthsForCurrentYear();
	}

	ngOnInit() {
		forkJoin([
			this.apiService.getVaws(),
			this.apiService.getVacs(),
			this.apiService.getUsers()
		]).subscribe(([res1, res2, res3]) => {
			if (res1 && res2) {
				this.vaw = res1;
				this.vac = res2;
				this.totalVaw  = res1.map(item => item.number_vaw);
				this.totalVac = res2.map(item => item.number_vac);
				this.users = res3;
				const totalVawSum = this.totalVaw.reduce((acc, curr) => acc + curr, 0);
				const totalVacSum = this.totalVac.reduce((acc, curr) => acc + curr, 0);
				this.totalCases = totalVawSum + totalVacSum;
				this.initializeChart();
			}
		});
	}

	initializeChart() {
		this.totalVaw  = this.vaw.map(item => item.number_vaw);
		this.totalVac = this.vac.map(item => item.number_vac);
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
				xaxis: {
					lines: {
						show: false,
					},
				},
			},
			plotOptions: {
				bar: { horizontal: false, columnWidth: '35%', borderRadius: [4] },
			},
			chart: {
				type: 'bar',
				height: 390,
				offsetX: -15,
				toolbar: { show: false },
				foreColor: '#adb0bb',
				fontFamily: 'inherit',
				sparkline: { enabled: false },
			},
			dataLabels: { enabled: false },
			markers: { size: 0 },
			legend: { show: false },
			xaxis: {
				type: 'category',
				categories: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
				labels: {
					style: { cssClass: 'grey--text lighten-2--text fill-color' },
				},
			},
			yaxis: {
				show: true,
				min: 0,
				max: 100,
				tickAmount: 4,
				labels: {
					style: {
						cssClass: 'grey--text lighten-2--text fill-color',
					},
				},
			},
			stroke: {
				show: true,
				width: 3,
				lineCap: 'butt',
				colors: ['transparent'],
			},
			tooltip: { theme: 'light' },

			responsive: [
				{
					breakpoint: 600,
					options: {
						plotOptions: {
							bar: {
								borderRadius: 3,
							},
						},
					},
				},
			],
		};
	}

	initializeMonthlyChart(month: any) {
		const currentMonthVac = this.vac.length > 0 ? this.vac.filter(f => f.month === month).map(item => item.number_vac) : [];
		const currentMonthVaw = this.vaw.length > 0 ? this.vaw.filter(f => f.month === month).map(item => item.number_vaw) : [];
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

			grid: {
				borderColor: 'rgba(0,0,0,0.1)',
				strokeDashArray: 3,
				xaxis: {
					lines: {
						show: false,
					},
				},
			},
			plotOptions: {
				bar: { horizontal: false, columnWidth: '35%', borderRadius: [4] },
			},
			chart: {
				type: 'bar',
				height: 390,
				offsetX: -15,
				toolbar: { show: false },
				foreColor: '#adb0bb',
				fontFamily: 'inherit',
				sparkline: { enabled: false },
			},
			dataLabels: { enabled: false },
			markers: { size: 0 },
			legend: { show: false },
			xaxis: {
				type: 'category',
				categories: [month],
				labels: {
					style: { cssClass: 'grey--text lighten-2--text fill-color' },
				},
			},
			yaxis: {
				show: true,
				min: 0,
				max: 100,
				tickAmount: 4,
				labels: {
					style: {
						cssClass: 'grey--text lighten-2--text fill-color',
					},
				},
			},
			stroke: {
				show: true,
				width: 3,
				lineCap: 'butt',
				colors: ['transparent'],
			},
			tooltip: { theme: 'light' },

			responsive: [
				{
					breakpoint: 600,
					options: {
						plotOptions: {
							bar: {
								borderRadius: 3,
							},
						},
					},
				},
			],
		};
	}

	initializeQuarterlyChart(q: any) {
		let VacPerQuarterData: number[] = [];
		let VawPerQuarterData: number[] = [];
		let currentQMonths: string[] = [];
		if (q === 'Q1') {
			currentQMonths = ['January', 'February', 'March'];
			VacPerQuarterData = this.vac.length > 0 ? this.vac.filter(f => currentQMonths.includes(f.month)).map(item => item.number_vac) : [];
			VawPerQuarterData = this.vaw.length > 0 ? this.vaw.filter(f => currentQMonths.includes(f.month)).map(item => item.number_vaw) : [];
		}
		if (q === 'Q2') {
			currentQMonths = ['April', 'May', 'June'];
			VacPerQuarterData = this.vac.length > 0 ? this.vac.filter(f => currentQMonths.includes(f.month)).map(item => item.number_vac) : [];
			VawPerQuarterData = this.vaw.length > 0 ? this.vaw.filter(f => currentQMonths.includes(f.month)).map(item => item.number_vaw) : [];
		}
		if (q === 'Q3') {
			currentQMonths = ['July', 'August', 'September'];
			VacPerQuarterData = this.vac.length > 0 ? this.vac.filter(f => currentQMonths.includes(f.month)).map(item => item.number_vac) : [];
			VawPerQuarterData = this.vaw.length > 0 ? this.vaw.filter(f => currentQMonths.includes(f.month)).map(item => item.number_vaw) : [];
		}
		if (q === 'Q4') {
			currentQMonths = ['October', 'November', 'December'];
			VacPerQuarterData = this.vac.length > 0 ? this.vac.filter(f => currentQMonths.includes(f.month)).map(item => item.number_vac) : [];
			VawPerQuarterData = this.vaw.length > 0 ? this.vaw.filter(f => currentQMonths.includes(f.month)).map(item => item.number_vaw) : [];
		}
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

			grid: {
				borderColor: 'rgba(0,0,0,0.1)',
				strokeDashArray: 3,
				xaxis: {
					lines: {
						show: false,
					},
				},
			},
			plotOptions: {
				bar: { horizontal: false, columnWidth: '35%', borderRadius: [4] },
			},
			chart: {
				type: 'bar',
				height: 390,
				offsetX: -15,
				toolbar: { show: false },
				foreColor: '#adb0bb',
				fontFamily: 'inherit',
				sparkline: { enabled: false },
			},
			dataLabels: { enabled: false },
			markers: { size: 0 },
			legend: { show: false },
			xaxis: {
				type: 'category',
				categories: currentQMonths,
				labels: {
					style: { cssClass: 'grey--text lighten-2--text fill-color' },
				},
			},
			yaxis: {
				show: true,
				min: 0,
				max: 100,
				tickAmount: 4,
				labels: {
					style: {
						cssClass: 'grey--text lighten-2--text fill-color',
					},
				},
			},
			stroke: {
				show: true,
				width: 3,
				lineCap: 'butt',
				colors: ['transparent'],
			},
			tooltip: { theme: 'light' },

			responsive: [
				{
					breakpoint: 600,
					options: {
						plotOptions: {
							bar: {
								borderRadius: 3,
							},
						},
					},
				},
			],
		};
	}

	generateMonthsForCurrentYear(): month[] {
		const currentYear = new Date().getFullYear();
		const months: month[] = [];
	
		for (let i = 0; i < 12; i++) {
			const monthValue = ('0' + (i + 1)).slice(-2);
			const monthName = this.monthNames[i];
			months.push({ value: monthName, viewValue: `${monthName} ${currentYear}` });
		}
		return months;
	}

	onReportTypeChange(event: any) {
		if(event?.value === 'Monthly') {
			const currentMonth = this.getCurrentMonth();
			this.initializeMonthlyChart(currentMonth);
		} else if(event?.value === 'Quarterly') {
			this.initializeQuarterlyChart('Q1');
		} else {
			this.initializeChart();
		}
	}
	getCurrentMonth() {
		const currentMonthIndex = new Date().getMonth();
		return this.monthNames[currentMonthIndex];
	}
}
