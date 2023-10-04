import { Component, Input, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ConfigService } from '../../../config/config.service';
import { Gasto } from 'src/app/config/interfaces/gasto.interface';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styles: [
  ]
})


export class DialogComponent {


  private fb = inject( FormBuilder )

  private configService = inject(ConfigService)

  @Input()
  gasto: Gasto | null = null



  myForm = this.fb.group({
    nombre: ['', [ Validators.required, Validators.minLength(3) ]],
    cantidad: [0, [ Validators.required, Validators.min(1) ]],
    categoria: ['', [Validators.required, ] ],
  })

  visible: boolean = false

  showDialog(gasto: Gasto | null){
    if(gasto){
      this.myForm.controls.nombre.setValue(gasto.nombre)
      this.myForm.controls.cantidad.setValue(gasto.cantidad)
      this.myForm.controls.categoria.setValue(gasto.categoria)
    }
    this.visible = true
  }

  onSubmit(e: Event){
    e.preventDefault()
    this.myForm.markAllAsTouched()

    if(this.myForm.valid){

      if( this.gasto ){

        this.configService.updateGasto(this.gasto._id!, {
          categoria: this.myForm.controls.categoria.value!,
          nombre: this.myForm.controls.nombre.value!,
          cantidad: +this.myForm.controls.cantidad.value!,
        })
        this.visible = false
        this.myForm.reset()
        return
      }


      this.configService.createGasto({
        categoria: this.myForm.controls.categoria.value!,
        nombre: this.myForm.controls.nombre.value!,
        cantidad: +this.myForm.controls.cantidad.value!,
      })

      this.visible = false
      this.myForm.reset()
    }
  }



  isValidField( field: FormControl ): boolean | null {
    return field.errors && field.touched
  }

  getFieldError( field: FormControl ): string | null {
    if ( !field ) return null;

    const errors = field.errors || {};

    for (const key of Object.keys(errors) ) {
      switch( key ) {
        case 'required':
          return 'Este campo es requerido';

        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracteres`;

        case 'min':
          return `Candidad debe ser un número positivo`;
      }
    }

     return null;
  }
}
