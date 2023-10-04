import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ConfigService } from 'src/app/config/config.service';
import { AuthStatus } from 'src/app/config/interfaces/auth-status.enum';

export const publicGuard: CanActivateFn = (route, state) => {

  const { authStatus } = inject(ConfigService)
  const router = inject( Router )

  if( authStatus() === AuthStatus.authenticated){
    router.navigateByUrl('/presupuestos')

    return false
  }

  return true
};
