import {
	Component,
	Output,
	EventEmitter,
	Input,
	ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CasesVawFormComponent } from '../../cases-vaw-form/cases-vaw-form.component';
import { ViolenceAgainstWomen } from '../../../../model/vaw.model';
import { CasesVacFormComponent } from '../../cases-vac-form/cases-vac-form.component';


@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
	@Input() showToggle = true;
	@Input() toggleChecked = false;
	@Output() toggleMobileNav = new EventEmitter<void>();
	@Output() toggleMobileFilterNav = new EventEmitter<void>();
	@Output() toggleCollapsed = new EventEmitter<void>();

	showFiller = false;
	barangay = localStorage.getItem('barangayUser');
	barangayName: string[] = [];
	superAdmin: boolean = false;

	notificationList: any[] = [];

	constructor(
		public dialog: MatDialog, 
		private authService: AuthService,
		private router: Router,
		private apiService: ApiService,
		private modalService: NgbModal
	) { 
		const userRole = localStorage.getItem('userRole');
		this.superAdmin = userRole && userRole === 'super admin' ? true : false;
	}

	ngOnInit() {
		this.apiService.getBarangayById(this.barangay).subscribe(res => {
			if(res) {
				this.barangayName = res?.name;
			}
		})
		this.apiService.getUserNotification().subscribe(res => {
			if(res) {
				this.notificationList = res;
			}
		})
	}

	logout() {
        this.authService.logout().subscribe(
            () => {
				this.router.navigate(['login']);
            }
        );
    }

	openNotification(data: any) {
		if(data.type === 'VAW') {
			this.apiService.getVaw(data.id).subscribe(res => {
				if(res) {
					const modalRef = this.modalService.open(CasesVawFormComponent, { size: 'lg', backdrop: 'static', centered: true });
					modalRef.componentInstance.vawData = res;
				}
			})
		}
		if(data.type === 'VAC') {
			this.apiService.getVac(data.id).subscribe(res => {
				if(res) {
					const modalRef = this.modalService.open(CasesVacFormComponent, { size: 'lg', backdrop: 'static', centered: true });
					modalRef.componentInstance.vacData = res;
				}
			})
		}
	}
}
