import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Constants } from '../app/constants';

@Injectable()
export class HomeService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers, method: "post" });

  constructor(public _http: Http) {
  }

  public findPublicidadePropaganda() {
    try {
      let idUsuarioLogado = localStorage.getItem('idUsuarioLogado') ? localStorage.getItem('idUsuarioLogado') : '';

      return new Promise((resolve, reject) => {
        this._http.post(Constants.API_URL + 'findPublicidadePropaganda/'
        + idUsuarioLogado, this.options)
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