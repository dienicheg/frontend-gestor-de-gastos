import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { emailPattern } from '../helpers/paterns';
import { ConfigService } from 'src/app/config/config.service';
import { notMatchPasswords } from 'src/app/auth/directives/password-match.directive';
import { Router } from '@angular/router';



@Component({
  selector: 'auth-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private http = inject(ConfigService)
  private router = inject( Router )

  myForm = new FormGroup({
    'name': new FormControl('', [Validators.required, Validators.minLength(3)]),
    'email': new FormControl('', [ Validators.required, Validators.pattern(emailPattern) ]),
    'password': new FormControl('', [ Validators.required, Validators.minLength(8) ]),
    'repetirPassword': new FormControl('', [Validators.required] )
  }, { validators: notMatchPasswords })

  public registerErrorMessage = signal<string|null>(null)
  public handleError = signal<boolean>(false)

  public handleSuccess = signal<boolean>(false)
  public registerSuccessMessage = signal<string|null>(null)

  public visibleSpinner = false


  onSubmit(e: Event){
    e.preventDefault()
    this.myForm.markAllAsTouched()

    if(this.myForm.valid) {
      this.visibleSpinner = true


      const body = {
        name: this.myForm.controls.name.value!,
        email: this.myForm.controls.email.value!,
        password: this.myForm.controls.password.value!,
      }
      this.http.createUser(body).subscribe({
        next: ({msg}) => {
          this.handleError.set(false)
          this.handleSuccess.set(true)
          this.registerSuccessMessage.set(msg)
          this.visibleSpinner = false
          setTimeout(() => {
            this.router.navigateByUrl('/auth/login')
          }, 1500);
        },
        error: (message) => {
          this.handleSuccess.set(false)
          this.handleError.set(true)
          this.visibleSpinner = false
          this.registerErrorMessage.set(message)
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
          return 'Este campo es requerido.';

        case 'minlength':
          return `Mínimo ${ errors['minlength'].requiredLength } caracters.`;

        case 'pattern':
          return 'Eso no parece un email.';

        case 'notMatchPassword':
          return 'Las contraseñas no coinciden.';

      }
    }

    return null;
  }

}
