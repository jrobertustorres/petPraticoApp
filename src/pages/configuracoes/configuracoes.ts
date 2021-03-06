import { Component, OnInit, EventEmitter } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, AlertController, Platform, Events } from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer';
import { Device } from '@ionic-native/device';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Constants } from '../../app/constants';

// PAGES
import { ModalTermosPage } from '../modal-termos/modal-termos';
import { ModalPoliticaPrivacidadePage } from '../modal-politica-privacidade/modal-politica-privacidade';
import { MeusDadosPage } from '../meus-dados/meus-dados';
import { MinhaSenhaPage } from './../minha-senha/minha-senha';
import { LoginPage } from '../login/login';
import { MeusPedidosListPage } from '../meus-pedidos-list/meus-pedidos-list';
import { MeuEnderecoPage } from '../meu-endereco/meu-endereco';
import { ModalSobrePage } from '../modal-sobre/modal-sobre';
import { ModalMeusPontosPage } from '../modal-meus-pontos/modal-meus-pontos';
import { ModalIndiqueEGanhePage } from '../modal-indique-e-ganhe/modal-indique-e-ganhe';

//SERVICES
import { IndicacaoService } from '../../providers/indicacao-service';
import { UsuarioService } from '../../providers/usuario-service';

//ENTITIES
import { IndicacaoUsuarioEntity } from '../../model/indicacao-usuario-entity';
import { UsuarioEntity } from '../../model/usuario-entity';

// @IonicPage()
@Component({
  selector: 'page-configuracoes',
  templateUrl: 'configuracoes.html',
})
export class ConfiguracoesPage implements OnInit {
  private linkLoja: string;
  public idUsuarioLogado: string;
  public nomeUsuarioLogado: string;
  private loading = null;
  private indicacaoUsuarioEntity: IndicacaoUsuarioEntity;
  private usuarioEntity: UsuarioEntity;
  public carrinhoChangeEvent = new EventEmitter();
  private estadoTema: string = 'Ligar';
  private temaChecked: boolean = false;
  public versaoApp: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public loadingCtrl: LoadingController,
              public modalCtrl: ModalController,
              private emailComposer: EmailComposer,
              private socialSharing: SocialSharing,
              public platform: Platform,
              private device: Device,
              private indicacaoService: IndicacaoService,
              private usuarioService: UsuarioService,
              public events: Events,
              public alertCtrl: AlertController) {
    this.indicacaoUsuarioEntity = new IndicacaoUsuarioEntity();
    this.usuarioEntity = new UsuarioEntity();
  }

  ngOnInit() {
    this.versaoApp = localStorage.getItem(Constants.VERSION_NUMBER);
  }

  ionViewWillEnter() {  
    if(localStorage.getItem(Constants.ID_USUARIO)) {
      this.estadoTema = JSON.parse(localStorage.getItem(Constants.ESTADO_TEMA)) != true ? 'Ligar' : 'Desligar';
      this.temaChecked = JSON.parse(localStorage.getItem(Constants.ESTADO_TEMA)) != true ? false : JSON.parse(localStorage.getItem(Constants.ESTADO_TEMA));
    }
    this.idUsuarioLogado = localStorage.getItem(Constants.ID_USUARIO);
    this.nomeUsuarioLogado = localStorage.getItem(Constants.NOME_PESSOA);
    if(this.idUsuarioLogado) {
      this.findByPontuacao();
    }  
  }

  setStatusTema(state) { 
    this.estadoTema = state.checked == false ? 'Ligar' : 'Desligar';
    this.events.publish('setEstadoTema:change', state.checked);
    localStorage.setItem(Constants.ESTADO_TEMA, state.checked);
  }

  findByPontuacao() {
    this.usuarioEntity.qtdPontos = null;
    this.usuarioEntity.qtdIndicacao = null;
    this.usuarioEntity.qtdPontuacaoIndicacao = null;

    this.usuarioService
    .findByPontuacao()
    .then((usuarioEntityResult: UsuarioEntity) => {
      this.usuarioEntity = usuarioEntityResult;

    }, (err) => {
      this.alertCtrl.create({
        subTitle: err.message,
        buttons: ['OK']
      }).present();
    });

  }

  sendEmailBug() {
    this.emailComposer.isAvailable().then((available: boolean) =>{
      if(available) {
      }
     });
     
     let email = {
       to: 'diretoria@logiic.com.br',
       cco: ['jose@logiic.com.br', 'bruno@logiic.com.br'],
       subject: 'Problema encontrado no app.',
       body: '<p><h1>Ol??! Descreva abaixo o problema encontrado e logo analizaremos.</h1></p>' +
       '<h1>Informa????es para suporte</h1>'+
       '<h1>Pet Pr??tico v'+ localStorage.getItem(Constants.VERSION_NUMBER) +'</h1>' +
       '<h1>'+ this.device.model +'</h1>' +
       '<h1>'+ this.device.platform +' '+ this.device.version +'</h1>' +
       '<h1>----------------------</h1>',
       isHtml: true
     };

     this.emailComposer.open(email);
  }

  openModalTermos(){
    let modal = this.modalCtrl.create(ModalTermosPage);
    modal.present();
  }

  openModalPolitica(){
    let modal = this.modalCtrl.create(ModalPoliticaPrivacidadePage);
    modal.present();
  }

  openModalSobre(){
    let modal = this.modalCtrl.create(ModalSobrePage);
    modal.present();
  }
  
  openModalMeusPontos(){
    let modal = this.modalCtrl.create(ModalMeusPontosPage, {qtdPontos: this.usuarioEntity.qtdPontos, 
      dataAtualizacaoPontosFormat: this.usuarioEntity.dataAtualizacaoPontosFormat});
    modal.present();
  }

  openModalIndiqueEGanhe() {
    let modal = this.modalCtrl.create(ModalIndiqueEGanhePage, {qtdIndicacao: this.usuarioEntity.qtdIndicacao, 
      qtdPontuacaoIndicacao: this.usuarioEntity.qtdPontuacaoIndicacao});
    modal.present();
  }

  openLoginPage() {
    this.navCtrl.push(LoginPage);
  }

  minhaSenha() {
    this.navCtrl.push(MinhaSenhaPage);
  }

  meusDados() {
    this.navCtrl.push(MeusDadosPage);
  }

  meuEndereco() {
    this.navCtrl.push(MeuEnderecoPage);
  }

  meusPedidos() {
    this.navCtrl.push(MeusPedidosListPage);
  }

  logout() {
    let alert = this.alertCtrl.create({
      subTitle: 'Deseja realmente sair?',
      buttons: [
        {
          text: 'Ficar',
          role: 'cancel'
        },
        {
          text: 'Sair',
          handler: () => {
            localStorage.removeItem(Constants.ID_USUARIO);
            localStorage.removeItem(Constants.TOKEN_USUARIO);
            localStorage.removeItem(Constants.NOME_PESSOA);
            localStorage.removeItem(Constants.QTD_ITENS_CARRINHO);
            localStorage.removeItem(Constants.CIDADES_POR_ESTADO);
            localStorage.removeItem(Constants.IS_CADASTRO_COMPLETO);
            localStorage.removeItem(Constants.IS_CADASTRO_ENDERECO_COMPLETO);
            localStorage.removeItem(Constants.ESTADO_TEMA);
            this.events.publish('atualizaBadgeCarrinhoLogoutEvent:change', localStorage.getItem(Constants.QTD_ITENS_CARRINHO));
            this.navCtrl.parent.select(0);
          }
        }
      ]
    });
    alert.present();
  }

}
