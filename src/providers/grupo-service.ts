import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Constants } from '../app/constants';

@Injectable()
export class GrupoService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers, method: "post" });

  constructor(public _http: Http) {
  }

  public findGruposByCategoria(categoria) {
    try {
      return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + 'findGruposByCategoria/',
          JSON.stringify(categoria), this.options)
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

  public findSubGruposByGrupo(grupo) {
    try {
      return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + 'findSubGruposByGrupo/',
          JSON.stringify(grupo), this.options)
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

  public findPrecoProdutosBySubGrupo(subGrupo) {
    try {
      let tokenUsuario = localStorage.getItem(Constants.TOKEN_USUARIO) ? localStorage.getItem(Constants.TOKEN_USUARIO) : null;

      return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + 'findPrecoProdutosBySubGrupo/'
          + tokenUsuario,
          JSON.stringify(subGrupo), this.options)
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