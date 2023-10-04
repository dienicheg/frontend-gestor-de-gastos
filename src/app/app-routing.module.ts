import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { privateGuard } from './shared/guards/private.guard';
import { publicGuard } from './shared/guards/public.guard';

const routes: Routes = [
  {
    path: 'auth',
    canActivate: [publicGuard],
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'presupuestos',
    canActivate: [privateGuard],
    loadChildren: () => import('./presupuestos/presupuestos.module').then(m => m.PresupuestosModule)
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];;

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
