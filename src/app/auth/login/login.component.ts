import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { emailPattern } from '../helpers/paterns';
import { ConfigService } from 'src/app/config/config.service';
import { Router } from '@angular/router';

@Component({
  selector: 'auth-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {


  private fb = inject(FormBuilder)
  private router = inject(Router)
  private configService = inject( ConfigService )

  myForm = this.fb.group({
    email: ['', [ Validators.required, Validators.pattern(emailPattern) ]],
    password: ['', Validators.required]
  })

  public loginErrorMessage = signal<string|null>(null)
  public handleError = signal<boolean>(false)

  onSubmit(e: Event){
    e.preventDefault()
    this.myForm.markAllAsTouched()

    if(this.myForm.valid) {
      const body = {
        email: this.myForm.controls.email.value!,
        password: this.myForm.controls.password.value!,
      }
      this.configService.loginUser(body).subscribe({
        next: () => {
          this.handleError.set(false)
          this.router.navigateByUrl('/presupuestos')
        },
        error: (message) => {
          this.loginErrorMessage.set(message)
          this.handleError.set(true)
        }
      })

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

        case 'pattern':
          return `Eso no parece un email`;
      }
    }

    return null;
  }





}
