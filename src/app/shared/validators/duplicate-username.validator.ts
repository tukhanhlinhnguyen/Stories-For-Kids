import { FormArray, FormControl, FormGroup, FormGroupDirective, NgForm } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { cloneNode } from "@syncfusion/ej2-base";

export function duplicateUsername(username: string)  {
    return (formGroup: FormGroup) => {
        let result: boolean = false;
        let allUsernamesStr = sessionStorage.getItem("allUsernames");
        const usernameFormControl = formGroup.controls[username]
        var usernameVal = usernameFormControl.value;

        if(usernameFormControl.errors && !usernameFormControl.errors.duplicate){
            return ;
        }

        if(allUsernamesStr != null && allUsernamesStr != "null"){
            let allUsernames: string[] = JSON.parse(allUsernamesStr);
            console.log("duplicateUsername username: " + usernameVal);
            console.log("duplicateUsername allUsernames: " + allUsernames);
            result = allUsernames.filter(registeredUsername => registeredUsername == usernameVal).length >= 1;
            console.log("result: " + result);
            console.log(formGroup.controls[username]);

            result ? usernameFormControl.setErrors({ duplicate: true }) : usernameFormControl.setErrors(null);
        }
    };
}