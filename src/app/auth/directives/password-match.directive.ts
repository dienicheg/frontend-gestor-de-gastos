import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const notMatchPasswords: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmarPassword = control.get('repetirPassword');
  if( password?.value === confirmarPassword?.value ){
    return null
  }
  return {
    notMatchPassword: true
  };
};
