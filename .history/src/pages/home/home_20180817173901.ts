import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, AlertController, LoadingController } from 'ionic-angular';
import {DomSanitizer} from '@angular/platform-browser';
import { Constants } from '../../app/constants';

//SERVICES
import { HomeService } from '../../providers/home-service';
import { LoginService } from '../../providers/login-service';

//ENTITYS
import { PublicidadePropagandaEntity } from '../../model/publicidade-propaganda-entity';
import { UsuarioEntity } from '../../model/usuario-entity';

//PAGES
import { GruposListPage } from '../grupos-list/grupos-list';
import { LocationPage } from '../location/location';
import { ModalBuscaProdutosPage } from '../modal-busca-produtos/modal-busca-produtos';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  @ViewChild(Slides) slides: Slides;

  search:string;
  // slides:any[];
  haveData:boolean = false;
  private loading = null;
  private propagandas: any;
  private dadosUsuario: any;
  // private qtdItemcarrinho: number;
  private publicidadePropagandaEntity: PublicidadePropagandaEntity;
  private usuarioEntity: UsuarioEntity;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              private homeService: HomeService,
              private loginService: LoginService,
              private sanitizer: DomSanitizer,
              public loadingCtrl: LoadingController) {

    this.publicidadePropagandaEntity = new PublicidadePropagandaEntity();
    this.usuarioEntity = new UsuarioEntity();
  }

  ngOnInit() {
    
    if(localStorage.getItem(Constants.ID_USUARIO)) {
      this.findUsuarioLogado();
    } else {
      localStorage.removeItem(Constants.QTD_ITENS_CARRINHO);
      console.log('aaaaa '+localStorage.getItem(Constants.QTD_ITENS_CARRINHO));
      this.findPublicidadePropaganda();
    }
  }

  findUsuarioLogado() {
    try {
      this.loading = this.loadingCtrl.create({
        content: 'Aguarde...'
      });
      this.loading.present();

      this.usuarioEntity.idUsuario = parseInt(localStorage.getItem(Constants.ID_USUARIO));
      this.loginService.loginByIdService(this.usuarioEntity)
      .then((loginResult: UsuarioEntity) => {
        this.dadosUsuario = loginResult;
        console.log(this.dadosUsuario.qtdItemcarrinho);
        localStorage.setItem(Constants.QTD_ITENS_CARRINHO, this.dadosUsuario.qtdItemcarrinho);
        this.findPublicidadePropaganda();
        // this.loading.dismiss();
      }, (err) => {
        this.loading.dismiss();
        this.alertCtrl.create({
          subTitle: err.message,
          buttons: ['OK']
        }).present();
      });

    }catch (err){
      if(err instanceof RangeError){
      }
      console.log(err);
    }
  }

  findPublicidadePropaganda() {
    try {
      if(!localStorage.getItem(Constants.ID_USUARIO)) {
        this.loading = this.loadingCtrl.create({
          content: 'Aguarde...'
        });
        this.loading.present();
      }

      this.homeService.findPublicidadePropaganda()
      .then((propagandasResult: PublicidadePropagandaEntity) => {
        this.propagandas = propagandasResult;

        this.loading.dismiss();
      }, (err) => {
        this.loading.dismiss();
        this.alertCtrl.create({
          subTitle: err.message,
          buttons: ['OK']
        }).present();
      });

    }catch (err){
      if(err instanceof RangeError){
      }
      console.log(err);
    }
  }

  slideChanged() {
    // let currentIndex = this.slides.getActiveIndex();
  }

  openGrupoList(idCategoria) {
    this.navCtrl.push(GruposListPage, {
      idCategoria: idCategoria
    })
  }

  openLocationPage() {
    this.navCtrl.push(LocationPage);
  }

  openSearchProdutosPage() {
    this.navCtrl.push(ModalBuscaProdutosPage);
  }
}