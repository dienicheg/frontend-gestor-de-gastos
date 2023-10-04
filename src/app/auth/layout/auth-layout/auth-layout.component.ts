import { Component, effect, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';
import { ConfigService } from 'src/app/config/config.service';
import { AuthStatus } from 'src/app/config/interfaces/auth-status.enum';

@Component({
  templateUrl: './auth-layout.component.html',
  styles: [
  ]
})
export class AuthLayoutComponent {

  private router = inject( Router )
  private configService = inject( ConfigService )



  public authStatusChangedEffect = effect(() => {
    if(this.configService.authStatus() === AuthStatus.authenticated ) {}
    switch(this.configService.authStatus()) {
      case AuthStatus.checking:
        console.log()
        return
      case AuthStatus.authenticated:
        this.router.navigateByUrl('/presupuestos')
        return
      case AuthStatus.notAuthenticated:
        return
    }

  })
}
