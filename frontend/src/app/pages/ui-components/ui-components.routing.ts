import { Routes } from '@angular/router';

// ui
import { VawComponent } from './vaw/vaw.component';
import { VacComponent } from './vac/vac.component';
import { CasesComponent } from './cases/cases.component';
import { GadWorkersComponent } from './gad-wrokers/gad-workers.component';
import { ProfileComponent } from './profile/profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GadWorkersFormComponent } from './gad-workers-form/gad-workers-form.component';
import { CasesVawFormComponent } from './cases-vaw-form/cases-vaw-form.component';

export const UiComponentsRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'dashboard',
				component: DashboardComponent,
			},
			{
				path: 'vaw',
				component: VawComponent,
			},
			{
				path: 'vac',
				component: VacComponent,
			},
			{
				path: 'cases',
				component: CasesComponent,
			},
			{
				path: 'cases/vaw',
				component: CasesVawFormComponent
			},
			{
				path: 'gad-workers',
				component: GadWorkersComponent
			},
			{
				path: 'gad-workers/edit',
				component: GadWorkersFormComponent
			},
			{
				path: 'gad-workers/create',
				component: GadWorkersFormComponent
			},
			{
				path: 'profile',
				component: ProfileComponent,
			}
		],
	},
];
