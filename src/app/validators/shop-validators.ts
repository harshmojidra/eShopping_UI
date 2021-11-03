import { FormControl, ValidationErrors } from "@angular/forms";

//custom Validators
export class ShopValidators {

    //whitespace validator
    static notOnlyWhitespace(control : FormControl) : ValidationErrors{

        //check if string string contains only whitespace
        if(control.value != null && (control.value.trim().length === 0)){
           
           //invalid , return error object
            return {'notOnlyWhitespace' : true}
        }
        else{

            //valid
            return null;
        }
    }
}
