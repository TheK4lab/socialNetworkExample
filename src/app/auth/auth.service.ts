import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AuthData } from './auth-data.model';

@Injectable({ providedIn: 'root'})
export class AuthService {
    private isAuthenticated = false;
    private token: string;
    private tokenTimer: any;
    private userId: string;
    private authStatusListener = new Subject<boolean>();

    constructor(private http: HttpClient, private router: Router) {}

    // tslint:disable-next-line: typedef
    getToken() {
        return this.token;
    }

    // tslint:disable-next-line: typedef
    getIsAuth() {
        return this.isAuthenticated;
    }

    // tslint:disable-next-line: typedef
    getUserId() {
        return this.userId;
    }

    // tslint:disable-next-line: typedef
    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    // tslint:disable-next-line: typedef
    createUser(email: string, password: string) {
        const authData: AuthData = { email, password };
        this.http
            .post('http://localhost:3000/api/user/signup', authData)
            .subscribe(() => {
                this.router.navigate(['/']);
            },
            error => {
                this.authStatusListener.next(false);
            });
    }

    // tslint:disable-next-line: typedef
    login(email: string, password: string) {
        const authData: AuthData = { email, password };
        this.http
            .post<{ token: string, expiresIn: number, userId: string }>('http://localhost:3000/api/user/login', authData)
            .subscribe(response => {
            const token = response.token;
            this.token = token;
            if (token) {
                const expiresInDuration = response.expiresIn;
                this.setAuthTimer(expiresInDuration);
                this.isAuthenticated = true;
                this.userId = response.userId;
                this.authStatusListener.next(true);
                const now = new Date();
                const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                this.saveAuthData(token, expirationDate, this.userId);
                this.router.navigate(['/posts']);
            }
        }, error => {
            this.authStatusListener.next(false);
        });
    }

    // tslint:disable-next-line: typedef
    autoAuthUser() {
        const authInformation = this.getAuthData();
        if (!authInformation) {
            return;
        }
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        if (expiresIn > 0) {
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.userId = authInformation.userId;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
        }
    }

    // tslint:disable-next-line: typedef
    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        this.userId = null;
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(['/']);
    }

    // tslint:disable-next-line: typedef
    private setAuthTimer(duration: number) {
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    // tslint:disable-next-line: typedef
    private saveAuthData(token: string, expirationDate: Date, userId: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('userId', userId);
    }

    // tslint:disable-next-line: typedef
    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userId');
    }

    // tslint:disable-next-line: typedef
    private getAuthData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        const userId = localStorage.getItem('userId');
        if (!token || !expirationDate) {
            return;
        }
        return {
            token,
            expirationDate: new Date(expirationDate),
            userId
        };
    }
}
