import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';
import { ViolenceAgainstWomen } from '../../../model/vaw.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-cases-vaw-form',
	templateUrl: './cases-vaw-form.component.html',
	styleUrls: ['./cases-vaw-form.component.scss']
})
export class CasesVawFormComponent implements OnInit {

	@Input() vawData: ViolenceAgainstWomen | undefined;
	@Output() recordCreated: EventEmitter<ViolenceAgainstWomen> = new EventEmitter<ViolenceAgainstWomen>();
	vawForm: FormGroup;
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    barangay = localStorage.getItem('barangay');

	constructor(
		private formBuilder: FormBuilder,
        private apiService: ApiService,
        private _snackBar: MatSnackBar,
		public activeModal: NgbActiveModal
	) {
		this.vawForm = this.formBuilder.group({
            id: null,
            number_vaw: [{value: 0, disabled: true}],
			// number_vaw: 0,
			physical_abuse: 0,
            sexual_abuse: 0,
            psychological_abuse: 0,
            economic_abuse: 0,
            issued_bpo: 0,
            referred_lowdo: 0,
            referred_court: 0,
            referred_pnp: 0,
            referred_nbi: 0,
            referred_medical: 0,
            month: '',
            barangay: 0,
            trainings: 0,
            counseling: 0,
            iec: 0,
            fund_allocation: 0,
            remarks: '',
        });
	 }

	ngOnInit() {
        if(this.vawData) {
            this.initializeForm();
        }
	}

    ngOnChanges(changes: SimpleChanges) {
        if (changes['vawData'] && !changes['vawData'].firstChange) {
            this.initializeForm();
        }
    }

    private initializeForm() {
        this.vawForm.patchValue({
            id: this.vawData!.id,
            number_vaw: this.vawData!.number_vaw,
			physical_abuse: this.vawData!.physical_abuse,
            sexual_abuse: this.vawData!.sexual_abuse,
            psychological_abuse: this.vawData!.psychological_abuse,
            economic_abuse: this.vawData!.economic_abuse,
            issued_bpo: this.vawData!.issued_bpo,
            referred_lowdo: this.vawData!.referred_lowdo,
            referred_court: this.vawData!.referred_court,
            referred_pnp: this.vawData!.referred_pnp,
            referred_nbi: this.vawData!.referred_nbi,
            referred_medical: this.vawData!.referred_medical,
            month: this.vawData!.month,
            trainings: this.vawData!.trainings,
            counseling: this.vawData!.counseling,
            iec: this.vawData!.iec,
            fund_allocation: this.vawData!.fund_allocation,
            remarks: this.vawData!.remarks,
        });
    }

	submitVaw() {
		if(this.vawData) {
            this.apiService.updateVaws(this.vawForm).subscribe((res) => {
				this.activeModal.close();
                this.openSnackBar('VAWs Record updated successfully', 'Close');
                this.recordCreated.emit(res);
            });
        } else {
            this.apiService.saveVaws(this.vawForm).subscribe((res) => {
				this.activeModal.close();
				this.openSnackBar('VAWs Record Created successfully', 'Close');
				this.recordCreated.emit(res);
            });
        }
	}

	openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
            duration: 2000,
        });
    }

	calculateTotalCases() {
        const controls = this.vawForm.controls;
        let total = 0;
        for (const controlName in controls) {
            if(controls.hasOwnProperty(controlName)) {
                if(controlName === 'physical_abuse') {
                    total += +controls[controlName].value;
                }
                if(controlName === 'psychological_abuse') {
                    total += +controls[controlName].value;
                }
                if(controlName === 'economic_abuse') {
                    total += +controls[controlName].value;
                }
                if(controlName === 'sexual_abuse') {
                    total += +controls[controlName].value;
                }
            }
        }
        this.vawForm.patchValue({ number_vaw: total });
    }
}
