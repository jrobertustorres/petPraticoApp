import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, AlertController } from 'ionic-angular';
// import { EmailComposer } from '@ionic-native/email-composer';
// import { AppVersion } from '@ionic-native/app-version';
// import { Device } from '@ionic-native/device';
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
  public idUsuario: string;
  public nomeUsuarioLogado: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public loadingCtrl: LoadingController,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController) {

  }

  ngOnInit() {
    this.idUsuario = localStorage.getItem(Constants.ID_USUARIO);
    this.nomeUsuarioLogado = localStorage.getItem(Constants.NOME_PESSOA);
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

  openModalTermos(){
    let modal = this.modalCtrl.create(ModalTermosPage);
    modal.present();
  }

  openModalPolitica(){
    let modal = this.modalCtrl.create(ModalPoliticaPrivacidadePage);
    modal.present();
  }

  // sendEmailBug() {
  //   this.emailComposer.isAvailable().then((available: boolean) =>{
  //     if(available) {
  //     }
  //    });
     
  //    let email = {
  //      to: 'diretoria@logiic.com.br',
  //      cc: ['jose@logiic.com.br', 'bruno@logiic.com.br'],
  //      subject: this.erroAppSubject,
  //      body: '<p><h1>'+ this.erroAppBody +'</h1></p>' +
  //      '<h1>'+ this.infoSuporte +'</h1>'+
  //      '<h1>JoyBees v'+ this.appVersion.getVersionCode() +'</h1>' +
  //      '<h1>'+ this.device.model +'</h1>' +
  //      '<h1>'+ this.device.platform +' '+ this.device.version +'</h1>' +
  //      '<h1>----------------------</h1>',
  //      isHtml: true
  //    };

  //    this.emailComposer.open(email);
  // }

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
