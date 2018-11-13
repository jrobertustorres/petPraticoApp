import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Constants } from '../app/constants';

@Injectable()
export class CarrinhoService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers, method: "post" });
  public qtdItensCarrinhoChangeEvent = new EventEmitter();

  constructor(public _http: Http) {
  }

  public listarItemPedidoCarrinho() {
    try {

      return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + 'listarItemPedidoCarrinho/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), this.options)
          .map(res=>res.json())
          .subscribe(data => {
            resolve(data);
            data.qtdItemcarrinhoCliente = data.qtdItemcarrinhoCliente == null ? "0" : data.qtdItemcarrinhoCliente;
            this.qtdItensCarrinhoChangeEvent.emit(data.qtdItemcarrinhoCliente);
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

  public adicionaItemPedidoCarrinho(itemPedidoEntity) {
    try {
      return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + 'adicionaItemPedidoCarrinho/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(itemPedidoEntity), this.options)
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

  public removerItemPedidoCarrinho(itemPedidoEntity) {
    try {
      return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + 'removerItemPedidoCarrinho/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(itemPedidoEntity), this.options)
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

  public alteraItemPedidoCarrinho(calculoItemCarrinho) {
    try {
      return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + 'alteraItemPedidoCarrinho/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(calculoItemCarrinho), this.options)
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