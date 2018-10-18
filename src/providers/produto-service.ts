import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Constants } from '../app/constants';

@Injectable()
export class ProdutoService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers, method: "post" });

  constructor(public _http: Http) {
  }

  public findProdutoFornecedorByProduto(produtoFornecedorEntity) {
    try {
      return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + 'findProdutoFornecedorByProduto/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(produtoFornecedorEntity), this.options)
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

  public findProdutoFornecedorByProdutoEFornecedor(produtoFornecedorEntity) {
    try {
      return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + 'findProdutoFornecedorByProdutoEFornecedor/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(produtoFornecedorEntity), this.options)
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

  public findProdutoByNome(produto) {
    try {
      return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + 'findProdutoByNome/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(produto), this.options)
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

  public alteraCalculoProdutoFornecedorDetalhe(produtoFornecedorEntity) {
    try {
      return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + 'alteraCalculoProdutoFornecedorDetalhe/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(produtoFornecedorEntity), this.options)
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