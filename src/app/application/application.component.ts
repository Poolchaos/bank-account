import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '../_helpers/_services/authentication.service';
import { IAccount } from '@acme/namespaces';
import { ApiService } from '../services/api.service';

@Component({templateUrl: 'application.component.html'})
export class ApplicationComponent implements OnInit {

  public user: any;
  public accounts: Array<IAccount> = [];
  public withdrawForm: FormGroup;
  public loading = false;
  public submitted = false;
  public error = '';

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private authenticationService: AuthenticationService,
              private ngxService: NgxUiLoaderService,
              private apiService: ApiService) { }

  ngOnInit() {
    this.withdrawForm = this.formBuilder.group({
      amount: ['', Validators.required]
    });

    this.startLoader();
    this.getUser();
    this.getAccounts();
  }

  private getUser(): void {
    try {
      this.user = JSON.parse(localStorage.getItem('currentUser'));
    } catch (e) {}
  }

  private startLoader(): void {
    this.ngxService.startLoader('loader');
  }

  private stopLoader(): void {
    this.ngxService.stopLoader('loader');
  }

  private getAccounts(): void {
    this.apiService.getAccounts()
      .subscribe(
        data => this.handleContentRetrieved(data),
        error => this.handleContentRetrievalError(error)
      );
  }

  private handleContentRetrieved(data: Array<any>): void {
    this.accounts = data.map(acc => {
      acc.balance = parseInt(acc.balance);
      return acc;
    });
    this.stopLoader();
  }

  private handleContentRetrievalError(error: string): void {
    this.stopLoader();
  }

  public enableWithdraw(accountNumber: number): void {
    this.accounts.map((acc: IAccount) => {
      acc.active = acc.account_number === accountNumber;
    });
    this.resetForm();
  }

  public cancelWithdraw() {
    this.accounts.map((acc: IAccount) => acc.active = false);
    this.resetForm();
  }

  private resetForm() {
    this.withdrawForm.reset();
    this.error = '';
  }

  public withdraw(accountNumber: number) {
    // todo: I would like to add stronger validation on the amount and balance

    const amount = this.withdrawData.amount.value;
    const account = this.accounts.find(acc => acc.account_number === accountNumber);
    const balance = account.balance;

    if (this.hasBalance(balance)) {

      if (this.isWithinOverdraft(balance, amount)) {
        alert('Success');
        this.resetForm();
      } else {
        this.error = 'You can only have R500 in overdraft.';
      }
    } else {
      this.error = 'You have insufficient funds.';
    }
  }

  private hasBalance(balance: number): boolean {
    return balance > -20.00;
  }

  private isWithinOverdraft(balance: number, amount: number): boolean {
    return (balance - amount) > -500;
  }

  public canWithdraw(_balance: string) {
    const balance = parseInt(_balance);
    return balance <= -20;
  }

  public logout(): void {
    this.authenticationService.logout();
    this.router.navigate(['']);
  }

  // convenience getter for easy access to form fields
  get withdrawData() {
    return this.withdrawForm.controls;
  }
}
