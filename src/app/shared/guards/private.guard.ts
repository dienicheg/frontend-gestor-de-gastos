import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ConfigService } from 'src/app/config/config.service';
import { AuthStatus } from 'src/app/config/interfaces/auth-status.enum';

export const privateGuard: CanActivateFn = (route, state) => {
const { authStatus } = inject(ConfigService)
const router = inject( Router )


if( authStatus() === AuthStatus.authenticated ){
  return true;
}


if( authStatus() === AuthStatus.checking ){
  return false;
}


router.navigateByUrl('/auth/login')
return false;

};
