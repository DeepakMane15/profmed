import { FlatTreeControl } from '@angular/cdk/tree';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { UserAuthModel } from 'src/app/common/models/UserAuthModel';
import { APIConstant } from 'src/app/common/constants/APIConstant';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public showHeader: boolean = true;



  public isLoggedIn: boolean = false; // Simulating user authentication status
  private userDataSubject = new BehaviorSubject<any>(null);
  public userData$: Observable<any> = this.userDataSubject.asObservable();
  public userProfile: any;
  private baseUrl = 'https://app.profmedservices.com/api';
  constructor(private router: Router, private http: HttpClient) {
    const userData = this.getUserData();
    if (userData) {
      this.userDataSubject.next(userData);
    }
  }


  login(userData: UserAuthModel): Observable<any> {
    const loginUrl = `${this.baseUrl}/login`; // Your login endpoint
    let fd = new FormData();
    fd.append('username', userData.email);
    fd.append('password', userData.password);

    return this.http.post<any>(loginUrl, fd);
  }

  storeUserData(userData: any) {
    sessionStorage.setItem('userData', JSON.stringify(userData));
    this.userDataSubject.next(userData);
  }

  getUserData(): any {
    return JSON.parse(sessionStorage.getItem('userData') || '{}');
  }

  logout(): void {
    window.location.reload();
    this.isLoggedIn = false;
    sessionStorage.clear();
    // this.router.navigate(['/auth']);
  }

  isAuthenticated(): boolean {
    this.userProfile = this.getUserData();
    if (this.userProfile) this.isLoggedIn = true;
    else this.isLoggedIn = false;
    return !!this.userProfile && Object.keys(this.userProfile).length !== 0; // Assuming userData exists if the user is logged in
  }

  public isUsernameAvailable(userName: FormData): Observable<any> {
    const url = `${this.baseUrl}/${APIConstant.IS_USERNAME_AVAILABLE}`;
    const httpOptions = {
      headers: new HttpHeaders({
        Token: `Bearer ${this.userProfile.token}`,
      }),
    };
    return this.http.post(url, userName, httpOptions).pipe(
      catchError((error: any) => {
        console.error('Login failed', error);
        return of(false); // Return false in case of error
      })
    );
  }

  public async checkUsernameAvailable(username: string): Promise<boolean> {
    // this.isUnameAvailable = !this.isUnameAvailable
    let fd = new FormData();
    fd.append('username', username);
    return new Promise<boolean>((resolve, reject) => {
      this.isUsernameAvailable(fd).subscribe(
        (response: any) => {
          const isAvailable: boolean = response && response.status;
          resolve(isAvailable);
        },
        (error) => {
          reject(error); // Handle error if needed
        }
      );
    });
  }
  public hideHeader() {
    this.showHeader = false;
  }
}
