import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({ templateUrl: 'public.component.html' })

export class PublicComponent {

  constructor(private router: Router) {}

  private home(): void {
    this.router.navigate(['']);
  }

  private enterVault(): void {
    this.router.navigate(['login']);
  }
}
