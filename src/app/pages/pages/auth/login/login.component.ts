import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserAuthModel } from 'src/app/common/models/UserAuthModel';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'vex-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUp400ms],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatCheckboxModule,
    RouterLink,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ]
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });
  public loggingIn: boolean = false;

  inputType = 'password';
  visible = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private snackbar: MatSnackBar,
    private _authService: AuthService
  ) {}

  // send() {
  //   this.router.navigate(['/']);
  //   this.snackbar.open(
  //     "Lucky you! Looks like you didn't need a password or email address! For a real application we provide validators to prevent this. ;)",
  //     'THANKS',
  //     {
  //       duration: 10000
  //     }
  //   );
  // }

  toggleVisibility() {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
      this.cd.markForCheck();
    } else {
      this.inputType = 'text';
      this.visible = true;
      this.cd.markForCheck();
    }
  }

  login() {
    if (this.loginForm.valid && !this.loggingIn) {
      this.loggingIn = true;
      const formModel: UserAuthModel = this.loginForm.value as UserAuthModel;
      this._authService.login(formModel).subscribe(
        (response) => {
          if (response.status) {
            this._authService.storeUserData(response.data);
            // this._chatService.createNewUser('angular-firebase@profmedservices.com','firebaseProfmed@2024');
            this.router.navigate(['/']);
          } else {
            console.error('Login failed', response.message);
          }
          this.loggingIn = false;
        },
        (error) => {
          console.error('Login failed', error);
          this.loggingIn = false;
        }
      );
    }
  }
}
