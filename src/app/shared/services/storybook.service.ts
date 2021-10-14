import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StorybookService {

  constructor(private http: HttpClient) { }

  getAllStorybooks(){
    return this.http.get(environment.BACKEND_HOST + environment.BACKEND_STORYBOOK_ENDPOINT)
  }
}
