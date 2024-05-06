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
	barangay = localStorage.getItem('barangay');
	barangayName: string[] = [];

	constructor(
		public dialog: MatDialog, 
		private authService: AuthService,
		private router: Router,
		private apiService: ApiService
	) { }

	ngOnInit() {
		this.apiService.getBarangayById(this.barangay).subscribe(res => {
			if(res) {
				this.barangayName = res?.name;
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
}
