import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

import { UiComponentsRoutes } from './ui-components.routing';

// ui components
import { MatNativeDateModule } from '@angular/material/core';
import { GadWorkersComponent } from './gad-wrokers/gad-workers.component';
import { VacComponent } from './vac/vac.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VawComponent } from './vaw/vaw.component';
import { ProfileComponent } from './profile/profile.component';
import { CasesComponent } from './cases/cases.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FormComponent } from './common/form/form.component';
import { GadWorkersFormComponent } from './gad-workers-form/gad-workers-form.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CasesVawFormComponent } from './cases-vaw-form/cases-vaw-form.component';
import { CasesVawListComponent } from './cases-vaw-list/cases-vaw-list.component';
import { CasesVacListComponent } from './cases-vac-list/cases-vac-list.component';
import { CasesVacFormComponent } from './cases-vac-form/cases-vac-form.component';
import { VawSummaryComponent } from './vaw-summary/vaw-summary.component';
import { VawMonitoringComponent } from './vaw-monitoring/vaw-monitoring.component';
import { VacSummaryComponent } from './vac-summary/vac.-summarycomponent';
import { VacMonitoringComponent } from './vac-monitoring/vac-monitoring.component';
import { ConfirmationDialogComponent } from './common/confirmation-dialog/confirmation-dialog.component';
import { SettingsComponent } from './settings/settings.component';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';
import { ArchiveComponent } from './archive/archive.component';
import { ModalContentComponent } from './dashboard/modal-content/model-content.component';

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(UiComponentsRoutes),
		MaterialModule,
		FormsModule,
		ReactiveFormsModule,
		TablerIconsModule.pick(TablerIcons),
		MatNativeDateModule,
		NgApexchartsModule,
		NgxPaginationModule
	],
	declarations: [
		DashboardComponent,
		// GadWorkersComponent,
		GadWorkersFormComponent,
		VacComponent,
		VacMonitoringComponent,
		VacSummaryComponent,
		VawComponent,
		VawMonitoringComponent,
		VawSummaryComponent,
		ProfileComponent,
		SettingsComponent,
		AuditLogsComponent,
		ArchiveComponent,
		CasesComponent,
		CasesVawListComponent,
		CasesVawFormComponent,
		CasesVacListComponent,
		CasesVacFormComponent,
		FormComponent,
		ConfirmationDialogComponent,
		ModalContentComponent
	],
	providers: [
		DatePipe
	]
})
export class UicomponentsModule { }
