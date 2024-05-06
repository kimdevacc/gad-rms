import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, tap  } from 'rxjs/operators';
import { User } from '../model/user.model';
import { ViolenceAgainstWomen } from '../model/vaw.model';
import { ViolenceAgainstChildren } from '../model/vac.model';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    apiUrl = 'http://localhost:8000/api';
    authToken: any = null;

    constructor(private http: HttpClient) {
        this.authToken = localStorage.getItem('authToken');
    }

    getCities(): Observable<any[]> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.get<any[]>(`${this.apiUrl}/cities`, { headers }).pipe(
                catchError(error => {
                    console.error('Error fetching cities:', error);
                    return of([]);
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of([]);
        }
    }

    getBarangays(): Observable<any[]> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.get<any[]>(`${this.apiUrl}/barangays`, { headers }).pipe(
                catchError(error => {
                    console.error('Error fetching barangays:', error);
                    return of([]);
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of([]);
        }
    }

    getBarangaysByCity(cityId: any): Observable<any> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.get<any[]>(`${this.apiUrl}/barangays/${cityId}`, { headers }).pipe(
                catchError(error => {
                    console.error('Error fetching barangays:', error);
                    return of([]);
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of([]);
        }
    }

    getBarangayById(id: any): Observable<any> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.get<any[]>(`${this.apiUrl}/barangay/${id}`, { headers }).pipe(
                catchError(error => {
                    console.error('Error fetching barangays:', error);
                    return of([]);
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of([]);
        }
    }
    /* START USER */
    getUsers(): Observable<User[]> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.get<any[]>(`${this.apiUrl}/users`, { headers }).pipe(
                catchError(error => {
                    console.error('Error fetching users:', error);
                    return of([]);
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of([]);
        }
    }

    saveUser(user: FormGroup): Observable<User> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authToken);
        return this.http.post<any>(`${this.apiUrl}/users`, user.value, { headers }).pipe(
            tap ((response) => {
                console.log(response);
            }),
            catchError(error => {
                console.error('Error saving user:', error);
                throw error; // Rethrow the error after logging
            })
        );
    }

    updateUser(user: FormGroup): Observable<User> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authToken);
        return this.http.patch<any>(`${this.apiUrl}/users`, user.value, { headers }).pipe(
            tap((response) => {
                // console.log(response);
            }),
            catchError(error => {
                console.error('Error saving user:', error);
                throw error; // Rethrow the error after logging
            })
        );
    }

    deleteUser(id: number): Observable<User> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authToken);

        return this.http.delete<any>(`${this.apiUrl}/users/${id}`, { headers }).pipe(
            tap((response) => {
                // console.log(response);
            }),
            catchError(error => {
                console.error('Error saving user:', error);
                throw error; // Rethrow the error after logging
            })
        );
    }

    getUserById(id: any): Observable<any> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.get<any[]>(`${this.apiUrl}/users/${id}`, { headers }).pipe(
                catchError(error => {
                    console.error('Error fetching users:', error);
                    return of([]);
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of([]);
        }
    }
    /* END USER */

    /* START VAWS */
    getVaws(): Observable<ViolenceAgainstWomen[]> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.get<any[]>(`${this.apiUrl}/vaws`, { headers }).pipe(
                catchError(error => {
                    console.error('Error fetching vaws:', error);
                    return of([]);
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of([]);
        }
    }

    saveVaws(vaws: FormGroup): Observable<ViolenceAgainstWomen> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authToken);
        return this.http.post<any>(`${this.apiUrl}/vaws`, vaws.value, { headers }).pipe(
            tap ((response) => {
            }),
            catchError(error => {
                console.error('Error saving vaws:', error);
                throw error; // Rethrow the error after logging
            })
        );
    }

    updateVaws(vaws: FormGroup): Observable<ViolenceAgainstWomen> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authToken);
        return this.http.patch<any>(`${this.apiUrl}/vaws`, vaws.value, { headers }).pipe(
            tap((response) => {
                // console.log(response);
            }),
            catchError(error => {
                console.error('Error saving vaws:', error);
                throw error; // Rethrow the error after logging
            })
        );
    }

    deleteVaws(id: number): Observable<ViolenceAgainstWomen> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authToken);

        return this.http.delete<any>(`${this.apiUrl}/vaws/${id}`, { headers }).pipe(
            tap((response) => {
                // console.log(response);
            }),
            catchError(error => {
                console.error('Error saving vaws:', error);
                throw error; // Rethrow the error after logging
            })
        );
    }
    /* END VAWS */

    /* START VACS */
    getVacs(): Observable<ViolenceAgainstChildren[]> {
        if (this.authToken) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`);
            return this.http.get<any[]>(`${this.apiUrl}/vacs`, { headers }).pipe(
                catchError(error => {
                    console.error('Error fetching vaws:', error);
                    return of([]);
                })
            );
        } else {
            console.error('Authentication token is missing');
            return of([]);
        }
    }

    saveVacs(vacs: FormGroup): Observable<ViolenceAgainstChildren> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authToken);
        return this.http.post<any>(`${this.apiUrl}/vacs`, vacs.value, { headers }).pipe(
            tap ((response) => {
            }),
            catchError(error => {
                console.error('Error saving vacs:', error);
                throw error; // Rethrow the error after logging
            })
        );
    }

    updateVacs(vacs: FormGroup): Observable<ViolenceAgainstChildren> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authToken);
        return this.http.patch<any>(`${this.apiUrl}/vacs`, vacs.value, { headers }).pipe(
            tap((response) => {
                // console.log(response);
            }),
            catchError(error => {
                console.error('Error saving vacs:', error);
                throw error; // Rethrow the error after logging
            })
        );
    }

    deleteVacs(id: number): Observable<ViolenceAgainstChildren> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authToken);

        return this.http.delete<any>(`${this.apiUrl}/vacs/${id}`, { headers }).pipe(
            tap((response) => {
                // console.log(response);
            }),
            catchError(error => {
                console.error('Error saving vacs:', error);
                throw error; // Rethrow the error after logging
            })
        );
    }
    /* END VACS */
}