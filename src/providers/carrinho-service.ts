import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Constants } from '../app/constants';

@Injectable()
export class CarrinhoService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers, method: "post" });

  constructor(public _http: Http) {
  }

  public getItensPedidoCarrinho(itemPedidoEntity) {
    try {
      console.log(itemPedidoEntity);

      return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + 'listarItemPedidoCarrinho/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(itemPedidoEntity), this.options)
          .map(res=>res.json())
          .subscribe(data => {
            resolve(data);
          }, (err) => {
            console.log(err);
            // reject(err.json());
          });
      });

    } catch (e){
      if(e instanceof RangeError){
        console.log('out of range');
      }
    }
  }

}