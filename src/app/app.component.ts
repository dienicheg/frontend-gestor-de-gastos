import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from './config/config.service'
import { AuthStatus } from './config/interfaces/auth-status.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  private configService = inject( ConfigService )
  private router = inject( Router )


  public finishedAuthCheck = computed<boolean>( () => {
    if( this.configService.authStatus() === AuthStatus.checking){
      return false
    }

    return true

  })


  public authStatusChangedEffect = effect(() => {

    switch(this.configService.authStatus()) {
      case AuthStatus.checking:
        return
      case AuthStatus.authenticated:
        this.router.navigateByUrl('/presupuestos')
        return
      case AuthStatus.notAuthenticated:
        return
    }

  })
}
