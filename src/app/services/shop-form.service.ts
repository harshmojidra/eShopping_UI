import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class ShopFormService {

  private baseUrl : string = environment.baseUrl;

  private countriesUrl = this.baseUrl + "/countries";
  private statesUrl = this.baseUrl +"/states";

  constructor(private http : HttpClient) { }

  getCreditCardMonths(startMonth : number): Observable<number[]>{
    let data : number[] = [];

    for(let month = startMonth;month <=12;month++){
      data.push(month);
    }

    return of(data);
  }

  getCreditCardYears(): Observable<number[]>{
    let data : number[] = [];

    const startYear : number = new Date().getFullYear();
    const endYear : number = startYear + 10;

    for (let year = startYear ; year <= endYear ; year++){
      data.push(year);
    }

    return of(data);
  }

  getCountries() : Observable<Country[]>{
    return this.http.get<GetCountriesResponse>(this.countriesUrl).pipe(
      map(response=>response._embedded.countries)
      );
  }


  getStates(countryCode : string) : Observable<State[]>{

    const url = this.statesUrl + "/search/findByCountryCode?code=" + countryCode;

    console.log("State Url : "+ url);
    

    return this.http.get<GetStatesResponse>(url).pipe(
      map(response=>response._embedded.states)
      );

  }

  
}

interface GetCountriesResponse{
  _embedded : {
    countries : Country[];
  }
}

interface GetStatesResponse{
  _embedded : {
    states : State[];
  }
}
