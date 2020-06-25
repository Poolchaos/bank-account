import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../../_helpers/_services';

@Component({templateUrl: 'register.component.html'})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      surname: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get registerData() {
    return this.registerForm.controls;
  }

  private register(): void {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    const payload = {
      firstName: this.registerData.firstName.value,
      surname: this.registerData.surname.value,
      username: this.registerData.username.value,
      password: this.registerData.password.value
    };
    this.authenticationService.register(payload)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['login']);
        },
        error => {
          if (error === 'Bad Request') {
            this.error = 'Username already taken.';
          }
          this.loading = false;
        });
  }

  private navigateToLogin(): void {
    this.router.navigate(['login']);
  }
}
