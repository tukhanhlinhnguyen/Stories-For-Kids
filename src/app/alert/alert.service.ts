import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  clear(){
    console.log("clear() called");
  }

  success(message : string){
    console.log("success() called");
  }

  error(error : string){
    console.log("error() called");
  }
}
