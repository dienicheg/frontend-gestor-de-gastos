import { Component, inject, computed, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigService } from 'src/app/config/config.service';

@Component({
  templateUrl: './presupuestos.component.html'
})

export class PresupuestosComponent  {

  public configService = inject( ConfigService )
  public router = inject( Router )
  public fb = inject ( FormBuilder )
  public user = computed(() => this.configService.currentUser())




  myForm = this.fb.group({
    presupuesto: [0, [Validators.min(1)]]
  })

  onSubmit(e: Event){
    e.preventDefault()
    this.myForm.markAllAsTouched()

    if(this.myForm.valid) {

      this.configService.updatePresupuesto({presupuesto: this.myForm.value.presupuesto!})

    }
  }

}
