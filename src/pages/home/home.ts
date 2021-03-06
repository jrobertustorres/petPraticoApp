import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, AlertController, LoadingController, Events } from 'ionic-angular';
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
import { ModalBuscaProdutosPage } from '../modal-busca-produtos/modal-busca-produtos';
import { CategoriaAnimalServicoListPage } from '../categoria-animal-servico-list/categoria-animal-servico-list';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  @ViewChild(Slides) slides: Slides;

  search:string;
  haveData:boolean = false;
  private loading = null;
  private propagandas: any;
  private dadosUsuario: any;
  private publicidadePropagandaEntity: PublicidadePropagandaEntity;
  private usuarioEntity: UsuarioEntity;
  private idUsuarioLogado: string;
  private qtdPontos: number;
  private temaLigado: boolean;

  public qtdItensCarrinho: string;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              private homeService: HomeService,
              private loginService: LoginService,
              private sanitizer: DomSanitizer,
              public events: Events,
              public loadingCtrl: LoadingController) {

    this.publicidadePropagandaEntity = new PublicidadePropagandaEntity();
    this.usuarioEntity = new UsuarioEntity();
  }
  
  ngOnInit() {
  }
      
  ionViewWillEnter() {
    this.temaLigado = JSON.parse(localStorage.getItem(Constants.ESTADO_TEMA)) != true ? false : JSON.parse(localStorage.getItem(Constants.ESTADO_TEMA));
    this.events.subscribe('setEstadoTema:change', (estadoTema) => {
      this.temaLigado = estadoTema;
    });
    this.idUsuarioLogado = localStorage.getItem(Constants.ID_USUARIO);
    if(localStorage.getItem(Constants.ID_USUARIO)) {
      this.findUsuarioLogado();
    } else {
      localStorage.removeItem(Constants.QTD_ITENS_CARRINHO);
      this.findPublicidadePropaganda();
    }    
  }

  findUsuarioLogado() {
    try {

      this.usuarioEntity.idUsuario = parseInt(localStorage.getItem(Constants.ID_USUARIO));
      this.loginService.loginByIdService(this.usuarioEntity)
      .then((loginResult: UsuarioEntity) => {
        this.dadosUsuario = loginResult;
        this.qtdPontos = this.dadosUsuario.qtdPontos;
        localStorage.setItem(Constants.QTD_ITENS_CARRINHO, this.dadosUsuario.qtdItemcarrinho);
        this.findPublicidadePropaganda();
      }, (err) => {
        // this.loading.dismiss();
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
      this.propagandas = null;

      this.homeService.findPublicidadePropaganda()
      .then((propagandasResult: PublicidadePropagandaEntity) => {
        this.propagandas = propagandasResult;

      }, (err) => {
        // this.loading.dismiss();
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
    this.slides.autoplayDisableOnInteraction = false;
  }

  openGrupoList(idCategoria) {
    this.navCtrl.push(GruposListPage, {
      idCategoria: idCategoria
    })
  }

  openSearchProdutosPage() {
    this.navCtrl.push(ModalBuscaProdutosPage);
  }

  openCategoriaServico(tipoServico) {
    this.navCtrl.push(CategoriaAnimalServicoListPage, {tipoServico: tipoServico});
  }

}