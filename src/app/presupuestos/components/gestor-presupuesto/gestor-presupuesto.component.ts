import { Component, inject, computed, OnInit, signal, effect, Input, } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigService } from 'src/app/config/config.service';

@Component({
  selector: 'app-gestor-presupuesto',
  templateUrl: './gestor-presupuesto.component.html'
})
export class GestorPresupuestoComponent implements OnInit {

  public fb = inject ( FormBuilder )

  public configService = inject( ConfigService )
  public router        = inject( Router )
  public user          = computed(() => this.configService.currentUser())

  public presupuesto   = computed(() => this.configService.presupuesto())
  public disponible    = computed(() => this.configService.disponible())
  public totalGastado  = computed(() => this.configService.totalGastado())

  public gastos        = computed(() => this.configService.gastos())

  public porcentajeGastado = computed(() => {
    if(this.configService.currentUser()?.presupuesto === 0) return

    const nuevoPorcentaje = ((this.user()!.presupuesto - this.disponible()) / this.user()!.presupuesto * 100).toFixed(2)
    return +nuevoPorcentaje
  })


  visible: boolean = false

  myForm = this.fb.group({
    presupuesto: [this.user()?.presupuesto, [Validators.min(1)]]
  })

  onSubmit(e: Event){
    e.preventDefault()
    this.myForm.markAllAsTouched()

    if(this.myForm.valid) {
      this.configService.updatePresupuesto({presupuesto: this.myForm.value.presupuesto!})
      this.visible = false
    }
  }

  onDelete(id: string){
    this.configService.deleteGasto(id)
  }

  showDialog() {
    this.visible = true;
  }

  ngOnInit(): void {
    this.configService.getGastos()
  }


}
