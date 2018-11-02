import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, AlertController, Platform } from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer';
import { Device } from '@ionic-native/device';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Constants } from '../../app/constants';

// PAGES
import { ModalTermosPage } from '../modal-termos/modal-termos';
import { ModalPoliticaPrivacidadePage } from '../modal-politica-privacidade/modal-politica-privacidade';
import { MeusDadosPage } from '../meus-dados/meus-dados';
import { MinhaSenhaPage } from './../minha-senha/minha-senha';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
import { MeusPedidosListPage } from '../meus-pedidos-list/meus-pedidos-list';
import { MeuEnderecoPage } from '../meu-endereco/meu-endereco';
import { ModalSobrePage } from '../modal-sobre/modal-sobre';

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
  // private messagePresentToast: string;
  // private socialSharingTitle: string;
  // private erroAppSubject: string;
  // private erroAppBody: string;
  // private infoSuporte: string;
  // private loading = null;
  private linkLoja: string;
  public idUsuarioLogado: string;
  public nomeUsuarioLogado: string;
  private loading = null;
  private indicacaoUsuarioEntity: IndicacaoUsuarioEntity;
  private usuarioEntity: UsuarioEntity;
  // private usuarioEntityPontos: any;

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
              public alertCtrl: AlertController) {
    this.indicacaoUsuarioEntity = new IndicacaoUsuarioEntity();
    this.usuarioEntity = new UsuarioEntity();

  }

  ngOnInit() {
    this.idUsuarioLogado = localStorage.getItem(Constants.ID_USUARIO);
    this.nomeUsuarioLogado = localStorage.getItem(Constants.NOME_PESSOA);
    this.findByPontuacao();
  }

  ionViewDidLoad() {
  }

  // presentToast() {
  //   let toast = this.toastCtrl.create({
  //     message: this.messagePresentToast,
  //     duration: 3000,
  //     position: 'bottom',
  //     cssClass: "toast-success"
  //   });

  //   toast.onDidDismiss(() => {
  //   });

  //   toast.present();
  // }

  findByPontuacao() {
    this.loading = this.loadingCtrl.create({
      content: 'Aguarde...'
    });
    this.loading.present();

    this.usuarioService
    .findByPontuacao()
    .then((usuarioEntityResult: UsuarioEntity) => {
      this.usuarioEntity = usuarioEntityResult;
      // localStorage.setItem(Constants.QTD_PONTOS, this.usuarioEntity.qtdPontos);

      console.log(this.usuarioEntity);

      this.loading.dismiss();

    }, (err) => {
      this.loading.dismiss();
      this.alertCtrl.create({
        subTitle: err.message,
        buttons: ['OK']
      }).present();
    });

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

  getPlatform() {
    if (this.platform.is('ios')) {
      this.linkLoja = "https://play.google.com/store/apps/details?id=br.com.spacetrack.mobile";
    }
    
    if (this.platform.is('android')) {
      this.linkLoja = "https://play.google.com/store/apps/details?id=br.com.spacetrack.mobile";
    }
  }

  shareAnyWhere() {
    this.loading = this.loadingCtrl.create({
      content: 'Aguarde...'
    });
    this.loading.present();

    this.indicacaoService
    .indicaAplicativo()
    .then((indicacaoUsuarioEntityResult: IndicacaoUsuarioEntity) => {
      this.indicacaoUsuarioEntity = indicacaoUsuarioEntityResult;

      this.loading.dismiss();

      this.socialSharing.share("Estou gostando muito do Pet Prático! Tenha todos os Pet Shops na palma de sua mão! Use o código de indicação e ganhe pontos: " + this.indicacaoUsuarioEntity.codigoIndicacao,
      "http://www.petpratico.com.br/img/logo_shared.jpg", this.linkLoja)
      .then(() => {
      }).catch(() => {
      });
    }, (err) => {
      this.loading.dismiss();
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
       cc: ['jose@logiic.com.br', 'bruno@logiic.com.br'],
       subject: 'Problema encontrado no app.',
       body: '<p><h1>Olá! Descreva abaixo o problema encontrado e logo analizaremos.</h1></p>' +
       '<h1>Informações para suporte</h1>'+
       '<h1>Pet Prático v'+ localStorage.getItem(Constants.VERSION_NUMBER) +'</h1>' +
       '<h1>'+ this.device.model +'</h1>' +
       '<h1>'+ this.device.platform +' '+ this.device.version +'</h1>' +
       '<h1>----------------------</h1>',
       isHtml: true
     };

     this.emailComposer.open(email);
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
            // localStorage.removeItem(Constants.EMAIL_PESSOA);
            // localStorage.removeItem('clienteLogado');
            // this.navCtrl.setRoot(LoginPage);
            this.navCtrl.setRoot(HomePage);
          }
        }
      ]
    });
    alert.present();
  }

}
