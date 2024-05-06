import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { AuthenticationRoutes } from './authentication.routing';

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(AuthenticationRoutes),
		MatIconModule,
		MatCardModule,
		MatInputModule,
		MatCheckboxModule,
		MatButtonModule,
		FormsModule,
		ReactiveFormsModule,
	],
	declarations: [
		LoginComponent
	]
})
export class AuthenticationModule { }
