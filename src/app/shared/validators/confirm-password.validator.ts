import { FormGroup } from "@angular/forms";

// checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
//     let pass = group.get('password').value;
//     let confirmPass = group.get('confirmPassword').value
//     return pass === confirmPass ? null : { notSame: true }
//   }

export function confirmPassword(controlName: string, matchingControlName: string){
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.notMatching) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ notMatching: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}