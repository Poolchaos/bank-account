import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../../_helpers/_services';

@Component({templateUrl: 'login.component.html'})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public loading = false;
  public submitted = false;
  public returnUrl: string;
  public error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get loginData() {
    return this.loginForm.controls;
  }

  public login(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.loginData.username.value, this.loginData.password.value)
      .pipe(first())
      .subscribe(
        () => {
          this.router.navigate(['dashboard']);
        },
        error => {
          if (error === 'Not Found') {
            this.error = 'Something information you entered is incorrect.';
          }
          this.loading = false;
        });
  }

  public navigateToRegister(): void {
    this.router.navigate(['register']);
  }

  public leaveVault(): void {
    this.router.navigate(['']);
  }
}
