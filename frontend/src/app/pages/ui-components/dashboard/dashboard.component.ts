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
	currentUserRole = localStorage.getItem('userRole');
	monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	quarterNames = ['Q1', 'Q2', 'Q3', 'Q4'];
	reportType: string[] = ['Year', 'Monthly', 'Quarterly'];
	selectedReportType: string = 'Year';

	totalVawCaseSubmitted = 0;
	totalVacCaseSubmitted = 0;

	allVacs: any[] = [];
	allVaws: any[] = [];

	isLoading = true;

	allYearData: any[] = [];

	percentageVaws: any;
	percentageVacs: any;

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
			this.apiService.getAllVaws(this.currentYear, this.currentMonth),
			this.apiService.getAllVawsByParameter()
		]).subscribe(([res1, res2, res3, res4, res5, res6, res7]) => {
			if (res1 && res2) {
				this.vaw = res1;
				this.vac = res2;
				this.users = res3;
				this.barangays = res4;
				this.currentBarangay = localStorage.getItem('userRole') === 'super admin' ? "All" : this.barangays.find(r => r.id == localStorage.getItem('barangayUser')).name;
				this.totalVaw = res1.map(item => item.number_vaw);
				this.totalVac = res2.map(item => item.number_vac);
				this.totalCases = this.totalVaw.reduce((acc, curr) => acc + curr, 0) + this.totalVac.reduce((acc, curr) => acc + curr, 0);

				this.totalVawCaseSubmitted = res1.filter(r => r.status === 'Submitted' || r.status === 'Received').length;
				this.totalVacCaseSubmitted = res2.filter(r => r.status === 'Submitted' || r.status === 'Received').length;

				this.allVacs = res5;
				this.allVaws = res6;
				this.isLoading = false;
				this.allYearData = res7;
				this.updateCharts()
				this.initializeVawCasePercentage(this.currentMonth);
				this.initializeVacCasePercentage(this.currentMonth);
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
		let seriesList: any[] = [];
		for (let i = 0; i < this.allYearData.length; i++) {
			let tempData = [];
			for (let j = 0; j < this.allYearData[i].data.length; j++) {
				tempData.push(this.allYearData[i].data[j].total);
			}
			seriesList.push({ name: this.allYearData[i].name, data: tempData });
		}
		seriesList = this.currentBarangay === 'All' ? seriesList : seriesList.filter(r => r.name === this.currentBarangay);
		this.salesOverviewChart = {
			series: seriesList,
			chart: {
				height: 350,
				type: 'line',
				zoom: {
					enabled: false
				}
			},
			dataLabels: {
				enabled: false
			},
			stroke: {
				curve: 'straight'
			},
			title: {
				text: 'Product Trends by Month',
				align: 'left'
			},
			grid: {
				row: {
					colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
					opacity: 0.5
				},
			},
			xaxis: {
				categories: this.monthNames,
			}
		};
	}

	initializeMonthlyChart(month: string) {
		let seriesList: any[] = [];

		for (let i = 0; i < this.allYearData.length; i++) {
			let filteredData = [];
			let filteredCategories = [];

			for (let j = 0; j < this.allYearData[i].data.length; j++) {
				const dataItem = this.allYearData[i].data[j];

				if (dataItem.month === month && (this.currentBarangay === 'All' || this.allYearData[i].name === this.currentBarangay)) {
					filteredData.push(dataItem.total);
					filteredCategories.push(dataItem.month);
				}
			}

			if (filteredData.length > 0) {
				seriesList.push({
					name: this.allYearData[i].name,
					data: filteredData
				});
			}
		}

		this.salesOverviewChartMonthly = {
			series: seriesList,
			chart: {
				height: 350,
				type: 'line',
				zoom: {
					enabled: false
				}
			},
			dataLabels: {
				enabled: false
			},
			stroke: {
				curve: 'smooth'
			},
			title: {
				text: 'Product Trends by Month',
				align: 'left'
			},
			grid: {
				row: {
					colors: ['#f3f3f3', 'transparent'],
					opacity: 0.5
				},
			},
			xaxis: {
				categories: [month] // Updated to show all relevant months
			}
		};
	}


	_initializeMonthlyChart(month: string) {
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
		let currentQMonths: string[] = [];
		let seriesList: any[] = [];

		// Define months for each quarter
		if (q === 'Q1') {
			currentQMonths = ['January', 'February', 'March'];
		} else if (q === 'Q2') {
			currentQMonths = ['April', 'May', 'June'];
		} else if (q === 'Q3') {
			currentQMonths = ['July', 'August', 'September'];
		} else if (q === 'Q4') {
			currentQMonths = ['October', 'November', 'December'];
		}

		for (let i = 0; i < this.allYearData.length; i++) {
			let filteredData: number[] = [];
			let filteredCategories: string[] = [];

			for (let j = 0; j < this.allYearData[i].data.length; j++) {
				const dataItem = this.allYearData[i].data[j];

				// Check if the month is in the current quarter and barangay filter
				if (currentQMonths.includes(dataItem.month) &&
					(this.currentBarangay === 'All' || this.allYearData[i].name === this.currentBarangay)) {
					filteredData.push(dataItem.total);
					filteredCategories.push(dataItem.month);
				}
			}

			// Only add to seriesList if there is data to display
			if (filteredData.length > 0) {
				seriesList.push({
					name: this.allYearData[i].name,
					data: filteredData
				});
			}
		}

		this.salesOverviewChartQuarterly = {
			series: seriesList,
			chart: {
				height: 350,
				type: 'line',
				zoom: {
					enabled: false
				}
			},
			dataLabels: {
				enabled: false
			},
			stroke: {
				curve: 'smooth'
			},
			title: {
				text: 'Product Trends by Month',
				align: 'left'
			},
			grid: {
				row: {
					colors: ['#f3f3f3', 'transparent'],
					opacity: 0.5
				},
			},
			xaxis: {
				categories: currentQMonths
			}
		};
	}


	_initializeQuarterlyChart(q: string) {
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
			size: 'md',
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

	initializeVawCasePercentage(value: string) {
		this.apiService.getAllVawsPercentage(value).subscribe(res => {
			if(res) {
				this.percentageVaws = res;
			}
		})
	}

	initializeVacCasePercentage(value: string) {
		this.apiService.getAllVacsPercentage(value).subscribe(res => {
			if(res) {
				this.percentageVacs = res;
			}
		})
	}
}
