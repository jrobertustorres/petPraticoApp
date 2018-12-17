import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Constants } from '../app/constants';

@Injectable()
export class ServicoService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers, method: "post" });

  constructor(public _http: Http) {
  }

  public findPrecoProdutosByBanhoETosa(grupoEntity) {
    try {

      return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + 'findPrecoProdutosByBanhoETosa/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(grupoEntity), this.options)
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

  public findPrecoProdutosByConsultasMedicacoes(grupoEntity) {
    try {

      return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + 'findPrecoProdutosByConsultasMedicacoes/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(grupoEntity), this.options)
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

  public findPrecoProdutosByOutrosServicos(grupoEntity) {
    try {

      return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + 'findPrecoProdutosByOutrosServicos/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(grupoEntity), this.options)
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

  public verificaHorarioAtendimentoByProdutoFornecedor(horarioAtendimentoEntity) {
    try {

      return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + 'verificaHorarioAtendimentoByProdutoFornecedor/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(horarioAtendimentoEntity), this.options)
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

  public horarioAtendimentoByProdutoFornecedor(horarioAtendimentoEntity) {
    try {

      return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + 'horarioAtendimentoByProdutoFornecedor/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(horarioAtendimentoEntity), this.options)
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

  public findProdutoFornecedorByProdutoESubGrupo(produtoFornecedorEntity) {
    try {

      return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + 'findProdutoFornecedorByProdutoESubGrupo/'
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