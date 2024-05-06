import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ViolenceAgainstChildren } from '../../../model/vac.model';

@Component({
	selector: 'app-cases-vac-form',
	templateUrl: './cases-vac-form.component.html',
	styleUrls: ['./cases-vac-form.component.scss']
})
export class CasesVacFormComponent implements OnInit {

	@Input() vacData: ViolenceAgainstChildren | undefined;
	@Output() recordCreatedVac: EventEmitter<ViolenceAgainstChildren> = new EventEmitter<ViolenceAgainstChildren>();
	vacForm: FormGroup;
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    barangay = localStorage.getItem('barangay');

	constructor(
		private formBuilder: FormBuilder,
        private apiService: ApiService,
        private _snackBar: MatSnackBar,
		public activeModal: NgbActiveModal
	) {
		this.vacForm = this.formBuilder.group({
            id:0,
            month: '',
            number_vac:0,
            male:0,
            female:0,
            range_one:0,
            range_two:0,
            range_three:0,
            range_four:0,
            range_five:0,
            physical_abuse:0,
            sexual_abuse:0,
            psychological_abuse:0,
            neglect:0,
            others:0,
            immediate_family:0,
            other_close_relative:0,
            acquaintance:0,
            stranger:0,
            local_official:0,
            law_enforcer:0,
            other_guardians:0,
            referred_pnp:0,
            referred_nbi:0,
            referred_medical:0,
            referred_legal_assist:0,
            referred_others:0,
            barangay: this.barangay,
            trainings: 0,
            counseling: 0,
            iec: 0,
            fund_allocation: 0,
            remarks: '',
        });
	 }

	ngOnInit() {
        if(this.vacData) {
            this.initializeForm();
        }
	}

    ngOnChanges(changes: SimpleChanges) {
        if (changes['vacData'] && !changes['vacData'].firstChange) {
            this.initializeForm();
        }
    }

    private initializeForm() {
        this.vacForm.patchValue({
            id: this.vacData!.id,
            month: this.vacData!.month,
            number_vac: this.vacData!.number_vac,
            male: this.vacData!.male,
            female: this.vacData!.female,
            range_one: this.vacData!.range_one,
            range_two: this.vacData!.range_two,
            range_three: this.vacData!.range_three,
            range_four: this.vacData!.range_four,
            range_five: this.vacData!.range_five,
            physical_abuse: this.vacData!.physical_abuse,
            sexual_abuse: this.vacData!.sexual_abuse,
            psychological_abuse: this.vacData!.psychological_abuse,
            neglect: this.vacData!.neglect,
            others: this.vacData!.others,
            immediate_family: this.vacData!.immediate_family,
            other_close_relative: this.vacData!.other_close_relative,
            acquaintance: this.vacData!.acquaintance,
            stranger: this.vacData!.stranger,
            local_official: this.vacData!.local_official,
            law_enforcer: this.vacData!.law_enforcer,
            other_guardians: this.vacData!.other_guardians,
            referred_pnp: this.vacData!.referred_pnp,
            referred_nbi: this.vacData!.referred_nbi,
            referred_medical: this.vacData!.referred_medical,
            referred_legal_assist: this.vacData!.referred_legal_assist,
            referred_others: this.vacData!.referred_others,
            trainings: this.vacData!.trainings,
            counseling: this.vacData!.counseling,
            iec: this.vacData!.iec,
            fund_allocation: this.vacData!.fund_allocation,
            remarks: this.vacData!.remarks,
        });
    }
    
    

	submitVac() {
		if(this.vacData) {
            this.apiService.updateVacs(this.vacForm).subscribe((res) => {
				this.activeModal.close();
                this.openSnackBar('VACs Record updated successfully', 'Close');
                this.recordCreatedVac.emit(res);
            });
        } else {
            this.apiService.saveVacs(this.vacForm).subscribe((res) => {
				this.activeModal.close();
				this.openSnackBar('VACs Record Created successfully', 'Close');
				this.recordCreatedVac.emit(res);
            });
        }
	}

	openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
            duration: 2000,
        });
    }

	calculateTotalCases() {
        const controls = this.vacForm.controls;
        let total = 0;
        for (const controlName in controls) {
            if (
                    controls.hasOwnProperty(controlName) && 
                    controlName !== 'month' &&
                    controlName !== 'number_vac' &&
                    controlName !== 'male' &&
                    controlName !== 'female' &&
                    controlName !== 'range_one' &&
                    controlName !== 'range_two' &&
                    controlName !== 'range_three' &&
                    controlName !== 'range_four' &&
                    controlName !== 'range_five' &&
                    controlName !== 'immediate_family' &&
                    controlName !== 'other_close_relative' &&
                    controlName !== 'acquaintance' &&
                    controlName !== 'stranger' &&
                    controlName !== 'local_official' &&
                    controlName !== 'law_enforcer' &&
                    controlName !== 'other_guardians' &&
                    controlName !== 'referred_pnp' &&
                    controlName !== 'referred_nbi' &&
                    controlName !== 'referred_medical' &&
                    controlName !== 'referred_legal_assist' &&
                    controlName !== 'referred_others'
            ) {
                total += +controls[controlName].value;
            }
        }
        this.vacForm.patchValue({ number_vac: total });
    }
}
