import { Injectable, EventEmitter } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Constants } from '../app/constants';

//ENTITYS
import { UsuarioEntity } from '../model/usuario-entity';

@Injectable()
export class LoginService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers, method: "post" });
  public userChangeEvent = new EventEmitter();
  public carrinhoChangeEvent = new EventEmitter();
  public emailPessoaChangeEvent = new EventEmitter();
  private usuarioEntity: UsuarioEntity;

  constructor(public http: Http) {
    this.usuarioEntity = new UsuarioEntity();
  }

  public login(usuarioEntity) {
    try {
      
      this.usuarioEntity = usuarioEntity;
      this.usuarioEntity.tokenPush = localStorage.getItem(Constants.TOKEN_PUSH);
      this.usuarioEntity.versaoApp = localStorage.getItem(Constants.VERSION_NUMBER);
      this.usuarioEntity.uuid = localStorage.getItem(Constants.UUID);
      
      return new Promise((resolve, reject) => {
        this.http.post(Constants.API_URL + 'login/', 
        JSON.stringify(this.usuarioEntity), this.options)
          .map(res=>res.json())
          .subscribe(data => {
            resolve(data);

            localStorage.setItem(Constants.TOKEN_USUARIO, data.token);
            localStorage.setItem(Constants.NOME_PESSOA, data.nomePessoa);
            localStorage.setItem(Constants.ID_USUARIO, data.idUsuario);
            localStorage.setItem(Constants.IS_CADASTRO_COMPLETO, data.isCadastroCompleto);
            localStorage.setItem(Constants.IS_CADASTRO_ENDERECO_COMPLETO, data.isCadastroEnderecoCompleto);
            localStorage.setItem(Constants.QTD_ITENS_CARRINHO, data.qtdItemcarrinho);
            localStorage.setItem(Constants.QTD_PONTOS, data.qtdPontos);

            this.userChangeEvent.emit(data.nomePessoa);
            this.emailPessoaChangeEvent.emit(data.email);
            this.carrinhoChangeEvent.emit(data.qtdItemcarrinho);

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

  public loginByIdService(usuarioEntity) {
    try {
      this.usuarioEntity.tokenPush = localStorage.getItem(Constants.TOKEN_PUSH);
      this.usuarioEntity.versaoApp = localStorage.getItem(Constants.VERSION_NUMBER);
      this.usuarioEntity.uuid = localStorage.getItem(Constants.UUID);
      
      return new Promise((resolve, reject) => {
        this.http.post(Constants.API_URL + 'loginById/', 
        JSON.stringify(usuarioEntity), this.options)
          .map(res=>res.json())
          .subscribe(data => {
            resolve(data);

            localStorage.setItem(Constants.TOKEN_USUARIO, data.token);
            localStorage.setItem(Constants.NOME_PESSOA, data.nomePessoa);
            // localStorage.setItem(Constants.EMAIL_PESSOA, data.email);
            localStorage.setItem(Constants.ID_USUARIO, data.idUsuario);
            localStorage.setItem(Constants.IS_CADASTRO_COMPLETO, data.isCadastroCompleto);
            localStorage.setItem(Constants.IS_CADASTRO_ENDERECO_COMPLETO, data.isCadastroEnderecoCompleto);
            localStorage.setItem(Constants.QTD_ITENS_CARRINHO, data.qtdItemcarrinho);
            localStorage.setItem(Constants.QTD_PONTOS, data.qtdPontos);

            this.userChangeEvent.emit(data.nomePessoa);
            this.emailPessoaChangeEvent.emit(data.email);
            this.carrinhoChangeEvent.emit(data.qtdItemcarrinho);

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

  public loginFacebook(usuarioEntity) {
    try {

      this.usuarioEntity = usuarioEntity;
      this.usuarioEntity.tokenPush = localStorage.getItem(Constants.TOKEN_PUSH);
      this.usuarioEntity.versaoApp = localStorage.getItem(Constants.VERSION_NUMBER);
      this.usuarioEntity.uuid = localStorage.getItem(Constants.UUID);

      console.log(JSON.stringify(this.usuarioEntity));

      return new Promise((resolve, reject) => {
        this.http.post(Constants.API_URL + 'loginByIdFacebook/', 
          JSON.stringify(this.usuarioEntity), this.options)
          .map(res=>res.json())
          .subscribe(data => {
            resolve(data);
            data.idiomaUsuario = data.idiomaUsuario == 'Português' ? 'pt-br' : 'en';

            localStorage.setItem(Constants.TOKEN_USUARIO, data.token);
            localStorage.setItem(Constants.NOME_PESSOA, data.nomePessoa);
            localStorage.setItem(Constants.ID_USUARIO, data.idUsuario);
            localStorage.setItem(Constants.IS_CADASTRO_COMPLETO, data.isCadastroCompleto);
            localStorage.setItem(Constants.IS_CADASTRO_ENDERECO_COMPLETO, data.isCadastroEnderecoCompleto);
            console.log(data.isCadastroEnderecoCompleto);
            localStorage.setItem(Constants.QTD_ITENS_CARRINHO, data.qtdItemcarrinho);
            localStorage.setItem(Constants.QTD_PONTOS, data.qtdPontos);

            this.userChangeEvent.emit(data.nomePessoa);
            this.emailPessoaChangeEvent.emit(data.login);
            this.carrinhoChangeEvent.emit(data.qtdItemcarrinho);
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

