import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';


import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MenubarModule } from 'primeng/menubar';
import { PresupuestosComponent } from './pages/presupuestos/presupuestos.component';
import { PresupuestosRoutingModule } from './presupuestos-routing.module';
import { ProgressBarModule } from 'primeng/progressbar';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { CardModule } from 'primeng/card';
import { ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe } from './pipes/currency.pipe';
import { GestorPresupuestoComponent } from './components/gestor-presupuesto/gestor-presupuesto.component';

@NgModule({
  declarations: [
    PresupuestosComponent,
    NavbarComponent,
    DialogComponent,
    CurrencyPipe,
    GestorPresupuestoComponent
  ],
  imports: [
    ButtonModule,
    CardModule,
    CommonModule,
    DialogModule,
    MenubarModule,
    PresupuestosRoutingModule,
    ProgressBarModule,
    ReactiveFormsModule

  ]
})
export class PresupuestosModule { }
