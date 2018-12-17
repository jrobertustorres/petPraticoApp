import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Constants } from '../app/constants';

@Injectable()
export class AgendaService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers, method: "post" });

  constructor(public _http: Http) {
  }

  public findListAgenda() {
    try {
      return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + 'findListAgenda/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), this.options)
          .map(res=>res.json())
          .subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err.json());
          });
      });

    } catch (e){
      if(e instanceof RangeError){
        console.log('out of range');
      }
    }
  }

  public findDetalheAgenda(agendaDetalheEntity) {
    try {
      return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + 'findDetalheAgenda/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(agendaDetalheEntity), this.options)
          .map(res=>res.json())
          .subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err.json());
          });
      });

    } catch (e){
      if(e instanceof RangeError){
        console.log('out of range');
      }
    }
  }

}