import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SampleService {

  private apiUrl = 'https://api.example.com/data'; // Replace this with your endpoint URL

  constructor(private http: HttpClient) { }

  getAppSettings(): Observable<string | any> {
    return this.http.get('/api/WeatherForecast/GetAppSettings',{responseType:'text' as 'json'});
  }
}
